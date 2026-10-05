import { toPersian, toEnglish, ToPersianOptions, ToEnglishOptions } from 'persian';
import * as persian from 'persian';

const options: ToPersianOptions = { arabic: false, english: true, preserveHalfSpace: true, preserveDiacritics: true };
const a: string = toPersian('123', options);
const b: string = toPersian(123);
const c: string = toEnglish('۱۲۳');
const d: string = toEnglish(123);
const e: string = persian.toPersian('123', {});
const f: string = persian.toEnglish(123);

const englishOptions: ToEnglishOptions = { arabic: true };
const g: string = toEnglish('۱۲٣4', englishOptions);
const h: string = persian.toEnglish(123, {});
const i: string = toEnglish('١٢٣', { arabic: false });
