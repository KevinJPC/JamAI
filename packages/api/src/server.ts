import app from './app.js'
import { setupAnalysesQueue } from './lib/analysesQueue.js'
import { setupAnalysesWorker } from './lib/analysesWorker.js'
import config from './config.js'
import { setupYoutubeClient } from './lib/YoutubeClient.js'
import { setupJamAIMongoDB } from './lib/db/JamAIMongoDB.js'

const startServer = async () => {
  try {
    const port = process.env.PORT || 3000

    await setupJamAIMongoDB(config.mongo)
    await setupAnalysesQueue(config.redis)
    setupAnalysesWorker(config.redis)
    await setupYoutubeClient(config.youtube.yotubeApiKey)

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`)
    })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
startServer()
