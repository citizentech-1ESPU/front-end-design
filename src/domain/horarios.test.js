import { describe, it, expect } from 'vitest';
import { opcoesDePrazo, opcoesDeRetirada } from './horarios';

const agora = new Date('2026-11-15T12:10:00-03:00');

describe('opcoesDePrazo', () => {
  it('começa no máximo e volta de 30 em 30 min, com pelo menos 15 min de folga', () => {
    const opcoes = opcoesDePrazo('2026-11-15T13:50:00-03:00', agora);
    expect(opcoes.map((o) => o.rotulo)).toEqual(['até 13h50', 'até 13h20', 'até 12h50']);
    expect(opcoes[0].valor).toBe('2026-11-15T16:50:00.000Z');
  });
});

describe('opcoesDeRetirada', () => {
  it('horários cheios de 15 em 15 min até o prazo da oferta', () => {
    expect(opcoesDeRetirada('2026-11-15T13:50:00-03:00', agora).map((o) => o.rotulo))
      .toEqual(['12h30', '12h45', '13h00', '13h15', '13h30', '13h45']);
  });
  it('sem tempo para retirar, lista vazia', () => {
    expect(opcoesDeRetirada('2026-11-15T12:20:00-03:00', agora)).toEqual([]);
  });
});
