import { buildChordSymbol } from './buildChordSymbol.js'
import { noChord, notePositionInChromaticScale, orderedChromaticNotesByAccidental } from './dictionaries/notes.js'

export function modifyAccidental (chord, accidental) {
  if (!accidental || chord.rootNote === noChord) return chord
  const orderedChromaticNotes = orderedChromaticNotesByAccidental[accidental] ?? orderedChromaticNotesByAccidental.sharp
  const rootNote = orderedChromaticNotes[notePositionInChromaticScale[chord.rootNote]]
  if (!rootNote) throw new Error('Could not modify accidental')
  const bassNote = orderedChromaticNotes[notePositionInChromaticScale[chord.bassNote]] ?? null
  return {
    rootNote,
    extension: chord.extension,
    bassNote,
    symbol: buildChordSymbol(rootNote, chord.extension, bassNote)
  }
}
