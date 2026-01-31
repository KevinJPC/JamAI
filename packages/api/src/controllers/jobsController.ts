import { HTTP_CODES } from '@chords-extractor/common/constants'
import { AnalysesService } from '../services/AnalysesService.js'
import { protectedRouteHandler } from '../utils/routes.js'
import { Router } from 'express'
import { validateRequest } from '../utils/validateRequest.js'
import { createYoutubeVideoAnalysisJobInputSchema, getYoutubeVideoAnalysisJobQuerySchema } from '../schemas/analyses.js'
import { createYoutubeVideoAnalysisJobLimiter } from '../lib/rateLimiters.js'
import { ServiceUnavailable, TooManyRequests, YoutubeVideoTooLongError } from '../errors.js'
import { tryRateLimiterConsume } from '../utils/tryRateLimiterConsume.js'
import config from '../config.js'

const router = Router()

router.get('/:id', protectedRouteHandler(
  async function getAnalysisJob (req, res) {
    if (config.disableAnalysisJobs) throw new ServiceUnavailable()

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
    console.log(config.disableAnalysisJobs)
    if (config.disableAnalysisJobs) throw new ServiceUnavailable()

    const input = validateRequest(createYoutubeVideoAnalysisJobInputSchema, {
      youtubeId: req.body.youtubeId,
      overrideIfExists: req.body.overrideIfExists
    })

    const [allowed, rateLimiterRes] = await tryRateLimiterConsume(createYoutubeVideoAnalysisJobLimiter, req.session.user.id, 1)

    if (!allowed) throw new TooManyRequests({ retryAfterMs: rateLimiterRes.msBeforeNext })

    let job

    try {
      job = await AnalysesService.createYoutubeVideoAnalysisJob(input)
    } catch (error) {
      if (error instanceof YoutubeVideoTooLongError) {
        await createYoutubeVideoAnalysisJobLimiter.reward(req.session.user.id, 1)
      }
    }

    res.status(HTTP_CODES.CREATED).json({
      status: 'success',
      data: job
    })
  }))

export default router
