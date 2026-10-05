export interface ToPersianOptions {
  arabic?: boolean;
  english?: boolean;
  preserveHalfSpace?: boolean;
  preserveDiacritics?: boolean;
}

export interface ToEnglishOptions {
  arabic?: boolean;
}

export function toPersian(input: string | number, options?: ToPersianOptions): string;
export function toEnglish(input: string | number, options?: ToEnglishOptions): string;
