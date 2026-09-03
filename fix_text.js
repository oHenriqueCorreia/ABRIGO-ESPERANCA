const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix all remaining broken text
html = html.replace(/ x A História do Abrigo/g, '🐾 A História do Abrigo');
html = html.replace(/ xa Doar pelo Pix/g, '💳 Doar pelo Pix');
html = html.replace(/ Cães Resgatados/g, '🐶 Cães Resgatados');
html = html.replace(/Ú️ Com vs Sem Sua Ajuda/g, '⚖️ Com vs Sem Sua Ajuda');
html = html.replace(/ Onde Vai Seu Apoio/g, '❤️ Onde Vai Seu Apoio');
html = html.replace(/ x` Prestação de Custos/g, '🧾 Prestação de Custos');
html = html.replace(/ x\x1d\x1d Últimas Notícias/g, '📰 Últimas Notícias');
html = html.replace(/ x Depoimentos/g, '💬 Depoimentos');
html = html.replace(/ Boletos e Notas Reais/g, '📄 Boletos e Notas Reais');
html = html.replace(/  Dúvidas Frequentes/g, '❓ Dúvidas Frequentes');
html = html.replace(/ \n\nUm apelo desesperado!/g, '🚨 Um apelo desesperado!');
html = html.replace(/<span> <\/span> Um apelo desesperado!/g, '🚨 Um apelo desesperado!');
html = html.replace(/A HIST RIA/g, 'A HISTÓRIA');
html = html.replace(/HIST RIASDE RESGATE/g, 'HISTÓRIAS DE RESGATE');
html = html.replace(/Link PiOficial/g, 'Link Pix Oficial');
html = html.replace(/ANCHOR PILLSBAR/g, 'ANCHOR PILLS BAR');
html = html.replace(/SECTION: DEPOIMENTOS\(VÍDEOS\)/g, 'SECTION: DEPOIMENTOS (VÍDEOS)');
html = html.replace(/SECTION: HIST RIASDE RESGATE/g, 'SECTION: HISTÓRIAS DE RESGATE');

// Fix control characters in inline text (these are \x1d chars in story text that are em-dash markers)
html = html.replace(/\x1d/g, '—');

// Fix the x1c control char 
html = html.replace(/\x1c/g, '');
html = html.replace(/\x19/g, '');
html = html.replace(/\x13/g, '');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Text cleanup done');
