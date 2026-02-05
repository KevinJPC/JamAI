import { Document, ObjectId, StrictFilter } from 'mongodb'
import { jamAIMongoDB } from '../lib/db/JamAIMongoDB.js'
import { FavoriteSongDocument } from '../lib/db/documents/FavoriteSongDocument.js'
import { FavoriteSongInput, GetFavoriteUserSongsContinuationTokenPayload, GetFavoriteUserSongsQuery, UnfavoriteSongInput } from '../types/favoriteSongs.js'
import { createContinuationTokenHandler } from '../utils/continuationToken.js'
import { SongSummaryResponse } from '../types/songs.js'
import { createCursorPage, CursorPage } from '../utils/cursorPage.js'
import { PAGINATION_LIMIT } from '../constants.js'
import { parseKnown } from '../utils/parseKnown.js'
import { songSummaryResponseSchema } from '../schemas/songs.js'
import { SongDocument } from '../lib/db/documents/SongDocument.js'
import { getFavoriteUserSongsContinuationTokenPayloadSchema } from '../schemas/favoriteSongs.js'
import { sliceForCursorPagination } from '../utils/sliceForCursorPagination.js'
import { notFoundError } from '../errors.js'

export class FavoriteSongService {
  static async getFavoriteUserSongs (query: GetFavoriteUserSongsQuery): Promise<CursorPage<SongSummaryResponse>> {
    const continuationTokenHandler =
      createContinuationTokenHandler<FavoriteSongDocument, GetFavoriteUserSongsContinuationTokenPayload>({
        payloadFn: (favSongDoc) => ({ lastFavoriteId: favSongDoc._id }),
        parsePayload: (payload) => getFavoriteUserSongsContinuationTokenPayloadSchema.safeParse(payload).data
      })

    const continuationTokenPayload = continuationTokenHandler.decode(query.continuationToken)

    if (query.continuationToken && !continuationTokenPayload) return createCursorPage<SongSummaryResponse>()

    const filter: StrictFilter<FavoriteSongDocument> = {
      userId: query.userId
    }

    if (continuationTokenPayload) {
      filter._id = { $lt: continuationTokenPayload.lastFavoriteId }
    }

    const paginationLimit = PAGINATION_LIMIT + 1

    const queryPipeline: Document[] = [
      { $match: filter },
      { $sort: { _id: -1 } },
      {
        $lookup: {
          from: 'songs',
          localField: 'songId',
          foreignField: '_id',
          as: 'song'
        }
      },
      { $limit: paginationLimit },
      {
        $set: {
          song: { $first: '$song' }
        }
      }
    ]

    const results = await jamAIMongoDB().favoriteSongs()
      .aggregate<FavoriteSongDocument & { song: SongDocument }>(queryPipeline)
      .toArray()

    const { items, hasMore } = sliceForCursorPagination(results, paginationLimit)

    const nextContinuationToken = hasMore ? continuationTokenHandler.encode(items.at(-1)) : null

    const songsSummaryResponse = items.map(favoriteSongDoc =>
      parseKnown(songSummaryResponseSchema, {
        ...favoriteSongDoc.song,
        id: favoriteSongDoc.song._id.toHexString(),
        defaultVersion: {
          ...favoriteSongDoc.song.defaultVersion,
          id: favoriteSongDoc.song.defaultVersion.id.toHexString(),
        }
      })
    )

    return createCursorPage(songsSummaryResponse, hasMore, nextContinuationToken)
  }

  static async favoriteSong (input: FavoriteSongInput): Promise<void> {
    await jamAIMongoDB().withTransaction(async (session) => {
      const songExists = !!(await jamAIMongoDB().songs().findOne({ _id: input.songId }, { projection: { _id: 1 }, session }))

      if (!songExists) throw notFoundError()

      const newFavoriteSongDoc: FavoriteSongDocument = {
        _id: new ObjectId(),
        userId: input.userId,
        songId: input.songId,
        createdAt: new Date().toISOString()
      }

      const upsertResult = await jamAIMongoDB()
        .favoriteSongs()
        .updateOne({ userId: newFavoriteSongDoc.userId, songId: newFavoriteSongDoc.songId },
          { $setOnInsert: newFavoriteSongDoc }, { session, upsert: true })

      const favoriteWasInserted = upsertResult.matchedCount === 0

      if (favoriteWasInserted) {
        await jamAIMongoDB().songs().updateOne({ _id: input.songId }, { $inc: { favoritesCount: 1 } }, { session })
      }
    })
  }

  static async unfavoriteSong (input: UnfavoriteSongInput): Promise<void> {
    await jamAIMongoDB().withTransaction(async (session) => {
      const songExists = !!(await jamAIMongoDB().songs().findOne({ _id: input.songId }, { projection: { _id: 1 }, session }))

      if (!songExists) throw notFoundError()

      const deleteResult = await jamAIMongoDB().favoriteSongs().deleteOne({ userId: input.userId, songId: input.songId }, { session })

      const favoriteWasDeleted = deleteResult.deletedCount === 1

      if (favoriteWasDeleted) {
        await jamAIMongoDB().songs().updateOne({ _id: input.songId }, { $inc: { favoritesCount: -1 } }, { session })
      }
    })
  }
}
