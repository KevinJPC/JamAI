import Chord from '@chords-extractor/common/chord'

export function customizeChord (chordString, {
  fromNotationSystem = Chord.supportedNotationsSystems.english,
  notationSystem = Chord.supportedNotationsSystems.english,
  transposeValue = 0,
  accidental = Chord.accidentals.sharp,
  simplify = false
} = {}) {
  if (!chordString) return null
  try {
    let parsedChord
    parsedChord = Chord.parseChordString(chordString, fromNotationSystem)
    parsedChord = Chord.transposeChord(parsedChord, transposeValue)
    if (simplify) {
      parsedChord = Chord.simplifyChord(parsedChord)
    }
    parsedChord = Chord.modifyAccidental(parsedChord, accidental)
    parsedChord = Chord.mapChordToNotationSystem(parsedChord, notationSystem)
    return parsedChord
  } catch (error) {
    return null
  }
}
