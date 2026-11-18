import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useReservas } from './useReservas';
import { buscarOferta, listarOfertas } from '@/services/ofertasService';
import { listarReservas, criarReserva, cancelarReserva } from '@/services/reservasService';

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
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); localStorage.clear(); });

describe('useReservas', () => {
  it('reservar grava o id no navegador e devolve a reserva', async () => {
    buscarOferta.mockResolvedValue(oferta({ id: '1', quantidade: 6 }));
    listarOfertas.mockResolvedValue([oferta({ id: '1', quantidade: 6 })]);
    listarReservas.mockResolvedValue([]);
    criarReserva.mockResolvedValue({ id: 'r9', ofertaId: '1', tipo: 'compra', quantidade: 2, apelido: 'Ana' });
    const { result } = renderHook(() => useReservas('compra'));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    let resposta;
    await act(async () => { resposta = await result.current.reservar({ ofertaId: '1', quantidade: 2, apelido: ' Ana ' }); });
    expect(resposta.ok).toBe(true);
    expect(criarReserva).toHaveBeenCalledWith(expect.objectContaining({ ofertaId: '1', tipo: 'compra', quantidade: 2, apelido: 'Ana' }));
    expect(JSON.parse(localStorage.getItem('xepa-certa:reservas'))).toEqual(['r9']);
  });
  it('não reserva mais do que o disponível', async () => {
    buscarOferta.mockResolvedValue(oferta({ id: '1', quantidade: 3 }));
    listarOfertas.mockResolvedValue([oferta({ id: '1', quantidade: 3 })]);
    listarReservas.mockResolvedValue([{ id: 'x', ofertaId: '1', quantidade: 2 }]);
    const { result } = renderHook(() => useReservas('compra'));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    let resposta;
    await act(async () => { resposta = await result.current.reservar({ ofertaId: '1', quantidade: 2, apelido: 'Ana' }); });
    expect(resposta).toEqual({ ok: false, erros: { quantidade: 'Só tem 1 kg para reservar.' } });
    expect(criarReserva).not.toHaveBeenCalled();
  });
  it('oferta encerrada não aceita reserva', async () => {
    buscarOferta.mockResolvedValue(oferta({ id: '1', status: 'encerrada' }));
    listarOfertas.mockResolvedValue([]);
    listarReservas.mockResolvedValue([]);
    const { result } = renderHook(() => useReservas('compra'));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    let resposta;
    await act(async () => { resposta = await result.current.reservar({ ofertaId: '1', quantidade: 1, apelido: 'Ana' }); });
    expect(resposta).toEqual({ ok: false, erros: { geral: 'Essa oferta não está mais disponível.' } });
  });
  it('doação guarda o horário escolhido e a caixa térmica', async () => {
    buscarOferta.mockResolvedValue(oferta({ id: '1', categoria: 'peixe' }));
    listarOfertas.mockResolvedValue([]);
    listarReservas.mockResolvedValue([]);
    criarReserva.mockResolvedValue({ id: 'd1' });
    const retirarAte = daqui(30);
    const { result } = renderHook(() => useReservas('doacao'));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    await act(async () => {
      await result.current.reservar({ ofertaId: '1', quantidade: 1, apelido: 'Cozinha Esperança', retirarAte, temCaixaTermica: true });
    });
    expect(criarReserva).toHaveBeenCalledWith(expect.objectContaining({ tipo: 'doacao', retirarAte, temCaixaTermica: true }));
  });
  it('limpa do navegador as reservas que não existem mais e mostra oferta excluída como null', async () => {
    localStorage.setItem('xepa-certa:reservas', JSON.stringify(['r1', 'sumiu']));
    listarReservas.mockResolvedValue([{ id: 'r1', ofertaId: '77', tipo: 'compra', quantidade: 1, apelido: 'Ana' }]);
    listarOfertas.mockResolvedValue([]);
    const { result } = renderHook(() => useReservas('compra'));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    expect(result.current.reservas).toHaveLength(1);
    expect(result.current.reservas[0].oferta).toBeNull();
    expect(JSON.parse(localStorage.getItem('xepa-certa:reservas'))).toEqual(['r1']);
  });
  it('cancelar tira a reserva do navegador', async () => {
    localStorage.setItem('xepa-certa:reservas', JSON.stringify(['r1']));
    listarReservas.mockResolvedValueOnce([{ id: 'r1', ofertaId: '1', tipo: 'compra', quantidade: 1, apelido: 'Ana' }]).mockResolvedValue([]);
    listarOfertas.mockResolvedValue([oferta({ id: '1' })]);
    cancelarReserva.mockResolvedValue();
    const { result } = renderHook(() => useReservas('compra'));
    await waitFor(() => expect(result.current.reservas).toHaveLength(1));
    await act(async () => { await result.current.cancelar('r1'); });
    expect(JSON.parse(localStorage.getItem('xepa-certa:reservas'))).toEqual([]);
  });
});
