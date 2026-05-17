/**
 * rspack.demo.config.ts
 *
 * Separate build config for the demo page (no Module Federation).
 * Built alongside the library in dev mode via `npm run dev`.
 * Output goes to `dist/`, served at `/demo.html`.
 */
import rspack from '@rspack/core';
import { dirname,resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { HtmlRspackPlugin } = rspack;

export default {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    demo: './demo/demo.tsx',
  },
  output: {
    path: resolve(__dirname, 'dist'),
    publicPath: 'auto',
    clean: false, // don't wipe MF library output
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    parser: {
      'css/module': {
        namedExports: false,
      },
    },
    generator: {
      'css/module': {
        esModule: true,
        exportsConvention: 'as-is',
        localIdentName: 'ui-looper-[name]__[local]',
      },
    },
    rules: [
      {
        test: /\.module\.css$/i,
        type: 'css/module',
      },
      {
        test: /\.css$/i,
        exclude: /\.module\.css$/i,
        type: 'css',
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript', tsx: true },
              transform: { react: { runtime: 'automatic' } },
            },
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlRspackPlugin({
      filename: 'index.html',
      template: './demo/index.html',
      chunks: ['demo'],
    }),
  ],
};
