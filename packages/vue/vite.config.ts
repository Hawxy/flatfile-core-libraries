import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  // @ts-ignore there's a real painful conflict here with the version of vite installed with angular build tools
  plugins: [vue(), dts({ tsconfigPath: 'tsconfig.app.json' })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', '@flatfile/embedded-utils', '@flatfile/listener', '@flatfile/plugin-record-hook', '@flatfile/api'],
    },
  },
})
