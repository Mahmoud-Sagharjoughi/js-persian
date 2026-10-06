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

function numberToWords(input, options = {}) {
  const parts = numberParts(input);
  const integer = replacePersianToEnglish(parts.integer, true).replace(/^0+/, '') || '0';
  const fraction = replacePersianToEnglish(parts.fraction.slice(1), true).replace(/0+$/, '');
  if (integer.length > 18 || fraction.length > 12) throw new RangeError('NUMBER_OUT_OF_RANGE');
  const denominators = ['دهم', 'صدم', 'هزارم', 'ده‌هزارم', 'صد‌هزارم', 'میلیونیم',
    'ده‌میلیونیم', 'صد‌میلیونیم', 'میلیاردم', 'ده‌میلیاردم', 'صد‌میلیاردم', 'تریلیونیم'];
  let result = integerToWords(integer);
  if (options && options.ordinal === true) {
    if (fraction) throw new RangeError('ORDINAL_REQUIRES_INTEGER');
    if (/سه$/.test(result)) result = result.replace(/سه$/, 'سوم');
    else if (/سی$/.test(result)) result += '\u200cام';
    else result += 'م';
  }
  if (fraction) {
    const decimal = `${integerToWords(fraction)} ${denominators[fraction.length - 1]}`;
    result = integer === '0' ? decimal : `${result} و ${decimal}`;
  }
  return (parts.sign !== '+' && parts.sign && (integer !== '0' || fraction) ? 'منفی ' : '') + result;
}

function persianDigits(input) {
  if (typeof input !== 'string' && typeof input !== 'number') {
    throw new TypeError('INPUT_MUST_BE_NUMBER_OR_STRING');
  }
  return String(input).replace(/[0-9٠-٩]/g, (character) => {
    const code = character.charCodeAt(0);
    return '۰۱۲۳۴۵۶۷۸۹'.charAt(code >= 1632 ? code - 1632 : code - 48);
  });
}

function persianLetters(input) {
  if (typeof input !== 'string' && typeof input !== 'number') {
    throw new TypeError('INPUT_MUST_BE_NUMBER_OR_STRING');
  }
  return String(input).replace(/[يىك]/g, character => (character === 'ك' ? 'ک' : 'ی'));
}

function unformatNumber(input, options = {}) {
  if (typeof input !== 'string') throw new TypeError('INPUT_MUST_BE_STRING');
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('OPTIONS_MUST_BE_OBJECT');
  }
  const separator = options.separator === undefined ? '٬' : options.separator;
  if (typeof separator !== 'string' || !separator || /[0-9۰-۹٠-٩+\-−.٫]/.test(separator)) {
    throw new TypeError('INVALID_SEPARATOR');
  }
  const parts = /^([+\-−]?)([^.٫]+)([.٫][0-9۰-۹٠-٩]+)?$/.exec(input);
  if (!parts || parts[0].length !== input.length) throw new TypeError('INVALID_NUMBER');
  const groups = parts[2].split(separator);
  groups.forEach((group, index) => {
    if (!/^[0-9۰-۹٠-٩]+$/.test(group) || /[^0-9۰-۹٠-٩]/.test(group)
      || (groups.length > 1 && (index ? group.length !== 3 : group.length > 3))) {
      throw new TypeError('INVALID_NUMBER');
    }
  });
  return parts[1] + groups.join('') + (parts[3] || '');
}

const numberWordValues = {
  یک: 1,
  دو: 2,
  سه: 3,
  چهار: 4,
  پنج: 5,
  شش: 6,
  هفت: 7,
  هشت: 8,
  نه: 9,
  ده: 10,
  یازده: 11,
  دوازده: 12,
  سیزده: 13,
  چهارده: 14,
  پانزده: 15,
  شانزده: 16,
  هفده: 17,
  هجده: 18,
  نوزده: 19,
  بیست: 20,
  سی: 30,
  چهل: 40,
  پنجاه: 50,
  شصت: 60,
  هفتاد: 70,
  هشتاد: 80,
  نود: 90,
  صد: 100,
  یکصد: 100,
  دویست: 200,
  سیصد: 300,
  چهارصد: 400,
  پانصد: 500,
  ششصد: 600,
  هفتصد: 700,
  هشتصد: 800,
  نهصد: 900,
};
const numberWordScales = {
  هزار: 1, میلیون: 2, میلیارد: 3, تریلیون: 4, کوادریلیون: 5,
};
const fractionWordPlaces = ['دهم', 'صدم', 'هزارم', 'ده‌هزارم', 'صد‌هزارم', 'میلیونیم',
  'ده‌میلیونیم', 'صد‌میلیونیم', 'میلیاردم', 'ده‌میلیاردم', 'صد‌میلیاردم', 'تریلیونیم'];

