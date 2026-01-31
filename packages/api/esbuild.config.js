function relativeSpacing (str) {
  return ' '.repeat(Math.max(1, 24 - str.length))
}

const summaryPlugin = {
  name: 'summary',
  setup (build) {
    let startTime = null
    build.onStart(() => {
      startTime = performance.now()
    })
    build.onEnd(result => {
      const endTime = performance.now()
      const durationMs = endTime - startTime

      if (!result.metafile) return

      for (const [file, info] of Object.entries(result.metafile.outputs)) {
        const sizeKb = (info.bytes / 1024).toFixed(1)
        console.log(`${file} ${relativeSpacing(file)} ${sizeKb}kb`)
      }

      console.log(`\nBuilt in ${Math.round(durationMs)}ms`)
    })
  }
}

export default {
  bundle: true,
  entryPoints: ['./src/server.js'],
  outdir: './build',
  platform: 'node',
  format: 'esm',
  banner: {
    js: "import { createRequire as createRequire3 } from 'module'; const require = createRequire3(import.meta.url);"
  },
  metafile: true,
  plugins: [summaryPlugin]
}
