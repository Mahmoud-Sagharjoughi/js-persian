import { toPersian, toEnglish } from 'persian';

toPersian(true);
toEnglish({});
toPersian('123', { preserveHalfSpace: 'yes' });
toEnglish('123', { arabic: 'yes' });
toPersian('123', { preserveDiacritics: 'yes' });
