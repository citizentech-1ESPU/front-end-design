import { afterEach, describe, it, expect, vi } from 'vitest';
import { recriarDemo } from './demoService';
import { criarOferta, excluirOferta, listarOfertas } from './ofertasService';
import { cancelarReserva, listarReservas } from './reservasService';

vi.mock('./ofertasService', () => ({
  listarOfertas: vi.fn(), buscarOferta: vi.fn(), criarOferta: vi.fn(), atualizarOferta: vi.fn(), excluirOferta: vi.fn(),
}));
vi.mock('./reservasService', () => ({ listarReservas: vi.fn(), criarReserva: vi.fn(), cancelarReserva: vi.fn() }));

afterEach(() => vi.clearAllMocks());

describe('recriarDemo', () => {
  it('com apagarAntes, apaga reservas e ofertas e cria as 6 de demonstração', async () => {
    listarReservas.mockResolvedValue([{ id: 'r1' }, { id: 'r2' }]);
    listarOfertas.mockResolvedValue([{ id: '1' }]);
    criarOferta.mockImplementation(async (dados) => ({ id: 'x', ...dados }));
    expect(await recriarDemo({ apagarAntes: true, agora: new Date('2026-11-15T12:10:00-03:00') })).toBe(6);
    expect(cancelarReserva).toHaveBeenCalledTimes(2);
    expect(excluirOferta).toHaveBeenCalledWith('1');
    expect(criarOferta).toHaveBeenCalledTimes(6);
  });
  it('sem apagarAntes, não apaga nada', async () => {
    criarOferta.mockImplementation(async (dados) => ({ id: 'x', ...dados }));
    expect(await recriarDemo({ apagarAntes: false })).toBe(6);
    expect(listarReservas).not.toHaveBeenCalled();
    expect(cancelarReserva).not.toHaveBeenCalled();
    expect(excluirOferta).not.toHaveBeenCalled();
  });
});
