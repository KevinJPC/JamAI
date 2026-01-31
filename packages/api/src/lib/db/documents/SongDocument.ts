import { ObjectId } from 'mongodb'
import { Key } from '../../../types/music.js'

export type SongDocument = {
  _id: ObjectId,
  title: string,
  youtubeId: string,
  youtubeChannel: {
    id: string,
    name: string
  },
  duration: number,
  favoritesCount: 0,
  defaultVersion: {
    id: ObjectId,
    bpm: number,
    key: Key,
  },
  createdAt: string,
  modifiedAt: string,
}
