import webpack from 'webpack';
import path from 'path';

const webpackConfig = {
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  },
  devtool: 'source-map',
  target: 'web',
  externals: ['react', /^@angular\//],
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }),
  ]
};
export default webpackConfig;