function readWordGroup(words) {
  if (!words.length || words.length > 5 || words.length % 2 === 0) return null;
  let result = 0;
  let ceiling = 1000;
  for (let index = 0; index < words.length; index += 1) {
    if (index % 2) {
      if (words[index] !== 'و') return null;
    } else {
      if (!Object.prototype.hasOwnProperty.call(numberWordValues, words[index])) return null;
      const value = numberWordValues[words[index]];
      if (value >= ceiling) return null;
      result += value;
      if (value >= 100) ceiling = 100;
      else if (value >= 20) ceiling = 10;
      else ceiling = 0;
    }
  }
  return result;
}

function readIntegerWords(words) {
  if (words.length === 1 && words[0] === 'صفر') return '0';
  if (!words.length) return null;
  const groups = [0, 0, 0, 0, 0, 0];
  let previousScale = 6;
  let start = 0;
  for (let index = 0; index < words.length; index += 1) {
    if (Object.prototype.hasOwnProperty.call(numberWordScales, words[index])) {
      const scale = numberWordScales[words[index]];
      if (scale >= previousScale) return null;
      const value = index === start ? 1 : readWordGroup(words.slice(start, index));
      if (value === null) return null;
      groups[scale] = value;
      previousScale = scale;
      start = index + 1;
      if (words[start] === 'و') start += 1;
      if (start > words.length) return null;
    }
  }
  if (start < words.length) {
    const value = readWordGroup(words.slice(start));
    if (value === null) return null;
    groups[0] = value;
  } else if (words[words.length - 1] === 'و') return null;
  return groups.reverse().map(value => (`00${value}`).slice(-3)).join('').replace(/^0+/, '');
}

function fractionDigits(words) {
  const places = fractionWordPlaces.indexOf(words[words.length - 1]) + 1;
  if (!places) return null;
  const numerator = readIntegerWords(words.slice(0, -1));
  if (numerator === null || numerator.length > places) return null;
  return (new Array(places + 1).join('0') + numerator).slice(-places).replace(/0+$/, '');
}

function decimalFromWords(words) {
  const point = words.indexOf('ممیز');
  if (point !== -1) {
    if (words.lastIndexOf('ممیز') !== point) return null;
    const integer = readIntegerWords(words.slice(0, point));
    if (integer === null) return null;
    const tail = words.slice(point + 1);
    let fraction = fractionDigits(tail);
    if (fraction === null) {
      fraction = '';
      for (let index = 0; index < tail.length; index += 1) {
        const word = tail[index];
        if (word === 'صفر') fraction += '0';
        else if (Object.prototype.hasOwnProperty.call(numberWordValues, word)
          && numberWordValues[word] < 10) fraction += String(numberWordValues[word]);
        else return null;
      }
      if (!fraction) return null;
      fraction = fraction.replace(/0+$/, '');
      if (fraction.length > 12) throw new RangeError('NUMBER_OUT_OF_RANGE');
    }
    return integer + (fraction ? `.${fraction}` : '');
  }
  if (fractionWordPlaces.indexOf(words[words.length - 1]) === -1) {
    return readIntegerWords(words);
  }
  const candidates = [];
  const fraction = fractionDigits(words);
  if (fraction !== null) candidates.push(fraction ? `0.${fraction}` : '0');
  for (let index = 0; index < words.length; index += 1) {
    if (words[index] === 'و') {
      const integer = readIntegerWords(words.slice(0, index));
      const decimal = fractionDigits(words.slice(index + 1));
      if (integer !== null && decimal !== null) {
        const candidate = integer + (decimal ? `.${decimal}` : '');
        if (candidates.indexOf(candidate) === -1) candidates.push(candidate);
      }
    }
  }
  if (candidates.length > 1) throw new TypeError('AMBIGUOUS_NUMBER_WORDS');
  return candidates.length ? candidates[0] : null;
}

