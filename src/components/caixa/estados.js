// Textos e cores de cada estado da caixa (design 6.1 e 6.3). Os mesmos do LED e do display da caixa de verdade.
// "piscar" imita o LED: o verde pisca no gelo e os três piscam sem leitura.
// "placa" marca o estado que vira plaquinha de feira (o amarelo da logo): a hora da xepa.
export const ESTADOS_DA_CAIXA = {
  normal: { rotulo: 'Venda normal', apoio: 'Pode vender tranquilo.', cores: 'bg-ok-bg text-ok-ink', piscar: false, placa: false },
  gelo: { rotulo: 'Complete o gelo', apoio: 'A caixa está esquentando.', cores: 'bg-ok-bg text-ok-ink', piscar: true, placa: false },
  xepa: { rotulo: 'Hora da xepa', apoio: 'Venda ou doe hoje.', cores: 'bg-sign text-ink', piscar: false, placa: true },
  descarte: { rotulo: 'Descarte', apoio: 'Não venda nem doe.', cores: 'bg-bad-bg text-bad', piscar: false, placa: false },
  sensor: { rotulo: 'Sem leitura', apoio: 'Confira o sensor da caixa.', cores: 'bg-paper-3 text-ink', piscar: true, placa: false },
};

export function dadosDoEstado(estado) {
  return ESTADOS_DA_CAIXA[estado] ?? ESTADOS_DA_CAIXA.sensor;
}
