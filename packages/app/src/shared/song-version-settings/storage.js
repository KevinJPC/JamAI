import Chord from '@chords-extractor/common/chord'
import { z } from 'zod'

import { getItemFromLocalStorage, setItemToLocalStorage } from '@/shared/utils/localStorage'

const SONG_VERSION_SETTINGS_PREFIX = 'song-version-settings'

function persistedSongVersionSettingsKey ({ songId, versionId }) {
  return `${SONG_VERSION_SETTINGS_PREFIX}:${songId}:${versionId}`
}

export const getPersistedSongVersionSettings = ({ songId, versionId }) => {
  const key = persistedSongVersionSettingsKey({ songId, versionId })
  const parsedChordsSettings = songVersionSettingsSchema.safeParse(getItemFromLocalStorage(key))
  if (parsedChordsSettings.success) return parsedChordsSettings.data
  return null
}

export const updatePersistedSongVersionSettings = ({ songId, versionId }, data) => {
  const key = persistedSongVersionSettingsKey({ songId, versionId })
  setItemToLocalStorage(key, data)
}

export const songVersionSettingsSchema = z.object({
  transposeValue: z.number().min(-11).max(11),
  simplify: z.boolean(),
  accidental: z.union([z.literal(Chord.accidentals.flat), z.literal(Chord.accidentals.sharp)])
})
