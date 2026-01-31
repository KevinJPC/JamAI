import esbuild from 'esbuild'
import baseOptions from './esbuild.config.js'

export default esbuild
  .context({ ...baseOptions })
  .then(async (buildResult) => {
    await buildResult.rebuild()
    process.exit(0)
  }).catch(() => {
    process.exit(1)
  })
