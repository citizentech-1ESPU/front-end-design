// Caixas 2, 3 e 4 (design 6.6): simuladas no navegador para quem abrir o site sem o Wokwi
// rodando ainda ver todos os estados. Os valores contam a partir de quando a página abriu.
const MS_POR_MIN = 60000;

export function leituraSimulada(cenario, inicio, agora) {
  const t = (agora.getTime() - inicio.getTime()) / MS_POR_MIN;
  const base = { leituraEm: agora.toISOString(), valida: true };
  switch (cenario) {
    case 'gelo': // 4,6 °C subindo 2 °C por hora: passa de 5 °C em 12 min
      return { ...base, temperaturaC: 4.6 + (2 * t) / 60, taxaCh: 2, minutosFora: 30 + Math.max(0, t - 12) };
    case 'xepa': // 7,8 °C e 2h20 fora do frio, crescendo em tempo real
      return { ...base, temperaturaC: 7.8, taxaCh: 0, minutosFora: 140 + t };
    case 'descarte': // gelo reposto (3,9 °C esfriando), mas já são 4h10 fora: a caixa lembra
    default:
      return { ...base, temperaturaC: 3.9, taxaCh: -1.5, minutosFora: 250 };
  }
}
