import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useOfertaForm } from './useOfertaForm';
import { criarOferta, atualizarOferta } from '@/services/ofertasService';

vi.mock('@/services/ofertasService', () => ({
  listarOfertas: vi.fn(), buscarOferta: vi.fn(), criarOferta: vi.fn(), atualizarOferta: vi.fn(), excluirOferta: vi.fn(),
}));

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date('2026-11-15T12:10:00-03:00'));
  vi.stubEnv('NEXT_PUBLIC_MODO_DEMO', 'false');
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); vi.clearAllMocks(); });

const caixa = {
  id: 'caixa-1', nome: 'Tilápia', emoji: '🐟', categoria: 'peixe', fonte: 'sensor', temperaturaC: 7.8, taxaCh: 1.2,
  minutosFora: 140, minutosRestantes: 100, minutosAte5C: null, estado: 'xepa', leituraEm: '2026-11-15T15:09:40Z',
  leituraAntiga: false, prazoMaximo: '2026-11-15T16:50:00.000Z', podeAnunciar: true, motivoBloqueio: null,
};

describe('useOfertaForm', () => {
  it('na caixa, já vem preenchido com produto, preços e prazo travado', () => {
    const { result } = renderHook(() => useOfertaForm({ caixa, oferta: null }));
    expect(result.current.modo).toBe('caixa');
    expect(result.current.valores).toMatchObject({
      produto: 'Tilápia (filé)', categoria: 'peixe', unidade: 'kg', precoNormal: 39.9, precoXepa: 29.9,
      venderAte: '2026-11-15T16:50:00.000Z', aceitaDoacao: true,
    });
    expect(result.current.categorias.map((c) => c.valor)).toEqual(['peixe']);
    expect(result.current.prazoMaximo.toISOString()).toBe('2026-11-15T16:50:00.000Z');
  });
  it('preenche quando a caixa chega depois (tela ainda carregando)', () => {
    const { result, rerender } = renderHook((props) => useOfertaForm(props), { initialProps: { caixa: null, oferta: null } });
    rerender({ caixa, oferta: null });
    expect(result.current.valores.produto).toBe('Tilápia (filé)');
  });
  it('sem caixa, só fruta, verdura ou outro, com prazo no fim da feira', () => {
    const { result } = renderHook(() => useOfertaForm({ caixa: null, oferta: null }));
    expect(result.current.modo).toBe('livre');
    expect(result.current.categorias.map((c) => c.valor)).toEqual(['fruta', 'verdura', 'outro']);
    expect(result.current.valores.venderAte).toBe('2026-11-15T17:00:00.000Z');
  });
  it('troca o emoji junto com a categoria no modo livre', () => {
    const { result } = renderHook(() => useOfertaForm({ caixa: null, oferta: null }));
    act(() => result.current.alterar('categoria', 'verdura'));
    expect(result.current.valores.emoji).toBe('🥬');
  });
  it('sugere o preço da xepa quando muda o preço normal', () => {
    const { result } = renderHook(() => useOfertaForm({ caixa: null, oferta: null }));
    act(() => result.current.alterar('precoNormal', 8));
    expect(result.current.precoSugerido).toBe(6);
  });
  it('aceita preço digitado com vírgula', async () => {
    criarOferta.mockImplementation(async (dados) => ({ id: '51', ...dados }));
    const { result } = renderHook(() => useOfertaForm({ caixa, oferta: null }));
    act(() => { result.current.alterar('quantidade', '6'); result.current.alterar('precoXepa', '28,50'); });
    let resposta;
    await act(async () => { resposta = await result.current.enviar(); });
    expect(resposta.ok).toBe(true);
    expect(criarOferta).toHaveBeenCalledWith(expect.objectContaining({ quantidade: 6, precoXepa: 28.5 }));
  });
  it('não publica com xepa mais cara que o normal', async () => {
    const { result } = renderHook(() => useOfertaForm({ caixa, oferta: null }));
    act(() => { result.current.alterar('quantidade', 6); result.current.alterar('precoXepa', 45); });
    let resposta;
    await act(async () => { resposta = await result.current.enviar(); });
    expect(resposta).toEqual({ ok: false });
    expect(result.current.erros.precoXepa).toBe('O preço da xepa precisa ser menor que o normal.');
    expect(criarOferta).not.toHaveBeenCalled();
  });
  it('bloqueia se a caixa foi para o descarte com o formulário aberto', async () => {
    const { result, rerender } = renderHook((props) => useOfertaForm(props), { initialProps: { caixa, oferta: null } });
    act(() => result.current.alterar('quantidade', 6));
    rerender({ caixa: { ...caixa, estado: 'descarte', podeAnunciar: false, motivoBloqueio: 'Caixa no descarte. Não venda nem doe.' }, oferta: null });
    let resposta;
    await act(async () => { resposta = await result.current.enviar(); });
    expect(resposta).toEqual({ ok: false });
    expect(result.current.erros.geral).toBe('Caixa no descarte. Não venda nem doe.');
  });
  it('publica com os dados da caixa e da banca', async () => {
    criarOferta.mockImplementation(async (dados) => ({ id: '50', ...dados }));
    const { result } = renderHook(() => useOfertaForm({ caixa, oferta: null }));
    act(() => result.current.alterar('quantidade', 6));
    let resposta;
    await act(async () => { resposta = await result.current.enviar(); });
    expect(resposta.ok).toBe(true);
    expect(criarOferta).toHaveBeenCalledWith(expect.objectContaining({
      produto: 'Tilápia (filé)', quantidade: 6, precoNormal: 39.9, precoXepa: 29.9, caixaId: 'caixa-1', fonteCaixa: 'sensor',
      temperaturaC: 7.8, conferidaEm: '2026-11-15T15:09:40Z', banca: 'Banca Mar Azul', status: 'ativa',
    }));
  });
  it('erro da API vira erros.geral', async () => {
    criarOferta.mockRejectedValue(new Error('O servidor não respondeu. Tente de novo.'));
    const { result } = renderHook(() => useOfertaForm({ caixa, oferta: null }));
    act(() => result.current.alterar('quantidade', 6));
    let resposta;
    await act(async () => { resposta = await result.current.enviar(); });
    expect(resposta).toEqual({ ok: false });
    expect(result.current.erros.geral).toBe('O servidor não respondeu. Tente de novo.');
    expect(result.current.enviando).toBe(false);
  });
  it('na edição, o prazo só pode diminuir', () => {
    const oferta = { id: '7', produto: 'Sardinha', categoria: 'peixe', emoji: '🐟', unidade: 'kg', quantidade: 4, precoNormal: 18, precoXepa: 13.5, venderAte: '2026-11-15T13:50:00-03:00', aceitaDoacao: false, status: 'ativa', caixaId: 'caixa-3', fonteCaixa: 'simulada' };
    const { result } = renderHook(() => useOfertaForm({ caixa: null, oferta }));
    expect(result.current.modo).toBe('editar');
    expect(result.current.opcoesPrazo.map((o) => o.rotulo)).toEqual(['até 13h50', 'até 13h20', 'até 12h50']);
  });
  it('na edição, salva com PUT mantendo os dados da caixa', async () => {
    const oferta = { id: '7', produto: 'Sardinha', categoria: 'peixe', emoji: '🐟', unidade: 'kg', quantidade: 4, precoNormal: 18, precoXepa: 13.5, venderAte: '2026-11-15T13:50:00-03:00', aceitaDoacao: false, status: 'ativa', caixaId: 'caixa-3', fonteCaixa: 'simulada', temperaturaC: 7.8, conferidaEm: '2026-11-15T12:00:00-03:00', disponivel: 4, ativa: true, linkWhatsApp: 'x' };
    atualizarOferta.mockImplementation(async (id, dados) => ({ id, ...dados }));
    const { result } = renderHook(() => useOfertaForm({ caixa: null, oferta }));
    act(() => result.current.alterar('venderAte', result.current.opcoesPrazo[1].valor));
    let resposta;
    await act(async () => { resposta = await result.current.enviar(); });
    expect(resposta.ok).toBe(true);
    const [id, corpo] = atualizarOferta.mock.calls[0];
    expect(id).toBe('7');
    expect(corpo).toMatchObject({ caixaId: 'caixa-3', fonteCaixa: 'simulada', venderAte: '2026-11-15T16:20:00.000Z' });
    expect(corpo).not.toHaveProperty('disponivel');
  });
});
