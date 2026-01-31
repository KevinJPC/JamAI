import { z } from 'zod'
import { getSongByIdQuerySchema, getSongsContinuationTokenPayloadSchema, getSongsQuerySchema, songDetailedResponseSchema, songSummaryResponseSchema } from '../schemas/songs.js'

export type SongDetailedResponse = z.infer<typeof songDetailedResponseSchema>
export type SongSummaryResponse = z.infer<typeof songSummaryResponseSchema>
export type GetSongByIdQuery = z.infer<typeof getSongByIdQuerySchema>

export type GetSongsQuery = z.infer<typeof getSongsQuerySchema>
export type FindAllSongsContinuationTokenPayload = z.infer<typeof getSongsContinuationTokenPayloadSchema>
