import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OFERTAS_FALSAS } from '@/data/falsos';
import { useOfertas } from '@/hooks/useOfertas';
import SuasOfertas from './page';

const { busca } = vi.hoisted(() => ({ busca: { valor: '' } }));
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(busca.valor) }));
vi.mock('@/hooks/useOfertas', () => ({ useOfertas: vi.fn() }));

const ofertas = (extra) => ({
  ofertas: [{ ...OFERTAS_FALSAS[0], ativa: true }],
  carregando: false,
  erro: null,
  criar: vi.fn(),
  atualizar: vi.fn(),
  encerrar: vi.fn(async () => ({ ok: true })),
  excluir: vi.fn(async () => ({ ok: true })),
  recarregar: vi.fn(),
  modoDemo: true,
  criarDemo: vi.fn(async () => ({ ok: true })),
  ...extra,
});

describe('Suas ofertas', () => {
  it('excluir pede confirmação e avisa depois', async () => {
    const valor = ofertas();
    vi.mocked(useOfertas).mockReturnValue(valor);
    render(<SuasOfertas />);
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }));
    const dialogo = screen.getByRole('dialog');
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Excluir' }));
    expect(valor.excluir).toHaveBeenCalledWith(OFERTAS_FALSAS[0].id);
    expect(await screen.findByText('Oferta excluída.')).toBeInTheDocument();
  });

  it('o botão do WhatsApp usa o link da oferta', () => {
    vi.mocked(useOfertas).mockReturnValue(ofertas());
    render(<SuasOfertas />);
    expect(screen.getByRole('link', { name: /Mandar no WhatsApp/ })).toHaveAttribute('href', OFERTAS_FALSAS[0].linkWhatsApp);
  });

  it('encerrar avisa que a oferta foi encerrada', async () => {
    const valor = ofertas();
    vi.mocked(useOfertas).mockReturnValue(valor);
    render(<SuasOfertas />);
    await userEvent.click(screen.getByRole('button', { name: 'Encerrar' }));
    expect(valor.encerrar).toHaveBeenCalledWith(OFERTAS_FALSAS[0].id);
    expect(await screen.findByText('Oferta encerrada.')).toBeInTheDocument();
  });

  it('chegando de um anúncio, avisa que a oferta foi publicada', () => {
    busca.valor = 'publicada=1';
    vi.mocked(useOfertas).mockReturnValue(ofertas());
    render(<SuasOfertas />);
    expect(screen.getByText('Oferta publicada! Os fregueses perto da feira já veem.')).toBeInTheDocument();
    busca.valor = '';
  });

  it('sem ofertas, no modo demonstração, oferece criar as de demonstração', async () => {
    const valor = ofertas({ ofertas: [] });
    vi.mocked(useOfertas).mockReturnValue(valor);
    render(<SuasOfertas />);
    await userEvent.click(screen.getByRole('button', { name: 'Criar ofertas de demonstração' }));
    expect(valor.criarDemo).toHaveBeenCalled();
  });

  it('erro mostra a mensagem e tenta de novo', async () => {
    const valor = ofertas({ ofertas: [], erro: 'Sem conexão com o servidor. Tente de novo.' });
    vi.mocked(useOfertas).mockReturnValue(valor);
    render(<SuasOfertas />);
    await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(valor.recarregar).toHaveBeenCalled();
  });
});
