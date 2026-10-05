var assert = require('assert');
var path = require('path');
var spawnSync = require('child_process').spawnSync;

var compiler = path.resolve(process.argv[2]);
var consumer = path.resolve(process.argv[3]);
var modern = process.argv[4] === 'modern';
var flags = ['--strict', '--noEmit', '--target', modern ? 'es2015' : 'es5',
  '--module', modern ? 'node16' : 'commonjs', '--moduleResolution', modern ? 'node16' : 'node'];
function compile(file) {
  var result = spawnSync(process.execPath, [compiler].concat(flags, [file]), { cwd: consumer, encoding: 'utf8' });
  if (result.error) throw result.error;
  assert.strictEqual(result.signal, null);
  return result;
}
var valid = compile('types-valid.ts');
assert.strictEqual(valid.status, 0, valid.stdout + valid.stderr);
var invalid = compile('types-invalid.ts');
assert.notStrictEqual(invalid.status, 0, invalid.stdout + invalid.stderr);
var errors = invalid.stdout.match(/error TS[0-9]+:/g) || [];
assert.strictEqual(errors.length, 3, invalid.stdout + invalid.stderr);
assert.ok(/types-invalid\.ts\(3,/.test(invalid.stdout), invalid.stdout);
assert.ok(/types-invalid\.ts\(4,/.test(invalid.stdout), invalid.stdout);
assert.ok(/types-invalid\.ts\(5,/.test(invalid.stdout), invalid.stdout);
console.log('TypeScript valid inputs accepted and invalid inputs rejected.');
