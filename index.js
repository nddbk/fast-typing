// start

const include = require('esm')(module, {
  cjs: true,
  mode: 'auto',
  cache: false,
  sourceMap: false,
});

module.exports = include('./server.js');
