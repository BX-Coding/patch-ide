import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

import * as url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


export default {
  entry: path.join(__dirname, "playground", "main.jsx"),
  output: {
    path: path.join(__dirname, "/build"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.?(js|jsx|mjs)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              '@babel/preset-env', 
              ['@babel/preset-react', {"runtime": "automatic"}]
          ], plugins: [
            '@babel/plugin-syntax-import-assertions'
          ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.png$/,
        type: 'asset/resource'
      },
      {
        test: /\.svg$/,
        type: 'asset/resource'
      },
      {
        test: /\.ptch1$/,
        use: ['arraybuffer-loader'],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "playground", "public", "index.html"),
    }),
    new NodePolyfillPlugin(),
  ],
}