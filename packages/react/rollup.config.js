// Contents of the file /rollup.config.js
import css from 'rollup-plugin-import-css'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import url from '@rollup/plugin-url'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'

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
      json(),
      // esModuleInterop(),
      commonjs({
        requireReturnsDefault: 'auto',
      }),
      css(),
      typescript({
        outDir: 'dist',
      }),
      nodeResolve({ browser: true }),
      url({
        include: ['**/*.otf'],
        limit: Infinity,
        fileName: '[dirname][name][extname]',
      }),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: 'index.ts',
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
      // esModuleInterop(),
      nodeResolve({ browser: true }),
      typescript({
        tsconfig: 'tsconfig.json',
        declaration: true,
        declarationDir: './dist',
      }),
      url({
        include: ['**/*.otf'],
        limit: Infinity,
        fileName: '[dirname][name][extname]',
      }),
    ],
    external: ["react", "react-dom"],
  },
]
export default config
