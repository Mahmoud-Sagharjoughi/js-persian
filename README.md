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

___

Prior Version 1.0.0 (< 1.0.0)

```javascript
const toPersian = require('persian');

toPersian('اردك علي ٤6٦'); // اردک علی ۴۶۶

toPersian('اردك علي ٤6٦', { english: false }); // اردک علی ۴6۶

```
