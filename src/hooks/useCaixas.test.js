import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useCaixas } from './useCaixas';
import { buscarUltimaLeitura } from '@/services/thingspeakService';

vi.mock('@/services/thingspeakService', () => ({ buscarUltimaLeitura: vi.fn() }));

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.stubEnv('NEXT_PUBLIC_THINGSPEAK_CHANNEL_ID', '123');
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); vi.clearAllMocks(); });

const leituraBoa = () => ({
  temperaturaC: 3, minutosFora: 0, estadoCodigo: 0, taxaCh: 0, minutosRestantes: 240,
  leituraEm: new Date().toISOString(), valida: true,
});

describe('useCaixas', () => {
  it('carrega as 4 caixas e atualiza a cada 20 s', async () => {
    buscarUltimaLeitura.mockResolvedValue(leituraBoa());
    const { result } = renderHook(() => useCaixas());
    await waitFor(() => expect(result.current.carregando).toBe(false));
    expect(result.current.caixas.map((c) => c.id)).toEqual(['caixa-1', 'caixa-2', 'caixa-3', 'caixa-4']);
    expect(result.current.caixas.map((c) => c.estado)).toEqual(['normal', 'gelo', 'xepa', 'descarte']);
    expect(buscarUltimaLeitura).toHaveBeenCalledTimes(1);
    await act(async () => { vi.advanceTimersByTime(20000); });
    expect(buscarUltimaLeitura).toHaveBeenCalledTimes(2);
  });
  it('para de atualizar quando a tela fecha', async () => {
    buscarUltimaLeitura.mockResolvedValue(leituraBoa());
    const { result, unmount } = renderHook(() => useCaixas());
    await waitFor(() => expect(result.current.carregando).toBe(false));
    unmount();
    await act(async () => { vi.advanceTimersByTime(60000); });
    expect(buscarUltimaLeitura).toHaveBeenCalledTimes(1);
  });
  it('se o ThingSpeak falhar, a caixa 1 fica sem leitura e as outras aparecem', async () => {
    buscarUltimaLeitura.mockRejectedValue(new Error('Sem conexão com o servidor. Tente de novo.'));
    const { result } = renderHook(() => useCaixas());
    await waitFor(() => expect(result.current.carregando).toBe(false));
    expect(result.current.caixas[0]).toMatchObject({ id: 'caixa-1', estado: 'sensor', podeAnunciar: false });
    expect(result.current.caixas).toHaveLength(4);
    expect(result.current.erro).toBe('Não deu para ler a caixa ao vivo agora.');
  });
});
