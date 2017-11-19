String.prototype.replaceAll = function(mapObj) {
  let regex = new RegExp(Object.keys(mapObj).join('|'), 'gi');
  let str = this;
  return str.replace(regex, function(key) {
    return mapObj[key];
  });
};

function replaceArabicToPersian(str) {
  const arabicSignsCharCode = Array(21).fill(0).map((e, i) => i + 1611);

  for (let i = 0; i < arabicSignsCharCode.length; i += 1) {
    str = str.replace(new RegExp(String.fromCharCode(arabicSignsCharCode[i]), 'g'), '');
  }

  const charMap = {
    'ي': 'ی',
    'ى': 'ی',
    'ك': 'ک',
    '‍': '',
    '‌': '',
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
  return str.replaceAll(charMap);
}

function replaceEnglishToPersian(str) {
  const charMap = {
    '0': '۰',
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹',
  };
  return str.replaceAll(charMap);
}


module.exports = (str, {
  arabic = true,
  english = true,
} = {}) => {
  let result = str;
  if (arabic) {
    result = replaceArabicToPersian(result);
  }
  if (english) {
    result = replaceEnglishToPersian(result);
  }
  return result;
}
