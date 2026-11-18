import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useOfertas } from './useOfertas';
import { listarOfertas, criarOferta, excluirOferta, atualizarOferta } from '@/services/ofertasService';
import { listarReservas, cancelarReserva } from '@/services/reservasService';
import { recriarDemo } from '@/services/demoService';

vi.mock('@/services/demoService', () => ({ recriarDemo: vi.fn() }));

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

describe('useOfertas', () => {
  it('freguês vê só ativas com disponível, da mais perto para a mais longe', async () => {
    listarOfertas.mockResolvedValue([
      oferta({ id: '1', distanciaM: 900 }),
      oferta({ id: '2', distanciaM: 300 }),
      oferta({ id: '3', venderAte: daqui(-5) }),
      oferta({ id: '4', status: 'encerrada' }),
      oferta({ id: '5', quantidade: 2 }),
    ]);
    listarReservas.mockResolvedValue([{ id: 'r1', ofertaId: '5', quantidade: 2 }]);
    const { result } = renderHook(() => useOfertas('fregues'));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    expect(result.current.ofertas.map((o) => o.id)).toEqual(['2', '1']);
    expect(result.current.ofertas[0]).toMatchObject({ disponivel: 6, ativa: true });
    expect(result.current.ofertas[0].linkWhatsApp).toMatch(/^https:\/\/wa\.me\/\?text=/);
  });
  it('ONG vê só o que aceita doação e sabe o que precisa de caixa térmica', async () => {
    listarOfertas.mockResolvedValue([
      oferta({ id: '1', categoria: 'peixe' }),
      oferta({ id: '2', categoria: 'fruta' }),
      oferta({ id: '3', aceitaDoacao: false }),
    ]);
    listarReservas.mockResolvedValue([]);
    const { result } = renderHook(() => useOfertas('ong', { temCaixaTermica: false }));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    expect(result.current.ofertas.map((o) => o.id)).toEqual(['1', '2']);
    expect(result.current.ofertas[0]).toMatchObject({ podeDoar: false, motivoDoacao: 'Precisa de caixa térmica.' });
    expect(result.current.ofertas[1]).toMatchObject({ podeDoar: true, motivoDoacao: null });
  });
  it('feirante vê só a própria banca, inclusive as encerradas', async () => {
    listarOfertas.mockResolvedValue([
      oferta({ id: '1' }),
      oferta({ id: '2', status: 'encerrada' }),
      oferta({ id: '3', banca: 'Hortifrúti Bom Preço' }),
    ]);
    listarReservas.mockResolvedValue([]);
    const { result } = renderHook(() => useOfertas('feirante'));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    expect(result.current.ofertas.map((o) => [o.id, o.ativa])).toEqual([['1', true], ['2', false]]);
  });
  it('excluir apaga antes as reservas da oferta (e só dela)', async () => {
    listarOfertas.mockResolvedValue([oferta({ id: '1' })]);
    listarReservas.mockResolvedValue([
      { id: 'r1', ofertaId: '1', quantidade: 1 },
      { id: 'r2', ofertaId: '10', quantidade: 1 },
    ]);
    excluirOferta.mockResolvedValue();
    cancelarReserva.mockResolvedValue();
    const { result } = renderHook(() => useOfertas('feirante'));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    let resposta;
    await act(async () => { resposta = await result.current.excluir('1'); });
    expect(resposta).toEqual({ ok: true });
    expect(cancelarReserva).toHaveBeenCalledTimes(1);
    expect(cancelarReserva).toHaveBeenCalledWith('r1');
    expect(excluirOferta).toHaveBeenCalledWith('1');
  });
  it('encerrar manda o objeto inteiro, sem os campos calculados', async () => {
    const original = oferta({ id: '1' });
    listarOfertas.mockResolvedValue([original]);
    listarReservas.mockResolvedValue([]);
    atualizarOferta.mockResolvedValue({ ...original, status: 'encerrada' });
    const { result } = renderHook(() => useOfertas('feirante'));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    let resposta;
    await act(async () => { resposta = await result.current.encerrar('1'); });
    expect(resposta).toEqual({ ok: true });
    expect(atualizarOferta).toHaveBeenCalledWith('1', { ...original, status: 'encerrada' });
  });
  it('erro ao criar volta como mensagem, sem quebrar a tela', async () => {
    listarOfertas.mockResolvedValue([]);
    listarReservas.mockResolvedValue([]);
    criarOferta.mockRejectedValue(new Error('Sem conexão com o servidor. Tente de novo.'));
    const { result } = renderHook(() => useOfertas('feirante'));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    let resposta;
    await act(async () => { resposta = await result.current.criar({ produto: 'Tomate' }); });
    expect(resposta).toEqual({ ok: false, erro: 'Sem conexão com o servidor. Tente de novo.' });
  });
  it('erro ao carregar vira mensagem para a tela', async () => {
    listarOfertas.mockRejectedValue(new Error('A conexão está lenta. Tente de novo.'));
    listarReservas.mockResolvedValue([]);
    const { result } = renderHook(() => useOfertas('fregues'));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    expect(result.current.erro).toBe('A conexão está lenta. Tente de novo.');
    expect(result.current.ofertas).toEqual([]);
  });
  it('criarDemo só funciona no modo demonstração', async () => {
    listarOfertas.mockResolvedValue([]);
    listarReservas.mockResolvedValue([]);
    const { result } = renderHook(() => useOfertas('fregues'));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    expect(result.current.modoDemo).toBe(false);
    let resposta;
    await act(async () => { resposta = await result.current.criarDemo(); });
    expect(resposta).toEqual({ ok: false, erro: 'Só no modo demonstração.' });
  });
  it('no modo demonstração, criarDemo recria as ofertas e recarrega a lista', async () => {
    vi.stubEnv('NEXT_PUBLIC_MODO_DEMO', 'true');
    listarOfertas.mockResolvedValueOnce([]).mockResolvedValue([oferta({ id: '1' })]);
    listarReservas.mockResolvedValue([]);
    recriarDemo.mockResolvedValue(6);
    const { result } = renderHook(() => useOfertas('fregues'));
    await waitFor(() => expect(result.current.carregando).toBe(false));
    expect(result.current.ofertas).toHaveLength(0);
    let resposta;
    await act(async () => { resposta = await result.current.criarDemo(); });
    expect(resposta).toEqual({ ok: true });
    expect(recriarDemo).toHaveBeenCalledTimes(1);
    expect(result.current.ofertas).toHaveLength(1);
  });
});
