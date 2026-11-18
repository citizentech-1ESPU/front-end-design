import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useOferta } from './useOferta';
import { buscarOferta } from '@/services/ofertasService';
import { listarReservas } from '@/services/reservasService';

vi.mock('@/services/ofertasService', () => ({
  listarOfertas: vi.fn(), buscarOferta: vi.fn(), criarOferta: vi.fn(), atualizarOferta: vi.fn(), excluirOferta: vi.fn(),
}));
vi.mock('@/services/reservasService', () => ({ listarReservas: vi.fn(), criarReserva: vi.fn(), cancelarReserva: vi.fn() }));

const daqui = (minutos) => new Date(Date.now() + minutos * 60000).toISOString();
const oferta = (extra) => ({
  id: '1', produto: 'Tilápia (filé)', categoria: 'peixe', unidade: 'kg', quantidade: 6, precoNormal: 39.9, precoXepa: 29.9,
  venderAte: daqui(60), status: 'ativa', aceitaDoacao: true, banca: 'Banca Mar Azul', distanciaM: 350, ...extra,
});

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_MODO_DEMO', 'false'));
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });

describe('useOferta', () => {
  it('oferta que não existe vem null, sem erro', async () => {
    buscarOferta.mockResolvedValue(null);
    listarReservas.mockResolvedValue([]);
    const { result } = renderHook(() => useOferta('999'));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    expect(result.current).toMatchObject({ oferta: null, erro: null });
  });
  it('calcula o disponível com as reservas da oferta', async () => {
    buscarOferta.mockResolvedValue(oferta({ id: '1', quantidade: 6 }));
    listarReservas.mockResolvedValue([{ id: 'r1', ofertaId: '1', quantidade: 2 }, { id: 'r2', ofertaId: '10', quantidade: 9 }]);
    const { result } = renderHook(() => useOferta('1'));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    expect(result.current.disponivel).toBe(4);
    expect(result.current.reservas).toHaveLength(1);
    expect(result.current.oferta).toMatchObject({ id: '1', disponivel: 4, ativa: true });
  });
  it('sem id na página não chama a internet', async () => {
    const { result } = renderHook(() => useOferta(null));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    expect(result.current.oferta).toBeNull();
    expect(buscarOferta).not.toHaveBeenCalled();
  });
});
