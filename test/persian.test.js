var assert = require('assert');

var stringProperties = Object.getOwnPropertyNames(String.prototype);
var originalReplaceAll = String.prototype.replaceAll;
var persian = require('../');
var toPersian = persian.toPersian;
var toEnglish = persian.toEnglish;
var formatNumber = persian.formatNumber;
var numberToWords = persian.numberToWords;
var switchKeyboard = persian.switchKeyboard;

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

var consecutiveMarks = '\u064b\u064c\u064d\u064e\u064f\u0650\u0651\u0652\u0653\u0654\u0655\u0656\u0657\u0658\u0659\u065a\u065b\u065c\u065d\u065e\u065f';
var markBoundaries = '\u064a' + consecutiveMarks + '\u0660';
assert.strictEqual(toPersian(consecutiveMarks + consecutiveMarks), '');
assert.strictEqual(toPersian(markBoundaries), 'ی۰');
assert.strictEqual(toPersian(markBoundaries, { preserveDiacritics: true }), 'ی' + consecutiveMarks + '۰');
assert.strictEqual(toPersian(markBoundaries, { arabic: false, english: false }), markBoundaries);
var repeatedMarks = new Array(513).join('🌍ا' + consecutiveMarks + 'ب\u200c\n');
assert.strictEqual(toPersian(repeatedMarks), new Array(513).join('🌍اب\n'));
assert.strictEqual(toPersian(repeatedMarks, { preserveDiacritics: true, preserveHalfSpace: true }), repeatedMarks);

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

assert.deepEqual(Object.keys(require('../')).sort(), ['formatNumber', 'numberToWords', 'switchKeyboard', 'toEnglish', 'toPersian']);
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

function expectError(action, type, message) {
  assert.throws(action, function (error) {
    return error instanceof type && error.message === message;
  });
}

var formatCases = [
  [0, '0'], [-0, '0'], [12, '12'], [123, '123'], [1234, '1٬234'],
  [-1234567.89, '-1٬234٬567.89'], ['+1234567', '+1٬234٬567'],
  ['−۱۲۳۴٫۵۰', '−۱٬۲۳۴٫۵۰'], ['٠٠١٢٣٤.٥٠', '٠٠١٬٢٣٤.٥٠'],
  ['۱۲٣4۵٦7', '۱٬۲٣4٬۵٦7'], ['0000', '0٬000'], ['0.000', '0.000'],
  ['123456789012345678901234567890', '123٬456٬789٬012٬345٬678٬901٬234٬567٬890'],
  [9007199254740991, '9٬007٬199٬254٬740٬991'],
  [-9007199254740991, '-9٬007٬199٬254٬740٬991'],
  [1e-7, '0.0000001'], [-1.23e-7, '-0.000000123'],
];
formatCases.forEach(function (testCase) {
  assert.strictEqual(formatNumber(testCase[0]), testCase[1]);
  assert.strictEqual(formatNumber(testCase[0], {}), testCase[1]);
  assert.strictEqual(formatNumber(testCase[0], { separator: undefined }), testCase[1]);
  assert.strictEqual(formatNumber(testCase[0], { separator: ',' }), testCase[1].replace(/٬/g, ','));
});
assert.strictEqual(formatNumber('1234567.89', { separator: ' | ' }), '1 | 234 | 567.89');
assert.strictEqual(formatNumber('1234567', { separator: '$&' }), '1$&234$&567');
assert.strictEqual(formatNumber(5e-324), '0.' + new Array(324).join('0') + '5');
var longNumber = new Array(10001).join('123456789');
var formattedLongNumber = formatNumber(longNumber);
assert.strictEqual(formattedLongNumber.replace(/٬/g, ''), longNumber);
assert.strictEqual(formattedLongNumber.split('٬').length, 30000);

