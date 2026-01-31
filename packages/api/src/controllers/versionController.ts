import { Router } from 'express'
import { protectedRouteHandler } from '../utils/routes.js'
import { validateRequest } from '../utils/validateRequest.js'
import { HTTP_CODES } from '@chords-extractor/common/constants'
import { VersionRatingService } from '../services/VersionRatingService.js'
import { rateVersionInputSchema } from '../schemas/versions.js'

const router = Router()

router.post('/:versionId/ratings', protectedRouteHandler(
  async function getSongVersion (req, res) {
    const input = validateRequest(rateVersionInputSchema, {
      versionId: req.params.versionId,
      userId: req.session.user.id,
      rating: req.body.rating
    })

    const data = await VersionRatingService.rateVersion(input)

    res.status(HTTP_CODES.OK).json({
      status: 'success',
      data
    })
  }
))

export default router
