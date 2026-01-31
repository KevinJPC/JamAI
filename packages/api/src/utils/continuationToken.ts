export function tryGetContinuationTokenPayloadOrNull<T> (continuationToken: string | null, validatorFn: (payload: unknown) => T | null):T | null {
  try {
    if (!continuationToken) return null
    const json = Buffer.from(continuationToken, 'base64').toString('utf-8')
    const payload = JSON.parse(json)

    const validatedPayload = validatorFn(payload)
    if (!validatedPayload) return null
    return validatedPayload
  } catch (error) {
    return null
  }
}

export function createContinuationTokenFromPayload<T> (payload: NonNullable<T>): string {
  const json = JSON.stringify(payload)
  return Buffer.from(json).toString('base64')
}

export function createContinuationTokenHandler<TItem, TPayload> (options:{
  payloadFn: (item:NonNullable<TItem>) => NonNullable<TPayload>,
  parsePayload: (payload: unknown) => TPayload | undefined | null
}) {
  return {
    encode: (item: TItem | null | undefined):string | null => {
      if (item === null || item === undefined) return null
      const json = JSON.stringify(options.payloadFn(item))
      return Buffer.from(json).toString('base64')
    },
    decode: (continuationToken: string | null | undefined): TPayload | null => {
      if (!continuationToken) return null
      try {
        const json = Buffer.from(continuationToken, 'base64').toString('utf-8')
        const payload = JSON.parse(json)

        const validatedPayload = options.parsePayload(payload)
        if (!validatedPayload) return null
        return validatedPayload
      } catch (error) {
        return null
      }
    }
  }
}
