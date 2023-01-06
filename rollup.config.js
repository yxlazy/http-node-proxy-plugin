import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';

const outputOptions = {
  es: './lib/esm',
  cjs: './lib/node',
};

const plugins = [typescript(), resolve()];

const configs = Object.keys(outputOptions).map((format) => {
  const dir = outputOptions[format];

  const output = {
    format,
    sourcemap: true,
    // dir,
    file: format === 'cjs' ? dir + '/index.cjs' : dir + '/index.js'
  };

  return {
    input: './src/index.ts',
    output,
    plugins,
  };
});

export default configs.concat({
  input: './src/index.ts',
  output: {
    dir: 'lib',
    format: 'es',
  },
  plugins: [...plugins, dts()],
});
