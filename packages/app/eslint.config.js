import { defineConfig } from 'eslint/config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import neostandard from 'neostandard'

export default [
  ...neostandard({
    files: ['**/*.js', '**/*.jsx'],
    ignores: ['./build/', './node_modules/']
  }),
  ...defineConfig({
    plugins: { simpleImportSort },
    rules: {
      'simpleImportSort/imports': ['error', {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // React related imports
          ['^react', '^@?\\w'],
          // Node.js builtins prefixed with `node:`.
          ['^node:'],
          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          ['^@?\\w'],
          // Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything not matched in another group.
          ['^'],
          // Relative imports.
          // Anything that starts with a dot.
          ['^\\.'],
          // Styles related imports
          ['^.+\\.s?css$'],
        ]
      }],
      'simpleImportSort/exports': 'error',
    },

  })
]
