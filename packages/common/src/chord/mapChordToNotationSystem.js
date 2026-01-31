import { buildChordSymbol } from './buildChordSymbol.js'
import { noChord } from './dictionaries/notes.js'
import { notesTranslationMapByNotationSystem } from './dictionaries/notesByNotationSystem.js'

export function mapChordToNotationSystem (chord, notationSystem) {
  if (chord.rootNote === noChord) return chord
  const translationMap = notesTranslationMapByNotationSystem[notationSystem]
  if (!translationMap) throw new Error('Could not map chord to notation')

  const rootNote = translationMap[chord.rootNote]
  if (!rootNote) throw new Error('Could not map chord to notation')

  const bassNote = translationMap[chord.bassNote] ?? null

  return {
    rootNote,
    extension: chord.extension,
    bassNote,
    symbol: buildChordSymbol(rootNote, chord.extension, bassNote)
  }
}
