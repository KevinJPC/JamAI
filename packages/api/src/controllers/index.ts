import { Router } from 'express'
import userRoutes from './userController.js'
import authRoutes from './authController.js'
import songsRoutes from './songController.js'
import versionRoutes from './versionController.js'
import jobsRoutes from './jobsController.js'

const router = Router()

router.use('/api/users', userRoutes)
router.use('/api/jobs', jobsRoutes)
router.use('/api/songs', songsRoutes)
router.use('/api/versions', versionRoutes)
router.use('/api/auth/local', authRoutes)

export default router
