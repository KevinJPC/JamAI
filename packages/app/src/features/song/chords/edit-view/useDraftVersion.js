import { useState } from 'react'
import Chord from '@chords-extractor/common/chord'
import { BEATS_PER_BAR } from '@chords-extractor/common/constants'
import { z } from 'zod'

import { objectIdFormatSchema } from '@/shared/schemas'
import { getItemFromSessionStorage, removeItemFromSessionStorage, setItemToSessionStorage } from '@/shared/utils/sessionStorage'

function isValidChordSymbol (symbol) {
  if (symbol === null) return true
  try {
    Chord.parseChordString(symbol)
    return true
  } catch (error) {
    return false
  }
}

const draftVersionSchema = z.object({
  originalVersionId: objectIdFormatSchema,
  songId: objectIdFormatSchema,
  beatsPerBar: z.union([z.literal(BEATS_PER_BAR[3]), z.literal(BEATS_PER_BAR[4])]),
  shiftViewValue: z.number().min(0),
  lastEditAt: z.coerce.date(),
  beatChords: z.array(z.object({
    time: z.number(),
    number: z.number(),
    chord: z.string().nullable()
  })).refine(beatChords => beatChords.every(
    beatChord => isValidChordSymbol(beatChord.chord))
  ),
}).refine(data => {
  return data.shiftViewValue < data.beatsPerBar
})

const persistedDraftVersionKeyPrefix = 'persisted-draft-versions'

const createPersistedDraftVersionKey = ({ songId, originalVersionId }) => {
  return `${persistedDraftVersionKeyPrefix}:${songId}:${originalVersionId}`
}

const setPersistedDraftVersion = (key, data) => {
  setItemToSessionStorage(key, data)
}

const removePersistedDraftVersion = removeItemFromSessionStorage

const getPersistedDraftVersion = (key) => {
  const draftVersion = getItemFromSessionStorage(key)
  if (!draftVersion) return null
  const parsedDraftVersion = draftVersionSchema.safeParse(draftVersion)
  if (parsedDraftVersion.success) return parsedDraftVersion.data
  console.warn('Invalid persisted draft version')
  return null
}

export const useDraftVersion = (originalVersion) => {
  const [draftVersion, setDraftVersion] = useState(() => {
    return {
      originalVersionId: originalVersion.id,
      songId: originalVersion.songId,
      beatChords: [...originalVersion.beatChords],
      beatsPerBar: originalVersion.beatsPerBar,
      shiftViewValue: originalVersion.shiftViewValue,
      lastEditAt: null,
    }
  })

  const persistedDraftVersionKey = createPersistedDraftVersionKey({
    songId: originalVersion.songId,
    originalVersionId: originalVersion.id
  })

  // Draft version recovery snapshot loaded from persisted state
  const [draftVersionRecovery, setDraftVersionRecovery] = useState(() =>
    getPersistedDraftVersion(persistedDraftVersionKey)
  )

  const setDraftVersionAndPersist = (newData) => {
    setDraftVersion(newData)
    setPersistedDraftVersion(persistedDraftVersionKey, newData)
  }

  const editChord = ({ chordString, index }) => {
    const newBeatChords = [...draftVersion.beatChords]
    newBeatChords[index].chord = chordString || null
    setDraftVersionAndPersist({ ...draftVersion, beatChords: newBeatChords, lastEditAt: Date.now() })
  }

  const clearBeatChord = (beatChordIndex) => {
    const newBeatChords = [...draftVersion.beatChords]
    newBeatChords[beatChordIndex].chord = null
    setDraftVersionAndPersist({ ...draftVersion, beatChords: newBeatChords, lastEditAt: Date.now() })
  }

  const shiftView = (newValue) => {
    if (newValue < 0) return
    if (newValue > draftVersion.beatsPerBar - 1) return

    setDraftVersionAndPersist({ ...draftVersion, shiftViewValue: newValue, lastEditAt: Date.now() })
  }

  const toggleBeatsPerBar = () => {
    const newBeatsPerBar =
    draftVersion.beatsPerBar === BEATS_PER_BAR[4]
      ? BEATS_PER_BAR[3]
      : BEATS_PER_BAR[4]

    const newShiftViewValue = Math.min(draftVersion.shiftViewValue, newBeatsPerBar - 1)

    setDraftVersionAndPersist({
      ...draftVersion,
      shiftViewValue: newShiftViewValue,
      beatsPerBar: newBeatsPerBar,
      lastEditAt: Date.now()
    })
  }

  const hasDraftRecovery = draftVersionRecovery !== null

  const applyDraftRecovery = () => {
    if (!hasDraftRecovery) return
    setDraftVersion(draftVersionRecovery)
    setDraftVersionRecovery(null)
  }

  const clearDraftRecovery = () => {
    removePersistedDraftVersion(persistedDraftVersionKey)
    if (!hasDraftRecovery) return
    setDraftVersionRecovery(null)
  }

  return {
    hasDraftRecovery,
    applyDraftRecovery,
    clearDraftRecovery,
    originalVersionId: draftVersion.originalVersionId,
    songId: draftVersion.songId,
    beatChords: draftVersion.beatChords,
    beatsPerBar: draftVersion.beatsPerBar,
    shiftViewValue: draftVersion.shiftViewValue,
    lastEditAt: draftVersion.lastEditAt,
    edit: editChord,
    clearBeatChord,
    shiftView,
    toggleBeatsPerBar,
  }
}
