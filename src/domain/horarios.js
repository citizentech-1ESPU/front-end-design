import { formatarHora } from './tempo';

const MS_POR_MIN = 60000;
const PASSO_PRAZO_MIN = 30;
const FOLGA_MIN = 15;
const MAX_OPCOES_PRAZO = 4;
const PASSO_RETIRADA_MIN = 15;

// O prazo máximo e, de 30 em 30 min para trás, os horários com pelo menos 15 min de folga (até 4 opções)
export function opcoesDePrazo(prazoMaximo, agora) {
  const maximo = new Date(prazoMaximo).getTime();
  const limite = agora.getTime() + FOLGA_MIN * MS_POR_MIN;
  const opcoes = [];
  for (let momento = maximo; opcoes.length < MAX_OPCOES_PRAZO; momento -= PASSO_PRAZO_MIN * MS_POR_MIN) {
    if (opcoes.length > 0 && momento < limite) break;
    const data = new Date(momento);
    opcoes.push({ valor: data.toISOString(), rotulo: `até ${formatarHora(data)}` });
  }
  return opcoes;
}

// Horários cheios de 15 em 15 min, começando 15 min depois de agora e sem passar do prazo da oferta.
// São Paulo tem deslocamento de horas inteiras, então dá para arredondar em milissegundos UTC.
export function opcoesDeRetirada(venderAte, agora) {
  const passo = PASSO_RETIRADA_MIN * MS_POR_MIN;
  const fim = new Date(venderAte).getTime();
  const opcoes = [];
  let momento = Math.ceil((agora.getTime() + FOLGA_MIN * MS_POR_MIN) / passo) * passo;
  for (; momento <= fim; momento += passo) {
    const data = new Date(momento);
    opcoes.push({ valor: data.toISOString(), rotulo: formatarHora(data) });
  }
  return opcoes;
}
