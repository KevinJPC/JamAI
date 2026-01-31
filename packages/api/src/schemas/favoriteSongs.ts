import { z } from 'zod'
import { continuationTokenSchema, objectIdSchema } from './shared.js'

export const favoriteSongInputSchema = z.object({
  songId: objectIdSchema,
  userId: objectIdSchema,
})

export const unfavoriteSongInputSchema = z.object({
  songId: objectIdSchema,
  userId: objectIdSchema,
})

export const getFavoriteUserSongsQuerySchema = z.object({
  userId: objectIdSchema,
  continuationToken: continuationTokenSchema
})

export const getFavoriteUserSongsContinuationTokenPayloadSchema = z.object({
  lastFavoriteId: objectIdSchema
})