var wordCases = [
  [0, 'صفر'], [-0, 'صفر'], ['-000.000', 'صفر'], ['+000', 'صفر'],
  [1, 'یک'], [9, 'نه'], [10, 'ده'], [11, 'یازده'], [12, 'دوازده'],
  [13, 'سیزده'], [14, 'چهارده'], [15, 'پانزده'], [16, 'شانزده'],
  [17, 'هفده'], [18, 'هجده'], [19, 'نوزده'], [20, 'بیست'], [21, 'بیست و یک'],
  [30, 'سی'], [40, 'چهل'], [50, 'پنجاه'], [60, 'شصت'], [70, 'هفتاد'],
  [80, 'هشتاد'], [90, 'نود'], [99, 'نود و نه'], [100, 'صد'], [101, 'صد و یک'],
  [110, 'صد و ده'], [111, 'صد و یازده'], [200, 'دویست'], [300, 'سیصد'],
  [400, 'چهارصد'], [500, 'پانصد'], [600, 'ششصد'], [700, 'هفتصد'],
  [800, 'هشتصد'], [900, 'نهصد'], [999, 'نهصد و نود و نه'],
  [1000, 'یک هزار'], [1001, 'یک هزار و یک'], [1010, 'یک هزار و ده'],
  [1100, 'یک هزار و صد'], [1000000, 'یک میلیون'],
  [1000001, 'یک میلیون و یک'], [1001001, 'یک میلیون و یک هزار و یک'],
  [1000000000, 'یک میلیارد'], [1000000000000, 'یک تریلیون'],
  ['1000000000000000', 'یک کوادریلیون'],
  ['100000000000000001', 'صد کوادریلیون و یک'],
  ['999999999999999999', 'نهصد و نود و نه کوادریلیون و نهصد و نود و نه تریلیون و نهصد و نود و نه میلیارد و نهصد و نود و نه میلیون و نهصد و نود و نه هزار و نهصد و نود و نه'],
  ['9007199254740993', 'نه کوادریلیون و هفت تریلیون و صد و نود و نه میلیارد و دویست و پنجاه و چهار میلیون و هفتصد و چهل هزار و نهصد و نود و سه'],
  ['۰۰۰۱۲٣', 'صد و بیست و سه'], ['−۱۲٫۵', 'منفی دوازده و پنج دهم'],
  [-123, 'منفی صد و بیست و سه'], ['+123', 'صد و بیست و سه'],
  ['0.1', 'یک دهم'], ['0.01', 'یک صدم'], ['0.001', 'یک هزارم'],
  ['0.0001', 'یک ده‌هزارم'], ['0.00001', 'یک صد‌هزارم'],
  ['0.000001', 'یک میلیونیم'], ['0.0000001', 'یک ده‌میلیونیم'],
  ['0.00000001', 'یک صد‌میلیونیم'], ['0.000000001', 'یک میلیاردم'],
  ['0.0000000001', 'یک ده‌میلیاردم'], ['0.00000000001', 'یک صد‌میلیاردم'],
  ['0.000000000001', 'یک تریلیونیم'], [1e-7, 'یک ده‌میلیونیم'],
  ['1.000', 'یک'], ['0.1200', 'دوازده صدم'], ['-0.010', 'منفی یک صدم'],
  ['12.345', 'دوازده و سیصد و چهل و پنج هزارم'],
  ['0.123456789012', 'صد و بیست و سه میلیارد و چهارصد و پنجاه و شش میلیون و هفتصد و هشتاد و نه هزار و دوازده تریلیونیم'],
  ['00000000000000000000000000001.000000000000000', 'یک'],
];
wordCases.forEach(function (testCase) {
  assert.strictEqual(numberToWords(testCase[0]), testCase[1]);
  var input = String(testCase[0]);
  if (!/e/.test(input)) {
    assert.strictEqual(numberToWords(toPersian(input)), testCase[1]);
    assert.strictEqual(numberToWords(input.replace(/[0-9]/g, function (digit) {
      return arabicDigits.charAt(Number(digit));
    })), testCase[1]);
  }
});

