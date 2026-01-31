import { swapKeyValueObj } from '../../utils/swapKeyValue.js'
import { notes } from './notes.js'

export const supportedNotationsSystems = {
  english: 'english',
  latin: 'latin'
}

export const notesByNotationSystem = {
  [supportedNotationsSystems.english]: {
    C: notes.C,
    'C#': notes.CSharp,
    Db: notes.DFlat,
    D: notes.D,
    'D#': notes.DSharp,
    Eb: notes.EFlat,
    E: notes.E,
    F: notes.F,
    'F#': notes.FSharp,
    Gb: notes.GFlat,
    G: notes.G,
    'G#': notes.GSharp,
    Ab: notes.AFlat,
    A: notes.A,
    'A#': notes.ASharp,
    Bb: notes.BFlat,
    B: notes.B
  },
  [supportedNotationsSystems.latin]: {
    Do: notes.C,
    'Do#': notes.CSharp,
    Reb: notes.DFlat,
    Re: notes.D,
    'Re#': notes.DSharp,
    Mib: notes.EFlat,
    Mi: notes.E,
    Fa: notes.F,
    'Fa#': notes.FSharp,
    Solb: notes.GFlat,
    Sol: notes.G,
    'Sol#': notes.GSharp,
    Lab: notes.AFlat,
    La: notes.A,
    'La#': notes.ASharp,
    Sib: notes.BFlat,
    Si: notes.B
  }
}

export const notesTranslationMapByNotationSystem = {
  [supportedNotationsSystems.english]: swapKeyValueObj(notesByNotationSystem.english),
  [supportedNotationsSystems.latin]: swapKeyValueObj(notesByNotationSystem.latin)
}
