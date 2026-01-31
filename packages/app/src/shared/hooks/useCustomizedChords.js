import { useMemo } from 'react'
import Chord from '@chords-extractor/common/chord'

import { customizeChord } from '@/shared/utils/customizeChord'

export const useCustomizedChords = (initialChords, settings = {
  notationSystem: Chord.supportedNotationsSystems.english,
  transposeValue: 0,
  accidental: Chord.accidentals.sharp,
  simplify: false
}, { enabled = true } = {}) => {
  const customizedChords = useMemo(() => {
    if (!initialChords || !enabled) return []
    const customizedChords = initialChords?.map(chordString => customizeChord(chordString, settings))
    return customizedChords
  }, [
    enabled,
    initialChords,
    settings.notationSystem,
    settings.transposeValue,
    settings.accidental,
    settings.simplify
  ])
  return customizedChords
}
