import { afterEach, describe, it, expect, vi } from 'vitest';
import { lerLocal, gravarLocal } from './armazenamentoLocal';

afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); });

describe('armazenamento local', () => {
  it('grava e lê de volta', () => {
    gravarLocal('xepa-certa:teste', ['1', '2']);
    expect(lerLocal('xepa-certa:teste', [])).toEqual(['1', '2']);
  });
  it('devolve o padrão quando o navegador bloqueia', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('bloqueado'); });
    expect(lerLocal('xepa-certa:teste', 'padrão')).toBe('padrão');
  });
  it('não quebra quando não dá para gravar', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('cheio'); });
    expect(() => gravarLocal('xepa-certa:teste', 1)).not.toThrow();
  });
});
