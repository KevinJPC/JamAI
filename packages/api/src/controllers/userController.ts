import { HTTP_CODES } from '@chords-extractor/common/constants'
import { protectedRouteHandler } from '../utils/routes.js'
import { Router } from 'express'
import { FavoriteSongService } from '../services/FavoriteSongService.js'
import { validateRequest } from '../utils/validateRequest.js'
import { getFavoriteUserSongsQuerySchema } from '../schemas/favoriteSongs.js'
import { VersionService } from '../services/VersionService.js'
import { getUserVersionsQuerySchema } from '../schemas/versions.js'
import UserService from '../services/UserService.js'
import { updateUserInputSchema } from '../schemas/users.js'
import { ObjectId } from 'mongodb'

const router = Router()

router.get('/me', protectedRouteHandler(
  async function getAuthenticatedUser (req, res) {
    const user = await UserService.getAuthenticatedUser({ userId: new ObjectId(req.session.user.id) })
    res.status(HTTP_CODES.OK).json({
      status: 'success',
      data: user
    })
  }))

router.patch('/me',
  protectedRouteHandler(async function updateUser (req, res) {
    const input = validateRequest(updateUserInputSchema, {
      userId: req.session.user.id,
      name: req.body.name,
      lastName: req.body.lastName,
    })
    await UserService.updateUser(input)

    res.status(HTTP_CODES.OK).json({
      status: 'success'
    })
  }))

router.get('/me/versions',
  protectedRouteHandler(async function getUserVersions (req, res) {
    const query = validateRequest(
      getUserVersionsQuerySchema,
      {
        userId: req.session.user.id,
        continuationToken: req.query.continuationToken
      })

    const data = await VersionService.getUserVersions(query)

    res.status(HTTP_CODES.OK).json({
      status: 'success',
      data
    })
  }))

router.get('/me/favorites',
  protectedRouteHandler(async function getFavoriteUserSongs (req, res) {
    const query = validateRequest(
      getFavoriteUserSongsQuerySchema,
      {
        userId: req.session.user.id,
        continuationToken: req.query.continuationToken
      })

    const data = await FavoriteSongService.getFavoriteUserSongs(query)

    res.status(HTTP_CODES.OK).json({
      status: 'success',
      data
    })
  }))

export default router
