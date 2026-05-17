/**
 * rspack.lib.config.ts
 *
 * ESM library build for @ui-looper/core.
 * Output: dist/lib/index.js + dist/lib/styles.css
 *
 * React is externalized by default (consumers bundle their own).
 * Set BUNDLE_REACT=true to inline React for standalone / CDN usage.
 */
import { dirname,resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const bundleReact = process.env.BUNDLE_REACT === 'true';

export default {
  mode: 'production',
  devtool: false,
  entry: './src/index.ts',
  output: {
    path: resolve(__dirname, 'dist/lib'),
    filename: 'index.js',
    cssFilename: 'styles.css',
    library: { type: 'module' },
    module: true,
    chunkFormat: 'module',
    chunkLoading: 'import',
    clean: true,
    publicPath: '',
  },
  experiments: { outputModule: true },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  externals: bundleReact
    ? []
    : [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
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
        localIdentName: 'uil-[hash:base64:6]',
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
  optimization: {
    sideEffects: true,
    usedExports: true,
    providedExports: true,
    minimize: true,
  },
};
