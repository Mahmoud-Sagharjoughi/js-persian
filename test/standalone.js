var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var root = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..');
var target = process.argv[2] ? path.dirname(require.resolve('persian/package.json')) : root;
var commonjs = fs.readFileSync(path.join(target, 'dist/persian.js'), 'utf8');
var browser = fs.readFileSync(path.join(target, 'dist/persian.browser.js'), 'utf8');
var regression = fs.readFileSync(path.join(root, process.argv[2] ? 'test.js' : 'test/persian.test.js'), 'utf8');
var api = require(path.join(target, 'dist/persian.js'));
assert.ok(browser.indexOf(commonjs) !== -1, 'Browser artifact must contain the unchanged CommonJS build');

['plain', 'host', 'guarded', 'fallback'].forEach(function (mode) {
  var context = vm.createContext({ console: console });
  if (mode !== 'fallback') vm.runInContext('this.self = this;', context);
  var sentinels = {};
  ['module', 'exports', 'require', 'define'].forEach(function (key) {
    if (mode === 'host') context[key] = sentinels[key] = Object.freeze({ host: key });
    if (mode === 'guarded') Object.defineProperty(context, key, {
      get: function () { throw new Error('Host global accessed: ' + key); },
      configurable: false,
    });
  });
  function globals() {
    return vm.runInContext('Object.getOwnPropertyNames(this).sort();', context);
  }
  var before = globals();
  vm.runInContext(browser, context, 'persian.browser.js');
  assert.deepEqual(Object.keys(context.persian).sort(), Object.keys(api).sort());
  assert.deepEqual(globals(), before.concat('persian').sort());
  Object.keys(sentinels).forEach(function (key) { assert.strictEqual(context[key], sentinels[key]); });
  var first = context.persian;
  var configured = first.createPersian({ toEnglish: { arabic: true } });
  vm.runInContext(browser, context, 'persian.browser.js');
  assert.notStrictEqual(context.persian, first);
  assert.strictEqual(configured.toEnglish('٣'), '3');
  assert.strictEqual(context.persian.toEnglish('٣'), '٣');
  var runRegression = vm.runInContext('(function (require) {\n' + regression + '\n});', context, 'standalone-regression.js');
  runRegression(function (name) {
    if (name === 'assert') return assert;
    assert.ok(name === '../' || name === 'persian', 'Unexpected regression dependency');
    return context.persian;
  });
  assert.deepEqual(globals(), before.concat('persian').sort());
  console.log('Standalone ES5 context / ' + mode + ': full regression passed.');
});
