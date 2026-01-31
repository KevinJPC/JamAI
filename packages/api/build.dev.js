import esbuild from 'esbuild'
import baseOptions from './esbuild.config.js'

export default esbuild
  .context({ ...baseOptions })
  .then(async (buildContext) => {
    buildContext.watch()
  }).catch(() => {
    process.exit(1)
  })
