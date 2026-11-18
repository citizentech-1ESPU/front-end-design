import { afterEach, describe, it, expect, vi } from 'vitest';
import { lerConfig } from './config';

afterEach(() => vi.unstubAllEnvs());

describe('lerConfig', () => {
  it('lê as variáveis e tira a barra do fim da URL', () => {
    vi.stubEnv('NEXT_PUBLIC_MOCKAPI_URL', 'https://teste.mockapi.io/api/v1/');
    vi.stubEnv('NEXT_PUBLIC_THINGSPEAK_CHANNEL_ID', '123');
    vi.stubEnv('NEXT_PUBLIC_MODO_DEMO', 'true');
    expect(lerConfig()).toEqual({ mockapiUrl: 'https://teste.mockapi.io/api/v1', canalId: '123', modoDemo: true });
  });
  it('modo demonstração só com o texto true', () => {
    vi.stubEnv('NEXT_PUBLIC_MODO_DEMO', 'sim');
    expect(lerConfig().modoDemo).toBe(false);
  });
});
