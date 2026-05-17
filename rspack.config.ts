import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { dirname,resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

/** MF remotes: share React etc from host singleton. */
const sharedFromHost = {
  react: { singleton: true, requiredVersion: '^19.0.0', import: false },
  'react-dom': { singleton: true, requiredVersion: '^19.0.0', import: false },
  'react/jsx-runtime': { singleton: true, requiredVersion: '^19.0.0', import: false },
  'react/jsx-dev-runtime': { singleton: true, requiredVersion: '^19.0.0', import: false },
};

/** Remotes: thin remoteEntry; read runtime-core from host global. */
const mfExperimentsRemote = {
  externalRuntime: true,
  optimization: { target: 'web', disableSnapshot: true },
};

export default {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : 'source-map',
  entry: {},
  output: {
    path: resolve(__dirname, 'dist'),
    publicPath: 'auto',
    uniqueName: 'ui_looper',
    clean: false,
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
        localIdentName: isProduction
          ? 'uil-[hash:base64:6]'
          : 'ui-looper-[name]__[local]',
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
    new ModuleFederationPlugin({
      name: 'ui_looper',
      filename: 'remoteEntry.js',
      shareStrategy: 'loaded-first',
      exposes: {
        // ── Components ──
        './Button': './src/Button/Button.tsx',
        './Spinner': './src/Spinner/Spinner.tsx',
        './Typography': './src/Typography/index.ts',
        './Text': './src/Typography/Text.tsx',
        './Heading': './src/Typography/Heading.tsx',
        './Input': './src/Input/Input.tsx',
        './Tag': './src/Tag/Tag.tsx',
        './Badge': './src/Badge/Badge.tsx',
        './Card': './src/Card/Card.tsx',
        './Tooltip': './src/Tooltip/Tooltip.tsx',
        './Select': './src/Select/Select.tsx',
        './Modal': './src/Modal/Modal.tsx',
        './Toast': './src/Toast/index.ts',

        // ── Design tokens & primitives (import via loadRemote or direct link) ──
        './styles/tokens.css': './src/styles/tokens.css',
        './styles/primitives.css': './src/styles/primitives.css',
      },
      manifest: { fileName: 'mf-manifest.json' },
      dts: { generateTypes: false, consumeTypes: false },
      shared: sharedFromHost,
      experiments: mfExperimentsRemote,
    }),
  ],
  devServer: {
    port: 3030,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  optimization: {
    sideEffects: true,
    usedExports: true,
    providedExports: true,
    innerGraph: true,
    concatenateModules: false, // required for MF remote
    mangleExports: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: (module) => {
            const resource =
              module.nameForCondition?.() ?? module.resource ?? '';
            return (
              /[\\/]node_modules[\\/]/.test(resource) &&
              !/[\\/]node_modules[\\/](react|react-dom|scheduler|react-jsx-runtime|react-jsx-dev-runtime)([\\/]|$)/.test(
                resource,
              )
            );
          },
          name: 'vendor',
          chunks: 'all',
          priority: 20,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
