import { buildChordSymbol } from './buildChordSymbol.js'
import { degrees } from './dictionaries/degrees.js'
import { extensions } from './dictionaries/extensions.js'
import { noChord, notePositionInChromaticScale, orderedChromaticNotesByAccidental } from './dictionaries/notes.js'
import { notesByNotationSystem, supportedNotationsSystems } from './dictionaries/notesByNotationSystem.js'
import { getNoteAccidental } from './getNoteAccidental.js'

const parseRegex = /^(.*?)(?::(.*?))?(?:\/(.*?))?$/

export function parseChordString (chordString, notationSystem = supportedNotationsSystems.english) {
  const validNotes = notesByNotationSystem[notationSystem]

  if (!validNotes) throw new Error(`Error parsing chord: ${chordString}. Invalid notation system ${notationSystem}`)

  const [, rootNote, extension, bass] = chordString.match(parseRegex) ?? []

  if (rootNote === noChord) return { rootNote, extension: null, bassNote: null, symbol: buildChordSymbol(rootNote, null, null) }

  const parsedRootNote = validNotes[rootNote] ?? null

  if (!parsedRootNote) throw new Error(`Error parsing chord: ${chordString}. Could not parse root note ${rootNote}`)
  const parsedExtension = extensions[extension] ?? null

  let parsedBassNote = validNotes[bass] ?? null

  // The AI model used for chord recognition outputs chords in a format like C:maj7/3 with the bassNote written as a degree
  // In the rest of the app that chord would be displayed as C:M7/E which is more user friendly
  // Because of that the degree needs to be parse to the actual note any time a chord comes with that format
  const degreeInterval = degrees[bass] ?? null
  if (!parsedBassNote && degreeInterval) {
    const rootNotePosition = notePositionInChromaticScale[parsedRootNote]
    const orderedChromaticNotes = orderedChromaticNotesByAccidental[getNoteAccidental(parsedRootNote)] // will use sharp for both naturals and sharp notes
    parsedBassNote = orderedChromaticNotes[(rootNotePosition + degreeInterval) % orderedChromaticNotes.length] ?? null
  }

  return {
    rootNote: parsedRootNote,
    extension: parsedExtension,
    bassNote: parsedBassNote,
    symbol: buildChordSymbol(parsedRootNote, parsedExtension, parsedRootNote)
  }
}
