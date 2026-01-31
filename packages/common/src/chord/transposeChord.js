import { buildChordSymbol } from './buildChordSymbol.js'
import { noChord, notePositionInChromaticScale, orderedChromaticNotesByAccidental } from './dictionaries/notes.js'
import { getNoteAccidental } from './getNoteAccidental.js'

function shiftSemitone (currentSemitone = 0, semitones = 0, maxSemitones = 11) {
  let shiftedSemitone = (currentSemitone + semitones) % maxSemitones
  if (shiftedSemitone < 0) shiftedSemitone += maxSemitones
  return shiftedSemitone
}

export function transposeChord (chord, semitones) {
  if (chord.rootNote === noChord) return chord

  const { rootNote, extension, bassNote } = chord

  const orderedChromaticNotesForRootNote = orderedChromaticNotesByAccidental[getNoteAccidental(rootNote)]

  const rootNoteChromaticPosition = notePositionInChromaticScale[rootNote]

  if (rootNoteChromaticPosition === undefined) throw new Error('Could not transpose chord')

  const rootNoteShiftedChromaticPosition = shiftSemitone(
    rootNoteChromaticPosition,
    semitones,
    orderedChromaticNotesForRootNote.length
  )
  const transposedRootNote = orderedChromaticNotesForRootNote[rootNoteShiftedChromaticPosition]

  let transposedBassNote = null
  if (bassNote) {
    const orderedChromaticNotesForBassNote = orderedChromaticNotesByAccidental[getNoteAccidental(bassNote)] ?? orderedChromaticNotesByAccidental.sharp

    const bassNoteChromaticPosition = notePositionInChromaticScale[bassNote]
    if (bassNoteChromaticPosition === undefined) throw new Error('Could not transpose chord')

    const baseNoteShiftedChromaticPosition = shiftSemitone(
      bassNoteChromaticPosition,
      semitones,
      orderedChromaticNotesForBassNote.length
    )
    transposedBassNote = orderedChromaticNotesForBassNote[baseNoteShiftedChromaticPosition]
  }

  return {
    rootNote: transposedRootNote,
    extension,
    bassNote: transposedBassNote,
    symbol: buildChordSymbol(rootNote, chord.extension, bassNote)
  }
}
