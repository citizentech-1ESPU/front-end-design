// Ofertas de demonstração (design 6.5 e 6.6). Bancas inventadas, nada de dado pessoal.
// Os prazos são relativos (minutos a partir de agora), para quem abrir o site dias depois
// não encontrar tudo vencido. Arquivo .mjs sem imports: o scripts/seed.mjs usa o mesmo arquivo.

const FEIRA = 'Feira da Av. Eng. Caetano Álvares';
const CRIADA_MIN_ANTES = 15;

export const OFERTAS_DEMO = [
  { produto: 'Tilápia (filé)', categoria: 'peixe', emoji: '🐟', unidade: 'kg', quantidade: 6, precoNormal: 39.9, precoXepa: 29.9, prazoMin: 100, caixaId: 'caixa-1', fonteCaixa: 'sensor', temperaturaC: 7.8, conferidaMinAtras: 2, aceitaDoacao: true, banca: 'Banca Mar Azul', distanciaM: 350 },
  { produto: 'Sardinha', categoria: 'peixe', emoji: '🐟', unidade: 'kg', quantidade: 4, precoNormal: 18, precoXepa: 13.5, prazoMin: 60, caixaId: 'caixa-3', fonteCaixa: 'simulada', temperaturaC: 7.8, conferidaMinAtras: 1, aceitaDoacao: false, banca: 'Banca Mar Azul', distanciaM: 350 },
  { produto: 'Queijo minas frescal', categoria: 'queijo', emoji: '🧀', unidade: 'kg', quantidade: 3, precoNormal: 34, precoXepa: 25.5, prazoMin: 80, caixaId: 'queijaria-1', fonteCaixa: 'simulada', temperaturaC: 4.9, conferidaMinAtras: 3, aceitaDoacao: true, banca: 'Queijaria Serra Azul', distanciaM: 1200 },
  { produto: 'Banana prata', categoria: 'fruta', emoji: '🍌', unidade: 'dúzia', quantidade: 10, precoNormal: 8, precoXepa: 6, prazoMin: 120, caixaId: null, fonteCaixa: null, temperaturaC: null, conferidaMinAtras: null, aceitaDoacao: true, banca: 'Hortifrúti Bom Preço', distanciaM: 600 },
  { produto: 'Tomate', categoria: 'verdura', emoji: '🍅', unidade: 'kg', quantidade: 5, precoNormal: 7, precoXepa: 5, prazoMin: 120, caixaId: null, fonteCaixa: null, temperaturaC: null, conferidaMinAtras: null, aceitaDoacao: true, banca: 'Hortifrúti Bom Preço', distanciaM: 600 },
  { produto: 'Alface crespa', categoria: 'verdura', emoji: '🥬', unidade: 'maço', quantidade: 8, precoNormal: 3.5, precoXepa: 2.5, prazoMin: 110, caixaId: null, fonteCaixa: null, temperaturaC: null, conferidaMinAtras: null, aceitaDoacao: true, banca: 'Hortifrúti Bom Preço', distanciaM: 600 },
];

const minutosDepois = (agora, minutos) => new Date(agora.getTime() + minutos * 60000).toISOString();

// Troca os minutos relativos por horários ISO, no formato do recurso ofertas do MockAPI
export function montarOfertasDemo(agora) {
  return OFERTAS_DEMO.map(({ prazoMin, conferidaMinAtras, ...oferta }) => ({
    ...oferta,
    venderAte: minutosDepois(agora, prazoMin),
    conferidaEm: conferidaMinAtras === null ? null : minutosDepois(agora, -conferidaMinAtras),
    feira: FEIRA,
    status: 'ativa',
    criadaEm: minutosDepois(agora, -CRIADA_MIN_ANTES),
  }));
}
