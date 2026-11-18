import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { listarReservas, criarReserva, cancelarReserva } from './reservasService';

const BASE = 'https://teste.mockapi.io/api/v1';
const resposta = (dados, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(dados), { status, headers: { 'Content-Type': 'application/json' } }));

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_MOCKAPI_URL', BASE));
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('reservasService', () => {
  it('lista as reservas', async () => {
    const fetchFalso = vi.fn(() => resposta([{ id: '1', ofertaId: '1' }]));
    vi.stubGlobal('fetch', fetchFalso);
    expect(await listarReservas()).toEqual([{ id: '1', ofertaId: '1' }]);
    expect(fetchFalso).toHaveBeenCalledWith(`${BASE}/reservas`, expect.objectContaining({ method: 'GET' }));
  });
  it('lista vazia quando o MockAPI responde 404', async () => {
    vi.stubGlobal('fetch', vi.fn(() => resposta('Not found', 404)));
    expect(await listarReservas()).toEqual([]);
  });
  it('cria com POST e corpo em JSON', async () => {
    const fetchFalso = vi.fn(() => resposta({ id: '3', ofertaId: '1', quantidade: 1 }, 201));
    vi.stubGlobal('fetch', fetchFalso);
    expect(await criarReserva({ ofertaId: '1', quantidade: 1 })).toEqual({ id: '3', ofertaId: '1', quantidade: 1 });
    expect(fetchFalso).toHaveBeenCalledWith(`${BASE}/reservas`, expect.objectContaining({ method: 'POST', body: JSON.stringify({ ofertaId: '1', quantidade: 1 }) }));
  });
  it('cancela com DELETE no id', async () => {
    const fetchFalso = vi.fn(() => resposta({ id: '5' }));
    vi.stubGlobal('fetch', fetchFalso);
    await cancelarReserva('5');
    expect(fetchFalso).toHaveBeenCalledWith(`${BASE}/reservas/5`, expect.objectContaining({ method: 'DELETE' }));
  });
  it('cancelar uma reserva que já não existe conta como cancelada', async () => {
    vi.stubGlobal('fetch', vi.fn(() => resposta('Not found', 404)));
    await expect(cancelarReserva('5')).resolves.toBeUndefined();
  });
  it('erro do servidor sobe para o hook', async () => {
    vi.stubGlobal('fetch', vi.fn(() => resposta({}, 500)));
    await expect(criarReserva({})).rejects.toThrow('O servidor não respondeu. Tente de novo.');
  });
});
