var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var host = '0.0.0.0';
var port = 3009;

var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

function getEntrySources(sources) {
  sources.push(`webpack-dev-server/client?http://${ host }:${ port }`)
  sources.push('webpack/hot/only-dev-server')
  return sources;
}

module.exports = {
  cache: true,
  devtool: 'source-map',
  stats: {
    // Config for minimal console.log mess.
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false
  },
  resolve: {
    extensions: ['.js', '.json']
  },  
  entry: getEntrySources([
      './src/js/index.js',
      './src/css/app.css'
  ]),
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    devFlagPlugin,
    new ExtractTextPlugin('app.css'),
    new webpack.ProvidePlugin({
      Promise: 'imports-loader?this=>global!exports-loader?global.Promise!es6-promise',
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
    new CopyWebpackPlugin([
      { from: './src/index.html', to: './index.html' },
      { from: './src/404.html', to: './404.html' },
      { from: './src/assets', to: './assets'},
      { from: './_redirects' }
    ])
  ],
  module: {
    noParse: /node_modules\/quill\/dist/,
    loaders: [
      { test: require.resolve("react"), loader: "imports-loader?shim=es6-shim/es6-shim&sham=es6-shim/es6-sham" },
      { test: /\.js$/, loader: 'babel-loader',
        include: [ path.join(__dirname, 'src/js') ],
        exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract([ 'css-loader?module', 'postcss-loader' ]) },
      { test: /\.sass$/, loader: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ] },
      { test: /\.less$/, loader: [
        'style-loader',
        'css-loader',
        'less-loader'
      ] },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.svg(\?.*)?$/, loader: 'babel-loader!svg-react-loader' +
        // removes xmlns tag from svg (see https://github.com/jhamlet/svg-react-loader/issues/25)
        '!string-replace-loader?search=%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22&replace=' +
        // removes data-name attributes
        '!string-replace-loader?search=%20data-name%3D%22%5B%5Cw%5Cs_-%5D*%22&replace=&flags=ig' },
      { test: /\.png$/, loader: "url-loader?mimetype=image/png" },
    ]
  }
};
