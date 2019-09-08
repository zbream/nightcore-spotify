const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, options) => ({
  entry: {
    'background/background': './src/background/main.ts',
    "content-script/content-script": "./src/content-script/main.ts",
    "page-script/page-script": "./src/page-script/main.ts"
  },
  devtool: options.mode === 'production' ? 'hidden-source-map' : 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: './**/*',
        to: '.',
        context: './src',
        ignore: ['*.ts', '*.d.ts'],
      },
    ], {
      copyUnmodified: true,
    }),
  ],
});
