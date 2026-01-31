import { JOB_STATUS } from '@chords-extractor/common/constants'
import { z } from 'zod'
import { songSummaryResponseSchema } from './songs.js'

export const jobResponseSchema = z.object({
  id: z.string(),
  status: z.union([z.literal(JOB_STATUS.waiting), z.literal(JOB_STATUS.processing), z.literal(JOB_STATUS.completed), z.literal(JOB_STATUS.failed)]),
  result: songSummaryResponseSchema.nullable()
})

export const createYoutubeVideoAnalysisJobInputSchema = z.object({
  youtubeId: z.string(),
  overrideIfExists: z.boolean().optional().default(false)
})

export const getYoutubeVideoAnalysisJobQuerySchema = z.object({
  id: z.string()
})
