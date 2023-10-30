// Contents of the file /rollup.config.js
import css from 'rollup-plugin-import-css'
import typescript from '@rollup/plugin-typescript'
import url from '@rollup/plugin-url'
import commonjs from '@rollup/plugin-commonjs'

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
    plugins: [
      commonjs(),
      css(),
      typescript({
        outDir: 'dist',
      }),
      url({
        include: ['**/*.otf'],
        limit: Infinity,
        fileName: '[dirname][name][extname]',
      }),
    ],
  },
]
export default config
