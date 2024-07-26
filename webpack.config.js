import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import Dotenv from 'dotenv-webpack';

import * as url from 'url';
import webpack from 'webpack';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


export default {
  entry: path.join(__dirname, "src", "index.tsx"),
  output: {
    path: path.join(__dirname, "/build"),
  },
  mode: "development",
  module: {
    rules: [
      // Still using babel loader for js files only to support funky CodeMirror component see BXC-210
      {
        test: /\.?(js|jsx)$/,
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
      { test: /\.tsx?$/, use: { loader: 'ts-loader' }, exclude: /node_modules/ },
      { enforce: "pre", test: /\.js$/, exclude: /node_modules/, loader: "source-map-loader" },
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
        test: /\.ptch2$/,
        use: ['arraybuffer-loader'],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
    new NodePolyfillPlugin(),
    new Dotenv({
      path: path.join(__dirname, ".env"),
      safe: true,
      allowEmptyValues: true,
      systemvars: true,
      silent: true,
      defaults: false
    }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
  }
}