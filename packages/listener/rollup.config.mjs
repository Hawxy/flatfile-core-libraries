import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      exports: 'auto',
      sourcemap: false,
      format: 'cjs',
    },
    {
      exports: 'auto',
      file: 'dist/index.mjs',
      sourcemap: false,
      format: 'es',
    },
    {
      exports: 'auto',
      sourcemap: false,
      strict: true,
      file: 'dist/index.js',
      format: 'umd',
      name: 'FlatFileListener',
    },
  ],
  plugins: [
    json(),
    commonjs({ include: '../../node_modules/**' }),
    nodeResolve({ browser: true }),
    typescript({ compilerOptions: { outDir: 'dist' } }),
  ],
}
