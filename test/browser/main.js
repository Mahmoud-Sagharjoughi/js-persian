import { toPersian, toEnglish, formatNumber, numberToWords, switchKeyboard, createPersian } from 'persian';

var checks = 0;
function equal(actual, expected) {
  if (actual !== expected) {
    throw new Error('Expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
  }
  checks += 1;
}
function rejects(action, type, message) {
  var error;
  try { action(); } catch (caught) { error = caught; }
  equal(error instanceof type, true);
  equal(error.message, message);
}

var result = document.getElementById('result');
try {
  [toPersian, toEnglish, formatNumber, numberToWords, switchKeyboard, createPersian].forEach(function (method) {
    equal(typeof method, 'function');
  });
  equal(toPersian('اردك علي ٤6٦'), 'اردک علی ۴۶۶');
  equal(toPersian(''), '');
  equal(toPersian(-123.45), '-۱۲۳.۴۵');
  equal(toPersian('hello 🌍\nمي\u200cروم 12٤'), 'hello 🌍\nمیروم ۱۲۴');
  equal(toPersian('مِي\u200cروم 12٤', { preserveHalfSpace: true, preserveDiacritics: true }), 'مِی\u200cروم ۱۲۴');
  equal(toPersian('عَلِي 123٤', { arabic: false }), 'عَلِي ۱۲۳٤');
  equal(toPersian('123٤', { english: false }), '123۴');
  equal(toPersian('عَلِي 🌍 123٤', { arabic: false, english: false }), 'عَلِي 🌍 123٤');
  equal(toEnglish('۱۲٣4'), '12٣4');
  equal(toEnglish('مِي\u200cروم 🌍 ۱۲٣4', { arabic: true }), 'مِي\u200cروم 🌍 1234');
  equal(toEnglish(''), '');
  equal(toEnglish(toPersian('0123456789', { arabic: false })), '0123456789');
  equal(formatNumber('۱۲۳۴۵۶۷'), '۱٬۲۳۴٬۵۶۷');
  equal(formatNumber('−۰۰۱۲۳۴٫۵۰'), '−۰۰۱٬۲۳۴٫۵۰');
  equal(formatNumber('9007199254740993'), '9٬007٬199٬254٬740٬993');
  equal(formatNumber('1234567', { separator: '$&' }), '1$&234$&567');
  equal(formatNumber(5e-324), '0.' + new Array(324).join('0') + '5');
  equal(numberToWords('۱۲٣'), 'صد و بیست و سه');
  equal(numberToWords('-12.50'), 'منفی دوازده و پنج دهم');
  equal(numberToWords('0.01'), 'یک صدم');
  equal(numberToWords('100000000000000001'), 'صد کوادریلیون و یک');
  equal(numberToWords('-0.000'), 'صفر');
  equal(switchKeyboard('لخخلمث'), 'google');
  equal(switchKeyboard('google', { direction: 'toPersian' }), 'لخخلمث');
  equal(switchKeyboard('۱۲٣4 ABC! 🌍\n\u200c'), '۱۲٣4 ABC! 🌍\n\u200c');
  rejects(function () { toPersian(null); }, TypeError, 'INPUT_MUST_BE_NUMBER_OR_STRING');
  rejects(function () { formatNumber('1,000'); }, TypeError, 'INVALID_NUMBER');
  rejects(function () { formatNumber(9007199254740992); }, RangeError, 'NUMBER_MUST_BE_SAFE');
  rejects(function () { numberToWords('1000000000000000000'); }, RangeError, 'NUMBER_OUT_OF_RANGE');
  equal(JSON.stringify(Object.getOwnPropertyNames(String.prototype)), JSON.stringify(window.stringProperties));
  equal(String.prototype.replaceAll, window.originalReplaceAll);
  equal('aba'.replaceAll('a', 'x'), 'xbx');
  equal(numberToWords(3, { ordinal: true }), 'سوم');
  equal(numberToWords(30, { ordinal: true }), 'سی\u200cام');
  equal(numberToWords('-23.00', { ordinal: true }), 'منفی بیست و سوم');
  rejects(function () { numberToWords('0.01', { ordinal: true }); }, RangeError, 'ORDINAL_REQUIRES_INTEGER');
  var config = {
    toPersian: { preserveHalfSpace: true },
    toEnglish: { arabic: true },
    formatNumber: { separator: ',' },
    numberToWords: { ordinal: true },
    switchKeyboard: { direction: 'toPersian' },
  };
  var fa = createPersian(config);
  equal(fa.toPersian('مي\u200cروم'), 'می\u200cروم');
  equal(fa.toEnglish('٣'), '3');
  equal(fa.formatNumber('1234'), '1,234');
  equal(fa.numberToWords(3), 'سوم');
  equal(fa.numberToWords(3, { ordinal: false }), 'سه');
  equal(fa.numberToWords(3, { ordinal: undefined }), 'سوم');
  equal(fa.switchKeyboard('google'), 'لخخلمث');
  equal(numberToWords(3), 'سه');
  equal(createPersian().toEnglish('٣'), '٣');
  config.toEnglish.arabic = false;
  equal(fa.toEnglish('٣'), '3');
  equal(JSON.stringify([1, 2, 3].map(fa.numberToWords)), JSON.stringify(['یکم', 'دوم', 'سوم']));
  rejects(function () { createPersian({ numberToWords: { ordinal: 'yes' } }); }, TypeError, 'OPTION_MUST_BE_BOOLEAN');
  equal(JSON.stringify(Object.getOwnPropertyNames(String.prototype)), JSON.stringify(window.stringProperties));
  equal(String.prototype.replaceAll, window.originalReplaceAll);
  result.textContent = checks + ' browser checks passed.';
  result.dataset.checks = String(checks);
  result.dataset.status = 'passed';
} catch (error) {
  result.textContent = error.stack || error.message;
  result.dataset.status = 'failed';
  throw error;
}
