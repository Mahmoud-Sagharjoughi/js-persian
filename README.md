# Library for Persian(farsi) localization "`persian`"

[![npm version](https://badge.fury.io/js/persian.svg)](https://badge.fury.io/js/persian)
[![CI](https://github.com/Mahmoud-Sagharjoughi/js-persian/actions/workflows/ci.yml/badge.svg)](https://github.com/Mahmoud-Sagharjoughi/js-persian/actions/workflows/ci.yml)

## Installing

### Using NPM

```bash
npm install persian
```

### Using Yarn

```bash
yarn add persian
```

The new conversion options, number and keyboard utilities, and TypeScript definitions below
are part of the upcoming 1.1.0 release.

## Compatibility

The published package uses ES5 CommonJS and has no runtime dependencies.
The release artifact has been tested on Node.js 0.10.48, 0.12.18, 4.0.0, 4.8.6,
4.9.1, 6.0.0, 6.12.0, 6.17.1, 8.0.0, 8.9.1, 8.17.0, 9.2.0, 10.24.1,
12.22.12, 14.21.3, 16.20.2, 18.20.8, 20.19.5, 22.23.3, 24.16.0 and 26.10.0.

Building from source requires Node.js 22.18 or later in the 22.x line, or Node.js
24.11 or later. This requirement applies to development tools; the published
package retains the runtime compatibility listed above.

Run `npm run lint` to check the source style and `npm test` to build the package
and run the regression tests. The tests cover conversion options, half-spaces, numeric boundaries, keyboard layouts, invalid
inputs, unchanged `String.prototype`, and all 65,536 UTF-16 code units across
every combination of conversion options.

CI builds one npm archive and tests that archive on the Node.js versions above
on Linux, plus Node.js 22, 24 and 26 on Windows and macOS. It also checks native
ESM imports on Node.js 12 and later, ES5 output syntax, package contents, and valid
and invalid TypeScript usage with TypeScript 2.6.2 and 7.0.2.

## Examples

### To Persian

Latest Version

```javascript
// ES6
import { toPersian, toEnglish } from 'persian';

toPersian('اردك علي ٤6٦'); // اردک علی ۴۶۶

// { english, arabic }
toPersian('اردك علي ٤6٦', { english: false }); // اردک علی ۴6۶

// From Persian To English
toEnglish('۷۶۳۲۴۵'); // 763245

```

### Using CommonJS

```javascript
var persian = require('persian');

persian.toPersian('اردك علي ٤6٦'); // اردک علی ۴۶۶
persian.toEnglish('۷۶۳۲۴۵'); // 763245
```

### Preserving half-spaces

By default, `toPersian` removes half-spaces (U+200C) when Arabic conversion is enabled.
Use `preserveHalfSpace` to keep them:

```javascript
toPersian('مي‌روم'); // میروم
toPersian('مي‌روم', { preserveHalfSpace: true }); // می‌روم
```

### Preserving diacritics

By default, `toPersian` removes diacritics in U+064B–U+065F when Arabic conversion
is enabled. Use `preserveDiacritics` to keep them while still converting letters
and digits:

```javascript
toPersian('عَلِي 123'); // علی ۱۲۳
toPersian('عَلِي 123', { preserveDiacritics: true }); // عَلِی ۱۲۳
```

`preserveDiacritics` and `preserveHalfSpace` can be enabled together. When
`arabic: false`, Arabic letters, digits, diacritics and joining characters are
already left unchanged.

Options for `toPersian`:

| Option | Default | Behavior |
| --- | --- | --- |
| `arabic` | `true` | Convert Arabic letters and digits, and remove diacritics and joining characters. |
| `english` | `true` | Convert English digits to Persian digits. |
| `preserveHalfSpace` | `false` | Keep U+200C during Arabic conversion. |
| `preserveDiacritics` | `false` | Keep U+064B–U+065F during Arabic conversion. |

### Converting Arabic digits to English

`toEnglish` converts Persian digits by default. Set its `arabic` option to `true`
to convert Arabic digits too; the default is `false`:

```javascript
toEnglish('۱۲٣4'); // 12٣4
toEnglish('۱۲٣4', { arabic: true }); // 1234
```

This option changes digits only; letters, diacritics and half-spaces are kept.
Both functions accept strings or numbers and return strings.

### Formatting numbers

`formatNumber` groups the integer part in threes. It preserves the input's digit
characters, sign, decimal separator, leading zeros and fractional trailing zeros.
The default thousands separator is `٬` (U+066C):

```javascript
import { formatNumber } from 'persian';

formatNumber('۱۲۳۴۵۶۷'); // ۱٬۲۳۴٬۵۶۷
formatNumber('−۰۰۱۲۳۴٫۵۰'); // −۰۰۱٬۲۳۴٫۵۰
formatNumber(-1234.5, { separator: ',' }); // -1,234.5
formatNumber('9007199254740993'); // 9٬007٬199٬254٬740٬993
```

`separator` must be a nonempty string without digits, signs or decimal separators.
It is inserted literally, including characters such as `$`.

### Numbers to Persian words

`numberToWords` supports signed integers and decimals written with English,
Persian or Arabic digits, including mixed digits:

```javascript
import { numberToWords } from 'persian';

numberToWords('۱۲۳'); // صد و بیست و سه
numberToWords('-12.50'); // منفی دوازده و پنج دهم
numberToWords('0.01'); // یک صدم
numberToWords('100000000000000001'); // صد کوادریلیون و یک
```

The integer part supports up to 18 digits after removing leading zeros (through quadrillions);
the fractional part supports up to 12 decimal places after removing trailing
zeros. Leading zeros and negative zero are normalized. A whole number followed
only by fractional zeros is read as a whole number.

Both numeric utilities accept strings or numbers. Strings must contain an optional
`+`, `-` or `−` (U+2212), one or more digits, and optionally `.` or `٫` (U+066B)
followed by one or more digits. Spaces, existing grouping separators and string
exponent notation are rejected with `TypeError('INVALID_NUMBER')`.

Use strings for exact large integers or decimals: numeric inputs use JavaScript's
existing string representation. Nonfinite numbers throw
`RangeError('NUMBER_MUST_BE_FINITE')`; numbers outside ±9007199254740991 throw
`RangeError('NUMBER_MUST_BE_SAFE')`. Numeric exponent notation is expanded to
ordinary decimal notation. `formatNumber` has no digit limit for strings;
`numberToWords` throws `RangeError('NUMBER_OUT_OF_RANGE')` beyond its limits.

### Switching keyboard layouts

`switchKeyboard` converts the letter positions of the unshifted Persian Standard
and English QWERTY layouts. The default direction is `toEnglish`:

```javascript
import { switchKeyboard } from 'persian';

switchKeyboard('لخخلمث'); // google
switchKeyboard('google', { direction: 'toPersian' }); // لخخلمث
```

The mappings follow the letter rows in the
[Persian Standard keyboard layout](https://learn.microsoft.com/en-us/globalization/keyboards/kbdfar.html).
English `[`, `]`, `;`, `'` and `,` map to Persian `ج`, `چ`, `ک`, `گ` and `و`.
Digits, uppercase English letters, shifted symbols, half-spaces, emoji and other
unmapped characters stay unchanged. This function accepts strings only and
converts in the requested direction without guessing the input's language.

For the two utilities with options, `options` must be an object when provided.
An invalid separator or direction throws a `TypeError`.
These utilities are additional exports; existing conversion defaults are unchanged.

### TypeScript

Type definitions are included in the package.

```typescript
import { toPersian, toEnglish, ToPersianOptions, ToEnglishOptions } from 'persian';

const options: ToPersianOptions = { preserveHalfSpace: true, preserveDiacritics: true };
const result: string = toPersian('مي‌روم 123', options);

const englishOptions: ToEnglishOptions = { arabic: true };
const digits: string = toEnglish('۱۲٣4', englishOptions);
```

___

Prior Version 1.0.0 (< 1.0.0)

```javascript
const toPersian = require('persian');

toPersian('اردك علي ٤6٦'); // اردک علی ۴۶۶

toPersian('اردك علي ٤6٦', { english: false }); // اردک علی ۴6۶

```
