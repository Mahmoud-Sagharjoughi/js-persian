var assert = require('assert');
var fs = require('fs');
var path = require('path');

var expected = require('./expected-package.json');
var metadata = require('persian/package.json');
assert.strictEqual(metadata.name, expected.name);
assert.strictEqual(metadata.version, expected.version);
assert.strictEqual(metadata.main, expected.main);
assert.strictEqual(metadata.types, expected.types);
assert.deepEqual(Object.keys(metadata.dependencies || {}), []);
assert.deepEqual(Object.keys(metadata.optionalDependencies || {}), []);
assert.deepEqual(Object.keys(metadata.peerDependencies || {}), []);
var modules = fs.readdirSync(path.join(__dirname, 'node_modules')).filter(function (entry) {
  return entry.charAt(0) !== '.';
});
assert.deepEqual(modules.sort(), ['persian']);
var target = path.join(__dirname, 'node_modules', 'persian');
assert.strictEqual(fs.lstatSync(target).isSymbolicLink(), false);
assert.deepEqual(fs.readdirSync(target).sort(), [
  'CHANGELOG.md', 'LICENSE', 'README.md', 'dist', 'index.d.ts', 'package.json',
]);
assert.strictEqual(require.resolve('persian'), path.join(target, 'dist', 'persian.js'));
assert.ok(fs.statSync(path.join(target, metadata.types)).isFile());
assert.strictEqual(require('./package.json').dependencies.persian, 'file:persian.tgz');
console.log('npm installation verified: ' + metadata.name + '@' + metadata.version);
