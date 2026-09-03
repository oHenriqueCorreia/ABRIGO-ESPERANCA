const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const map = {
  'ABRIGO ESPERAN!A': 'ABRIGO ESPERANÇA',
  'NAVEGA!ÒO': 'NAVEGAÇÃO',
  'HIST RIA': 'HISTÓRIA',
  'TRANSPARNCIA': 'TRANSPARÊNCIA',
  'ATUALIZA!"ES': 'ATUALIZAÇÕES',
  'DaVIDAS': 'DÚVIDAS',
  'M0DICO': 'MÉDICO',
  'CIRaRGICO': 'CIRÚRGICO',
  'PR XIMO': 'PRÓXIMO',
  'CÒES': 'CÃES',
  'RA!ÒO': 'RAÇÃO',
  'RA!A': 'RAÇA',
  'NEGÒO': 'NEGÃO',
  'VOV ': 'VOVÔ',
  'SERVI!OS': 'SERVIÇOS',
  'OPERA!ÒO': 'OPERAÇÃO',
  'AUTORIZA!ÒO': 'AUTORIZAÇÃO',
  'COBRAN!A': 'COBRANÇA',
  'INDaSTRIA': 'INDÚSTRIA',
  'TIET': 'TIETÊ',
  'GALPÒO': 'GALPÃO',
  'ELETR NICA': 'ELETRÔNICA',
  'S0RIE': 'SÉRIE',
  'AP S': 'APÓS',
  'AT0': 'ATÉ',
  'C DIGO': 'CÓDIGO',
  'DESCRI!ÒO': 'DESCRIÇÃO',
  'SERVI!O': 'SERVIÇO',
  'ABSOR!ÒO': 'ABSORÇÃO',
  'INTERNA!"ES': 'INTERNAÇÕES',
  'EMERGNCIA': 'EMERGÊNCIA',
  'DOA!ÒO': 'DOAÇÃO',
  'ASSOCIA!ÒO': 'ASSOCIAÇÃO',
  'PROTE!ÒO': 'PROTEÇÃO',
  '0': 'É',
  'voc': 'você',
  'Voc': 'Você',
  'VOC': 'VOCÊ',
  'trs': 'três',
  'ms': 'mês',
  'S"': '✕',
  'S ': '✓',
  '&': '⭐',
  'xa': '🚨',
  'x"': '📦',
  'x   ': '',
  'x a ': '',
  'x ': '',
  'a ️ ': '',
  'x} ': '',
  'x  ': '',
  'x  ': '',
  '  ': '',
  ' ': '❮',
  ' ': '❯',
  'x:️': '🔒',
  'S  ': '✔'
};

for (const [bad, good] of Object.entries(map)) {
  html = html.split(bad).join(good);
}

// Any remaining  that are obvious
html = html.replace(/S/g, '✓');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed basic dict.');
