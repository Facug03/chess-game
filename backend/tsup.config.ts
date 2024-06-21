import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src'],
  clean: true,
  outDir: 'dist/src',
  format: 'cjs',
  noExternal: [/(.*)/]
})
