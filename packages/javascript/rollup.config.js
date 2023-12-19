import css from 'rollup-plugin-import-css'
import typescript from '@rollup/plugin-typescript'
import url from '@rollup/plugin-url'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'

// Consolidated external dependencies
const external = [
  '@flatfile/api',
  '@flatfile/embedded-utils',
  '@flatfile/listener',
  '@flatfile/plugin-record-hook',
  'pubnub',
]

// Common plugins function
function commonPlugins() {
  return [
    json(),
    commonjs(),
    css(),
    resolve({ browser: true }),
    typescript({ outDir: 'dist' }),
    url({
      include: ['**/*.otf'],
      limit: Infinity,
      fileName: '[dirname][name][extname]',
    }),
    terser(),
  ]
}

const config = [
  {
    input: 'index.ts',
    output: [
      {
        format: 'commonjs',
        exports: 'auto',
        file: 'dist/index.cjs',
        sourcemap: false,
      },
      {
        format: 'esm',
        exports: 'auto',
        file: 'dist/index.mjs',
        sourcemap: false,
      },
    ],
    plugins: commonPlugins(),
    external,
  },
  {
    input: 'index.ts',
    output: {
      exports: 'auto',
      sourcemap: false,
      strict: true,
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'FlatFileJavaScript',
    },
    plugins: commonPlugins(),
  },
]

export default config
