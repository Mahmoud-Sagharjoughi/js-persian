/// <reference types="persian" />

var text: string = persian.toPersian('123');
text = persian.toEnglish('۱۲٣', { arabic: true });
text = persian.formatNumber('1234');
text = persian.numberToWords(3, { ordinal: true });
text = persian.switchKeyboard('google', { direction: 'toPersian' });
text = persian.persianDigits('123');
text = persian.persianLetters('علي');
text = persian.unformatNumber('۱٬۲۳۴');
text = persian.wordsToDigits('سوم', { ordinal: true });
var config: persian.PersianConfig = { toEnglish: { arabic: true } };
var instance: persian.PersianInstance = persian.createPersian(config);
text = instance.toEnglish('٣');
var ordinals: string[] = [1, 2, 3].map(persian.numberToWords);
