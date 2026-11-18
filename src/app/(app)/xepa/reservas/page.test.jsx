import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RESERVAS_FALSAS } from '@/data/falsos';
import { useReservas } from '@/hooks/useReservas';
import MinhasReservas from './page';

vi.mock('@/hooks/useReservas', () => ({ useReservas: vi.fn() }));

const reservas = (extra) => ({
  reservas: [{ ...RESERVAS_FALSAS[0], id: 'r1' }],
  carregando: false,
  erro: null,
  reservar: vi.fn(),
  cancelar: vi.fn(async () => ({ ok: true })),
  opcoesRetirada: vi.fn(() => []),
  ...extra,
});

describe('Minhas reservas', () => {
  it('cancelar pede confirmação e avisa', async () => {
    const valor = reservas();
    vi.mocked(useReservas).mockReturnValue(valor);
    render(<MinhasReservas />);
    expect(useReservas).toHaveBeenCalledWith('compra');
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar reserva' }));
    const dialogo = screen.getByRole('dialog', { name: 'Cancelar a reserva?' });
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Cancelar reserva' }));
    expect(valor.cancelar).toHaveBeenCalledWith('r1');
    expect(await screen.findByText('Reserva cancelada.')).toBeInTheDocument();
  });

  it('sem reservas, leva para a xepa', () => {
    vi.mocked(useReservas).mockReturnValue(reservas({ reservas: [] }));
    render(<MinhasReservas />);
    expect(screen.getByText('Você ainda não reservou nada.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver a xepa' })).toHaveAttribute('href', '/xepa');
  });
});
