require('shelljs/global');
var util = require('util');
var path = require('path');

var output;
var env = require('./.env.js');

// Used for local development with webpack-dev-server
output = util.inspect(env, {depth: null});
output = 'window.__env = ' + output + ';\n';
output.to(path.join(__dirname, 'public')+'/env.js');
