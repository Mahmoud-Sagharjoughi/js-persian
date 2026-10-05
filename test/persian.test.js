var assert = require('assert');

var stringProperties = Object.getOwnPropertyNames(String.prototype);
var originalReplaceAll = String.prototype.replaceAll;
var persian = require('../');
var toPersian = persian.toPersian;
var toEnglish = persian.toEnglish;

assert.deepEqual(Object.getOwnPropertyNames(String.prototype), stringProperties);
assert.strictEqual(String.prototype.replaceAll, originalReplaceAll);
if (originalReplaceAll) {
  assert.strictEqual('aba'.replaceAll('a', 'x'), 'xbx');
}

var persianCases = [
  ['', ''],
  ['اردك علي ٤6٦', 'اردک علی ۴۶۶'],
  ['0123456789', '۰۱۲۳۴۵۶۷۸۹'],
  ['٠١٢٣٤٥٦٧٨٩', '۰۱۲۳۴۵۶۷۸۹'],
  ['۰۱۲۳۴۵۶۷۸۹', '۰۱۲۳۴۵۶۷۸۹'],
  ['يىك', 'ییک'],
  ['مُحَمَّد', 'محمد'],
  ['می\u200cروم', 'میروم'],
  ['می\u200dروم', 'میروم'],
  ['hello 🌍', 'hello 🌍'],
  [0, '۰'],
  [-123.45, '-۱۲۳.۴۵'],
  [NaN, 'NaN'],
  [Infinity, 'Infinity'],
];

persianCases.forEach(function (testCase) {
  var input = testCase[0];
  var expected = testCase[1];
  assert.strictEqual(toPersian(input), expected);
  assert.strictEqual(toPersian(input, {}), expected);
  assert.strictEqual(toPersian(input, { preserveHalfSpace: false }), expected);
  assert.strictEqual(toPersian(input, { preserveDiacritics: false }), expected);
});

var mixed = 'اردك علي ٤6٦';
assert.strictEqual(toPersian(mixed, { english: false }), 'اردک علی ۴6۶');
assert.strictEqual(toPersian(mixed, { arabic: false }), 'اردك علي ٤۶٦');
assert.strictEqual(toPersian(mixed, { arabic: false, english: false }), mixed);
assert.strictEqual(toPersian(mixed, { arabic: undefined, english: undefined }), 'اردک علی ۴۶۶');

var withHalfSpace = 'مي\u200cروم 123٤';
assert.strictEqual(toPersian(withHalfSpace, { preserveHalfSpace: true }), 'می\u200cروم ۱۲۳۴');
assert.strictEqual(toPersian(withHalfSpace, { preserveHalfSpace: true, english: false }), 'می\u200cروم 123۴');
assert.strictEqual(toPersian(withHalfSpace, { preserveHalfSpace: true, arabic: false }), 'مي\u200cروم ۱۲۳٤');
assert.strictEqual(toPersian('مي\u200c\u200dروم', { preserveHalfSpace: true }), 'می\u200cروم');
assert.strictEqual(toPersian('مُحَمَّد', { preserveHalfSpace: true }), 'محمد');
assert.strictEqual(toPersian('مي\u200cروم', { arabic: false }), 'مي\u200cروم');

assert.strictEqual(toPersian('مُحَمَّد', { preserveDiacritics: true }), 'مُحَمَّد');
assert.strictEqual(toPersian('عَلِي 123٤', { preserveDiacritics: true }), 'عَلِی ۱۲۳۴');
assert.strictEqual(toPersian('عَلِي 123٤', { preserveDiacritics: true, english: false }), 'عَلِی 123۴');
assert.strictEqual(toPersian('عَلِي 123٤', { preserveDiacritics: true, arabic: false }), 'عَلِي ۱۲۳٤');
assert.strictEqual(toPersian('مِي\u200cروم 12٤', { preserveDiacritics: true, preserveHalfSpace: true }), 'مِی\u200cروم ۱۲۴');
assert.strictEqual(toPersian('مِي\u200c\u200dروم', { preserveDiacritics: true }), 'مِیروم');
assert.strictEqual(toPersian('مِي\u200c\u200dروم', { preserveDiacritics: true, preserveHalfSpace: true }), 'مِی\u200cروم');
assert.strictEqual(toPersian('مُحَمَّد', { preserveDiacritics: undefined }), 'محمد');

for (var code = 1611; code < 1632; code += 1) {
  var diacritic = String.fromCharCode(code);
  assert.strictEqual(toPersian('ا' + diacritic + 'ب'), 'اب');
  assert.strictEqual(toPersian('ي' + diacritic + 'ك', { preserveDiacritics: true }), 'ی' + diacritic + 'ک');
}

var englishCases = [
  ['', ''],
  ['۷۶۳۲۴۵', '763245'],
  ['۰۱۲۳۴۵۶۷۸۹', '0123456789'],
  ['٠١٢٣٤٥٦٧٨٩', '٠١٢٣٤٥٦٧٨٩'],
  ['مي\u200cروم ۱۲۳', 'مي\u200cروم 123'],
  ['hello 🌍', 'hello 🌍'],
  [0, '0'],
  [-123.45, '-123.45'],
  [NaN, 'NaN'],
  [Infinity, 'Infinity'],
];

