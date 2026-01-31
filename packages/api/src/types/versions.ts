import { z } from 'zod'
import {
  deleteUserSongVersionInputSchema,
  getSongVersionQuerySchema,
  getSongVersionsContinuationTokenPayloadSchema,
  getSongVersionsQuerySchema,
  getUserVersionsContinuationTokenPayloadSchema,
  getUserVersionsQuerySchema,
  rateVersionInputSchema,
  rateVersionResponseSchema,
  upsertSongVersionInputSchema,
  upsertSongVersionResponseSchema,
  userVersionSummaryResponseSchema,
  versionDetailedResponseSchema,
  versionSummaryResponseSchema
} from '../schemas/versions.js'

export type VersionSummaryResponse = z.infer<typeof versionSummaryResponseSchema>
export type VersionDetailedResponse = z.infer<typeof versionDetailedResponseSchema>

export type GetSongVersionQuery = z.infer<typeof getSongVersionQuerySchema>

export type RateVersionInput = z.infer<typeof rateVersionInputSchema>

export type RateVersionResponse = z.infer<typeof rateVersionResponseSchema>

export type GetSongVersionsQuery = z.infer<typeof getSongVersionsQuerySchema>

export type GetSongVersionsContinuationTokenPayload = z.infer<typeof getSongVersionsContinuationTokenPayloadSchema>

export type UpsertSongVersionInput = z.infer<typeof upsertSongVersionInputSchema>

export type UpsertSongVersionResponse = z.infer<typeof upsertSongVersionResponseSchema>

export type DeleteUserSongVersionInput = z.infer<typeof deleteUserSongVersionInputSchema>

export type GetUserVersionsQuery = z.infer<typeof getUserVersionsQuerySchema>

export type UserVersionSummaryResponse = z.infer<typeof userVersionSummaryResponseSchema>

export type GetUserVersionsContinuationTokenPayload = z.infer<typeof getUserVersionsContinuationTokenPayloadSchema>
