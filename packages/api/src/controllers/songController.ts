import { HTTP_CODES } from '@chords-extractor/common/constants'
import { VersionService } from '../services/VersionService.js'
import { SongSearchService } from '../services/SongSearchService.js'
import { SongService } from '../services/SongService.js'
import { validateRequest } from '../utils/validateRequest.js'
import { protectedRouteHandler, routeHandler } from '../utils/routes.js'
import { Router } from 'express'
import { getSongByIdQuerySchema, getSongsQuerySchema } from '../schemas/songs.js'
import { deleteUserSongVersionInputSchema, getSongVersionQuerySchema, getSongVersionsQuerySchema, upsertSongVersionInputSchema } from '../schemas/versions.js'
import { searchWithYoutubeQuerySchema } from '../schemas/songsSearch.js'
import { favoriteSongInputSchema, unfavoriteSongInputSchema } from '../schemas/favoriteSongs.js'
import { FavoriteSongService } from '../services/FavoriteSongService.js'

const router = Router()

router.get('/', routeHandler(
  async function getAllSongs (req, res) {
    const query = validateRequest(getSongsQuerySchema, {
      continuationToken: req.query.continuationToken
    })

    const data = await SongService.getSongs(query)

    res.status(HTTP_CODES.OK).json({
      status: 'success',
      data
    })
  }
))

router.get('/search/youtube', routeHandler(
  async function getYoutubeSearchResultsWithSongs (req, res) {
    const query = validateRequest(searchWithYoutubeQuerySchema, { q: req.query.q })

    const results = await SongSearchService.searchWithYoutube(query)

    res.status(HTTP_CODES.OK).json({
      status: 'success',
      data: results
    })
  }
))

router.get('/:songId', routeHandler(
  async function getSongById (req, res) {
    const query = validateRequest(getSongByIdQuerySchema, {
      songId: req.params.songId,
      userId: req.session.user?.id,

    })
    const data = await SongService.getSongById(query)

    res.status(HTTP_CODES.OK).json({
      status: 'success',
      data
    })
  })
)

router.post('/:songId/favorites', protectedRouteHandler(
  async function favoriteSong (req, res) {
    const input = validateRequest(favoriteSongInputSchema, { songId: req.params.songId, userId: req.session.user.id })

    await FavoriteSongService.favoriteSong(input)
    res.status(201).json({
      status: 'success'
    })
  }))

router.delete('/:songId/favorites', protectedRouteHandler(
  async function favoriteSong (req, res) {
    const input = validateRequest(unfavoriteSongInputSchema, { songId: req.params.songId, userId: req.session.user.id })

    await FavoriteSongService.unfavoriteSong(input)
    res.status(201).json({
      status: 'success'
    })
  }))

router.get('/:songId/versions', routeHandler(
  async function getSongsVersions (req, res) {
    const query = validateRequest(getSongVersionsQuerySchema, {
      songId: req.params.songId,
      continuationToken: req.query.continuationToken
    })
    const result = await VersionService.getSongVersions(query)
    res.status(200).json({
      status: 'success',
      data: result
    })
  }))

router.post('/:songId/versions', protectedRouteHandler(
  async function upsertUserVersion (req, res) {
    const input = validateRequest(upsertSongVersionInputSchema, {
      userId: req.session.user.id,
      songId: req.params.songId,
      originalVersionId: req.body.originalVersionId,
      chords: req.body.chords,
      beatsPerBar: req.body.beatsPerBar,
      shiftViewValue: req.body.shiftViewValue,
    })
    const result = await VersionService.upsertUserVersion(input)
    res.status(201).json({
      status: 'success',
      data: result
    })
  }
))

router.delete('/:songId/versions', protectedRouteHandler(
  async function deleteUserVersion (req, res) {
    const input = validateRequest(deleteUserSongVersionInputSchema, {
      userId: req.session.user.id,
      songId: req.params.songId,
    })
    await VersionService.deleteUserVersion(input)
    res.status(200).json({
      status: 'success',
    })
  }
))

router.get('/:songId/versions/:versionId', routeHandler(
  async function getSongVersion (req, res) {
    const query = validateRequest(getSongVersionQuerySchema, {
      songId: req.params.songId,
      versionId: req.params.versionId,
      loggedInUserId: req.session.user?.id
    })

    const data = await VersionService.getSongVersion(query)

    res.status(HTTP_CODES.OK).json({
      status: 'success',
      data
    })
  }
))

export default router

// export const upsertUserVersion = tryCatch(async (req: Request, res: Response) => {
//   const { _id } = req.params
//   const { chords, shiftViewValue, beatsPerBar } = req.body
//   const version = await VersionService.upsertUserVersion({ songId: _id, user: req.session.user, chords, shiftViewValue, beatsPerBar })
//   res.status(200).json({
//     status: 'success',
//     data: version
//   })
// })

// export const deleteUserVersion = tryCatch(async (req: Request, res: Response) => {
//   const { _id } = req.params
//   await VersionService.deleteUserVersion({ songId: _id, userId: req.session.user.id })
//   res.status(204).json({
//     status: 'success'
//   })
// })

// export const upsertUserVersionRate = tryCatch(async (req: Request, res: Response) => {
//   const { _id, creatorId } = req.params
//   const { rating } = req.body
//   const data = await VersionService.upsertUserRate({ songId: _id, creatorId, userId: req.session.user.id, rating })

//   res.status(HTTP_CODES.OK).json({
//     status: 'success',
//     data
//   })
// }
// )

// export const createFavorite = tryCatch(async (req: Request, res: Response) => {
//   const { _id } = req.params
//   const userId = req.session.user.id

//   await FavoriteSongModel.create({ songId: _id, userId })
//   res.status(201).json({
//     status: 'success'
//   })
// })

// export const deleteFavorite = tryCatch(async (req: Request, res: Response) => {
//   const { _id } = req.params
//   const userId = req.session.user.id

//   await FavoriteSongModel.delete({ songId: _id, userId })
//   res.status(200).json({
//     status: 'success'
//   })
// })

// export const getYoutubeResultsWithSongs = tryCatch(async (req: Request, res: Response) => {

// })

// // router.get('/', getAllSongs)

// // router.get('/search/youtube', getYoutubeResultsWithSongs)

// router.get('/:_id/versions', findAllVersionsBySongId)

// // router.get('/:_id', getSongById)

// router.post('/:_id/favorites', requireAuth, createFavorite)

// router.delete('/:_id/favorites', requireAuth, deleteFavorite)

// // router.get('/:_id/versions/:versionId', findSongVersionById)

// router.post('/:_id/versions/:creatorId/rating', requireAuth, upsertUserVersionRate)

// router.post('/:_id/versions', requireAuth, upsertUserVersion)

// router.delete('/:_id/versions', requireAuth, deleteUserVersion)
