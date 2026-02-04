import { csrfSync } from 'csrf-sync'

export const { csrfSynchronisedProtection, generateToken } = csrfSync({
  getTokenFromRequest: (req) => {
    return req.get('x-csrf-token')
  }
})
