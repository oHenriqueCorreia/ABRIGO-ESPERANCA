const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix remaining broken texts
html = html.replace(/HIST RIASde/g, 'HISTÓRIAS DE');
html = html.replace(/HIST RIASDE/g, 'HISTÓRIAS DE');
html = html.replace(/HIST RIAS/g, 'HISTÓRIAS');
html = html.replace(/HIST RIA/g, 'HISTÓRIA');
html = html.replace(/Faça uma doação pelo Pi\s+\x19/g, 'Pix');
html = html.replace(/Área Pi\s+\x19/g, 'Área Pix');
html = html.replace(/Pi\s+\x19/g, 'Pix');
html = html.replace(/RELAT\s+\x1cRIO/g, 'RELATÓRIO');
html = html.replace(/INTERNAÇ "ES/g, 'INTERNAÇÕES');
html = html.replace(/Ú\s+️/g, '🚨');
html = html.replace(/ \s+/g, ' ');
html = html.replace(/\x19/g, '');
html = html.replace(/\x1c/g, '');
html = html.replace(/\x13/g, '');
html = html.replace(/✓\x1c/g, '✅');
html = html.replace(/✕/g, '✕');
html = html.replace(/RUA DASCLÍNICAS/g, 'RUA DAS CLÍNICAS');
html = html.replace(/PROCEDIMENTOSMÉDICO/g, 'PROCEDIMENTOS MÉDICO');
html = html.replace(/CIRÚRGICOSREALIZADOS/g, 'CIRÚRGICOS REALIZADOS');
html = html.replace(/DOSSERVIÇOS/g, 'DOS SERVIÇOS');
html = html.replace(/CLÍNICOS:/g, 'CLÍNICOS:');
html = html.replace(/p10px/g, 'p: 10px');
html = html.replace(/RAÇA\s/g, 'RAÇA ');
html = html.replace(/NEGÃO \(VOV\)/g, 'NEGÃO (VOVÔ)');
html = html.replace(/6p12p/g, '6px 12px ');
html = html.replace(/1pdashed/g, '1px dashed');
html = html.replace(/border-radius: 4px;/g, 'border-radius: 4px;');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Final cleanup done');
