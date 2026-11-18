import { describe, it, expect } from 'vitest';
import { precoSugerido, formatarPreco, formatarQuantidade, lerNumero } from './precos';

describe('precoSugerido', () => {
  it('dá 25% de desconto e arredonda para baixo em 10 centavos', () => {
    expect(precoSugerido(39.9)).toBe(29.9);
    expect(precoSugerido(10)).toBe(7.5);
    expect(precoSugerido(12.5)).toBe(9.3);
    expect(precoSugerido(18)).toBe(13.5);
    expect(precoSugerido(2.8)).toBe(2.1);
  });
  it('devolve null para preço inválido', () => {
    expect(precoSugerido(0)).toBeNull();
    expect(precoSugerido(-5)).toBeNull();
    expect(precoSugerido(Number.NaN)).toBeNull();
  });
});

describe('formatarPreco', () => {
  it('usa reais no formato brasileiro', () => {
    expect(formatarPreco(29.9)).toBe('R$\u00a029,90');
    expect(formatarPreco(1234.5)).toBe('R$\u00a01.234,50');
  });
});

describe('formatarQuantidade', () => {
  it('escreve a unidade no singular ou no plural', () => {
    expect(formatarQuantidade(3, 'kg')).toBe('3 kg');
    expect(formatarQuantidade(2.5, 'kg')).toBe('2,5 kg');
    expect(formatarQuantidade(1, 'dúzia')).toBe('1 dúzia');
    expect(formatarQuantidade(3, 'dúzia')).toBe('3 dúzias');
    expect(formatarQuantidade(2, 'maço')).toBe('2 maços');
    expect(formatarQuantidade(5, 'unidade')).toBe('5 unidades');
  });
});

describe('lerNumero', () => {
  it('aceita vírgula e ponto, como a pessoa digitar', () => {
    expect(lerNumero('29,90')).toBe(29.9);
    expect(lerNumero('29.9')).toBe(29.9);
    expect(lerNumero('1.234,50')).toBe(1234.5);
    expect(lerNumero(6)).toBe(6);
  });
  it('vazio ou texto vira NaN', () => {
    expect(lerNumero('')).toBeNaN();
    expect(lerNumero('abc')).toBeNaN();
  });
});
