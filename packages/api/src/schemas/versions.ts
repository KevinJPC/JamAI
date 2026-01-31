import { z } from 'zod'
import { beatChordSchema, continuationTokenSchema, keySchema, objectIdSchema } from './shared.js'
import { BEATS_PER_BAR } from '@chords-extractor/common/constants'

const versionBaseResponseSchema = z.object({
  id: z.string(),
  songId: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    lastName: z.string(),
  }).nullable(),
  bpm: z.number(),
  key: keySchema,
  ratingCount: z.number(),
  ratingAverage: z.number(),
  isDefault: z.boolean(),
  isSystemVersion: z.boolean(),
})

export const versionSummaryResponseSchema = versionBaseResponseSchema

export const versionDetailedResponseSchema = versionBaseResponseSchema.and(
  z.object({

    beatsPerBar: z.number(),
    beatsCount: z.number(),
    beatChords: z.array(beatChordSchema),
    shiftViewValue: z.number(),
    userRating: z.number().nullable(),
  }))

export const getSongVersionQuerySchema = z.object({
  songId: objectIdSchema,
  versionId: objectIdSchema,
  loggedInUserId: objectIdSchema.optional()
})

export const rateVersionInputSchema = z.object({
  versionId: objectIdSchema,
  userId: objectIdSchema,
  rating: z.number().min(1).max(5)
})

export const rateVersionResponseSchema = z.object({
  userRating: z.number(),
  ratingAverage: z.number(),
  ratingCount: z.number()
})

export const getSongVersionsQuerySchema = z.object({
  songId: objectIdSchema,
  continuationToken: continuationTokenSchema
})

export const getSongVersionsContinuationTokenPayloadSchema = z.object({
  lastVersionId: objectIdSchema
})

export const upsertSongVersionInputSchema = z.object({
  userId: objectIdSchema,
  songId: objectIdSchema,
  originalVersionId: objectIdSchema,
  beatsPerBar: z.union([z.literal(BEATS_PER_BAR[3]), z.literal(BEATS_PER_BAR[4])]),
  shiftViewValue: z.coerce.number().min(0),
  chords: z.array(z.string().nullable())
}).refine((data) => {
  return data.shiftViewValue < data.beatsPerBar
}, {
  message: 'Shift view value less than beats per bar'
})

export const upsertSongVersionResponseSchema = z.object({
  id: z.string(),
})

export const deleteUserSongVersionInputSchema = z.object({
  userId: objectIdSchema,
  songId: objectIdSchema,
})

export const getUserVersionsQuerySchema = z.object({
  userId: objectIdSchema,
  continuationToken: continuationTokenSchema
})

export const userVersionSummaryResponseSchema =
  versionBaseResponseSchema.omit({ songId: true })
    .and(
      z.object({
        modifiedAt: z.string(),
        song: z.object({
          id: z.string(),
          title: z.string(),
          youtubeId: z.string(),
          youtubeChannel: z.object({
            id: z.string(),
            name: z.string(),
          }),
          duration: z.number()
        })
      }))

export const getUserVersionsContinuationTokenPayloadSchema = z.object({
  versionId: objectIdSchema,
  modifiedAt: z.string(),
})
