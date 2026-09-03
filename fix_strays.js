const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/Pioficial/g, 'Pix oficial');
html = html.replace(/ta🚨s/g, 'taxas');
html = html.replace(/PROCEDIMENTOSMÉDICO-CIRÚRGICOSREALIZADOS/g, 'PROCEDIMENTOS MÉDICO-CIRÚRGICOS REALIZADOS');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed strays');
