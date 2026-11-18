// Textos fixos da página Sobre: Ficha da CitizenTech (design, seção 1), ODS e equipe

export const FICHA = [
  { campo: 'Nome da CitizenTech', valor: 'Xepa Certa' },
  { campo: 'Cidade e bairro', valor: 'São Paulo, Zona Norte (feira de domingo da Av. Engenheiro Caetano Álvares)' },
  {
    campo: 'Cidadão beneficiado',
    valor: 'Feirante que vende perecível (peixe, queijo, frios). Também os fregueses do bairro e as ONGs e cozinhas solidárias que recebem doações.',
  },
  {
    campo: 'Problema',
    valor:
      'O feirante não tem como saber se o peixe e o queijo ficaram frios o suficiente: perde mercadoria quando o gelo acaba antes do esperado, e a sobra que ainda está boa não chega a quem precisa a tempo.',
  },
  {
    campo: 'Indicador de impacto',
    valor: 'Quilos de perecível que deixaram de ir para o lixo por feira (vendidos na xepa mais doados) e reais de perda evitada por feirante.',
  },
];

export const PASSOS = [
  {
    titulo: 'A caixa mede e decide',
    texto:
      'Um sensor na caixa térmica mede a temperatura, soma o tempo que o produto passou acima de 5 °C e acende verde, amarelo ou vermelho, mesmo sem internet.',
  },
  {
    titulo: 'A nuvem guarda',
    texto: 'Quando tem internet, a caixa manda as leituras para o ThingSpeak a cada 20 segundos.',
  },
  {
    titulo: 'O site leva a xepa',
    texto:
      'No amarelo, o feirante anuncia a xepa aqui. Fregueses e ONGs perto da feira reservam e retiram antes de estragar. O vermelho bloqueia venda e doação.',
  },
];

export const ODS = [
  {
    nome: 'ODS 2 · Fome zero',
    meta: 'Meta 2.1: acesso a alimentos seguros',
    como: 'A sobra que ainda está boa chega, com prazo seguro, a fregueses e cozinhas solidárias.',
  },
  {
    nome: 'ODS 3 · Saúde e bem-estar',
    meta: 'Metas 3.3 e 3.d: evitar doença transmitida por alimento e alertar cedo um risco à saúde',
    como: 'A caixa conta o tempo fora do frio e bloqueia venda e doação do que passou do limite.',
  },
  {
    nome: 'ODS 11 · Cidades sustentáveis',
    meta: 'Meta 11.6: menos resíduo nas cidades',
    como: 'Menos peixe, queijo, fruta e verdura indo para o lixo no fim da feira.',
  },
];

export const EQUIPE = [
  { nome: 'Pedro Passos Corsini', rm: 'RM573493', parte: 'Python, Matemática e Pitch' },
  { nome: 'Daniel Gomes Torres', rm: 'RM573436', parte: 'Web Development' },
  { nome: 'Henrique Lira', rm: 'RM571009', parte: 'Front-end Design' },
  { nome: 'Pedro Thyago de Araújo Santos', rm: 'RM570939', parte: 'Edge Computing e STED' },
];
