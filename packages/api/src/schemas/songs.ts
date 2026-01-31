import { z } from 'zod'
import { continuationTokenSchema, keySchema, objectIdSchema } from './shared.js'

export const songBaseResponse = z.object({
  id: z.string(),
  title: z.string(),
  youtubeId: z.string(),
  youtubeChannel: z.object({
    id: z.string(),
    name: z.string(),
  }),
  defaultVersion: z.object({
    id: z.string(),
    bpm: z.number(),
    key: keySchema,
  }),
  duration: z.number()
})

export const songDetailedResponseSchema = songBaseResponse.and(
  z.object({
    favoritesCount: z.number(),
    userHasFavorited: z.boolean().nullable(),
    userVersionId: z.string().nullable()
  }))

export const songSummaryResponseSchema = songBaseResponse

export const getSongByIdQuerySchema = z.object({
  songId: objectIdSchema,
  userId: objectIdSchema.optional(),
})

export const getSongsQuerySchema = z.object({
  continuationToken: continuationTokenSchema
})

export const getSongsContinuationTokenPayloadSchema = z.object({
  lastSongId: objectIdSchema
})
