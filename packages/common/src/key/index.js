import { accidentals } from '../chord/dictionaries/accidentals'

const KEY_MODES = {
  major: 'major',
  minor: 'minor'
}

const PITCH_CLASSES = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11
}

const KEY_CONFIG = {
  [KEY_MODES.major]: {
    [PITCH_CLASSES[0]]: { label: 'C', accidental: accidentals.sharp },
    [PITCH_CLASSES[1]]: { label: 'Db', accidental: accidentals.flat },
    [PITCH_CLASSES[2]]: { label: 'D', accidental: accidentals.sharp },
    [PITCH_CLASSES[3]]: { label: 'Eb', accidental: accidentals.flat },
    [PITCH_CLASSES[4]]: { label: 'E', accidental: accidentals.sharp },
    [PITCH_CLASSES[5]]: { label: 'F', accidental: accidentals.flat },
    [PITCH_CLASSES[6]]: { label: 'F#', accidental: accidentals.sharp },
    [PITCH_CLASSES[7]]: { label: 'G', accidental: accidentals.sharp },
    [PITCH_CLASSES[8]]: { label: 'Ab', accidental: accidentals.flat },
    [PITCH_CLASSES[9]]: { label: 'A', accidental: accidentals.sharp },
    [PITCH_CLASSES[10]]: { label: 'Bb', accidental: accidentals.flat },
    [PITCH_CLASSES[11]]: { label: 'B', accidental: accidentals.sharp }
  },
  [KEY_MODES.minor]: {
    [PITCH_CLASSES[0]]: { label: 'Cm', accidental: accidentals.flat },
    [PITCH_CLASSES[1]]: { label: 'C#m', accidental: accidentals.sharp },
    [PITCH_CLASSES[2]]: { label: 'Dm', accidental: accidentals.flat },
    [PITCH_CLASSES[3]]: { label: 'D#m', accidental: accidentals.sharp },
    [PITCH_CLASSES[4]]: { label: 'Em', accidental: accidentals.sharp },
    [PITCH_CLASSES[5]]: { label: 'Fm', accidental: accidentals.flat },
    [PITCH_CLASSES[6]]: { label: 'F#m', accidental: accidentals.sharp },
    [PITCH_CLASSES[7]]: { label: 'Gm', accidental: accidentals.flat },
    [PITCH_CLASSES[8]]: { label: 'G#m', accidental: accidentals.sharp },
    [PITCH_CLASSES[9]]: { label: 'Am', accidental: accidentals.sharp },
    [PITCH_CLASSES[10]]: { label: 'Bbm', accidental: accidentals.flat },
    [PITCH_CLASSES[11]]: { label: 'Bm', accidental: accidentals.sharp }
  }
}

function getPreferredKeyLabelFromKey ({ pitchClass, mode }) {
  const preferredLabel = KEY_CONFIG[mode][pitchClass].label
  if (!preferredLabel) throw new Error('Invalid key')
  return preferredLabel
}

function getPreferredAccidentalFromKey ({ pitchClass, mode }) {
  const preferredAccidental = KEY_CONFIG[mode][pitchClass].accidental
  if (!preferredAccidental) throw new Error('Invalid key')
  return preferredAccidental
}

export default {
  dictionaries: {
    PITCH_CLASSES,
    KEY_MODES
  },
  getPreferredKeyLabelFromKey,
  getPreferredAccidentalFromKey
}
