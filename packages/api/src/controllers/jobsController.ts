import { ERROR_CODES, HTTP_CODES } from '@chords-extractor/common/constants'
import { AnalysesService } from '../services/AnalysesService.js'
import { protectedRouteHandler } from '../utils/routes.js'
import { Router } from 'express'
import { validateRequest } from '../utils/validateRequest.js'
import { createYoutubeVideoAnalysisJobInputSchema, getYoutubeVideoAnalysisJobQuerySchema } from '../schemas/analyses.js'
import { createYoutubeVideoAnalysisJobLimiter } from '../lib/rateLimiters.js'
import { tryRateLimiterConsume } from '../utils/tryRateLimiterConsume.js'
import config from '../config.js'
import { AppError, featureUnavailableError, tooManyRequestsError } from '../errors.js'

const router = Router()

router.get('/:id', protectedRouteHandler(
  async function getAnalysisJob (req, res) {
    if (config.disableAnalysisJobs) throw featureUnavailableError()

    const query = validateRequest(getYoutubeVideoAnalysisJobQuerySchema, {
      id: req.params.id
    })

    const job = await AnalysesService.getYoutubeVideoAnalysisJob(query)

    res.status(HTTP_CODES.OK).json({
      status: 'success',
      data: job
    })
  }))

  router.post('/', protectedRouteHandler(
  async function createAnalysisJob (req, res) {
    if (config.disableAnalysisJobs) throw featureUnavailableError()

    const input = validateRequest(createYoutubeVideoAnalysisJobInputSchema, {
      youtubeId: req.body.youtubeId,
      overrideIfExists: req.body.overrideIfExists
    })
    
    if(!config.disableAnalysisJobsRateLimiter) {
      const [allowed, rateLimiterRes]  = await tryRateLimiterConsume(createYoutubeVideoAnalysisJobLimiter, req.session.user.id, 1)
      if (!allowed) throw tooManyRequestsError({ retryAfterMs: rateLimiterRes.msBeforeNext })
    }
    
    try {
      const job = await AnalysesService.createYoutubeVideoAnalysisJob(input)
      res.status(HTTP_CODES.CREATED).json({
        status: 'success',
        data: job
      })
    } catch (error) {
      if (error instanceof AppError && error.errorCode === ERROR_CODES.YOUTUBE_VIDEO_TOO_LONG && !config.disableAnalysisJobsRateLimiter) {
        await createYoutubeVideoAnalysisJobLimiter.reward(req.session.user.id, 1)
      }
      throw error
    }
  }))

export default router
