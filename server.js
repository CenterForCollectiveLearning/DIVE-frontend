var useExpress = (process.env.NODE_ENV == 'PRODUCTION' || process.env.NODE_ENV == 'STAGING' || process.env.NODE_ENV == 'PROTOTYPE');

var host = '0.0.0.0';
var port = 3009;

if (useExpress) {
  var express = require('express');
  var path = require('path');
  var app = express();
  var static_path = path.join(__dirname, 'dist');

  app.use(express.static(static_path))
    .get('/*', function (req, res) {
      res.sendFile('index.html', {
        root: static_path
      });
    }).listen(process.env.PORT || 8080, function (err) {
      if (err) { console.log(err) };
      console.log(`>>> Listening at ${ host }:${ port }`);
    });

} else {
  var config = require('./webpack.config');
  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');

  new WebpackDevServer(webpack(config), {
    contentBase: './dist',
    publicPath: config.output.publicPath,
    compress: true,
    hot: true,
    quiet: false,
    noInfo: false,
    historyApiFallback: {
      index: 'index.html'
    },
    open: true,
    stats: { colors: true }
  }).listen(port, host, function (err, result) {
    if (err) { console.log(err) }
    console.log(`>>> Listening at ${ host }:${ port }`);
  });
}
