import type { RollupOptions } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

const pkgName = 'node-puzzle';

const config: RollupOptions = {
  input: 'src/index.ts',
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.build.json'
    })
  ],
  external: ['pureimage', 'node-useful', 'image-size'],
  output: [
    {
      format: 'cjs',
      file: `dist/${pkgName}.cjs.js`,
      exports: 'default'
    },
    {
      format: 'es',
      file: `dist/${pkgName}.esm.js`,
      exports: 'default'
    }
  ]
};

export default config;