// Read the generated words back as arithmetic, independently of digit grouping.
var wordValues = {
  'صفر': 0, 'یک': 1, 'دو': 2, 'سه': 3, 'چهار': 4, 'پنج': 5, 'شش': 6,
  'هفت': 7, 'هشت': 8, 'نه': 9, 'ده': 10, 'یازده': 11, 'دوازده': 12,
  'سیزده': 13, 'چهارده': 14, 'پانزده': 15, 'شانزده': 16, 'هفده': 17,
  'هجده': 18, 'نوزده': 19, 'بیست': 20, 'سی': 30, 'چهل': 40, 'پنجاه': 50,
  'شصت': 60, 'هفتاد': 70, 'هشتاد': 80, 'نود': 90, 'صد': 100,
  'دویست': 200, 'سیصد': 300, 'چهارصد': 400, 'پانصد': 500, 'ششصد': 600,
  'هفتصد': 700, 'هشتصد': 800, 'نهصد': 900, 'هزار': 1000,
  'میلیون': 1000000, 'میلیارد': 1000000000, 'تریلیون': 1000000000000,
};
function readIntegerWords(words) {
  var total = 0;
  var subtotal = 0;
  words.split(' ').forEach(function (word) {
    if (word === 'و') return;
    assert.ok(Object.prototype.hasOwnProperty.call(wordValues, word), word);
    var value = wordValues[word];
    if (value >= 1000) {
      total += subtotal * value;
      subtotal = 0;
    } else {
      subtotal += value;
    }
  });
  return total + subtotal;
}
for (var integer = 0; integer < 1000; integer += 1) {
  assert.strictEqual(readIntegerWords(numberToWords(integer)), integer);
}
var seed = 12345;
for (var sample = 0; sample < 1000; sample += 1) {
  seed = (seed * 16807) % 2147483647;
  var value = seed * 1000 + sample;
  assert.strictEqual(readIntegerWords(numberToWords(value)), value);
  [englishDigits, arabicDigits, persianDigits].forEach(function (digits) {
    var input = String(value).replace(/[0-9]/g, function (digit) { return digits.charAt(Number(digit)); });
    var groups = formatNumber(input).split('٬');
    assert.strictEqual(groups.join(''), input);
    assert.ok(groups[0].length >= 1 && groups[0].length <= 3);
    groups.slice(1).forEach(function (group) { assert.strictEqual(group.length, 3); });
  });
}

var invalidNumbers = ['', ' ', '\n', '1\n', '1\r', '1\r\n', ' 1', '1 ', '1 2',
  '1,234', '۱٬۲۳۴', '1_000', '1e3', '0x10', 'NaN', 'Infinity', '.5', '1.',
  '+', '-', '−', '--1', '1.2.3', '1٫2.3', '١a', '1🌍', '1\u200c2'];
invalidNumbers.forEach(function (input) {
  [formatNumber, numberToWords].forEach(function (convert) {
    expectError(function () { convert(input); }, TypeError, 'INVALID_NUMBER');
  });
});
invalidInputs.forEach(function (input) {
  [formatNumber, numberToWords].forEach(function (convert) {
    expectError(function () { convert(input); }, TypeError, 'INPUT_MUST_BE_NUMBER_OR_STRING');
  });
});
[NaN, Infinity, -Infinity].forEach(function (input) {
  [formatNumber, numberToWords].forEach(function (convert) {
    expectError(function () { convert(input); }, RangeError, 'NUMBER_MUST_BE_FINITE');
  });
});
[9007199254740992, -9007199254740992, 1e21, 1e308].forEach(function (input) {
  [formatNumber, numberToWords].forEach(function (convert) {
    expectError(function () { convert(input); }, RangeError, 'NUMBER_MUST_BE_SAFE');
  });
});
['1000000000000000000', '-1000000000000000000', '0.0000000000001', '1.1234567890123', 5e-324].forEach(function (input) {
  expectError(function () { numberToWords(input); }, RangeError, 'NUMBER_OUT_OF_RANGE');
});
[null, '', 0, false, [], function () {}].forEach(function (options) {
  expectError(function () { formatNumber('123', options); }, TypeError, 'OPTIONS_MUST_BE_OBJECT');
  expectError(function () { switchKeyboard('لخخلمث', options); }, TypeError, 'OPTIONS_MUST_BE_OBJECT');
});
['', 0, null, false, {}, [], '1', '۲', '٣', '-', '+', '−', '.', '٫', ',1'].forEach(function (separator) {
  expectError(function () { formatNumber('123', { separator: separator }); }, TypeError, 'INVALID_SEPARATOR');
});

