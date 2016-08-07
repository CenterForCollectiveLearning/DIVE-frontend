require('shelljs/global');
var util = require('util');
var path = require('path');

var output;
var env = require('./.env.js');
var envOut = path.join(__dirname, 'dist') + '/env.js';
console.log('>>> Building environment at path', envOut);

// Used for local development with webpack-dev-server
output = util.inspect(env, {depth: null});
output = 'window.__env = ' + output + ';\n';
output.to(envOut);
