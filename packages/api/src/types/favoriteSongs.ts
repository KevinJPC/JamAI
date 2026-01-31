import { z } from 'zod'
import { favoriteSongInputSchema, getFavoriteUserSongsContinuationTokenPayloadSchema, getFavoriteUserSongsQuerySchema, unfavoriteSongInputSchema } from '../schemas/favoriteSongs.js'

export type UnfavoriteSongInput = z.infer<typeof unfavoriteSongInputSchema>
export type FavoriteSongInput = z.infer<typeof favoriteSongInputSchema>

export type GetFavoriteUserSongsQuery = z.infer<typeof getFavoriteUserSongsQuerySchema>
export type GetFavoriteUserSongsContinuationTokenPayload = z.infer<typeof getFavoriteUserSongsContinuationTokenPayloadSchema>
