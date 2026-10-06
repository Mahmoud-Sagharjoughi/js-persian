export interface ToPersianOptions {
  arabic?: boolean;
  english?: boolean;
  preserveHalfSpace?: boolean;
  preserveDiacritics?: boolean;
}

export interface ToEnglishOptions {
  arabic?: boolean;
}

export interface FormatNumberOptions {
  separator?: string;
}

export interface SwitchKeyboardOptions {
  direction?: 'toEnglish' | 'toPersian';
}

export function toPersian(input: string | number, options?: ToPersianOptions): string;
export function toEnglish(input: string | number, options?: ToEnglishOptions): string;
export function formatNumber(input: string | number, options?: FormatNumberOptions): string;
export function numberToWords(input: string | number): string;
export function switchKeyboard(input: string, options?: SwitchKeyboardOptions): string;
