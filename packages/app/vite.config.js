import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'

import path from 'node:path'
import url from 'node:url'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const envDir = path.join(__dirname, '..', '..')
  const env = loadEnv(mode, envDir)
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    build: {
      outDir: './build',
    },
    envDir,
    server: {
      // host: true,
      proxy: {
        '/api': env.VITE_BACKEND_URL
      },
    },
    plugins: [react()],
  }
})
