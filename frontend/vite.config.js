import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  server: {
    host: '127.0.0.1'
  },
  resolve: {
    alias: {
      '@src': fileURLToPath(new URL('./src', import.meta.url)),
      '@lib': fileURLToPath(new URL('./lib', import.meta.url))
    }
  }
})
