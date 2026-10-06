import { toPersian, toEnglish, formatNumber, numberToWords, switchKeyboard, ToPersianOptions, ToEnglishOptions, FormatNumberOptions, SwitchKeyboardOptions, createPersian, NumberToWordsOptions, PersianConfig, PersianInstance } from 'persian';
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

const ordinalOptions: NumberToWordsOptions = { ordinal: true };
const ordinal: string = numberToWords(3, ordinalOptions);
const config: PersianConfig = { toPersian: options, toEnglish: englishOptions, formatNumber: formatOptions, numberToWords: ordinalOptions, switchKeyboard: keyboardOptions };
const instance: PersianInstance = createPersian(config);
const p: string = instance.toPersian('مي‌روم');
const q: string = instance.toEnglish('٣', { arabic: false });
const r: string = instance.formatNumber('1234', { separator: ',' });
const s: string = instance.numberToWords(3, { ordinal: false });
const t: string = instance.switchKeyboard('google');
const u: string[] = [1, 2, 3].map(instance.numberToWords);
const cardinals: string[] = [1, 2, 3].map(numberToWords);
const v: string = persian.createPersian().numberToWords('0.01');
