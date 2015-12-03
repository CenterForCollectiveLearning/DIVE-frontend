var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

function getEntrySources(sources) {
  if (process.env.NODE_ENV !== 'production') {
    sources.push('webpack-dev-server/client?http://localhost:3009')
    sources.push('webpack/hot/only-dev-server')
  }
  return sources;
}

module.exports = {
  entry: getEntrySources([
      './js/index.js',
      './css/app.css'
  ]),
  output: {
    path: __dirname + '/static/',
    publicPath: '/static/',
    filename: 'bundle.js',
    hot: true
  },
  externals: {
    plottable: "Plottable"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    devFlagPlugin,
    new ExtractTextPlugin('app.css'),
    new webpack.ProvidePlugin({
        Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
        fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
  ],
  module: {
    loaders: [
      { test: require.resolve("react"), loader: "imports?shim=es5-shim/es5-shim&sham=es5-shim/es5-sham" },
      { test: /\.js$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('css-loader?module!cssnext-loader') },
      { test: /\.sass$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?indentedSyntax&outputStyle=expanded&sourceMap' },
      { test: /\.less$/,  loader: "style!css!less" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file" }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
};
