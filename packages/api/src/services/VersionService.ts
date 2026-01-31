import { jamAIMongoDB } from '../lib/db/JamAIMongoDB.js'
import { ForbiddenError, NotFoundError } from '../errors.js'
import { Document, ObjectId, StrictFilter } from 'mongodb'
import { VersionDocument } from '../lib/db/documents/VersionDocument.js'
import { DeleteUserSongVersionInput, GetSongVersionQuery, GetSongVersionsContinuationTokenPayload, GetSongVersionsQuery, GetUserVersionsContinuationTokenPayload, GetUserVersionsQuery, UpsertSongVersionInput, UpsertSongVersionResponse, UserVersionSummaryResponse, VersionDetailedResponse, VersionSummaryResponse } from '../types/versions.js'
import { parseKnown } from '../utils/parseKnown.js'
import { getSongVersionsContinuationTokenPayloadSchema, getUserVersionsContinuationTokenPayloadSchema, upsertSongVersionResponseSchema, userVersionSummaryResponseSchema, versionDetailedResponseSchema, versionSummaryResponseSchema } from '../schemas/versions.js'
import { createContinuationTokenHandler } from '../utils/continuationToken.js'
import { createCursorPage, CursorPage } from '../utils/cursorPage.js'
import { PAGINATION_LIMIT } from '../constants.js'
import { sliceForCursorPagination } from '../utils/sliceForCursorPagination.js'
import Chord from '@chords-extractor/common/chord'

export class VersionService {
  static async getSongVersion (query: GetSongVersionQuery): Promise<VersionDetailedResponse> {
    const aggregationPipeline: Document[] = [{
      $match: {
        songId: query.songId,
        _id: query.versionId
      } as StrictFilter<VersionDocument>,
    },
    {
      $limit: 1
    },
    {
      $addFields: {
        userRating: query.loggedInUserId
          ? {
              $ifNull: [{
                $first: {
                  $map: {
                    input: {
                      $filter: {
                        input: '$ratings',
                        as: 'rating',
                        cond: { $eq: ['$$rating.userId', query.loggedInUserId] },
                        limit: 1
                      }
                    },
                    as: 'rating',
                    in: '$$rating.value'
                  }
                }
              }, null]
            }
          : null
      }
    },
    {
      $unset: ['ratings']
    }
    ]
    const versionResponse = await jamAIMongoDB().versions()
      .aggregate<Omit<VersionDocument, 'ratings'> & { userRating: number | null }>(aggregationPipeline)
      .map(({ _id, songId, user, ...rest }) => parseKnown(versionDetailedResponseSchema, {
        ...rest,
        id: _id.toHexString(),
        songId: songId.toHexString(),
        user: user ? ({ ...user, id: user.id.toHexString() }) : null
      }))
      .next()

    if (!versionResponse) throw new NotFoundError()

    return versionResponse
  }

  static async getSongVersions (query: GetSongVersionsQuery): Promise<CursorPage<VersionSummaryResponse>> {
    const continuationTokenHandler = createContinuationTokenHandler<VersionSummaryResponse, GetSongVersionsContinuationTokenPayload>({
      payloadFn: (version) => ({ lastVersionId: new ObjectId(version.id) }),
      parsePayload: (p) => getSongVersionsContinuationTokenPayloadSchema.safeParse(p).data ?? null,
    })

    const parsedContinuationToken = continuationTokenHandler.decode(query.continuationToken)

    if (!!query.continuationToken && parsedContinuationToken === null) return createCursorPage()

    // TODO: order by rating

    const filter: StrictFilter<VersionDocument> = { songId: query.songId }
    if (parsedContinuationToken) {
      filter._id = { $gt: parsedContinuationToken.lastVersionId }
    }

    const paginationLimit = PAGINATION_LIMIT + 1

    const pipeline = [
      { $match: filter },
      { $sort: { _id: 1 } },
      { $limit: paginationLimit },
      {
        $project: {
          beatsPerBar: 0,
          beatsCount: 0,
          beatChords: 0,
          shiftViewValue: 0,
        }
      }
    ]

    const aggregationCursor = jamAIMongoDB().versions()
      .aggregate<Omit<VersionDocument, 'beatsPerBar' | 'beatsCount' | 'beatChords' | 'shiftViewValue'>>(pipeline)
      .map(({ _id, songId, user, ...doc }) => {
        return parseKnown(versionSummaryResponseSchema,
          {
            ...doc,
            id: _id.toHexString(),
            songId: songId.toHexString(),
            user: user ? { ...user, id: user.id.toHexString() } : null
          }
        )
      })

    const result = sliceForCursorPagination(await aggregationCursor.toArray(), paginationLimit)
    const nextContinuationToken = result.hasMore ? continuationTokenHandler.encode(result.items.at(-1)) : null

    return createCursorPage(result.items, result.hasMore, nextContinuationToken)
  }

