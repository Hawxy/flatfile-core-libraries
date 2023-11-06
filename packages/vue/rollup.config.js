import css from 'rollup-plugin-import-css'
import typescript from '@rollup/plugin-typescript'
import url from '@rollup/plugin-url'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue';
import scss from 'rollup-plugin-scss'

const config = [
  {
    input: 'src/components/main.ts',
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
      vue(),
      commonjs(),
      css(),
      scss(),
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