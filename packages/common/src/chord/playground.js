/* eslint-disable no-unused-vars */
import { parseAndSummarizeChords } from '../chords.js'
import { mapChordToNotationSystem } from './mapChordToNotationSystem.js'
import { modifyAccidental } from './modifyAccidental.js'
import { parseChordString } from './parseChordString.js'
import { simplifyChord } from './simplifyChord.js'
import { transposeChord } from './transposeChord.js'

// const chordString = 'D#:maj7/G'
// let parsedChord = parseChordString(chordString, 'english')
// parsedChord = transposeChord(parsedChord, 0)
// parsedChord = modifyAccidental(parsedChord, 'flat')
// parsedChord = simplifyChord(parsedChord)
// parsedChord = mapChordToNotationSystem(parsedChord, 'english')
// console.log(parsedChord)

// console.log(parseAndSummarizeChords(['C:maj7/3', 'N', null, 'A:maj7/3', 'A:m/', 'Ab:m/', 'Am', 'C#', 'Db'], 9, { accidental: 'sharp' }))
