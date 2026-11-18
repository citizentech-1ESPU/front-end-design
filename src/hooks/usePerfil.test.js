import { afterEach, describe, it, expect, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { usePerfil } from './usePerfil';

afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); });

describe('usePerfil', () => {
  it('guarda o perfil e a caixa térmica no navegador', async () => {
    const { result } = renderHook(() => usePerfil());
    act(() => { result.current.definirPerfil('ong'); result.current.definirCaixaTermica(true); });
    const segunda = renderHook(() => usePerfil());
    await waitFor(() => expect(segunda.result.current.perfil).toBe('ong'));
    expect(segunda.result.current.temCaixaTermica).toBe(true);
  });
  it('ignora perfil desconhecido', async () => {
    localStorage.setItem('xepa-certa:perfil', JSON.stringify('admin'));
    const { result } = renderHook(() => usePerfil());
    await waitFor(() => expect(result.current.perfil).toBeNull());
  });
  it('funciona mesmo com o navegador bloqueando o armazenamento', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('bloqueado'); });
    const { result } = renderHook(() => usePerfil());
    expect(result.current.perfil).toBeNull();
  });
});
