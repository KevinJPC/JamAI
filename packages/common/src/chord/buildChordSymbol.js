export function buildChordSymbol (rootNote, extension, bassNote) {
  if (!rootNote) throw new Error('Could not build chord symbol. Invalid chord')
  return [
    rootNote,
    extension ? `:${extension}` : '',
    bassNote ? `/${bassNote}` : ''
  ].join('')
}
