import { z } from 'zod'
import { songSummaryResponseSchema } from './songs.js'

const baseYoutubeSearchResultResponseSchema = z.object({
  youtube: z.object({
    id: z.string(),
    title: z.string(),
    channel: z.object({
      id: z.string(),
      name: z.string()
    })
  })
})

export const notAnalyzedYoutubeSearchResultResponseSchema = baseYoutubeSearchResultResponseSchema.extend({
  isAnalyzed: z.literal(false)
})

export const analyzedYoutubeSearchResultResponseSchema = baseYoutubeSearchResultResponseSchema.extend({
  isAnalyzed: z.literal(true),
  song: songSummaryResponseSchema,
})

export const YoutubeSearchResultResponseSchema = z.discriminatedUnion('isAnalyzed',
  [notAnalyzedYoutubeSearchResultResponseSchema, analyzedYoutubeSearchResultResponseSchema])

export const searchWithYoutubeQuerySchema = z.object({
  q: z.string()
})
