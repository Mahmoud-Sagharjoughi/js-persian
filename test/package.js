var assert = require('assert');
var fs = require('fs');
var path = require('path');
var execFileSync = require('child_process').execFileSync;

var archiveDirectory = path.resolve(process.argv[2]);
var consumer = path.resolve(process.argv[3]);
var archives = fs.readdirSync(archiveDirectory).filter(function (file) {
  return /^persian-.*\.tgz$/.test(file);
});
assert.strictEqual(archives.length, 1, 'Expected one npm package');
var archive = fs.readFileSync(path.join(archiveDirectory, archives[0]));
var expectedFiles = ['LICENSE', 'README.md', 'dist/persian.js', 'index.d.ts', 'package.json'];
var entries = execFileSync('tar', ['-tzf', '-'], { input: archive, encoding: 'utf8' }).trim().split(/\r?\n/);
assert.deepEqual(entries.sort(), expectedFiles.map(function (file) { return 'package/' + file; }).sort());

var target = path.join(consumer, 'node_modules', 'persian');
fs.mkdirSync(target, { recursive: true });
execFileSync('tar', ['-xzf', '-', '--strip-components=1'], { input: archive, cwd: target });
var metadata = JSON.parse(fs.readFileSync(path.join(target, 'package.json'), 'utf8'));
assert.strictEqual(metadata.name, 'persian');
assert.strictEqual(metadata.version, require('../package.json').version);
assert.strictEqual(metadata.main, 'dist/persian.js');
assert.strictEqual(metadata.types, 'index.d.ts');
assert.deepEqual(Object.keys(metadata.dependencies || {}), []);

if (process.argv[4] === '--check-syntax') {
  require('acorn').parse(fs.readFileSync(path.join(target, metadata.main), 'utf8'), { ecmaVersion: 5 });
  console.log('ES5 syntax verified.');
}

var regression = fs.readFileSync(path.join(__dirname, 'persian.test.js'), 'utf8');
fs.writeFileSync(path.join(consumer, 'test.js'), regression.replace(/require\('\.\.\/'\)/g, "require('persian')"));
fs.copyFileSync(path.join(__dirname, 'types-valid.ts'), path.join(consumer, 'types-valid.ts'));
fs.copyFileSync(path.join(__dirname, 'types-invalid.ts'), path.join(consumer, 'types-invalid.ts'));
fs.writeFileSync(path.join(consumer, 'test.mjs'), [
  "import assert from 'assert';",
  "import { toPersian, toEnglish, formatNumber, numberToWords, switchKeyboard } from 'persian';",
  "assert.strictEqual(toPersian('123'), '۱۲۳');",
  "assert.strictEqual(toPersian('مي\\u200cروم', { preserveHalfSpace: true }), 'می\\u200cروم');",
  "assert.strictEqual(toEnglish('۱۲۳'), '123');",
  "assert.strictEqual(toEnglish('۱۲٣4', { arabic: true }), '1234');",
  "assert.strictEqual(toPersian('عَلِي', { preserveDiacritics: true }), 'عَلِی');",
  "assert.strictEqual(formatNumber('۱۲۳۴'), '۱٬۲۳۴');",
  "assert.strictEqual(numberToWords('۱۲۳'), 'صد و بیست و سه');",
  "assert.strictEqual(switchKeyboard('لخخلمث'), 'google');",
  "console.log('Native ESM imports passed.');",
].join('\n'));
console.log('Package contents verified: ' + metadata.name + '@' + metadata.version);