var keyboardRows = [
  ['qwertyuiop[]', 'ضصثقفغعهخحجچ'],
  ["asdfghjkl;'", 'شسیبلاتنمکگ'],
  ['zxcvbnm,', 'ظطزرذدپو'],
];
keyboardRows.forEach(function (row) {
  assert.strictEqual(switchKeyboard(row[1]), row[0]);
  assert.strictEqual(switchKeyboard(row[0], { direction: 'toPersian' }), row[1]);
  for (var i = 0; i < row[0].length; i += 1) {
    assert.strictEqual(switchKeyboard(row[1].charAt(i)), row[0].charAt(i));
    assert.strictEqual(switchKeyboard(row[0].charAt(i), { direction: 'toPersian' }), row[1].charAt(i));
  }
});
assert.strictEqual(switchKeyboard('لخخلمث'), 'google');
assert.strictEqual(switchKeyboard('google', { direction: 'toPersian' }), 'لخخلمث');
assert.strictEqual(switchKeyboard(''), '');
assert.strictEqual(switchKeyboard('لخخلمث', {}), 'google');
assert.strictEqual(switchKeyboard('لخخلمث', { direction: undefined }), 'google');
assert.strictEqual(switchKeyboard('۱۲٣4 ABC! 🌍\n\t\u200c\u200d.\\/?`'), '۱۲٣4 ABC! 🌍\n\t\u200c\u200d.\\/?`');
assert.strictEqual(switchKeyboard('۱۲٣4 ABC! 🌍\n\t\u200c\u200d.\\/?`', { direction: 'toPersian' }), '۱۲٣4 ABC! 🌍\n\t\u200c\u200d.\\/?`');
['auto', 'english', '', null, false, 1, {}].forEach(function (direction) {
  expectError(function () { switchKeyboard('google', { direction: direction }); }, TypeError, 'INVALID_DIRECTION');
});
invalidInputs.concat([0, 123, NaN, Infinity]).forEach(function (input) {
  expectError(function () { switchKeyboard(input); }, TypeError, 'INPUT_MUST_BE_STRING');
});
var allKeyboardEnglish = keyboardRows.map(function (row) { return row[0]; }).join('');
var allKeyboardPersian = keyboardRows.map(function (row) { return row[1]; }).join('');
for (var keyboardPoint = 0; keyboardPoint <= 65535; keyboardPoint += 1) {
  var keyboardCharacter = String.fromCharCode(keyboardPoint);
  if (allKeyboardPersian.indexOf(keyboardCharacter) === -1) {
    assert.strictEqual(switchKeyboard(keyboardCharacter), keyboardCharacter);
  }
  if (allKeyboardEnglish.indexOf(keyboardCharacter) === -1) {
    assert.strictEqual(switchKeyboard(keyboardCharacter, { direction: 'toPersian' }), keyboardCharacter);
  }
}
assert.strictEqual(switchKeyboard(switchKeyboard(allKeyboardEnglish, { direction: 'toPersian' })), allKeyboardEnglish);
var formatOptions = { separator: ',' };
var keyboardOptions = { direction: 'toPersian' };
formatNumber('1234', formatOptions);
switchKeyboard('google', keyboardOptions);
assert.deepEqual(formatOptions, { separator: ',' });
assert.deepEqual(keyboardOptions, { direction: 'toPersian' });
assert.deepEqual(Object.getOwnPropertyNames(String.prototype), stringProperties);
assert.strictEqual(String.prototype.replaceAll, originalReplaceAll);
console.log('All tests passed.');