englishCases.forEach(function (testCase) {
  var input = testCase[0];
  var expected = testCase[1];
  assert.strictEqual(toEnglish(input), expected);
  assert.strictEqual(toEnglish(input, {}), expected);
  assert.strictEqual(toEnglish(input, { arabic: false }), expected);
  assert.strictEqual(toEnglish(input, { arabic: undefined }), expected);
});

assert.strictEqual(toEnglish('٠١٢٣٤٥٦٧٨٩', { arabic: true }), '0123456789');
assert.strictEqual(toEnglish('۱۲٣4', { arabic: true }), '1234');
assert.strictEqual(toEnglish('مِي\u200cروم ۱۲٣4', { arabic: true }), 'مِي\u200cروم 1234');
assert.strictEqual(toEnglish('hello 🌍 -١٢.٣', { arabic: true }), 'hello 🌍 -12.3');
assert.strictEqual(toEnglish(123, { arabic: true }), '123');
assert.strictEqual(toEnglish('', { arabic: true }), '');
[null, undefined, false, true, 0, 1, '', 'unused', [], function () {}].forEach(function (options) {
  assert.strictEqual(toEnglish('۱۲٣4', options), '12٣4');
});
assert.deepEqual(['۱۲٣4', '٥۶٧'].map(toEnglish), ['12٣4', '٥6٧']);
assert.strictEqual(toEnglish.length, 1);

var invalidInputs = [undefined, null, true, false, {}, [], function () {}, new String('123'), new Number(123)];
if (typeof Symbol === 'function') {
  invalidInputs.push(Symbol('input'));
}
if (typeof BigInt === 'function') {
  invalidInputs.push(BigInt(123));
}
invalidInputs.forEach(function (input) {
  [toPersian, toEnglish, function (input) {
    return toPersian(input, { preserveDiacritics: true, preserveHalfSpace: true });
  }, function (input) {
    return toEnglish(input, { arabic: true });
  }].forEach(function (convert) {
    assert.throws(function () { convert(input); }, function (error) {
      return error instanceof TypeError && error.message === 'INPUT_MUST_BE_NUMBER_OR_STRING';
    });
  });
});

assert.deepEqual(Object.keys(require('../')).sort(), ['toEnglish', 'toPersian']);
assert.throws(function () { toPersian('123', null); }, TypeError);
assert.strictEqual(toPersian(-Infinity), '-Infinity');
assert.strictEqual(toEnglish(-Infinity), '-Infinity');
assert.strictEqual(toPersian('123٤', { english: null, arabic: null }), '123٤');
assert.strictEqual(toPersian('123٤', { english: 0, arabic: '' }), '123٤');

var allCharacters = '';
for (var point = 0; point <= 65535; point += 1) {
  allCharacters += String.fromCharCode(point);
}
var englishDigits = '0123456789';
var arabicDigits = '٠١٢٣٤٥٦٧٨٩';
var persianDigits = '۰۱۲۳۴۵۶۷۸۹';
[false, true].forEach(function (arabic) {
  [false, true].forEach(function (english) {
    [false, true].forEach(function (preserveHalfSpace) {
      [false, true].forEach(function (preserveDiacritics) {
        var expected = '';
        for (var point = 0; point <= 65535; point += 1) {
          var character = String.fromCharCode(point);
          if (arabic) {
            if ((point >= 1611 && point < 1632 && !preserveDiacritics) || point === 8205 || (point === 8204 && !preserveHalfSpace)) {
              continue;
            }
            if (character === 'ي' || character === 'ى') character = 'ی';
            if (character === 'ك') character = 'ک';
            var arabicIndex = arabicDigits.indexOf(character);
            if (arabicIndex !== -1) character = persianDigits.charAt(arabicIndex);
          }
          var englishIndex = englishDigits.indexOf(character);
          if (english && englishIndex !== -1) character = persianDigits.charAt(englishIndex);
          expected += character;
        }
        var options = { arabic: arabic, english: english, preserveHalfSpace: preserveHalfSpace, preserveDiacritics: preserveDiacritics };
        var actual = toPersian(allCharacters, options);
        assert.strictEqual(actual, expected);
        assert.strictEqual(toPersian(actual, options), actual);
      });
    });
  });
});
[false, true].forEach(function (arabic) {
  var expectedEnglish = '';
  for (var point = 0; point <= 65535; point += 1) {
    var character = String.fromCharCode(point);
    var index = persianDigits.indexOf(character);
    if (arabic && index === -1) index = arabicDigits.indexOf(character);
    expectedEnglish += index === -1 ? character : englishDigits.charAt(index);
  }
  var options = { arabic: arabic };
  assert.strictEqual(toEnglish(allCharacters, options), expectedEnglish);
  assert.strictEqual(toEnglish(expectedEnglish, options), expectedEnglish);
  if (!arabic) assert.strictEqual(toEnglish(allCharacters), expectedEnglish);
});
assert.strictEqual(toEnglish(toPersian(englishDigits, { arabic: false })), englishDigits);
console.log('All tests passed.');
