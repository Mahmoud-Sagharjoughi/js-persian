import { toPersian, toEnglish, ToPersianOptions } from 'persian';
import * as persian from 'persian';

const options: ToPersianOptions = { arabic: false, english: true, preserveHalfSpace: true };
const a: string = toPersian('123', options);
const b: string = toPersian(123);
const c: string = toEnglish('۱۲۳');
const d: string = toEnglish(123);
const e: string = persian.toPersian('123', {});
const f: string = persian.toEnglish(123);
