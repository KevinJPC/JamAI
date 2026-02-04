import { z } from 'zod'

const envMongoConfigSchema = z.object({
  MONGO_URI: z.string().url(),
  MONGO_DB_NAME: z.string()
})

const envRedisConfigSchema = z.object({
  REDIS_URL: z.string().url(),
  REDIS_CLIENT_PREFIX: z.string(),
})

const youtubeConfig = z.object({
  YOUTUBE_API_KEY: z.string()
})

const pythonAnalyzerApiKey = z.object({
  INTERNAL_PYTHON_ANALYZER_API_KEY: z.string(),
  INTERNAL_PYTHON_ANALYZER_API_URL: z.string()
})

const sessionsConfigSchema = z.object({
  SESSIONS_SECRET_KEY: z.string()
})

const booleanSchema = z.boolean()
  .or(
    z.enum(['true', 'false']).transform((val) => val === 'true')
  )

const configSchema = z.object({
  FRONTEND_URL: z.string().url(),
  ENV: z.enum(['development', 'production']),
  DISABLE_ANALYSIS_JOBS: booleanSchema
}).and(envMongoConfigSchema)
  .and(envRedisConfigSchema)
  .and(youtubeConfig)
  .and(pythonAnalyzerApiKey)
  .and(sessionsConfigSchema)

const parsedConfig = configSchema.safeParse(process.env)
if (!parsedConfig.success) {
  throw new Error(`Env variables validation error. ${parsedConfig.error.message}`)
}

export default {
  env: parsedConfig.data.ENV,
  frontendUrl: parsedConfig.data.FRONTEND_URL,
  disableAnalysisJobs: parsedConfig.data.DISABLE_ANALYSIS_JOBS,
  redis: {
    url: parsedConfig.data.REDIS_URL,
    clientPrefix: parsedConfig.data.REDIS_CLIENT_PREFIX
  },
  mongo: {
    uri: parsedConfig.data.MONGO_URI,
    dbName: parsedConfig.data.MONGO_DB_NAME,
  },
  session: {
    cookieName: 'sessionId',
    secretKey: parsedConfig.data.SESSIONS_SECRET_KEY,
    expirationMs: 1000 * 1 * 60 * 60 * 24 * 30 // 1 month
  },
  youtube: {
    yotubeApiKey: parsedConfig.data.YOUTUBE_API_KEY

  },
  pythonAnalyzerApi: {
    apiKey: parsedConfig.data.INTERNAL_PYTHON_ANALYZER_API_KEY,
    url: parsedConfig.data.INTERNAL_PYTHON_ANALYZER_API_URL
  }
}
