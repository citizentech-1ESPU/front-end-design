import { afterEach, describe, it, expect, vi } from 'vitest';
import { interpretarFeed, buscarUltimaLeitura } from './thingspeakService';

afterEach(() => vi.unstubAllGlobals());

describe('interpretarFeed', () => {
  it('converte os campos do canal (design 6.4)', () => {
    const feed = { created_at: '2026-11-15T15:10:00Z', entry_id: 42, field1: '7.8', field2: '140', field3: '2', field4: '1.2', field5: '100' };
    expect(interpretarFeed(feed)).toEqual({
      temperaturaC: 7.8, minutosFora: 140, estadoCodigo: 2, taxaCh: 1.2, minutosRestantes: 100,
      leituraEm: '2026-11-15T15:10:00Z', valida: true,
    });
  });
  it('canal sem dados devolve null', () => {
    expect(interpretarFeed(-1)).toBeNull();
    expect(interpretarFeed('-1')).toBeNull();
    expect(interpretarFeed({})).toBeNull();
  });
  it('temperatura fora da faixa marca leitura inválida', () => {
    const feed = { created_at: '2026-11-15T15:10:00Z', field1: '999', field2: '10', field3: '0', field4: '0', field5: '230' };
    expect(interpretarFeed(feed).valida).toBe(false);
  });
  it('texto que não é número marca leitura inválida', () => {
    const feed = { created_at: '2026-11-15T15:10:00Z', field1: 'abc', field2: '10', field3: '0', field4: '0', field5: '230' };
    expect(interpretarFeed(feed).valida).toBe(false);
  });
});

describe('buscarUltimaLeitura', () => {
  it('sem canal configurado não chama a internet', async () => {
    const fetchFalso = vi.fn();
    vi.stubGlobal('fetch', fetchFalso);
    expect(await buscarUltimaLeitura('')).toBeNull();
    expect(await buscarUltimaLeitura('0')).toBeNull();
    expect(fetchFalso).not.toHaveBeenCalled();
  });
  it('lê a última entrada do canal', async () => {
    const feed = { created_at: '2026-11-15T15:10:00Z', field1: '3.0', field2: '0', field3: '0', field4: '0.2', field5: '240' };
    const fetchFalso = vi.fn(() => Promise.resolve(new Response(JSON.stringify(feed), { status: 200 })));
    vi.stubGlobal('fetch', fetchFalso);
    expect(await buscarUltimaLeitura('123')).toMatchObject({ temperaturaC: 3, estadoCodigo: 0, valida: true });
    expect(fetchFalso).toHaveBeenCalledWith('https://api.thingspeak.com/channels/123/feeds/last.json', expect.any(Object));
  });
  it('resposta de erro vira mensagem amigável', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response('x', { status: 500 }))));
    await expect(buscarUltimaLeitura('123')).rejects.toThrow('O servidor não respondeu. Tente de novo.');
  });
});
