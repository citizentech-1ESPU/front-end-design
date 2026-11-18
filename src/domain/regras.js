import {
  AVISO_GELO_MIN, CATEGORIAS_COM_FRIO, DESCARTE_APOS_MIN, ESTADOS, LIMITE_FRIO_C,
  PRAZO_DEMO_SEM_CAIXA_MIN, TEMP_MAX_VALIDA_C, TEMP_MIN_VALIDA_C, XEPA_APOS_MIN,
} from './constantes';
import { fimDaFeira, formatarHora, somarMinutos } from './tempo';

// Código do field3 do ThingSpeak → nome do estado. Código desconhecido vira 'sensor'.
export function estadoPorCodigo(codigo) {
  const numero = Number(codigo);
  return Number.isInteger(numero) && ESTADOS[numero] ? ESTADOS[numero] : 'sensor';
}

// Quanto falta para passar de 5 °C na velocidade atual. Só faz sentido esquentando e abaixo de 5 °C.
export function minutosAte5C(temperaturaC, taxaCh) {
  if (temperaturaC === null || temperaturaC === undefined || taxaCh === null || taxaCh === undefined) return null;
  if (taxaCh <= 0 || temperaturaC >= LIMITE_FRIO_C) return null;
  return ((LIMITE_FRIO_C - temperaturaC) / taxaCh) * 60;
}

function leituraValida(temperaturaC) {
  return typeof temperaturaC === 'number'
    && !Number.isNaN(temperaturaC)
    && temperaturaC >= TEMP_MIN_VALIDA_C
    && temperaturaC <= TEMP_MAX_VALIDA_C;
}

// Prioridade: sensor > descarte > xepa > gelo > normal (design 6.1)
export function calcularEstado({ temperaturaC, taxaCh, minutosFora }) {
  if (!leituraValida(temperaturaC)) return 'sensor';
  if (minutosFora >= DESCARTE_APOS_MIN) return 'descarte';
  if (minutosFora >= XEPA_APOS_MIN) return 'xepa';
  const ate5 = minutosAte5C(temperaturaC, taxaCh);
  if (temperaturaC > LIMITE_FRIO_C || (ate5 !== null && ate5 >= 0 && ate5 <= AVISO_GELO_MIN)) return 'gelo';
  return 'normal';
}

export function minutosRestantes(minutosFora) {
  return Math.max(0, DESCARTE_APOS_MIN - minutosFora);
}

// RN2: agora + minutos restantes, sem passar do fim da feira (fora do modo demonstração)
export function prazoMaximo({ agora, minutosRestantes: restantes, modoDemo }) {
  const prazo = somarMinutos(agora, restantes);
  if (modoDemo) return prazo;
  const fim = fimDaFeira(agora);
  return prazo > fim ? fim : prazo;
}

// RN3: produto sem caixa vai até o fim da feira; no modo demonstração, daqui a 2 horas
export function prazoPadraoSemCaixa({ agora, modoDemo }) {
  return modoDemo ? somarMinutos(agora, PRAZO_DEMO_SEM_CAIXA_MIN) : fimDaFeira(agora);
}

// RN1: devolve o primeiro motivo que impede anunciar a partir da caixa
export function podeAnunciar(caixa, { agora, modoDemo }) {
  if (caixa.estado === 'descarte' || caixa.minutosRestantes === 0) {
    return { pode: false, motivo: 'Caixa no descarte. Não venda nem doe.' };
  }
  if (caixa.estado === 'sensor') {
    return { pode: false, motivo: 'Sem leitura da caixa. Confira o sensor.' };
  }
  if (caixa.leituraAntiga) {
    const ultima = caixa.leituraEm ? ` (última às ${formatarHora(caixa.leituraEm)})` : '';
    return { pode: false, motivo: `Sem leitura recente da caixa${ultima}. Confira a conexão.` };
  }
  if (!modoDemo && agora >= fimDaFeira(agora)) {
    return { pode: false, motivo: 'A feira já acabou por hoje.' };
  }
  return { pode: true, motivo: null };
}

// RN6: peixe e queijo só para quem leva caixa térmica
export function podeDoar({ categoria, temCaixaTermica }) {
  return !CATEGORIAS_COM_FRIO.includes(categoria) || Boolean(temCaixaTermica);
}

// RN5: quantidade menos as reservas da própria oferta. A comparação é exata (===),
// porque o filtro de busca do MockAPI casa trechos (ofertaId=1 traria o 10).
export function disponivel(oferta, reservas) {
  const reservado = reservas
    .filter((reserva) => String(reserva.ofertaId) === String(oferta.id))
    .reduce((soma, reserva) => soma + Number(reserva.quantidade || 0), 0);
  return Math.max(0, Number(oferta.quantidade || 0) - reservado);
}

export function estaAtiva(oferta, agora) {
  return oferta.status === 'ativa' && new Date(oferta.venderAte).getTime() > agora.getTime();
}
