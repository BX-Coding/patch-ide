import { defineConfig } from 'vite'

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

import replace from "@rollup/plugin-replace"
import babel from '@rollup/plugin-babel';

import glsl from 'vite-plugin-glsl';

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

import react from '@vitejs/plugin-react'

import arraybuffer from '@wemap/rollup-plugin-arraybuffer';

import builtins from 'rollup-plugin-node-builtins';

export default {
   resolve: {
      alias: {
         util: 'rollup-plugin-node-polyfills/polyfills/util',
         sys: 'util',
         events: 'rollup-plugin-node-polyfills/polyfills/events',
         stream: 'rollup-plugin-node-polyfills/polyfills/stream',
         path: 'rollup-plugin-node-polyfills/polyfills/path',
         querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
         punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
         url: 'rollup-plugin-node-polyfills/polyfills/url',
         string_decoder:
             'rollup-plugin-node-polyfills/polyfills/string-decoder',
         http: 'rollup-plugin-node-polyfills/polyfills/http',
         https: 'rollup-plugin-node-polyfills/polyfills/http',
         os: 'rollup-plugin-node-polyfills/polyfills/os',
         assert: 'rollup-plugin-node-polyfills/polyfills/assert',
         constants: 'rollup-plugin-node-polyfills/polyfills/constants',
         _stream_duplex:
             'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
         _stream_passthrough:
             'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
         _stream_readable:
             'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
         _stream_writable:
             'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
         _stream_transform:
             'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
         timers: 'rollup-plugin-node-polyfills/polyfills/timers',
         console: 'rollup-plugin-node-polyfills/polyfills/console',
         vm: 'rollup-plugin-node-polyfills/polyfills/vm',
         zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
         tty: 'rollup-plugin-node-polyfills/polyfills/tty',
         domain: 'rollup-plugin-node-polyfills/polyfills/domain',

         'scratch-render':'scratch-render-vite',
         'scratch-render-fonts':'scratch-render-fonts-vite',
         'scratch-storage':'scratch-storage-vite',

         'linebreak':'linebreak-vite',
         'grapheme-breaker':'grapheme-breaker-vite',
      },
   },

   plugins: [
    arraybuffer({ include: '**/*.sprite3' }),
    react(),
   ],

   optimizeDeps: {
      esbuildOptions: {
          // Node.js global to browser globalThis
          define: {
              global: 'globalThis'
          },
          // Enable esbuild polyfill plugins
          plugins: [
            // NodeGlobalsPolyfillPlugin({
            //     buffer: true, 
            //     process: true,
            //   }), 
            NodeModulesPolyfillPlugin()
         ],
         loader: {
            '.trie':'base64',
            '.sprite3':'binary',
         }
      }
  },

  assetsInclude: [
    "**/*.sprite3",
    "**/*.worker.mjs" 
],

worker: {
    format: 'es'
}

};