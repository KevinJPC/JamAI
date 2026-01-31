import { ObjectId } from 'mongodb'

export const tryObjectIdFromStringOrNull = (value: string) => {
  try {
    return ObjectId.createFromHexString(value)
  } catch (_) {
    return null
  }
}
