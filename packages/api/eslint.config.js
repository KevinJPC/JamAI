import neostandard from 'neostandard'

export default neostandard({
  ts: true,   // Enable TypeScript support
  filesTs: ['src/**/*.ts'],  // Lint only TypeScript files in src/ and tests/ directories
  ignores: ['built/**/*'],  // Ignore files in dist/ and tests/ directories
})
