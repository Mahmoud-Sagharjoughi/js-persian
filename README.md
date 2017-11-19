# Library for Persian(farsi) localization

## Arabic To Persian

```javascript
const toPersian = require('persian');

toPersian('اردك ٤6٦');
// اردک ۴۶۶

toPersian('اردك ٤6٦', { english: false });
// اردک ۴6۶

```