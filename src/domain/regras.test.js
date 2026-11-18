import { describe, it, expect } from 'vitest';
import {
  estadoPorCodigo, minutosAte5C, calcularEstado, minutosRestantes, prazoMaximo,
  prazoPadraoSemCaixa, podeAnunciar, podeDoar, disponivel, estaAtiva,
} from './regras';

describe('estadoPorCodigo', () => {
  it('traduz o código do ThingSpeak', () => {
    expect(estadoPorCodigo(0)).toBe('normal');
    expect(estadoPorCodigo('2')).toBe('xepa');
    expect(estadoPorCodigo(4)).toBe('sensor');
  });
  it('código desconhecido vira sensor', () => {
    expect(estadoPorCodigo(9)).toBe('sensor');
    expect(estadoPorCodigo('abc')).toBe('sensor');
  });
});

describe('minutosAte5C', () => {
  it('calcula quando está esquentando abaixo de 5 °C', () => {
    expect(minutosAte5C(4.6, 2)).toBeCloseTo(12);
  });
  it('é null quando esfria, está parado, já passou de 5 °C ou não tem leitura', () => {
    expect(minutosAte5C(4.6, -1)).toBeNull();
    expect(minutosAte5C(4.6, 0)).toBeNull();
    expect(minutosAte5C(5.2, 2)).toBeNull();
    expect(minutosAte5C(null, 2)).toBeNull();
  });
});

describe('calcularEstado', () => {
  it('normal: frio e sem risco', () => {
    expect(calcularEstado({ temperaturaC: 3, taxaCh: 0.5, minutosFora: 0 })).toBe('normal');
  });
  it('gelo: vai passar de 5 °C em até 15 min', () => {
    expect(calcularEstado({ temperaturaC: 4.6, taxaCh: 2, minutosFora: 30 })).toBe('gelo');
  });
  it('normal: vai passar de 5 °C, mas só daqui a 30 min', () => {
    expect(calcularEstado({ temperaturaC: 4, taxaCh: 2, minutosFora: 0 })).toBe('normal');
  });
  it('gelo: acima de 5 °C com menos de 2h fora do frio', () => {
    expect(calcularEstado({ temperaturaC: 6, taxaCh: 0, minutosFora: 30 })).toBe('gelo');
  });
  it('xepa: de 120 a 239 min fora, mesmo que a caixa esfrie', () => {
    expect(calcularEstado({ temperaturaC: 3, taxaCh: -2, minutosFora: 120 })).toBe('xepa');
    expect(calcularEstado({ temperaturaC: 7.8, taxaCh: 1.2, minutosFora: 239 })).toBe('xepa');
  });
  it('descarte: 240 min ou mais', () => {
    expect(calcularEstado({ temperaturaC: 3.9, taxaCh: -1.5, minutosFora: 240 })).toBe('descarte');
  });
  it('sensor: leitura fora da faixa ou ausente vence tudo', () => {
    expect(calcularEstado({ temperaturaC: 100, taxaCh: 0, minutosFora: 250 })).toBe('sensor');
    expect(calcularEstado({ temperaturaC: -127, taxaCh: 0, minutosFora: 0 })).toBe('sensor');
    expect(calcularEstado({ temperaturaC: null, taxaCh: null, minutosFora: 0 })).toBe('sensor');
  });
});

describe('minutosRestantes', () => {
  it('conta até 240 e nunca fica negativo', () => {
    expect(minutosRestantes(140)).toBe(100);
    expect(minutosRestantes(250)).toBe(0);
  });
});

describe('prazoMaximo', () => {
  const agora = new Date('2026-11-15T12:10:00-03:00');
  const umaDaTarde = new Date('2026-11-15T13:00:00-03:00');
  it('é agora mais os minutos restantes', () => {
    expect(prazoMaximo({ agora, minutosRestantes: 100, modoDemo: false }).toISOString()).toBe('2026-11-15T16:50:00.000Z');
  });
  it('não passa das 14h fora do modo demonstração', () => {
    expect(prazoMaximo({ agora: umaDaTarde, minutosRestantes: 100, modoDemo: false }).toISOString()).toBe('2026-11-15T17:00:00.000Z');
  });
  it('no modo demonstração ignora o fim da feira', () => {
    expect(prazoMaximo({ agora: umaDaTarde, minutosRestantes: 100, modoDemo: true }).toISOString()).toBe('2026-11-15T17:40:00.000Z');
  });
});

