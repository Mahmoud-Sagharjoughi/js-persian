# Library for Persian(farsi) localization

## To Persian

Latest Version

```javascript
const persian = require('persian');

persian.toPersian('اردك ٤6٦');
// اردک ۴۶۶

persian.toPersian('اردك ٤6٦', { english: false });
// اردک ۴6۶

persian.toEnglish('۷۶۳۲۴۵');
// 763245

```

___

Prior Version 1.0.0 (<= 1.0.0)

```javascript
const toPersian = require('persian');

toPersian('اردك ٤6٦');
// اردک ۴۶۶

toPersian('اردك ٤6٦', { english: false });
// اردک ۴6۶

```