function wordsToDigits(input, options = {}) {
  if (typeof input !== 'string') throw new TypeError('INPUT_MUST_BE_STRING');
  const normalized = persianLetters(input).replace(/[\u064b-\u065f]/g, '')
    .replace(/[ \t\r\n\f\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/g, ' ')
    .replace(/^ | $/g, '');
  const words = normalized.split(' ');
  if (!normalized || words.length > 80) throw new TypeError('INVALID_NUMBER_WORDS');
  const negative = words[0] === 'منفی';
  if (negative) words.shift();
  let result;
  if (options && options.ordinal === true) {
    const last = words[words.length - 1];
    let cardinal;
    if (last === 'اول') cardinal = 'یک';
    else if (last === 'سوم') cardinal = 'سه';
    else if (last === 'سی\u200cام' || last === 'سیام') cardinal = 'سی';
    else if (last && last.slice(-1) === 'م') cardinal = last.slice(0, -1);
    if (!cardinal) throw new TypeError('INVALID_NUMBER_WORDS');
    words[words.length - 1] = cardinal;
    result = readIntegerWords(words);
  } else result = decimalFromWords(words);
  if (result === null || result === undefined) throw new TypeError('INVALID_NUMBER_WORDS');
  return (negative && result !== '0' ? '-' : '') + result;
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

function snapshotDefaults(options, keys) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('OPTIONS_MUST_BE_OBJECT');
  }
  const defaults = Object.create(null);
  Object.keys(options).forEach((key) => {
    if (keys.indexOf(key) === -1) throw new TypeError('UNKNOWN_OPTION');
    const value = options[key];
    if (value === undefined) return;
    if (key === 'separator') {
      if (typeof value !== 'string' || !value || /[0-9۰-۹٠-٩+\-−.٫]/.test(value)) {
        throw new TypeError('INVALID_SEPARATOR');
      }
    } else if (key === 'direction') {
      if (value !== 'toEnglish' && value !== 'toPersian') {
        throw new TypeError('INVALID_DIRECTION');
      }
    } else if (typeof value !== 'boolean') {
      throw new TypeError('OPTION_MUST_BE_BOOLEAN');
    }
    defaults[key] = value;
  });
  return defaults;
}

function withDefaults(convert, defaults, keys) {
  return (input, options = {}) => {
    const strictOptions = convert === formatNumber || convert === unformatNumber
      || convert === switchKeyboard;
    if (!options || typeof options !== 'object' || (strictOptions && Array.isArray(options))) {
      if (strictOptions || (convert === toPersian && options === null)) {
        return convert(input, options);
      }
      return convert(input, defaults);
    }
    const merged = Object.create(null);
    keys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(defaults, key)) merged[key] = defaults[key];
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        const value = options[key];
        if (value !== undefined) merged[key] = value;
      }
    });
    return convert(input, merged);
  };
}

function createPersian(config = {}) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new TypeError('OPTIONS_MUST_BE_OBJECT');
  }
  const methods = {
    toPersian,
    toEnglish,
    formatNumber,
    numberToWords,
    switchKeyboard,
    persianDigits,
    persianLetters,
    unformatNumber,
    wordsToDigits,
  };
  const optionKeys = {
    toPersian: ['arabic', 'english', 'preserveHalfSpace', 'preserveDiacritics'],
    toEnglish: ['arabic'],
    formatNumber: ['separator'],
    numberToWords: ['ordinal'],
    switchKeyboard: ['direction'],
    persianDigits: [],
    persianLetters: [],
    unformatNumber: ['separator'],
    wordsToDigits: ['ordinal'],
  };
  Object.keys(config).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(methods, key)) throw new TypeError('UNKNOWN_OPTION');
  });
  const instance = {};
  Object.keys(methods).forEach((key) => {
    const supplied = Object.prototype.hasOwnProperty.call(config, key) ? config[key] : undefined;
    const defaults = snapshotDefaults(supplied === undefined ? {} : supplied, optionKeys[key]);
    instance[key] = withDefaults(methods[key], defaults, optionKeys[key]);
  });
  return instance;
}

module.exports = {
  toPersian,
  toEnglish,
  formatNumber,
  numberToWords,
  switchKeyboard,
  createPersian,
  persianDigits,
  persianLetters,
  unformatNumber,
  wordsToDigits,
};
