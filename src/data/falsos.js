// Dados falsos no formato final do contrato dos hooks. Servem para a Lira montar as telas
// antes de o MockAPI e o ThingSpeak estarem ligados, e para os testes de componentes.

// Os 16 campos do objeto caixa, em ordem alfabética (a mesma de Object.keys(caixa).sort())
export const CAMPOS_CAIXA = [
  'categoria', 'emoji', 'estado', 'fonte', 'id', 'leituraAntiga', 'leituraEm', 'minutosAte5C',
  'minutosFora', 'minutosRestantes', 'motivoBloqueio', 'nome', 'podeAnunciar', 'prazoMaximo', 'taxaCh', 'temperaturaC',
];

export const CAIXAS_FALSAS = [
  {
    id: 'caixa-1', nome: 'Tilápia', emoji: '🐟', categoria: 'peixe', fonte: 'sensor',
    temperaturaC: 3.0, taxaCh: 0.4, minutosFora: 0, minutosRestantes: 240, minutosAte5C: null,
    estado: 'normal', leituraEm: '2026-11-15T15:09:40Z', leituraAntiga: false,
    prazoMaximo: '2026-11-15T17:00:00.000Z', podeAnunciar: true, motivoBloqueio: null,
  },
  {
    id: 'caixa-2', nome: 'Queijo', emoji: '🧀', categoria: 'queijo', fonte: 'simulada',
    temperaturaC: 4.6, taxaCh: 2, minutosFora: 30, minutosRestantes: 210, minutosAte5C: 12,
    estado: 'gelo', leituraEm: '2026-11-15T15:10:00Z', leituraAntiga: false,
    prazoMaximo: '2026-11-15T17:00:00.000Z', podeAnunciar: true, motivoBloqueio: null,
  },
  {
    id: 'caixa-3', nome: 'Sardinha', emoji: '🐟', categoria: 'peixe', fonte: 'simulada',
    temperaturaC: 7.8, taxaCh: 0, minutosFora: 140, minutosRestantes: 100, minutosAte5C: null,
    estado: 'xepa', leituraEm: '2026-11-15T15:10:00Z', leituraAntiga: false,
    prazoMaximo: '2026-11-15T16:50:00.000Z', podeAnunciar: true, motivoBloqueio: null,
  },
  {
    id: 'caixa-4', nome: 'Pescada', emoji: '🐟', categoria: 'peixe', fonte: 'simulada',
    temperaturaC: 3.9, taxaCh: -1.5, minutosFora: 250, minutosRestantes: 0, minutosAte5C: null,
    estado: 'descarte', leituraEm: '2026-11-15T15:10:00Z', leituraAntiga: false,
    prazoMaximo: null, podeAnunciar: false, motivoBloqueio: 'Caixa no descarte. Não venda nem doe.',
  },
];

const FEIRA = 'Feira da Av. Eng. Caetano Álvares';

export const OFERTAS_FALSAS = [
  {
    id: '1', produto: 'Tilápia (filé)', categoria: 'peixe', emoji: '🐟', unidade: 'kg', quantidade: 6,
    precoNormal: 39.9, precoXepa: 29.9, venderAte: '2026-11-15T13:50:00-03:00',
    caixaId: 'caixa-1', fonteCaixa: 'sensor', temperaturaC: 7.8, conferidaEm: '2026-11-15T12:10:00-03:00',
    aceitaDoacao: true, status: 'ativa', banca: 'Banca Mar Azul', feira: FEIRA, distanciaM: 350,
    criadaEm: '2026-11-15T12:10:00-03:00',
    disponivel: 4, ativa: true,
    linkWhatsApp: 'https://wa.me/?text=Xepa%20na%20Banca%20Mar%20Azul%3A%20Til%C3%A1pia%20(fil%C3%A9)',
  },
  {
    id: '2', produto: 'Queijo minas frescal', categoria: 'queijo', emoji: '🧀', unidade: 'kg', quantidade: 3,
    precoNormal: 34, precoXepa: 25.5, venderAte: '2026-11-15T13:30:00-03:00',
    caixaId: 'caixa-2', fonteCaixa: 'simulada', temperaturaC: 4.6, conferidaEm: '2026-11-15T12:05:00-03:00',
    aceitaDoacao: true, status: 'ativa', banca: 'Queijaria Serra Azul', feira: FEIRA, distanciaM: 420,
    criadaEm: '2026-11-15T12:05:00-03:00',
    disponivel: 3, ativa: true,
    linkWhatsApp: 'https://wa.me/?text=Xepa%20na%20Queijaria%20Serra%20Azul%3A%20Queijo%20minas%20frescal',
  },
  {
    id: '3', produto: 'Banana prata', categoria: 'fruta', emoji: '🍌', unidade: 'dúzia', quantidade: 10,
    precoNormal: 8, precoXepa: 6, venderAte: '2026-11-15T14:00:00-03:00',
    caixaId: null, fonteCaixa: null, temperaturaC: null, conferidaEm: null,
    aceitaDoacao: true, status: 'ativa', banca: 'Hortifrúti Bom Preço', feira: FEIRA, distanciaM: 380,
    criadaEm: '2026-11-15T11:50:00-03:00',
    disponivel: 8, ativa: true,
    linkWhatsApp: 'https://wa.me/?text=Xepa%20na%20Hortifr%C3%BAti%20Bom%20Pre%C3%A7o%3A%20Banana%20prata',
  },
];

export const RESERVAS_FALSAS = [
  {
    id: '1', ofertaId: '1', tipo: 'compra', quantidade: 2, apelido: 'Ana',
    retirarAte: '2026-11-15T13:50:00-03:00', temCaixaTermica: null, criadaEm: '2026-11-15T12:20:00-03:00',
    oferta: OFERTAS_FALSAS[0],
  },
  {
    id: '2', ofertaId: '3', tipo: 'doacao', quantidade: 2, apelido: 'Cozinha Solidária Esperança',
    retirarAte: '2026-11-15T13:15:00-03:00', temCaixaTermica: false, criadaEm: '2026-11-15T12:25:00-03:00',
    oferta: OFERTAS_FALSAS[2],
  },
];
