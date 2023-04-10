import { defineConfig } from 'vite'

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

import replace from "@rollup/plugin-replace"
import babel from '@rollup/plugin-babel';

export default {
   resolve: {
      alias: {
         http: require.resolve('rollup-plugin-node-builtins'),
         path: require.resolve('rollup-plugin-node-builtins'),
         fs: require.resolve('rollup-plugin-node-builtins'),
         os: require.resolve('rollup-plugin-node-builtins'),
         tslib: require.resolve('rollup-plugin-node-builtins'),
         child_process: require.resolve('rollup-plugin-node-builtins'),
         crypto: require.resolve('rollup-plugin-node-builtins'),
         stream: require.resolve('rollup-plugin-node-builtins'),
         https: require.resolve('rollup-plugin-node-builtins'),
         http2: require.resolve('rollup-plugin-node-builtins'),
         process: require.resolve('rollup-plugin-node-builtins'),
      },
   },
   optimizeDeps: {
      exclude: 'node_modules/scratch*',
   },
   plugins: [
      {
         ...replace({
            'base64-loader!': '',
            delimiters: ['', ''],
         }),
         enforce: 'pre',
      },
     
   ]
};