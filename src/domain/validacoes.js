import { CATEGORIAS_COM_FRIO } from './constantes';
import { formatarQuantidade, lerNumero } from './precos';
import { formatarHora } from './tempo';

const MAX_APELIDO = 30;
const DIGITOS_DE_TELEFONE = 8;

const numero = (valor) => (valor === null || valor === undefined ? Number.NaN : lerNumero(valor));
const positivo = (valor) => Number.isFinite(numero(valor)) && numero(valor) > 0;
const momento = (data) => new Date(data).getTime();

// Devolve { campo: mensagem }; objeto vazio quando está tudo certo
export function validarOferta(valores, { agora, prazoMaximo }) {
  const erros = {};
  if (!String(valores.produto ?? '').trim()) erros.produto = 'Diga qual é o produto.';
  if (!valores.categoria) erros.categoria = 'Escolha o tipo do produto.';
  if (!positivo(valores.quantidade)) erros.quantidade = 'A quantidade precisa ser maior que zero.';
  if (!positivo(valores.precoNormal)) erros.precoNormal = 'Informe o preço normal.';
  if (!positivo(valores.precoXepa)) {
    erros.precoXepa = 'Informe o preço da xepa.';
  } else if (positivo(valores.precoNormal) && numero(valores.precoXepa) >= numero(valores.precoNormal)) {
    erros.precoXepa = 'O preço da xepa precisa ser menor que o normal.';
  }
  if (!valores.venderAte || Number.isNaN(momento(valores.venderAte))) {
    erros.venderAte = 'Escolha até quando vender.';
  } else if (momento(valores.venderAte) <= agora.getTime()) {
    erros.venderAte = 'Esse horário já passou.';
  } else if (prazoMaximo && momento(valores.venderAte) > momento(prazoMaximo)) {
    erros.venderAte = `O prazo passou do limite seguro (até ${formatarHora(prazoMaximo)}).`;
  }
  return erros;
}

export function validarReserva(dados, { disponivel, categoria, unidade, venderAte }) {
  const erros = {};
  const quantidade = numero(dados.quantidade);
  if (!Number.isFinite(quantidade) || quantidade < 1) {
    erros.quantidade = 'Escolha pelo menos 1.';
  } else if (quantidade > disponivel) {
    erros.quantidade = `Só tem ${formatarQuantidade(disponivel, unidade)} para reservar.`;
  }

  const apelido = String(dados.apelido ?? '').trim();
  const digitos = (apelido.match(/\d/g) ?? []).length;
  if (!apelido) erros.apelido = 'Escreva um apelido para a banca chamar você.';
  else if (apelido.length > MAX_APELIDO) erros.apelido = `Use um apelido de até ${MAX_APELIDO} letras.`;
  else if (digitos >= DIGITOS_DE_TELEFONE) erros.apelido = 'Não coloque telefone. Só um apelido.';

  if (dados.tipo === 'doacao') {
    if (CATEGORIAS_COM_FRIO.includes(categoria) && !dados.temCaixaTermica) {
      erros.temCaixaTermica = 'Para levar peixe ou queijo, precisa de caixa térmica.';
    }
    if (!dados.retirarAte) erros.retirarAte = 'Escolha um horário de retirada.';
    else if (momento(dados.retirarAte) > momento(venderAte)) erros.retirarAte = `Escolha um horário até ${formatarHora(venderAte)}.`;
  }
  return erros;
}
