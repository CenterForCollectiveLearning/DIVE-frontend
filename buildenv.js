require('shelljs/global');
var util = require('util');

var output;
var env = require('./.env.js');

// Used for local development with webpack-dev-server
output = util.inspect(env, {depth: null});
output = 'window.__env = ' + output + ';\n';
output.to('/public/__/env.js');

// Used to test build with divshot server
output = JSON.stringify(env, null, 2);
output = output + '\n';
output.to('.env.json');
