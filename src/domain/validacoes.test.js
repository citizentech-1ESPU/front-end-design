import { describe, it, expect } from 'vitest';
import { validarOferta, validarReserva } from './validacoes';

const agora = new Date('2026-11-15T12:10:00-03:00');

describe('validarOferta', () => {
  const prazoMaximo = new Date('2026-11-15T13:50:00-03:00');
  const valida = {
    produto: 'Tilápia (filé)', categoria: 'peixe', unidade: 'kg', quantidade: 6,
    precoNormal: 39.9, precoXepa: 29.9, venderAte: '2026-11-15T13:50:00-03:00',
  };
  const ctx = { agora, prazoMaximo };
  it('aceita oferta válida', () => {
    expect(validarOferta(valida, ctx)).toEqual({});
  });
  it('aceita preço e quantidade digitados com vírgula', () => {
    expect(validarOferta({ ...valida, quantidade: '2,5', precoNormal: '39,90', precoXepa: '29,90' }, ctx)).toEqual({});
  });
  it('produto obrigatório', () => {
    expect(validarOferta({ ...valida, produto: ' ' }, ctx).produto).toBe('Diga qual é o produto.');
  });
  it('quantidade e preços maiores que zero', () => {
    const erros = validarOferta({ ...valida, quantidade: 0, precoNormal: 0, precoXepa: 0 }, ctx);
    expect(erros.quantidade).toBe('A quantidade precisa ser maior que zero.');
    expect(erros.precoNormal).toBe('Informe o preço normal.');
    expect(erros.precoXepa).toBe('Informe o preço da xepa.');
  });
  it('xepa mais barata que o normal', () => {
    expect(validarOferta({ ...valida, precoXepa: 39.9 }, ctx).precoXepa).toBe('O preço da xepa precisa ser menor que o normal.');
  });
  it('prazo até o limite seguro e no futuro', () => {
    expect(validarOferta({ ...valida, venderAte: '2026-11-15T14:00:00-03:00' }, ctx).venderAte).toBe('O prazo passou do limite seguro (até 13h50).');
    expect(validarOferta({ ...valida, venderAte: '2026-11-15T12:00:00-03:00' }, ctx).venderAte).toBe('Esse horário já passou.');
  });
});

describe('validarReserva', () => {
  const ctx = { disponivel: 3, categoria: 'peixe', unidade: 'kg', venderAte: '2026-11-15T13:50:00-03:00', agora };
  it('aceita reserva válida', () => {
    expect(validarReserva({ tipo: 'compra', quantidade: 1, apelido: 'Ana' }, ctx)).toEqual({});
  });
  it('quantidade entre 1 e o disponível', () => {
    expect(validarReserva({ tipo: 'compra', quantidade: 4, apelido: 'Ana' }, ctx).quantidade).toBe('Só tem 3 kg para reservar.');
    expect(validarReserva({ tipo: 'compra', quantidade: 0, apelido: 'Ana' }, ctx).quantidade).toBe('Escolha pelo menos 1.');
  });
  it('apelido curto e sem telefone', () => {
    expect(validarReserva({ tipo: 'compra', quantidade: 1, apelido: '' }, ctx).apelido).toBe('Escreva um apelido para a banca chamar você.');
    expect(validarReserva({ tipo: 'compra', quantidade: 1, apelido: 'a'.repeat(31) }, ctx).apelido).toBe('Use um apelido de até 30 letras.');
    expect(validarReserva({ tipo: 'compra', quantidade: 1, apelido: 'Ana 11 98765-4321' }, ctx).apelido).toBe('Não coloque telefone. Só um apelido.');
    expect(validarReserva({ tipo: 'compra', quantidade: 1, apelido: 'Turma 2026' }, ctx)).toEqual({});
  });
  it('doação de peixe ou queijo só com caixa térmica', () => {
    const dados = { tipo: 'doacao', quantidade: 1, apelido: 'Cozinha Esperança', retirarAte: '2026-11-15T13:00:00-03:00', temCaixaTermica: false };
    expect(validarReserva(dados, ctx).temCaixaTermica).toBe('Para levar peixe ou queijo, precisa de caixa térmica.');
  });
  it('doação precisa de horário até o prazo da oferta', () => {
    const fruta = { ...ctx, categoria: 'fruta' };
    expect(validarReserva({ tipo: 'doacao', quantidade: 1, apelido: 'Cozinha Esperança' }, fruta).retirarAte).toBe('Escolha um horário de retirada.');
    expect(validarReserva({ tipo: 'doacao', quantidade: 1, apelido: 'Cozinha Esperança', retirarAte: '2026-11-15T14:00:00-03:00' }, fruta).retirarAte).toBe('Escolha um horário até 13h50.');
  });
});
