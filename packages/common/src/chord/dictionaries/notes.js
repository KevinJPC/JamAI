/*
 * English is used as the internal notation system for processing a chord's notes.
 * A chord is first parsed from the incoming system (if supported) into the English system.
 * Once parsed, operations such as transposing and accidental switching can be performed
 * on the English chord. If another notation system is needed afterward, the processed
 * chord can then be mapped to the desired system (if supported).
 */

import { accidentals } from './accidentals.js'

export const notes = {
  C: 'C',
  CSharp: 'C#',
  DFlat: 'Db',
  D: 'D',
  DSharp: 'D#',
  EFlat: 'Eb',
  E: 'E',
  F: 'F',
  FSharp: 'F#',
  GFlat: 'Gb',
  G: 'G',
  GSharp: 'G#',
  AFlat: 'Ab',
  A: 'A',
  ASharp: 'A#',
  BFlat: 'Bb',
  B: 'B'
}

export const notePositionInChromaticScale = {
  [notes.C]: 0,
  [notes.CSharp]: 1,
  [notes.DFlat]: 1,
  [notes.D]: 2,
  [notes.DSharp]: 3,
  [notes.EFlat]: 3,
  [notes.E]: 4,
  [notes.F]: 5,
  [notes.FSharp]: 6,
  [notes.GFlat]: 6,
  [notes.G]: 7,
  [notes.GSharp]: 8,
  [notes.AFlat]: 8,
  [notes.A]: 9,
  [notes.ASharp]: 10,
  [notes.BFlat]: 10,
  [notes.B]: 11
}

export const orderedChromaticNotesByAccidental = {
  [accidentals.flat]: [
    notes.C,
    notes.DFlat,
    notes.D,
    notes.EFlat,
    notes.E,
    notes.F,
    notes.GFlat,
    notes.G,
    notes.AFlat,
    notes.A,
    notes.BFlat,
    notes.B
  ],
  [accidentals.sharp]: [
    notes.C,
    notes.CSharp,
    notes.D,
    notes.DSharp,
    notes.E,
    notes.F,
    notes.FSharp,
    notes.G,
    notes.GSharp,
    notes.A,
    notes.ASharp,
    notes.B
  ]
}

export const sharpNotesMap = {
  [notes.ASharp]: notes.ASharp,
  [notes.CSharp]: notes.CSharp,
  [notes.DSharp]: notes.DSharp,
  [notes.FSharp]: notes.FSharp,
  [notes.GSharp]: notes.GSharp
}

export const flatNotesMap = {
  [notes.AFlat]: notes.AFlat,
  [notes.BFlat]: notes.BFlat,
  [notes.DFlat]: notes.DFlat,
  [notes.EFlat]: notes.EFlat,
  [notes.GFlat]: notes.GFlat
}

export const noChord = 'N'
