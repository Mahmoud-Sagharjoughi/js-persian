var assert = require('assert');
var path = require('path');

if (process.argv[2] === '--help' || process.argv.length > 3) {
  console.log('Usage: node benchmark/to-persian.js [baseline-module.js]');
  console.log('Build first with npm run build. The optional baseline must export toPersian.');
  process.exit(process.argv.length > 3 ? 1 : 0);
}

var current = require('../').toPersian;
var baseline = process.argv[2] ? require(path.resolve(process.argv[2])).toPersian : null;
assert.strictEqual(typeof current, 'function');
if (process.argv[2]) assert.strictEqual(typeof baseline, 'function');

var shortPlain = 'سلام دنیا';
var shortMixed = 'اردك علي ٤6٦ و ۱۲۳ و 123 🌍';
var shortDiacritics = 'مُحَمَّد عَلِي مِي\u200cروم 12٤ 🌍';
function repeat(text, count) {
  return new Array(count + 1).join(text);
}
var cases = [
  { name: 'short / plain', input: shortPlain },
  { name: 'short / mixed', input: shortMixed },
  { name: 'short / diacritics', input: shortDiacritics },
  { name: 'long / plain', input: repeat(shortPlain + '\n', 1024) },
  { name: 'long / mixed', input: repeat(shortMixed + '\n', 512) },
  { name: 'long / diacritics', input: repeat(shortDiacritics + '\n', 512) },
  { name: 'long / preserve marks', input: repeat(shortDiacritics + '\n', 512), options: { preserveDiacritics: true } },
  { name: 'long / arabic disabled', input: repeat(shortMixed + '\n', 512), options: { arabic: false } },
];
var checksum = 0;
function measure(convert, testCase, iterations) {
  var size = 0;
  var start = process.hrtime();
  for (var i = 0; i < iterations; i += 1) {
    size += convert(testCase.input, testCase.options).length;
  }
  var elapsed = process.hrtime(start);
  checksum += size;
  return elapsed[0] * 1e9 + elapsed[1];
}
function median(values) {
  var sorted = values.slice().sort(function (left, right) { return left - right; });
  return sorted[Math.floor(sorted.length / 2)];
}
function pad(value, width) {
  var text = String(value);
  return text + repeat(' ', Math.max(0, width - text.length));
}

console.log('Node ' + process.version + '; median of 7 samples; microseconds per call.');
console.log('Inputs are fixed; modules are warmed up; comparison order alternates.');
console.log(pad('Case', 25) + pad('UTF-16 units', 15) + pad('Current', 14) +
  (baseline ? pad('Baseline', 14) + 'Baseline/current' : ''));
cases.forEach(function (testCase) {
  if (baseline) {
    assert.strictEqual(current(testCase.input, testCase.options), baseline(testCase.input, testCase.options), testCase.name);
  }
  measure(current, testCase, 100);
  if (baseline) measure(baseline, testCase, 100);

  var iterations = 1;
  while (iterations < 131072) {
    var duration = measure(current, testCase, iterations);
    if (baseline) duration = Math.max(duration, measure(baseline, testCase, iterations));
    if (duration >= 20000000) break;
    iterations *= 2;
  }
  var currentSamples = [];
  var baselineSamples = [];
  for (var sample = 0; sample < 7; sample += 1) {
    if (baseline && sample % 2) {
      baselineSamples.push(measure(baseline, testCase, iterations));
      currentSamples.push(measure(current, testCase, iterations));
    } else {
      currentSamples.push(measure(current, testCase, iterations));
      if (baseline) baselineSamples.push(measure(baseline, testCase, iterations));
    }
  }
  var currentTime = median(currentSamples) / iterations / 1000;
  var baselineTime = baseline ? median(baselineSamples) / iterations / 1000 : 0;
  console.log(pad(testCase.name, 25) + pad(testCase.input.length, 15) + pad(currentTime.toFixed(3), 14) +
    (baseline ? pad(baselineTime.toFixed(3), 14) + (baselineTime / currentTime).toFixed(2) + 'x' : ''));
});
console.log('Output checksum: ' + checksum);
console.log('Timings depend on the machine and runtime; no performance threshold is enforced.');
