import { z } from 'zod'
import { analyzedYoutubeSearchResultResponseSchema, notAnalyzedYoutubeSearchResultResponseSchema, searchWithYoutubeQuerySchema, YoutubeSearchResultResponseSchema } from '../schemas/songsSearch.js'

export type NotAnalyzedYoutubeSearchResultResponse = z.infer<typeof notAnalyzedYoutubeSearchResultResponseSchema>
export type AnalyzedYoutubeSearchResultResponse = z.infer<typeof analyzedYoutubeSearchResultResponseSchema>

export type YoutubeSearchResultResponse = z.infer<typeof YoutubeSearchResultResponseSchema>

export type SearchWithYoutubeQuery = z.infer<typeof searchWithYoutubeQuerySchema>
