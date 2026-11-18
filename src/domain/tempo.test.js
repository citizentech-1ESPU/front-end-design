import { describe, it, expect } from 'vitest';
import { somarMinutos, formatarDuracao, formatarHora, leituraAntiga, fimDaFeira } from './tempo';

describe('somarMinutos', () => {
  it('soma minutos a uma data', () => {
    expect(somarMinutos(new Date('2026-11-15T12:10:00-03:00'), 100).toISOString()).toBe('2026-11-15T16:50:00.000Z');
  });
});

describe('formatarDuracao', () => {
  it('mostra minutos abaixo de 1 hora', () => {
    expect(formatarDuracao(0)).toBe('0 min');
    expect(formatarDuracao(45)).toBe('45 min');
  });
  it('mostra horas e minutos no jeito da feira', () => {
    expect(formatarDuracao(60)).toBe('1h');
    expect(formatarDuracao(140)).toBe('2h20');
    expect(formatarDuracao(245)).toBe('4h05');
  });
  it('arredonda minutos quebrados para baixo', () => {
    expect(formatarDuracao(140.9)).toBe('2h20');
  });
});

describe('formatarHora', () => {
  it('usa o fuso de São Paulo e o formato 13h50', () => {
    expect(formatarHora('2026-11-15T16:50:00Z')).toBe('13h50');
    expect(formatarHora(new Date('2026-11-15T12:05:00-03:00'))).toBe('12h05');
    expect(formatarHora('2026-11-16T03:00:00Z')).toBe('00h00');
  });
});

describe('leituraAntiga', () => {
  const agora = new Date('2026-11-15T12:10:00-03:00');
  it('aceita leitura de até 2 minutos', () => {
    expect(leituraAntiga('2026-11-15T15:08:00Z', agora)).toBe(false);
  });
  it('marca leitura com mais de 2 minutos', () => {
    expect(leituraAntiga('2026-11-15T15:07:59Z', agora)).toBe(true);
  });
  it('marca leitura ausente ou inválida', () => {
    expect(leituraAntiga(null, agora)).toBe(true);
    expect(leituraAntiga('ontem', agora)).toBe(true);
  });
});

describe('fimDaFeira', () => {
  it('é 14h00 de São Paulo no mesmo dia', () => {
    expect(fimDaFeira(new Date('2026-11-15T12:00:00-03:00')).toISOString()).toBe('2026-11-15T17:00:00.000Z');
  });
  it('usa o dia de São Paulo mesmo quando em UTC já é o dia seguinte', () => {
    expect(fimDaFeira(new Date('2026-11-16T02:30:00Z')).toISOString()).toBe('2026-11-15T17:00:00.000Z');
  });
});
