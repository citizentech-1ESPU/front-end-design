import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OFERTAS_FALSAS } from '@/data/falsos';
import { useOferta } from '@/hooks/useOferta';
import { useOfertaForm } from '@/hooks/useOfertaForm';
import EditarOferta from './page';

const { push, busca } = vi.hoisted(() => ({ push: vi.fn(), busca: { valor: '' } }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(busca.valor),
}));
vi.mock('@/hooks/useOferta', () => ({ useOferta: vi.fn() }));
vi.mock('@/hooks/useOfertaForm', () => ({ useOfertaForm: vi.fn() }));

const oferta = OFERTAS_FALSAS[0];

describe('Editar oferta', () => {
  it('oferta que não existe mostra o caminho de volta', () => {
    busca.valor = 'id=999';
    vi.mocked(useOferta).mockReturnValue({ oferta: null, reservas: [], disponivel: 0, carregando: false, erro: null, recarregar: vi.fn() });
    render(<EditarOferta />);
    expect(screen.getByText('Essa oferta não existe mais.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voltar para suas ofertas' })).toHaveAttribute('href', '/feirante/ofertas');
  });

  it('salvar leva para Suas ofertas com o aviso', async () => {
    busca.valor = 'id=1';
    vi.mocked(useOferta).mockReturnValue({ oferta, reservas: [], disponivel: 4, carregando: false, erro: null, recarregar: vi.fn() });
    const enviar = vi.fn(async () => ({ ok: true, oferta }));
    vi.mocked(useOfertaForm).mockReturnValue({
      modo: 'editar',
      valores: { ...oferta, venderAte: new Date(oferta.venderAte).toISOString() },
      erros: {},
      alterar: vi.fn(),
      categorias: [{ valor: 'peixe', rotulo: 'Peixe', emoji: '🐟' }],
      precoSugerido: 29.9,
      prazoMaximo: new Date(oferta.venderAte),
      opcoesPrazo: [{ valor: new Date(oferta.venderAte).toISOString(), rotulo: 'até 13h50' }],
      validar: vi.fn(),
      enviando: false,
      enviar,
    });
    render(<EditarOferta />);
    await userEvent.click(screen.getByRole('button', { name: 'Salvar mudanças' }));
    expect(enviar).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('/feirante/ofertas?editada=1');
  });
});