  static async upsertUserVersion (input: UpsertSongVersionInput): Promise<UpsertSongVersionResponse> {
    const user = await jamAIMongoDB().users().findOne({ _id: input.userId })
    if (!user) throw new ForbiddenError()

    const originalVersion = await jamAIMongoDB().versions().findOne({
      _id: input.originalVersionId,
      songId: input.songId,
    })

    if (!originalVersion) throw new NotFoundError()

    if (input.chords.length !== originalVersion.beatsCount) throw new Error('There are fewer or more chords than the original version')

    const newBeatChords = [...originalVersion.beatChords]
      .map((beatChord, beatChordIndex) => {
        const chordString = input.chords[beatChordIndex]

        let parsedChord = null
        if (chordString) {
          try {
            parsedChord = Chord.parseChordString(chordString)
            parsedChord = Chord.modifyAccidental(parsedChord, Chord.accidentals.sharp)
          } catch (_) {
            throw new Error('Invalid chords')
          }
        }
        return {
          ...beatChord,
          chord: (parsedChord?.symbol ?? null) as string | null,
        }
      })

    const currentUtcDate = new Date().toISOString()

    const version = await jamAIMongoDB().versions().findOneAndUpdate({
      songId: originalVersion.songId,
      'user.id': input.userId
    },
    {
      $set: {
        beatChords: newBeatChords,
        beatsPerBar: input.beatsPerBar,
        shiftViewValue: input.shiftViewValue,
        modifiedAt: currentUtcDate
      },
      $setOnInsert: {
        _id: new ObjectId(),
        beatsCount: originalVersion.beatsCount,
        songId: input.songId,
        user: {
          id: user._id,
          name: user.name,
          lastName: user.lastName
        },
        key: originalVersion.key,
        bpm: originalVersion.bpm,
        ratings: [],
        ratingCount: 0,
        ratingAverage: 0,
        isDefault: false,
        createdAt: currentUtcDate,
        isSystemVersion: false,
      }
    }, { upsert: true, returnDocument: 'after', projection: { _id: 1 } })

    if (!version) {
      throw new Error('Upsert failed: no document returned')
    }

    return parseKnown(upsertSongVersionResponseSchema, {
      id: version._id.toHexString()
    })
  }

  static async getUserVersions (query: GetUserVersionsQuery): Promise<CursorPage<UserVersionSummaryResponse>> {
    const continuationTokenHandler =
    createContinuationTokenHandler<UserVersionSummaryResponse, GetUserVersionsContinuationTokenPayload>({
      payloadFn: (version) => ({ versionId: new ObjectId(version.id), modifiedAt: version.modifiedAt }),
      parsePayload: (payload) => getUserVersionsContinuationTokenPayloadSchema.safeParse(payload).data
    })

    const continuationTokenPayload = continuationTokenHandler.decode(query.continuationToken)

    if (query.continuationToken && !continuationTokenPayload) return createCursorPage<UserVersionSummaryResponse>()

    const filter: StrictFilter<VersionDocument> = {
      'user.id': query.userId
    }

    if (continuationTokenPayload) {
      filter.$or = [
        // last modifiedAt > modifiedAt
        { modifiedAt: { $lt: continuationTokenPayload.modifiedAt } },
        // last modifiedAt = modifiedAt AND last versionId > versionId
        { $and: [{ modifiedAt: continuationTokenPayload.modifiedAt, _id: { $lt: continuationTokenPayload.versionId } }] }
      ]
    }

    const paginationLimit = PAGINATION_LIMIT + 1

    const queryPipeline: Document[] = [
      { $match: filter },
      { $sort: { modifiedAt: -1, _id: -1 } },
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

    const { items, hasMore } = sliceForCursorPagination(

      await jamAIMongoDB().versions().aggregate(queryPipeline)
        .map(({ _id, user, song, ...restOfVersion }) => {
          const { _id: songId, ...restOfSong } = song
          return userVersionSummaryResponseSchema.parse({
            ...restOfVersion,
            id: _id.toHexString(),
            user: user
              ? {
                  ...user,
                  id: user.id.toHexString()
                }
              : null,
            song: {
              id: songId.toHexString(),
              ...restOfSong,
            }
          })
        }).toArray(),

      paginationLimit
    )

    const nextContinuationToken = hasMore ? continuationTokenHandler.encode(items.at(-1)) : null

    return createCursorPage(items, hasMore, nextContinuationToken)
  }

  static async deleteUserVersion (input: DeleteUserSongVersionInput) {
    await jamAIMongoDB().versions().deleteOne(
      { songId: input.songId, 'user.id': input.userId }
    )
  }
}
