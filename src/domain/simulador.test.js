import { describe, it, expect } from 'vitest';
import { leituraSimulada } from './simulador';

const inicio = new Date('2026-11-15T12:00:00-03:00');
const depoisDe = (minutos) => new Date(inicio.getTime() + minutos * 60000);

describe('leituraSimulada (design 6.6)', () => {
  it('gelo: 4,6 °C subindo 2 °C por hora, 30 min fora', () => {
    expect(leituraSimulada('gelo', inicio, inicio)).toMatchObject({ temperaturaC: 4.6, taxaCh: 2, minutosFora: 30, valida: true });
  });
  it('gelo: passa de 5 °C depois de 12 min e começa a somar', () => {
    const leitura = leituraSimulada('gelo', inicio, depoisDe(18));
    expect(leitura.temperaturaC).toBeCloseTo(5.2);
    expect(leitura.minutosFora).toBeCloseTo(36);
  });
  it('xepa: 7,8 °C e 2h20 que crescem em tempo real', () => {
    expect(leituraSimulada('xepa', inicio, depoisDe(10))).toMatchObject({ temperaturaC: 7.8, minutosFora: 150 });
  });
  it('descarte: 3,9 °C com gelo reposto e 4h10 fora', () => {
    expect(leituraSimulada('descarte', inicio, inicio)).toMatchObject({ temperaturaC: 3.9, taxaCh: -1.5, minutosFora: 250 });
  });
  it('leitura simulada é sempre recente', () => {
    expect(leituraSimulada('xepa', inicio, depoisDe(5)).leituraEm).toBe(depoisDe(5).toISOString());
  });
});
