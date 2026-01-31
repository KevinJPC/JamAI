import { Queue } from 'bullmq'
import { YoutubeVideoWithDuration } from './YoutubeClient.js'
import { SongSummaryResponse } from '../types/songs.js'
import { Redis } from 'ioredis'

export const ANALYSES_JOB_TYPES = {
  analysis: 'analysis'
}

export type AnalysesJobData = {
  video: YoutubeVideoWithDuration,
  overrideIfExists: boolean
}
export type AnalysesJobType = keyof typeof ANALYSES_JOB_TYPES
export type AnalysesJobResult = SongSummaryResponse

type AnalysesQueue = Queue<AnalysesJobData, AnalysesJobResult, AnalysesJobType>

let _analysesQueue: AnalysesQueue | null = null

export function setupAnalysesQueue ({ url, clientPrefix }: { url: string, clientPrefix: string }): Promise<void> {
  const newAnalysesQueue: AnalysesQueue = new Queue(
    'analyses-queue', {
      connection: new Redis(url, {
        // fast failing if redis is down
        enableOfflineQueue: false,
        maxRetriesPerRequest: 1,

      }),
      // use bullmq prefix option instead of ioredis contructor keyPrefix option
      // as mention here: https://docs.bullmq.io/guide/connections#queue
      prefix: clientPrefix,
      defaultJobOptions: {
        attempts: 0,
        removeOnComplete: {
          age: 60
        },
        removeOnFail: {
          age: 60
        }
      }
    }
  )
  /* Currently, for failing fast to be enable there is a limitation in that the Redis instance must at least be online
  ** while the queue is being instantiated.
  ** https://docs.bullmq.io/patterns/failing-fast-when-redis-is-down
  **/
  return new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Redis db connection failed.'))
    }, 5000)
    newAnalysesQueue.client.then(_client => {
      clearTimeout(timeoutId)
      _analysesQueue = newAnalysesQueue
      console.log('Redis DB connection successful')
      resolve()
    }).catch((err) => {
      clearTimeout(timeoutId)
      reject(new Error(`Redis db connection failed. ${err.message}`))
    })
  })
}

export function analysesQueue (): AnalysesQueue {
  if (!_analysesQueue) throw new Error('No queue connection')
  return _analysesQueue
}
