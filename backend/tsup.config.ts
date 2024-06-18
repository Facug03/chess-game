import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src', './netlify/functions'],
  clean: true,
  outDir: 'dist/src',
  format: 'esm',
})
