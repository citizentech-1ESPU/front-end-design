import { describe, it, expect, vi } from 'vitest';

vi.mock('@/services/thingspeakService', () => ({ buscarUltimaLeitura: vi.fn(async () => null) }));
vi.mock('@/services/ofertasService', () => ({
  listarOfertas: vi.fn(async () => []), buscarOferta: vi.fn(async () => null),
  criarOferta: vi.fn(), atualizarOferta: vi.fn(), excluirOferta: vi.fn(),
}));
vi.mock('@/services/reservasService', () => ({
  listarReservas: vi.fn(async () => []), criarReserva: vi.fn(), cancelarReserva: vi.fn(),
}));
import { renderHook } from '@testing-library/react';
import { usePerfil } from './usePerfil';
import { useCaixas } from './useCaixas';
import { useOfertas } from './useOfertas';
import { useOferta } from './useOferta';
import { useReservas } from './useReservas';
import { useOfertaForm } from './useOfertaForm';
import { CAIXAS_FALSAS, CAMPOS_CAIXA } from '@/data/falsos';

const chaves = (objeto) => Object.keys(objeto).sort();

describe('contrato dos hooks (o que as telas de Lira usam)', () => {
  it('usePerfil', () => {
    const { result } = renderHook(() => usePerfil());
    expect(chaves(result.current)).toEqual(['definirCaixaTermica', 'definirPerfil', 'perfil', 'temCaixaTermica']);
  });
  it('useCaixas', () => {
    const { result } = renderHook(() => useCaixas());
    expect(chaves(result.current)).toEqual(['atualizadoEm', 'caixas', 'carregando', 'erro']);
  });
  it('useOfertas', () => {
    const { result } = renderHook(() => useOfertas('fregues'));
    expect(chaves(result.current)).toEqual(['atualizar', 'carregando', 'criar', 'criarDemo', 'encerrar', 'erro', 'excluir', 'modoDemo', 'ofertas', 'recarregar']);
  });
  it('useOferta', () => {
    const { result } = renderHook(() => useOferta('1'));
    expect(chaves(result.current)).toEqual(['carregando', 'disponivel', 'erro', 'oferta', 'recarregar', 'reservas']);
  });
  it('useReservas', () => {
    const { result } = renderHook(() => useReservas('compra'));
    expect(chaves(result.current)).toEqual(['cancelar', 'carregando', 'erro', 'opcoesRetirada', 'reservar', 'reservas']);
  });
  it('useOfertaForm', () => {
    const { result } = renderHook(() => useOfertaForm({ caixa: null, oferta: null }));
    expect(chaves(result.current)).toEqual(['alterar', 'categorias', 'enviando', 'enviar', 'erros', 'modo', 'opcoesPrazo', 'prazoMaximo', 'precoSugerido', 'validar', 'valores']);
  });
  it('as caixas falsas têm todos os campos do objeto caixa', () => {
    expect(CAMPOS_CAIXA).toHaveLength(16);
    CAIXAS_FALSAS.forEach((caixa) => expect(chaves(caixa)).toEqual(CAMPOS_CAIXA));
    expect(CAIXAS_FALSAS.map((c) => c.estado)).toEqual(['normal', 'gelo', 'xepa', 'descarte']);
  });
});
