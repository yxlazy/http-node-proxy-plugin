import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';

const outputOptions = {
  es: './lib/esm',
  cjs: './lib/node',
};

const outputTypes = {
  es: './lib/index.d.ts',
  cjs: './lib/index.d.cts',
};

const plugins = [typescript(), resolve()];

const configs = Object.keys(outputOptions).map((format) => {
  const dir = outputOptions[format];

  const output = {
    format,
    sourcemap: true,
    // dir,
    file: format === 'cjs' ? dir + '/index.cjs' : dir + '/index.js',
  };

  return {
    input: './src/index.ts',
    output,
    plugins,
  };
});

const typesConfig = Object.keys(outputTypes).map((format) => {
  const file = outputTypes[format];

  return {
    input: './src/index.ts',
    output: {
      file,
      format,
    },
    plugins: [...plugins, dts()],
  };
});
export default configs.concat(typesConfig);
