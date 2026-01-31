import { ObjectId } from 'mongodb'

export type FavoriteSongDocument = {
  _id: ObjectId,
  userId: ObjectId,
  songId: ObjectId,
  createdAt: string
}
