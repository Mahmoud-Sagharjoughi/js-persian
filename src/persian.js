function replaceAll(str, mapObj) {
  const regex = new RegExp(Object.keys(mapObj).join('|'), 'gi');
  return str.replace(regex, key => mapObj[key]);
}

function replaceArabicToPersian(str, preserveHalfSpace, preserveDiacritics) {
  let newStr = str;
  if (!preserveDiacritics) {
    for (let i = 1611; i < 1632; i += 1) {
      newStr = newStr.replace(new RegExp(String.fromCharCode(i), 'g'), '');
    }
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

module.exports = {
  toPersian,
  toEnglish,
};
