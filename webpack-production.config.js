var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

module.exports = {
  devtool: 'source-map',
  entry: [
    './public/js/index.js',
    './public/css/app.css'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/public/',
    filename: 'bundle.js'
  },
  externals: {
  },
  plugins: [
    devFlagPlugin,
    new ExtractTextPlugin('app.css'),
    new webpack.ProvidePlugin({
      Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
  ],
  module: {
    noParse: /node_modules\/quill\/dist/,
    loaders: [
      { test: require.resolve("react"), loader: "imports?shim=es6-shim/es6-shim&sham=es6-shim/es6-sham" },
      { test: /\.js$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('css-loader?module!cssnext-loader') },
      { test: /\.sass$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?indentedSyntax&outputStyle=expanded&sourceMap' },
      { test: /\.less$/,  loader: "style!css!less" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file" },
      { test: /\.png$/, loader: "url-loader?mimetype=image/png" }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
};
