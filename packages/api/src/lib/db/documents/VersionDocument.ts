import { ObjectId } from 'mongodb'
import { BeatChord, Key } from '../../../types/music.js'

export type VersionDocument = {
  _id: ObjectId,
  songId: ObjectId,
  user: {
    id: ObjectId
    name: string,
    lastName: string
  } | null
  bpm: number,
  key: Key
  beatsPerBar: number,
  beatsCount: number,
  beatChords: BeatChord[],
  shiftViewValue: number,
  ratingCount: number,
  ratingAverage: number,
  ratings: {
    userId: ObjectId,
    value: number,
  }[],
  createdAt: string,
  modifiedAt: string,
  isDefault: boolean,
  isSystemVersion: boolean,
}
