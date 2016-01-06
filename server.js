// var webpack = require('webpack');
// var WebpackDevServer = require('webpack-dev-server');
// var config = require('./webpack.config');

// new WebpackDevServer(webpack(config), {
//   publicPath: config.output.publicPath,
//   hot: true,
//   historyApiFallback: true
// }).listen(3009, 'localhost', function (err, result) {
//   if (err) {
//     console.log(err);
//   }

//   console.log('Listening at localhost:3009');
// });

var express = require('express');
var path = require('path');
var webpack = require('webpack');
var app = express();

var isDevelopment = (process.env.NODE_ENV !== 'production');
var static_path = path.join(__dirname, 'public');

app.use(express.static(static_path))
  .get('/*', function (req, res) {
    res.sendFile('index.html', {
      root: static_path
    });
  }).listen(process.env.PORT || 8080, function (err) {
    if (err) { console.log(err) };
    console.log('Listening at localhost:8080');
  });

if (isDevelopment) {
  var config = require('./webpack.config');
  var WebpackDevServer = require('webpack-dev-server');

  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true
  }).listen(3009, 'localhost', function (err, result) {
    if (err) { console.log(err) }
    console.log('Listening at localhost:3009');
  });
}

