// Caixas da Banca Mar Azul (seção 6.6 do design). Só a caixa-1 tem sensor: o circuito do Wokwi, lido no ThingSpeak.
export const CAIXAS = [
  { id: 'caixa-1', nome: 'Tilápia', emoji: '🐟', categoria: 'peixe', fonte: 'sensor', produtoSugerido: 'Tilápia (filé)', unidade: 'kg', precoNormalSugerido: 39.9 },
  { id: 'caixa-2', nome: 'Queijo', emoji: '🧀', categoria: 'queijo', fonte: 'simulada', cenario: 'gelo', produtoSugerido: 'Queijo minas frescal', unidade: 'kg', precoNormalSugerido: 34 },
  { id: 'caixa-3', nome: 'Sardinha', emoji: '🐟', categoria: 'peixe', fonte: 'simulada', cenario: 'xepa', produtoSugerido: 'Sardinha', unidade: 'kg', precoNormalSugerido: 18 },
  { id: 'caixa-4', nome: 'Pescada', emoji: '🐟', categoria: 'peixe', fonte: 'simulada', cenario: 'descarte', produtoSugerido: 'Pescada (posta)', unidade: 'kg', precoNormalSugerido: 32 },
];
