
const path = require( 'path' );

const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const { VueLoaderPlugin } = require( 'vue-loader' );

const devMode = process.env.NODE_ENV === 'production';

module.exports = [

  // For main process
  {

    mode: !devMode ? 'production' : 'development',

    context: path.resolve( './src' ),

    entry: './main.ts',
    output: {
      path: path.resolve( __dirname, 'dist' ),
      filename: 'main.js',
    },
    target: 'electron-main',

    node: {
      __dirname: false,
      __filename: false
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
        },
      ],
    },

    resolve: {
      extensions: [
        '.ts',
        '.js',
        '.json',
      ],

      alias: {
        'vue$': 'vue/dist/vue.js'
      },

    },

    plugins: [

      new CopyWebpackPlugin( [
        { from: 'assets', to: 'assets' },
        { from: 'package.json', to: 'package.json' },
      ] ),
    ]

  },

  // for UI
  {

    mode: !devMode ? 'production' : 'development',

    context: path.resolve( './src/ui' ),

    entry: './index.ts',
    output: {
      path: path.resolve( __dirname, 'dist/ui' ),
      filename: 'index.js',
    },
    target: 'electron-renderer',

    devtool: 'inline-source-map',

    node: {
      __dirname: false,
      __filename: false
    },

    module: {
      rules: [

        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              scss: 'vue-style-loader!css-loader!sass-loader',
              sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
            },
          },
        },

        {
          test: /\.sass/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader?indentedSyntax',
          ],
        },

        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },

      ],
    },

    resolve: {
      extensions: [
        '.ts',
        '.js',
        '.json',
        '.vue',
      ],
      alias: {
        'vue': 'vue/dist/vue.js',
        'vuex': 'vuex/dist/vuex.js',
      },
    },

    plugins: [

      new CopyWebpackPlugin( [
        { from: './html', to: '.' },
        { from: './static', to: '.' },
      ] ),

      new VueLoaderPlugin(),

    ]

  },

];
