import { RateLimiterAbstract, RateLimiterRes } from 'rate-limiter-flexible'

type RateLimitConsumeResult = [allowed: boolean, rateLimiterRes: RateLimiterRes]

export async function tryRateLimiterConsume (rateLimiter: RateLimiterAbstract, key: string | number, pointsToConsume: number): Promise<RateLimitConsumeResult> {
  return await rateLimiter.consume(key, pointsToConsume)
    .then<RateLimitConsumeResult>((rateLimitState) => {
      return [true, rateLimitState]
    })
    .catch<RateLimitConsumeResult>(rateLimitState => {
      if (rateLimitState instanceof RateLimiterRes) {
        return [false, rateLimitState]
      }
      throw rateLimitState
    })
}
