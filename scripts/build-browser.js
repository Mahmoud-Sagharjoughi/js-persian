var fs = require('fs');
var path = require('path');

var dist = path.join(__dirname, '../dist');
var commonjs = fs.readFileSync(path.join(dist, 'persian.js'), 'utf8');
var browser = [
  '(function (root) {',
  '  "use strict";',
  '  var module = { exports: {} };',
  commonjs,
  '  root.persian = module.exports;',
  '}(typeof self !== "undefined" ? self : this));',
  '',
].join('\n');
fs.writeFileSync(path.join(dist, 'persian.browser.js'), browser);
