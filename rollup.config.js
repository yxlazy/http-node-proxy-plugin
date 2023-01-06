import typescript from "@rollup/plugin-typescript";
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: './src/index.ts',
  output: {
    format: 'cjs',
    sourcemap: true,
    dir: './lib'
  },
  plugins: [typescript(), resolve()]
}