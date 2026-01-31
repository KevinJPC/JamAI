import { RateLimiterMemory } from 'rate-limiter-flexible'

export const createYoutubeVideoAnalysisJobLimiter = new RateLimiterMemory({
  points: 2,
  duration: 60 * 60 * 24 // in seconds - 24h
})
