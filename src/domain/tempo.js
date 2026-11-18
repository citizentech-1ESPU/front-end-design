import { FIM_DA_FEIRA_HORA, FUSO, LEITURA_ANTIGA_MIN } from './constantes';

const MS_POR_MIN = 60000;

function paraData(data) {
  return data instanceof Date ? data : new Date(data);
}

// Pega ano, mês, dia, hora e minuto no fuso de São Paulo, qualquer que seja o fuso do computador.
function partesEmSaoPaulo(data) {
  const partes = new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(paraData(data));
  const valor = (tipo) => partes.find((p) => p.type === tipo)?.value;
  return { ano: valor('year'), mes: valor('month'), dia: valor('day'), hora: valor('hour'), minuto: valor('minute') };
}

export function somarMinutos(data, minutos) {
  return new Date(paraData(data).getTime() + minutos * MS_POR_MIN);
}

// 45 → '45 min'; 60 → '1h'; 140 → '2h20'; 245 → '4h05'
export function formatarDuracao(minutos) {
  const total = Math.max(0, Math.floor(minutos));
  if (total < 60) return `${total} min`;
  const horas = Math.floor(total / 60);
  const resto = total % 60;
  return resto === 0 ? `${horas}h` : `${horas}h${String(resto).padStart(2, '0')}`;
}

// Sempre no fuso de São Paulo, no jeito da feira: '13h50'
export function formatarHora(data) {
  const { hora, minuto } = partesEmSaoPaulo(data);
  return `${hora}h${minuto}`;
}

// Leitura ausente, inválida ou com mais de 2 minutos é antiga
export function leituraAntiga(leituraEm, agora = new Date()) {
  if (!leituraEm) return true;
  const momento = new Date(leituraEm).getTime();
  if (Number.isNaN(momento)) return true;
  return agora.getTime() - momento > LEITURA_ANTIGA_MIN * MS_POR_MIN;
}

// 14h00 de São Paulo, no dia de São Paulo (sem horário de verão desde 2019, o deslocamento é fixo)
export function fimDaFeira(agora) {
  const { ano, mes, dia } = partesEmSaoPaulo(agora);
  const hora = String(FIM_DA_FEIRA_HORA).padStart(2, '0');
  return new Date(`${ano}-${mes}-${dia}T${hora}:00:00-03:00`);
}
