const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/bo📦>/g, 'box">');
html = html.replace(/Bai🚨r/g, 'Baixar');
html = html.replace(/Ú ️/g, ''); // just remove weird Ú ️
html = html.replace(/NÒO/g, 'NÃO');
html = html.replace(/INTERNAÇ "ES/g, 'INTERNAÇÕES');
html = html.replace(/RELAT  RIO/g, 'RELATÓRIO');
html = html.replace(/🚨/g, ''); // remove all 🚨
html = html.replace(/📦/g, ''); // remove all 📦
html = html.replace(/🔒 SSL/g, 'SSL'); // clean up
html = html.replace(/✓ /g, ''); // remove stray checkmarks in lists if they look weird, but wait, those were actual checkmarks
html = html.replace(/ ✕/g, '✕');
html = html.replace(/Pi⬢/g, 'Pix ⬢');

fs.writeFileSync('index.html', html, 'utf8');
console.log("Fixed more strays");
