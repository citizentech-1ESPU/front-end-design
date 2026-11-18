import { describe, it, expect } from 'vitest';
import { montarCaixa } from './montarCaixa';
import { CAMPOS_CAIXA } from '@/data/falsos';

const config = { id: 'caixa-1', nome: 'Tilápia', emoji: '🐟', categoria: 'peixe', fonte: 'sensor' };
const agora = new Date('2026-11-15T12:10:00-03:00');
const opcoes = { agora, modoDemo: false };

describe('montarCaixa', () => {
  it('usa o estado que a caixa mandou e calcula o prazo', () => {
    const leitura = { temperaturaC: 7.8, minutosFora: 140, estadoCodigo: 2, taxaCh: 1.2, minutosRestantes: 100, leituraEm: '2026-11-15T15:09:40Z', valida: true };
    const caixa = montarCaixa(config, leitura, opcoes);
    expect(Object.keys(caixa).sort()).toEqual(CAMPOS_CAIXA);
    expect(caixa).toMatchObject({
      id: 'caixa-1', estado: 'xepa', minutosFora: 140, minutosRestantes: 100, minutosAte5C: null,
      leituraAntiga: false, prazoMaximo: '2026-11-15T16:50:00.000Z', podeAnunciar: true, motivoBloqueio: null,
    });
  });
  it('sem leitura vira sensor e bloqueia o anúncio', () => {
    expect(montarCaixa(config, null, opcoes)).toMatchObject({
      estado: 'sensor', temperaturaC: null, leituraAntiga: true, prazoMaximo: null, podeAnunciar: false,
    });
  });
  it('leitura inválida vira sensor', () => {
    const leitura = { temperaturaC: 999, minutosFora: 10, estadoCodigo: 0, taxaCh: 0, minutosRestantes: 230, leituraEm: '2026-11-15T15:09:40Z', valida: false };
    expect(montarCaixa(config, leitura, opcoes).estado).toBe('sensor');
  });
  it('caixa simulada calcula o estado pelas regras', () => {
    const leitura = { temperaturaC: 4.6, taxaCh: 2, minutosFora: 30, leituraEm: agora.toISOString(), valida: true };
    const caixa = montarCaixa({ ...config, id: 'caixa-2', fonte: 'simulada' }, leitura, opcoes);
    expect(caixa).toMatchObject({ estado: 'gelo', minutosAte5C: 12, minutosRestantes: 210 });
  });
  it('não leva para o objeto os campos extras da configuração', () => {
    const caixa = montarCaixa({ ...config, produtoSugerido: 'Tilápia (filé)', unidade: 'kg' }, null, opcoes);
    expect(Object.keys(caixa).sort()).toEqual(CAMPOS_CAIXA);
  });
});
