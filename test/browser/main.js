import { toPersian, toEnglish, formatNumber, numberToWords, switchKeyboard } from 'persian';

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
  [toPersian, toEnglish, formatNumber, numberToWords, switchKeyboard].forEach(function (method) {
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
  result.textContent = checks + ' browser checks passed.';
  result.dataset.checks = String(checks);
  result.dataset.status = 'passed';
} catch (error) {
  result.textContent = error.stack || error.message;
  result.dataset.status = 'failed';
  throw error;
}
