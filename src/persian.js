function replaceAll(str, mapObj) {
  const regex = new RegExp(Object.keys(mapObj).join('|'), 'gi');
  return str.replace(regex, key => mapObj[key]);
}

function replaceArabicToPersian(str, preserveHalfSpace, preserveDiacritics) {
  let newStr = str;
  if (!preserveDiacritics) {
    newStr = newStr.replace(/[\u064b-\u065f]/g, '');
  }

  const charMap = {
    ي: 'ی',
    ى: 'ی',
    ك: 'ک',
    '‍': '',
    '٠': '۰',
    '١': '۱',
    '٢': '۲',
    '٣': '۳',
    '٤': '۴',
    '٥': '۵',
    '٦': '۶',
    '٧': '۷',
    '٨': '۸',
    '٩': '۹',
  };
  if (!preserveHalfSpace) {
    charMap['\u200c'] = '';
  }
  return replaceAll(newStr, charMap);
}

function replaceEnglishToPersian(str) {
  const charMap = {
    0: '۰',
    1: '۱',
    2: '۲',
    3: '۳',
    4: '۴',
    5: '۵',
    6: '۶',
    7: '۷',
    8: '۸',
    9: '۹',
  };
  return replaceAll(str, charMap);
}

function replacePersianToEnglish(str, arabic) {
  const charMap = {
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
  };
  if (arabic) {
    charMap['٠'] = '0';
    charMap['١'] = '1';
    charMap['٢'] = '2';
    charMap['٣'] = '3';
    charMap['٤'] = '4';
    charMap['٥'] = '5';
    charMap['٦'] = '6';
    charMap['٧'] = '7';
    charMap['٨'] = '8';
    charMap['٩'] = '9';
  }
  return replaceAll(str, charMap);
}

function toPersian(input, {
  arabic = true,
  english = true,
  preserveHalfSpace = false,
  preserveDiacritics = false,
} = {}) {
  if (typeof input !== 'string' && typeof input !== 'number') {
    throw new TypeError('INPUT_MUST_BE_NUMBER_OR_STRING');
  }
  let result = String(input);
  if (arabic) {
    result = replaceArabicToPersian(result, preserveHalfSpace, preserveDiacritics);
  }
  if (english) {
    result = replaceEnglishToPersian(result);
  }
  return result;
}

function toEnglish(input, options = {}) {
  if (typeof input !== 'string' && typeof input !== 'number') {
    throw new TypeError('INPUT_MUST_BE_NUMBER_OR_STRING');
  }
  return replacePersianToEnglish(String(input), options && options.arabic);
}

function numberParts(input) {
  if (typeof input !== 'string' && typeof input !== 'number') {
    throw new TypeError('INPUT_MUST_BE_NUMBER_OR_STRING');
  }
  let text = String(input);
  if (typeof input === 'number') {
    if (text === 'NaN' || text === 'Infinity' || text === '-Infinity') {
      throw new RangeError('NUMBER_MUST_BE_FINITE');
    }
    if (Math.abs(input) > 9007199254740991) throw new RangeError('NUMBER_MUST_BE_SAFE');
    text = text.replace(/^(-?)(\d)(?:\.(\d+))?e-(\d+)$/, (match, sign, digit, fraction, exponent) =>
      `${sign}0.${new Array(Number(exponent)).join('0')}${digit}${fraction || ''}`);
  }
  const parts = /^([+\-−]?)([0-9۰-۹٠-٩]+)([.٫][0-9۰-۹٠-٩]+)?$/.exec(text);
  if (!parts || parts[0].length !== text.length) throw new TypeError('INVALID_NUMBER');
  return { sign: parts[1], integer: parts[2], fraction: parts[3] || '' };
}

function formatNumber(input, options = {}) {
  const parts = numberParts(input);
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('OPTIONS_MUST_BE_OBJECT');
  }
  const separator = options.separator === undefined ? '٬' : options.separator;
  if (typeof separator !== 'string' || !separator || /[0-9۰-۹٠-٩+\-−.٫]/.test(separator)) {
    throw new TypeError('INVALID_SEPARATOR');
  }
  const groups = [];
  for (let end = parts.integer.length; end > 0; end -= 3) {
    groups.push(parts.integer.slice(Math.max(0, end - 3), end));
  }
  return parts.sign + groups.reverse().join(separator) + parts.fraction;
}

function integerToWords(digits) {
  const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
  const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
  const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
  const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
  const scales = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون', 'کوادریلیون'];
  const groups = [];
  for (let end = digits.length, scale = 0; end > 0; end -= 3, scale += 1) {
    const value = Number(digits.slice(Math.max(0, end - 3), end));
    if (value) {
      const words = [];
      const hundred = Math.floor(value / 100);
      const rest = value % 100;
      if (hundred) words.push(hundreds[hundred]);
      if (rest >= 10 && rest < 20) {
        words.push(teens[rest - 10]);
      } else {
        if (rest >= 20) words.push(tens[Math.floor(rest / 10)]);
        if (rest % 10) words.push(ones[rest % 10]);
      }
      groups.push(words.join(' و ') + (scale ? ` ${scales[scale]}` : ''));
    }
  }
  return groups.reverse().join(' و ') || 'صفر';
}

function numberToWords(input) {
  const parts = numberParts(input);
  const integer = replacePersianToEnglish(parts.integer, true).replace(/^0+/, '') || '0';
  const fraction = replacePersianToEnglish(parts.fraction.slice(1), true).replace(/0+$/, '');
  if (integer.length > 18 || fraction.length > 12) throw new RangeError('NUMBER_OUT_OF_RANGE');
  const denominators = ['دهم', 'صدم', 'هزارم', 'ده‌هزارم', 'صد‌هزارم', 'میلیونیم',
    'ده‌میلیونیم', 'صد‌میلیونیم', 'میلیاردم', 'ده‌میلیاردم', 'صد‌میلیاردم', 'تریلیونیم'];
  let result = integerToWords(integer);
  if (fraction) {
    const decimal = `${integerToWords(fraction)} ${denominators[fraction.length - 1]}`;
    result = integer === '0' ? decimal : `${result} و ${decimal}`;
  }
  return (parts.sign !== '+' && parts.sign && (integer !== '0' || fraction) ? 'منفی ' : '') + result;
}

function switchKeyboard(input, options = {}) {
  if (typeof input !== 'string') throw new TypeError('INPUT_MUST_BE_STRING');
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('OPTIONS_MUST_BE_OBJECT');
  }
  const direction = options.direction === undefined ? 'toEnglish' : options.direction;
  if (direction !== 'toEnglish' && direction !== 'toPersian') {
    throw new TypeError('INVALID_DIRECTION');
  }
  const english = "qwertyuiop[]asdfghjkl;'zxcvbnm,";
  const persian = 'ضصثقفغعهخحجچشسیبلاتنمکگظطزرذدپو';
  const source = direction === 'toEnglish' ? persian : english;
  const target = direction === 'toEnglish' ? english : persian;
  return input.replace(/[\s\S]/g, (character) => {
    const index = source.indexOf(character);
    return index === -1 ? character : target.charAt(index);
  });
}

module.exports = {
  toPersian,
  toEnglish,
  formatNumber,
  numberToWords,
  switchKeyboard,
};
