var useExpress = (process.env.NODE_ENV == 'PRODUCTION' || process.env.NODE_ENV == 'STAGING' || process.env.NODE_ENV == 'PROTOTYPE');

if (useExpress) {
  var express = require('express');
  var path = require('path');
  var app = express();
  var static_path = path.join(__dirname, 'public');

  app.use(express.static(static_path))
    .get('/*', function (req, res) {
      res.sendFile('index.html', {
        root: static_path
      });
    }).listen(process.env.PORT || 8080, function (err) {
      if (err) { console.log(err) };
      console.log('Listening at 0.0.0.0:8080');
    });

} else {
  var config = require('./webpack.config');
  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');

  new WebpackDevServer(webpack(config), {
    contentBase: './public',
    publicPath: config.output.publicPath,
    hot: true,
    quiet: false,
    historyApiFallback: {
      index: 'index.html'
    },
    stats: { colors: true }
  }).listen(3009, '0.0.0.0', function (err, result) {
    if (err) { console.log(err) }
    console.log('Listening at 0.0.0.0:3009');
  });
}
