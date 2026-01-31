import Chord from '../src/chord/index.js'

export const parseAndSummarizeChords = (chords, maxItems, { accidental = CHORDS_DEFAULT_SETTINGS.accidental } = {}, { maxSummaryCount = 4 } = {}) => {
  const chordSymbols = []
  const unknownChordsSymbols = []
  const chordsSymbolsSummary = new ChordsSymbolsSummary()
  for (let index = 0; index < maxItems; index++) {
    const chordString = chords[index]
    let parsedChord
    if (chordString !== null) {
      try {
        parsedChord = Chord.parseChordString(chordString)
        if (Chord.accidentals[accidental]) {
          parsedChord = Chord.modifyAccidental(parsedChord, accidental)
        }
      } catch (_) {
        unknownChordsSymbols.push(chordString)
      }
    }
    const chordSymbol = parsedChord?.symbol ?? null
    chordsSymbolsSummary.updateChordOccurrence(chordSymbol, index)
    chordSymbols[index] = chordSymbol
  }

  return { chordSymbols, chordsSummary: chordsSymbolsSummary.summarize({ maxSummaryCount }), unknownChordsSymbols }
}

class ChordsSymbolsSummary {
  #chordsSymbolsOccurences = new Map()
  updateChordOccurrence (chordSymbol, index) {
    if (!chordSymbol || chordSymbol === Chord.noChord) return
    if (this.#chordsSymbolsOccurences.has(chordSymbol)) {
      const newChordsOccurrences = { ...this.#chordsSymbolsOccurences.get(chordSymbol) }
      newChordsOccurrences.count++
      this.#chordsSymbolsOccurences.set(chordSymbol, newChordsOccurrences)
    } else {
      this.#chordsSymbolsOccurences.set(chordSymbol, { count: 1, initialOcurrenceIndex: index })
    }
  }

  summarize ({ maxSummaryCount }) {
    return Array.from(this.#chordsSymbolsOccurences.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, maxSummaryCount)
      .sort((a, b) => a[1].initialOcurrenceIndex - b[1].initialOcurrenceIndex)
      .map(([chordSymbol]) => chordSymbol)
  }
}

export const CHORDS_DEFAULT_SETTINGS = {
  simplify: false,
  transposeValue: 0,
  language: 'english',
  accidental: Chord.accidentals.sharp
}
