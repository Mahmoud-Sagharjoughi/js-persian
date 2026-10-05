# Library for Persian(farsi) localization "`persian`"

[![npm version](https://badge.fury.io/js/persian.svg)](https://badge.fury.io/js/persian)

## Installing

### Using NPM

```bash
npm install persian
```

### Using Yarn

```bash
yarn add persian
```

## Compatibility

The published package uses ES5 CommonJS and has no runtime dependencies.
The release artifact has been tested on Node.js 0.10.48, 0.12.18, 4.0.0, 4.8.6,
4.9.1, 6.0.0, 6.12.0, 6.17.1, 8.0.0, 8.9.1, 8.17.0, 9.2.0, 10.24.1,
12.22.12, 14.21.3, 16.20.2, 18.20.8, 20.19.5, 22.23.3, 24.16.0 and 26.10.0.

Run `npm test` to build the package and run the regression tests. The tests cover
conversion options, half-spaces, invalid inputs, unchanged `String.prototype`,
and all 65,536 UTF-16 code units across every combination of boolean options.

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

| Option | Default | Behavior |
| --- | --- | --- |
| `arabic` | `true` | Convert Arabic letters and digits, and remove diacritics and joining characters. |
| `english` | `true` | Convert English digits to Persian digits. |
| `preserveHalfSpace` | `false` | Keep U+200C during Arabic conversion. |

`toEnglish` converts Persian digits only. Both functions accept strings or numbers and return strings.

### TypeScript

Type definitions are included in the package.

```typescript
import { toPersian, ToPersianOptions } from 'persian';

const options: ToPersianOptions = { preserveHalfSpace: true };
const result: string = toPersian('مي‌روم 123', options);
```

___

Prior Version 1.0.0 (< 1.0.0)

```javascript
const toPersian = require('persian');

toPersian('اردك علي ٤6٦'); // اردک علی ۴۶۶

toPersian('اردك علي ٤6٦', { english: false }); // اردک علی ۴6۶

```
