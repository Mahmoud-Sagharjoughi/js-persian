export interface ToPersianOptions {
  arabic?: boolean;
  english?: boolean;
  preserveHalfSpace?: boolean;
}

export function toPersian(input: string | number, options?: ToPersianOptions): string;
export function toEnglish(input: string | number): string;
