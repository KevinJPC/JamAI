import { useState } from 'react'
import Chord from '@chords-extractor/common/chord'
import Key from '@chords-extractor/common/key'

import { SongVersionSettingsContext } from '@/shared/song-version-settings/SongVersionSettingsContext'
import { getPersistedSongVersionSettings, songVersionSettingsSchema, updatePersistedSongVersionSettings } from '@/shared/song-version-settings/storage'
import { useUserPreferences } from '@/shared/user-preferences/UserPreferencesContext'

export const SongVersionSettingsProvider = ({ songId, versionId, versionKey: key, children }) => {
  const userPreferences = useUserPreferences()

  const [settings, setSettings] = useState(() => {
    if (!userPreferences.persistSongVersionsSettings) return defaultSongVersionSettings({ key })
    return getPersistedSongVersionSettings({ songId, versionId }) ?? defaultSongVersionSettings({ key })
  })

  const updateSettings = (data) => {
    const newSettings = { ...settings, ...data }
    setSettings(newSettings)
    if (userPreferences.persistSongVersionsSettings) updatePersistedSongVersionSettings({ songId, versionId }, newSettings)
  }

  const updateTransposeValue = (newTransposeValue) => {
    if (!songVersionSettingsSchema.shape.transposeValue.safeParse(newTransposeValue).success) return
    updateSettings({ transposeValue: newTransposeValue })
  }

  const updateSimplify = (newSimplify) => {
    if (newSimplify === settings.simplify) return
    updateSettings({ simplify: newSimplify })
  }

  const toggleAccidental = () => {
    updateSettings({
      accidental: settings.accidental === Chord.accidentals.sharp
        ? Chord.accidentals.flat
        : Chord.accidentals.sharp
    })
  }

  return (
    <SongVersionSettingsContext.Provider value={{ ...settings, updateSimplify, updateTransposeValue, toggleAccidental }}>
      {children}
    </SongVersionSettingsContext.Provider>
  )
}

const defaultSongVersionSettings = ({ key }) => ({
  simplify: false,
  transposeValue: 0,
  accidental: Key.getPreferredAccidentalFromKey(key)
})
