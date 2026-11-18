import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OFERTAS_FALSAS } from '@/data/falsos';
import { usePerfil } from '@/hooks/usePerfil';
import { useOfertas } from '@/hooks/useOfertas';
import { useReservas } from '@/hooks/useReservas';
import Doacoes from './page';

vi.mock('@/hooks/usePerfil', () => ({ usePerfil: vi.fn() }));
vi.mock('@/hooks/useOfertas', () => ({ useOfertas: vi.fn() }));
vi.mock('@/hooks/useReservas', () => ({ useReservas: vi.fn() }));

const ofertasOng = (lista) => ({
  ofertas: lista, carregando: false, erro: null, modoDemo: true, criarDemo: vi.fn(), recarregar: vi.fn(),
  criar: vi.fn(), atualizar: vi.fn(), encerrar: vi.fn(), excluir: vi.fn(),
});
const perfil = (extra) => ({ perfil: 'ong', definirPerfil: vi.fn(), temCaixaTermica: false, definirCaixaTermica: vi.fn(), ...extra });
const reservas = (extra) => ({
  reservas: [], carregando: false, erro: null, reservar: vi.fn(), cancelar: vi.fn(), opcoesRetirada: vi.fn(() => []), ...extra,
});

describe('Doações para retirar', () => {
  it('passa a caixa térmica para o hook e liga o interruptor', async () => {
    const definirCaixaTermica = vi.fn();
    vi.mocked(usePerfil).mockReturnValue(perfil({ definirCaixaTermica }));
    vi.mocked(useOfertas).mockReturnValue(ofertasOng([]));
    vi.mocked(useReservas).mockReturnValue(reservas());
    render(<Doacoes />);
    expect(useOfertas).toHaveBeenCalledWith('ong', { temCaixaTermica: false });
    await userEvent.click(screen.getByRole('switch', { name: 'Temos caixa térmica' }));
    expect(definirCaixaTermica).toHaveBeenCalledWith(true);
  });

  it('sem caixa térmica, peixe aparece bloqueado com o motivo', () => {
    vi.mocked(usePerfil).mockReturnValue(perfil());
    vi.mocked(useOfertas).mockReturnValue(ofertasOng([{ ...OFERTAS_FALSAS[0], podeDoar: false, motivoDoacao: 'Precisa de caixa térmica.' }]));
    vi.mocked(useReservas).mockReturnValue(reservas());
    render(<Doacoes />);
    expect(screen.getByText('Precisa de caixa térmica.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Combinar retirada' })).toBeDisabled();
  });

  it('combinar retirada envia o horário e a caixa térmica e confirma', async () => {
    vi.mocked(usePerfil).mockReturnValue(perfil({ temCaixaTermica: true }));
    const banana = { ...OFERTAS_FALSAS[2], id: '3', podeDoar: true, motivoDoacao: null, disponivel: 10 };
    vi.mocked(useOfertas).mockReturnValue(ofertasOng([banana]));
    const reservar = vi.fn(async () => ({ ok: true, reserva: { id: 'd1', retirarAte: '2026-11-15T15:30:00.000Z' } }));
    vi.mocked(useReservas).mockReturnValue(
      reservas({ reservar, opcoesRetirada: vi.fn(() => [{ valor: '2026-11-15T15:30:00.000Z', rotulo: '12h30' }]) }),
    );
    render(<Doacoes />);
    await userEvent.click(screen.getByRole('button', { name: 'Combinar retirada' }));
    await userEvent.type(screen.getByLabelText('Nome da ONG ou apelido'), 'Cozinha Esperança');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Horário da retirada' }), '12h30');
    await userEvent.click(screen.getByRole('button', { name: 'Combinar retirada' }));
    expect(reservar).toHaveBeenCalledWith(
      expect.objectContaining({ ofertaId: '3', apelido: 'Cozinha Esperança', retirarAte: '2026-11-15T15:30:00.000Z', temCaixaTermica: true }),
    );
    expect(await screen.findByText('Retirada combinada para 12h30. Leve sacolas e, para frios, a caixa térmica.')).toBeInTheDocument();
  });
});
