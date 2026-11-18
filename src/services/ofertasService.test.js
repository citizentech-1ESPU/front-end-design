import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { listarOfertas, buscarOferta, criarOferta, atualizarOferta, excluirOferta } from './ofertasService';

const BASE = 'https://teste.mockapi.io/api/v1';
const resposta = (dados, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(dados), { status, headers: { 'Content-Type': 'application/json' } }));

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_MOCKAPI_URL', BASE));
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('ofertasService', () => {
  it('lista as ofertas', async () => {
    const fetchFalso = vi.fn(() => resposta([{ id: '1' }]));
    vi.stubGlobal('fetch', fetchFalso);
    expect(await listarOfertas()).toEqual([{ id: '1' }]);
    expect(fetchFalso).toHaveBeenCalledWith(`${BASE}/ofertas`, expect.objectContaining({ method: 'GET' }));
  });
  it('lista vazia quando o MockAPI responde 404', async () => {
    vi.stubGlobal('fetch', vi.fn(() => resposta('Not found', 404)));
    expect(await listarOfertas()).toEqual([]);
  });
  it('busca uma oferta e devolve null quando não existe', async () => {
    vi.stubGlobal('fetch', vi.fn(() => resposta('Not found', 404)));
    expect(await buscarOferta('999')).toBeNull();
  });
  it('cria com POST e corpo em JSON', async () => {
    const fetchFalso = vi.fn(() => resposta({ id: '9', produto: 'Tomate' }, 201));
    vi.stubGlobal('fetch', fetchFalso);
    expect(await criarOferta({ produto: 'Tomate' })).toEqual({ id: '9', produto: 'Tomate' });
    expect(fetchFalso).toHaveBeenCalledWith(`${BASE}/ofertas`, expect.objectContaining({ method: 'POST', body: JSON.stringify({ produto: 'Tomate' }) }));
  });
  it('atualiza com PUT e exclui com DELETE no id', async () => {
    const fetchFalso = vi.fn(() => resposta({ id: '9' }));
    vi.stubGlobal('fetch', fetchFalso);
    await atualizarOferta('9', { status: 'encerrada' });
    await excluirOferta('9');
    expect(fetchFalso).toHaveBeenNthCalledWith(1, `${BASE}/ofertas/9`, expect.objectContaining({ method: 'PUT' }));
    expect(fetchFalso).toHaveBeenNthCalledWith(2, `${BASE}/ofertas/9`, expect.objectContaining({ method: 'DELETE' }));
  });
  it('sem internet vira mensagem amigável', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))));
    await expect(listarOfertas()).rejects.toThrow('Sem conexão com o servidor. Tente de novo.');
  });
  it('conexão lenta vira mensagem amigável', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new DOMException('tempo esgotado', 'TimeoutError'))));
    await expect(listarOfertas()).rejects.toThrow('A conexão está lenta. Tente de novo.');
  });
  it('erro do servidor vira mensagem amigável', async () => {
    vi.stubGlobal('fetch', vi.fn(() => resposta({}, 500)));
    await expect(criarOferta({})).rejects.toThrow('O servidor não respondeu. Tente de novo.');
  });
});
