import crypto from 'node:crypto'

const KEY_LENGTH = 64

export const hashPassword = (password: string, salt?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!salt) salt = crypto.randomBytes(16).toString('hex')
    crypto.scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) return reject(error)
      const hashedPassword = `${salt}:${derivedKey.toString('hex')}`
      resolve(hashedPassword)
    })
  })
}

const splitHashedPassword = (hash: string) => {
  const [salt, key] = hash.split(':')
  if (!salt || !key) throw new Error('Error splitting password')
  return { salt, key }
}

export const comparePassword = async (password: string, hashedPassword: string) => {
  const { salt, key } = splitHashedPassword(hashedPassword)
  const hashedPasswordToCampare = await hashPassword(password, salt)
  const keyToCompare = splitHashedPassword(hashedPasswordToCampare).key
  const keyBuffer = Buffer.from(key)
  const keyBufferToCompare = Buffer.from(keyToCompare)
  const isValidPassword = crypto.timingSafeEqual(keyBuffer, keyBufferToCompare)
  return isValidPassword
}
