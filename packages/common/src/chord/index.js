import { buildChordSymbol } from './buildChordSymbol.js'
import { mapChordToNotationSystem } from './mapChordToNotationSystem.js'
import { modifyAccidental } from './modifyAccidental.js'
import { parseChordString } from './parseChordString.js'
import { simplifyChord } from './simplifyChord.js'
import { transposeChord } from './transposeChord.js'
import { accidentals } from './dictionaries/accidentals.js'
import { degrees } from './dictionaries/degrees.js'
import { extensions } from './dictionaries/extensions.js'

import {
  notes,
  flatNotesMap,
  noChord,
  notePositionInChromaticScale,
  orderedChromaticNotesByAccidental,
  sharpNotesMap
} from './dictionaries/notes.js'
import {
  notesByNotationSystem,
  notesTranslationMapByNotationSystem,
  supportedNotationsSystems
} from './dictionaries/notesByNotationSystem.js'
import { getNoteAccidental } from './getNoteAccidental.js'

export default {
  buildChordSymbol,
  mapChordToNotationSystem,
  modifyAccidental,
  parseChordString,
  simplifyChord,
  transposeChord,
  getNoteAccidental,
  accidentals,
  degrees,
  extensions,
  notes,
  flatNotesMap,
  noChord,
  notePositionInChromaticScale,
  orderedChromaticNotesByAccidental,
  sharpNotesMap,
  notesByNotationSystem,
  notesTranslationMapByNotationSystem,
  supportedNotationsSystems
}
