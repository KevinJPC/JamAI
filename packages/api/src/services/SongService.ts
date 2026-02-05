import { jamAIMongoDB } from '../lib/db/JamAIMongoDB.js'
import { PAGINATION_LIMIT } from '../constants.js'
import { createContinuationTokenHandler } from '../utils/continuationToken.js'
import { Document, Filter, FindOptions, ObjectId } from 'mongodb'
import { createCursorPage, CursorPage } from '../utils/cursorPage.js'
import { pipeStagesIf } from '../utils/pipeStagesIf.js'
import { SongDocument } from '../lib/db/documents/SongDocument.js'
import { parseKnown } from '../utils/parseKnown.js'
import { getSongsContinuationTokenPayloadSchema, songDetailedResponseSchema, songSummaryResponseSchema } from '../schemas/songs.js'
import { FindAllSongsContinuationTokenPayload, GetSongByIdQuery, GetSongsQuery, SongDetailedResponse, SongSummaryResponse } from '../types/songs.js'
import { sliceForCursorPagination } from '../utils/sliceForCursorPagination.js'
import { notFoundError } from '../errors.js'

export class SongService {
  static async getSongById (query: GetSongByIdQuery): Promise<SongDetailedResponse> {
    const pipeline: Document[] = [
      {
        $match: {
          _id: query.songId
        }
      },
      { $addFields: { userHasFavorited: null, userVersionId: null } }, // default values when no lookup is made
      ...pipeStagesIf(query.userId, {
        // Get user hasFavorited
        $lookup: {
          from: 'favorite-songs',
          pipeline: [
            { $match: { songId: query.songId, userId: query.userId } },
            { $limit: 1 },
            { $project: { _id: 0 } },
          ],
          as: 'userFavorite'
        }
      },
      // Get user's song version id if any
      {
        $lookup: {
          from: 'versions',
          pipeline: [
            { $match: { songId: query.songId, 'user.id': query.userId } },
            { $limit: 1 },
            { $project: { _id: 1 } },
          ],
          as: 'userVersion'
        }
      }, {
        $set: {
          userHasFavorited: { $gt: [{ $size: '$userFavorite' }, 0] },
          userVersionId: { $ifNull: [{ $first: '$userVersion._id' }, '$userVersionId'] }
        }
      },
      { $unset: ['userVersion', 'userFavorite'] }),

    ]

    const song = await jamAIMongoDB().songs()
      .aggregate<SongDocument & { userVersionId: ObjectId | null, userHasFavorited: boolean | null }>(pipeline)
      .map(({ _id, defaultVersion, userVersionId, ...rest }): SongDetailedResponse => parseKnown(songDetailedResponseSchema, {
        ...rest,
        id: _id.toHexString(),
        defaultVersion: {
          ...defaultVersion,
          id: defaultVersion.id.toHexString()
        },
        userVersionId: userVersionId ? userVersionId.toHexString() : null
      })).next()
    if (!song) throw notFoundError()

    return song
  }

  static async getSongs (query: GetSongsQuery): Promise<CursorPage<SongSummaryResponse>> {
    const continuationTokenHandler = createContinuationTokenHandler<SongDocument, FindAllSongsContinuationTokenPayload>({
      payloadFn: (item) => ({ lastSongId: item._id }),
      parsePayload: (payload) => getSongsContinuationTokenPayloadSchema.safeParse(payload).data ?? null
    })

    const parsedContinuationTokenPayload = continuationTokenHandler.decode(query.continuationToken)

    if (query.continuationToken && !parsedContinuationTokenPayload) return createCursorPage<SongSummaryResponse>()

    const filter: Filter<SongDocument> = {}

    if (parsedContinuationTokenPayload) {
      filter._id = { $lt: parsedContinuationTokenPayload.lastSongId }
    }

    const paginationLimit = PAGINATION_LIMIT + 1

    const options: FindOptions = {
      sort: { _id: 'desc' },
      limit: paginationLimit,
    }
    const result = sliceForCursorPagination(await jamAIMongoDB().songs().find(filter, options).toArray(), paginationLimit)

    const nextContinuationToken = result.hasMore ? continuationTokenHandler.encode(result.items.at(-1)) : null

    const responseItems = result.items
      .map(({ _id, defaultVersion, ...rest }) =>
        parseKnown(songSummaryResponseSchema,
          { ...rest, id: _id.toHexString(), defaultVersion: { ...defaultVersion, id: defaultVersion.id.toHexString() } }))

    return createCursorPage(responseItems,
      result.hasMore,
      nextContinuationToken)
  }
}
