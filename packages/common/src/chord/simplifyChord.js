import { buildChordSymbol } from './buildChordSymbol.js'
import { extensions } from './dictionaries/extensions.js'

const minorExtensions = [extensions.m, extensions.min]
const minorExtensionDivisorRegex = new RegExp(`(${minorExtensions.join('|')})(.*)?`)
export function simplifyChord (chord) {
  const [, minorExtension] = chord.extension?.match(minorExtensionDivisorRegex) ?? []

  return {
    ...chord,
    extension: minorExtension ?? null,
    symbol: buildChordSymbol(chord.rootNote, chord.extension, chord.bassNote)
  }
}
