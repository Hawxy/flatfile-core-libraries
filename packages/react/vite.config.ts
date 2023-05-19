/// <reference types="vitest" />
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'Embed React',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React'
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    outputTruncateLength: 8000,
    root: './src',
    setupFiles: './test/setup.ts',
    coverage: {
      100: true,
      all: true,
      reporter: ['text', 'json', 'html']
    }
  },
  clearScreen: false,
  plugins: [
    react(),
    dts({
      insertTypesEntry: true
    })
  ],
  server: {
    open: true
  }
})
