import { calcularEstado, estadoPorCodigo, minutosAte5C, minutosRestantes, podeAnunciar, prazoMaximo } from './regras';
import { leituraAntiga } from './tempo';

const arredondar = (valor, casas = 0) => {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return null;
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
};

// Junta a configuração da caixa (data/caixas.js) com a leitura (ThingSpeak ou simulador)
// e devolve o objeto caixa do contrato dos hooks, com os 16 campos.
export function montarCaixa(config, leitura, { agora, modoDemo }) {
  const valida = Boolean(leitura?.valida);
  const temperaturaC = valida ? arredondar(leitura.temperaturaC, 1) : null;
  const taxaCh = valida ? arredondar(leitura.taxaCh, 1) : null;
  const minutosFora = leitura && Number.isFinite(leitura.minutosFora) ? Math.floor(leitura.minutosFora) : 0;

  let estado = 'sensor';
  if (valida) {
    // caixa com sensor: vale a decisão que o ESP32 tomou; simulada: as mesmas regras, calculadas aqui
    estado = Number.isFinite(leitura.estadoCodigo)
      ? estadoPorCodigo(leitura.estadoCodigo)
      : calcularEstado({ temperaturaC: leitura.temperaturaC, taxaCh: leitura.taxaCh, minutosFora });
  }

  const restantes = leitura && Number.isFinite(leitura.minutosRestantes)
    ? Math.floor(leitura.minutosRestantes)
    : minutosRestantes(minutosFora);
  const leituraEm = leitura?.leituraEm ?? null;
  const antiga = leituraAntiga(leituraEm, agora);

  const { pode, motivo } = podeAnunciar(
    { estado, leituraAntiga: antiga, leituraEm, minutosRestantes: restantes },
    { agora, modoDemo },
  );

  return {
    id: config.id,
    nome: config.nome,
    emoji: config.emoji,
    categoria: config.categoria,
    fonte: config.fonte,
    temperaturaC,
    taxaCh,
    minutosFora,
    minutosRestantes: restantes,
    minutosAte5C: valida ? arredondar(minutosAte5C(leitura.temperaturaC, leitura.taxaCh)) : null,
    estado,
    leituraEm,
    leituraAntiga: antiga,
    prazoMaximo: pode ? prazoMaximo({ agora, minutosRestantes: restantes, modoDemo }).toISOString() : null,
    podeAnunciar: pode,
    motivoBloqueio: motivo,
  };
}
