export type BeatChord = {
  time: number,
  number: number,
  chord: string | null
}

export type Key = {
  mode: KeyMode,
  pitchClass: PitchClass
}

export type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export type KeyMode = 'major' | 'minor'
