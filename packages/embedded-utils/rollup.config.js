import css from 'rollup-plugin-import-css'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'

const config = [
  {
    input: 'src/index.ts',
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
      json(),
      commonjs({
        requireReturnsDefault: 'auto',
      }),
      css(),
      typescript({
        outDir: 'dist',
      }),
      nodeResolve({ browser: true }),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        exports: 'auto',
        file: 'dist/index.browser.cjs',
        format: 'cjs',
      },
      {
        exports: 'auto',
        file: 'dist/index.browser.mjs',
        sourcemap: false,
        format: 'es',
      },
    ],
    plugins: [
      json(),
      commonjs({
        requireReturnsDefault: 'auto',
      }),
      css(),
      nodeResolve({ browser: true }),
      typescript({
        tsconfig: 'tsconfig.json',
        declaration: true,
        declarationDir: './dist',
      }),
    ],
  },
]
export default config
