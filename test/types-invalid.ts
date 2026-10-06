import { toPersian, toEnglish, formatNumber, numberToWords, switchKeyboard } from 'persian';

toPersian(true);
toEnglish({});
toPersian('123', { preserveHalfSpace: 'yes' });
toEnglish('123', { arabic: 'yes' });
toPersian('123', { preserveDiacritics: 'yes' });
formatNumber(true);
formatNumber('123', { separator: false });
numberToWords({});
switchKeyboard(123);
switchKeyboard('google', { direction: 'auto' });
formatNumber('123', null);
numberToWords('123', {});
