import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RESERVAS_FALSAS } from '@/data/falsos';
import { useReservas } from '@/hooks/useReservas';
import MinhasRetiradas from './page';

vi.mock('@/hooks/useReservas', () => ({ useReservas: vi.fn() }));

const reservas = (extra) => ({
  reservas: [{ ...RESERVAS_FALSAS[1], id: 'd1', retirarAte: '2026-11-15T15:30:00.000Z' }],
  carregando: false,
  erro: null,
  reservar: vi.fn(),
  cancelar: vi.fn(async () => ({ ok: true })),
  opcoesRetirada: vi.fn(() => []),
  ...extra,
});

describe('Minhas retiradas', () => {
  it('mostra o horário e cancela com confirmação', async () => {
    const valor = reservas();
    vi.mocked(useReservas).mockReturnValue(valor);
    render(<MinhasRetiradas />);
    expect(useReservas).toHaveBeenCalledWith('doacao');
    expect(screen.getByText('Retirada às 12h30 na Hortifrúti Bom Preço')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar retirada' }));
    const dialogo = screen.getByRole('dialog', { name: 'Cancelar a retirada?' });
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Cancelar retirada' }));
    expect(valor.cancelar).toHaveBeenCalledWith('d1');
    expect(await screen.findByText('Retirada cancelada.')).toBeInTheDocument();
  });

  it('sem retiradas, leva para as doações', () => {
    vi.mocked(useReservas).mockReturnValue(reservas({ reservas: [] }));
    render(<MinhasRetiradas />);
    expect(screen.getByText('Nenhuma retirada combinada.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver doações' })).toHaveAttribute('href', '/ong');
  });
});
