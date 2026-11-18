import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OFERTAS_FALSAS } from '@/data/falsos';
import { useOferta } from '@/hooks/useOferta';
import { useReservas } from '@/hooks/useReservas';
import DetalheOferta from './page';

const { busca } = vi.hoisted(() => ({ busca: { valor: '' } }));
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(busca.valor) }));
vi.mock('@/hooks/useOferta', () => ({ useOferta: vi.fn() }));
vi.mock('@/hooks/useReservas', () => ({ useReservas: vi.fn() }));

const reservasVazias = (extra) => ({
  reservas: [], carregando: false, erro: null, reservar: vi.fn(), cancelar: vi.fn(), opcoesRetirada: vi.fn(() => []), ...extra,
});

describe('Detalhe da oferta', () => {
  it.each(['id=999', ''])('oferta inexistente ou sem id (%s) mostra o caminho de volta', (valor) => {
    busca.valor = valor;
    vi.mocked(useOferta).mockReturnValue({ oferta: null, reservas: [], disponivel: 0, carregando: false, erro: null, recarregar: vi.fn() });
    vi.mocked(useReservas).mockReturnValue(reservasVazias());
    render(<DetalheOferta />);
    expect(screen.getByText('Essa oferta não existe mais.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver outras ofertas' })).toHaveAttribute('href', '/xepa');
  });

  it('reserva feita mostra a confirmação com o prazo', async () => {
    busca.valor = 'id=1';
    const oferta = {
      ...OFERTAS_FALSAS[0], id: '1', venderAte: '2026-11-15T16:50:00.000Z', conferidaEm: '2026-11-15T15:10:00Z', fonteCaixa: 'sensor', ativa: true,
    };
    vi.mocked(useOferta).mockReturnValue({ oferta, reservas: [], disponivel: 3, carregando: false, erro: null, recarregar: vi.fn() });
    const reservar = vi.fn(async () => ({ ok: true, reserva: { id: 'r1', retirarAte: '2026-11-15T16:50:00.000Z' } }));
    vi.mocked(useReservas).mockReturnValue(reservasVazias({ reservar }));
    render(<DetalheOferta />);
    expect(screen.getByText('Temperatura conferida às 12h10')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Seu apelido'), 'Ana');
    await userEvent.click(screen.getByRole('button', { name: 'Reservar e retirar até 13h50' }));
    expect(reservar).toHaveBeenCalledWith(expect.objectContaining({ ofertaId: '1', quantidade: 1, apelido: 'Ana' }));
    expect(await screen.findByText('Reserva feita! Retire na banca até 13h50.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver minhas reservas' })).toHaveAttribute('href', '/xepa/reservas');
  });

  it('erro de validação aparece no campo', async () => {
    busca.valor = 'id=1';
    vi.mocked(useOferta).mockReturnValue({ oferta: { ...OFERTAS_FALSAS[0], ativa: true }, reservas: [], disponivel: 4, carregando: false, erro: null, recarregar: vi.fn() });
    const reservar = vi.fn(async () => ({ ok: false, erros: { apelido: 'Escreva um apelido para a banca chamar você.' } }));
    vi.mocked(useReservas).mockReturnValue(reservasVazias({ reservar }));
    render(<DetalheOferta />);
    await userEvent.click(screen.getByRole('button', { name: /Reservar e retirar/ }));
    expect(await screen.findByText('Escreva um apelido para a banca chamar você.')).toBeInTheDocument();
  });
});