describe('prazoPadraoSemCaixa', () => {
  it('é o fim da feira', () => {
    const agora = new Date('2026-11-15T12:10:00-03:00');
    expect(prazoPadraoSemCaixa({ agora, modoDemo: false }).toISOString()).toBe('2026-11-15T17:00:00.000Z');
  });
  it('no modo demonstração é daqui a 2 horas, mesmo de noite', () => {
    const agora = new Date('2026-11-15T22:00:00-03:00');
    expect(prazoPadraoSemCaixa({ agora, modoDemo: true }).toISOString()).toBe('2026-11-16T03:00:00.000Z');
  });
});

describe('podeAnunciar', () => {
  const agora = new Date('2026-11-15T12:10:00-03:00');
  const base = { estado: 'xepa', leituraAntiga: false, minutosRestantes: 100, leituraEm: '2026-11-15T15:09:30Z' };
  const fora = { agora, modoDemo: false };
  it('libera caixa com leitura recente', () => {
    expect(podeAnunciar(base, fora)).toEqual({ pode: true, motivo: null });
  });
  it('bloqueia descarte', () => {
    expect(podeAnunciar({ ...base, estado: 'descarte', minutosRestantes: 0 }, fora))
      .toEqual({ pode: false, motivo: 'Caixa no descarte. Não venda nem doe.' });
  });
  it('bloqueia caixa sem leitura do sensor', () => {
    expect(podeAnunciar({ ...base, estado: 'sensor' }, fora).motivo).toBe('Sem leitura da caixa. Confira o sensor.');
  });
  it('bloqueia leitura antiga e diz o horário da última', () => {
    expect(podeAnunciar({ ...base, leituraAntiga: true, leituraEm: '2026-11-15T15:01:00Z' }, fora).motivo)
      .toBe('Sem leitura recente da caixa (última às 12h01). Confira a conexão.');
  });
  it('bloqueia depois do fim da feira, menos no modo demonstração', () => {
    const tarde = new Date('2026-11-15T14:30:00-03:00');
    expect(podeAnunciar(base, { agora: tarde, modoDemo: false }).motivo).toBe('A feira já acabou por hoje.');
    expect(podeAnunciar(base, { agora: tarde, modoDemo: true }).pode).toBe(true);
  });
});

describe('podeDoar', () => {
  it('peixe e queijo só com caixa térmica', () => {
    expect(podeDoar({ categoria: 'peixe', temCaixaTermica: false })).toBe(false);
    expect(podeDoar({ categoria: 'queijo', temCaixaTermica: true })).toBe(true);
  });
  it('fruta e verdura sempre', () => {
    expect(podeDoar({ categoria: 'fruta', temCaixaTermica: false })).toBe(true);
  });
});

describe('disponivel', () => {
  it('desconta só as reservas da própria oferta (o id 10 não é o 1)', () => {
    const reservas = [
      { ofertaId: '1', quantidade: 2 },
      { ofertaId: '10', quantidade: 5 },
      { ofertaId: '1', quantidade: 1 },
    ];
    expect(disponivel({ id: '1', quantidade: 6 }, reservas)).toBe(3);
  });
  it('nunca fica negativo', () => {
    expect(disponivel({ id: '1', quantidade: 1 }, [{ ofertaId: '1', quantidade: 3 }])).toBe(0);
  });
});

describe('estaAtiva', () => {
  const agora = new Date('2026-11-15T12:10:00-03:00');
  it('ativa com prazo no futuro', () => {
    expect(estaAtiva({ status: 'ativa', venderAte: '2026-11-15T13:50:00-03:00' }, agora)).toBe(true);
  });
  it('vencida ou encerrada não está ativa', () => {
    expect(estaAtiva({ status: 'ativa', venderAte: '2026-11-15T12:00:00-03:00' }, agora)).toBe(false);
    expect(estaAtiva({ status: 'encerrada', venderAte: '2026-11-15T13:50:00-03:00' }, agora)).toBe(false);
  });
});
