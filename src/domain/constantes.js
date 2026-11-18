// Regras da caixa (seção 6.1 do design). Mudou aqui, avise o grupo: o Edge usa os mesmos números.
export const LIMITE_FRIO_C = 5;
export const XEPA_APOS_MIN = 120;
export const DESCARTE_APOS_MIN = 240;
export const AVISO_GELO_MIN = 15;
export const TEMP_MIN_VALIDA_C = -30;
export const TEMP_MAX_VALIDA_C = 60;
export const LEITURA_ANTIGA_MIN = 2;
export const FIM_DA_FEIRA_HORA = 14;
export const FUSO = 'America/Sao_Paulo';

// Site
export const DESCONTO_SUGERIDO = 0.25;
export const ATUALIZAR_CAIXAS_MS = 20000; // o ThingSpeak grátis aceita um envio a cada 15 s
export const PRAZO_DEMO_SEM_CAIXA_MIN = 120;
export const TEMPO_LIMITE_API_MS = 8000;

// Código enviado pelo ESP32 no field3 do ThingSpeak = posição nesta lista
export const ESTADOS = ['normal', 'gelo', 'xepa', 'descarte', 'sensor'];

export const CATEGORIAS = [
  { valor: 'peixe', rotulo: 'Peixe', emoji: '🐟' },
  { valor: 'queijo', rotulo: 'Queijo', emoji: '🧀' },
  { valor: 'fruta', rotulo: 'Fruta', emoji: '🍌' },
  { valor: 'verdura', rotulo: 'Verdura', emoji: '🥬' },
  { valor: 'outro', rotulo: 'Outro', emoji: '🛒' },
];
export const CATEGORIAS_COM_FRIO = ['peixe', 'queijo']; // só saem de uma caixa (RN3); doação só com caixa térmica (RN6)
export const UNIDADES = ['kg', 'dúzia', 'unidade', 'maço'];

// Dados de demonstração (seção 6.6), todos fictícios
export const BANCA_DO_FEIRANTE = 'Banca Mar Azul';
export const FEIRA = 'Feira da Av. Eng. Caetano Álvares';
export const DISTANCIA_DEMO_M = 350;

export const CHAVES_LOCAIS = {
  perfil: 'xepa-certa:perfil',
  caixaTermica: 'xepa-certa:caixa-termica',
  reservas: 'xepa-certa:reservas',
};
