import { DESCONTO_SUGERIDO } from './constantes';

// 25% de desconto, arredondado para baixo em 10 centavos. A conta é feita em centavos inteiros
// para fugir do erro de vírgula flutuante (é o que faz 2.8 dar 2.1).
export function precoSugerido(precoNormal) {
  if (!Number.isFinite(precoNormal) || precoNormal <= 0) return null;
  return Math.floor((Math.round(precoNormal * 100) * (1 - DESCONTO_SUGERIDO)) / 10) / 10;
}

const formatoReais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// 29.9 → 'R$ 29,90' (com espaço inseparável)
export function formatarPreco(valor) {
  return formatoReais.format(valor);
}

const formatoNumero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const PLURAIS = { dúzia: 'dúzias', maço: 'maços', unidade: 'unidades' };

// 3, 'dúzia' → '3 dúzias'; 2.5, 'kg' → '2,5 kg'
export function formatarQuantidade(quantidade, unidade) {
  const nome = quantidade > 1 ? PLURAIS[unidade] ?? unidade : unidade;
  return `${formatoNumero.format(quantidade)} ${nome}`;
}

// Lê o número que a pessoa digitou, aceitando vírgula ("29,90") ou ponto ("29.90"). Vazio vira NaN.
export function lerNumero(valor) {
  if (typeof valor === 'number') return valor;
  const texto = String(valor ?? '').trim().replace(/\s/g, '');
  if (!texto) return Number.NaN;
  return Number(texto.includes(',') ? texto.replace(/\./g, '').replace(',', '.') : texto);
}
