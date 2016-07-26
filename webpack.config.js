var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

function getEntrySources(sources) {
  sources.push('webpack-dev-server/client?http://0.0.0.0:3009')
  sources.push('webpack/hot/only-dev-server')
  return sources;
}

module.exports = {
  devtool: 'source-map',
  entry: getEntrySources([
      './public/js/index.js',
      './public/css/app.css'
  ]),
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: 'bundle.js',
    hot: true
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
    noParse: /node_modules\/quill\/dist/,
    loaders: [
      { test: require.resolve("react"), loader: "imports?shim=es6-shim/es6-shim&sham=es6-shim/es6-sham" },
      { test: /\.js$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('css-loader?module!cssnext-loader') },
      { test: /\.sass$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?indentedSyntax&outputStyle=expanded&sourceMap' },
      { test: /\.less$/,  loader: "style!css!less" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file" },
      { test: /\.svg(\?.*)?$/, loader: 'babel!svg-react' +
        // removes xmlns tag from svg (see https://github.com/jhamlet/svg-react-loader/issues/25)
        '!string-replace?search=%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22&replace=' +
        // removes data-name attributes
        '!string-replace?search=%20data-name%3D%22%5B%5Cw%5Cs_-%5D*%22&replace=&flags=ig' },
      { test: /\.png$/, loader: "url-loader?mimetype=image/png" },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
};
