import { z } from 'zod'
import { createYoutubeVideoAnalysisJobInputSchema, getYoutubeVideoAnalysisJobQuerySchema, jobResponseSchema } from '../schemas/analyses.js'

export type JobResponse = z.infer<typeof jobResponseSchema>

export type GetYoutubeVideoAnalysisJobQuery = z.infer<typeof getYoutubeVideoAnalysisJobQuerySchema>
export type CreateYoutubeVideoAnalysisJobInput = z.infer<typeof createYoutubeVideoAnalysisJobInputSchema>
