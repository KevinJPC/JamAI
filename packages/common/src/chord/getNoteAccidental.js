import { accidentals } from './dictionaries/accidentals.js'
import { flatNotesMap, sharpNotesMap } from './dictionaries/notes.js'

export function getNoteAccidental (note, defaultAccidental = accidentals.sharp) {
  if (sharpNotesMap[note]) {
    return accidentals.sharp
  } else if (flatNotesMap[note]) {
    return accidentals.flat
  }
  return defaultAccidental
}
