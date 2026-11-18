import { describe, it, expect } from 'vitest';
import { montarOfertasDemo } from './ofertasDemo.mjs';

const CAMPOS_OFERTA = ['aceitaDoacao', 'banca', 'caixaId', 'categoria', 'conferidaEm', 'criadaEm', 'distanciaM', 'emoji', 'feira',
  'fonteCaixa', 'precoNormal', 'precoXepa', 'produto', 'quantidade', 'status', 'temperaturaC', 'unidade', 'venderAte'];

describe('montarOfertasDemo', () => {
  const agora = new Date('2026-11-15T12:10:00-03:00');
  const ofertas = montarOfertasDemo(agora);
  it('cria as 6 ofertas com prazos contados a partir de agora', () => {
    expect(ofertas).toHaveLength(6);
    expect(ofertas[0]).toMatchObject({ produto: 'Tilápia (filé)', venderAte: '2026-11-15T16:50:00.000Z', status: 'ativa' });
  });
  it('xepa sempre mais barata e só campos do contrato (nada de dado pessoal)', () => {
    ofertas.forEach((o) => {
      expect(o.precoXepa).toBeLessThan(o.precoNormal);
      expect(Object.keys(o).sort()).toEqual(CAMPOS_OFERTA);
    });
  });
  it('funciona de madrugada também (prazo no dia seguinte)', () => {
    const tarde = montarOfertasDemo(new Date('2026-11-15T23:30:00-03:00'));
    expect(new Date(tarde[0].venderAte).getTime()).toBeGreaterThan(new Date('2026-11-15T23:30:00-03:00').getTime());
  });
  it('a leitura da caixa vem antes de agora e produto sem caixa não tem leitura', () => {
    expect(ofertas[0].conferidaEm).toBe('2026-11-15T15:08:00.000Z');
    expect(ofertas[0].criadaEm).toBe('2026-11-15T14:55:00.000Z');
    expect(ofertas[3]).toMatchObject({ produto: 'Banana prata', caixaId: null, fonteCaixa: null, temperaturaC: null, conferidaEm: null });
  });
});
