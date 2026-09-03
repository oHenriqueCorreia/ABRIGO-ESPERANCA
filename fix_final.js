const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// This is a brute-force replacement for the 157 mojibake characters based on badlines.txt.
const replacements = [
  ['ABRIGO ESPERAN\uFFFD!A', 'ABRIGO ESPERANÇA'],
  ['\uFFFDx  \uFFFDA\\uFFFDHistória\\uFFFDdo\\uFFFDAbrigo', '🐾 A História do Abrigo'],
  ['\\uFFFDx a\\uFFFDDoar\\uFFFDpelo\\uFFFDPix', '𒴸 Doar pelo Pix'],
  ['\\uFFFDx\\uFFFD\\uFFFDCães\\uFFFDResgatados', '🐵 Cães Resgatados'],
  ['\\uFFFDa\\uFFFD ️\\uFFFDCom\\uFFFDvs\\uFFDS\\uFFFFEm\\uFFFD\\uFFFDSua\\uFFFDAjuda', '♨️ Com vs Sem Sua Ajuda'],
  ['\uFFFDx ` \\uFFFDPrestação\\uFFFDde\\uFFFDCustos', '�ߓ� Prestação de Custos'],
  ['\\uFFFDx  \\uFFFD\\uFFFDaltimas\\uFFFDNotícias', '📰 Últimas Notícias'],
  ['\\uFFFDx\\uFFFD \\uFFFDDepoimentos', '💣 Depoimentos'],
  ['\\uFFFDx\\uFFFD\\uFFFDBoletos\\uFFFDe\\uFFFDNotas\\uFFFDReais', '�ߓ� Boletos e Notas Reais'],
  ['\\uFFFD \\uFFDdDúvidas\\uFFFDFrequentes', 'Ⓠ Dúvidas Frequentes'],
  ['\\uFFFD💠\\uFFFD', '💠'],
  ['\\uFFFDx\\uFFFD\\uFFFD', '💠'],
  ['A HI\\uFFFDT\\uFFFD RIA', 'A HISTÓRIA'],
  ['4\\uFFFD\\uFFFD', '400'],
  ['1\\uFFFD\\uFFFD', '100'],
  ['ta\\uFFFD\\uFFFDs', 'taxas'],
  ['HI\\uFFFDT\\uFFFD RIA\\uFFFDDE\\uFFFDRE\\uFFFDGATE', 'HISTÓRIAS DE RESGATE'],
  ['\\uFFFD\\uFFFDcego', 'Å cego'],
  ['COMPARI\\uFFFDON', 'COMPARISON'],
  ['VOCÊ\\uFFFD`', 'VOCÊ'],
  ['TRAN\\uFFFDPAR\\uFFFD`NCIA', 'TRANSPARÊNCIA'],
  ['ATUALIZA\\uFFFD!\\uFFFD"E\\uFFFDD\\FFFDO', 'ATUALIZAÇÕES DO'],
  ['ATUALIZA\\uFFFD!\\uFFFD"E\\uFFFD', 'ATUALIZAÇÕES'],
  ['Chegada emergencial de ração! \\uFFDdx"\\uFFFD', 'Chegada emergencial de ração! 🎦'],
  ['PR\\uFFFD XIMO', 'PRÓXIMO'],
  ['PAGÁVEL EM QUALQUER BANCO OU CORRE\\uFFFDPONDENTE BANCÅRIO AT\\uFFFD0\\uFFFD O VENCIMENTO', 'PAG�VEL EM QUALQUER BANCO OU CORRESPONDENTE BANCÁRIO ATÒ O VENCIMENTO'],
  ['NUTRI-PET IND\\uFFFDa\\uFFFDTRIA E DI\\uFFFDTRIBUIDORA DE RA\\uFFFD!\\uFFFD"E\\uFFFDLTDA', 'NUTRI-PET INDÚSTRIA E DISTRIBUIDORA DE RAÇÕES LTDA'],
  ['\\uFFFDR. CAIXA: N\\uFFFD'O RECEBER AP\\uFFFD \\uFFFD15 DIA\\uFFFDD\\FFFDO VENCIMENTO.', 'SR. CAIXA: N3O RECEBER APÓS 15 DIAS DO!VENCIMENTO.'],
  ['A\\uFFFD\\uFFFDOCIA\\uFFFD!\\uFFFD'O DE RE\\uFFFDGATE E PROTEX\\uFFFDO ANIMAL (ABRIGO E\\uFFFDPERAN\\uFFFD!A)', 'ASSOCIAÇÅO DE RESGATE E PROTEÇÅO ANIMAL (ABRIGO ESPERANÇA)'],
  ['\\uFFFD\\uFFFDAUTORIZADA PELA \\uFFFDEFAZ', '✔ AUTORIZADA PELA SEFAZ)�,
  ['\\uFFFDELUDA\\uFFFD_\]FFFDD', 'ALTA'],
  ['\uFFFDx  \uFFFD\\uFFFDite\\uFFDseguro', '🛡 Site Seguro'],
  ['\\uFFFDx:\\uFFFD️\\uFFDd\]FFFDL\\uFFFD256-Bit', '🔥 SSL 256-Bit'],
  ['\\uFFFD\\uFFFDVerificado', '✔ Verificado'],
  ['\r\n', '\n'],
  ['\u', ' '],
  ['\\uFFFD\\uFFFD', ' '],
  ['\\uFFFD', '' ]
];
let newHtml = html;
for (const [b, g] of replacements) {
  newHtml = newHtml.split(b).join(g);
}
fs.writeFileSync('index.html', newHtml, 'utf8');
console.log('Fixed');

