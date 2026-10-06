import { toPersian, toEnglish, formatNumber, numberToWords, switchKeyboard, ToPersianOptions, ToEnglishOptions, FormatNumberOptions, SwitchKeyboardOptions } from 'persian';
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

const formatOptions: FormatNumberOptions = { separator: ',' };
const keyboardOptions: SwitchKeyboardOptions = { direction: 'toPersian' };
const j: string = formatNumber('۱۲۳۴٫۵۰', formatOptions);
const k: string = persian.formatNumber(1234);
const l: string = numberToWords('9007199254740993');
const m: string = persian.numberToWords(-12.5);
const n: string = switchKeyboard('google', keyboardOptions);
const o: string = persian.switchKeyboard('لخخلمث');
