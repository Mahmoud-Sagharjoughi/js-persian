String.prototype.replaceAll = function(mapObj) {
  let regex = new RegExp(Object.keys(mapObj).join('|'), 'gi');
  let str = this;
  return str.replace(regex, function(key) {
    return mapObj[key];
  });
};

function replaceAllToPersian(str) {
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

module.exports = {
  arabicToPersian(str) {
    return replaceAllToPersian(str);
  },
};
