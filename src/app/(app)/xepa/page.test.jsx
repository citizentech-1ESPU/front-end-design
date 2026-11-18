import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OFERTAS_FALSAS } from '@/data/falsos';
import { useOfertas } from '@/hooks/useOfertas';
import Xepa from './page';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/hooks/useOfertas', () => ({ useOfertas: vi.fn() }));

const resto = { recarregar: vi.fn(), criar: vi.fn(), atualizar: vi.fn(), encerrar: vi.fn(), excluir: vi.fn() };

describe('Xepa perto de você', () => {
  it('filtra por tipo de produto e abre a oferta', async () => {
    vi.mocked(useOfertas).mockReturnValue({ ofertas: OFERTAS_FALSAS, carregando: false, erro: null, modoDemo: true, criarDemo: vi.fn(), ...resto });
    render(<Xepa />);
    expect(screen.getByText('Tilápia (filé)')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Frutas' }));
    expect(screen.queryByText('Tilápia (filé)')).not.toBeInTheDocument();
    expect(screen.getByText('Banana prata')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Banana prata/ }));
    expect(push).toHaveBeenCalledWith('/xepa/oferta?id=3');
  });

  it('lista vazia no modo demonstração mostra o botão de criar', async () => {
    const criarDemo = vi.fn(async () => ({ ok: true }));
    vi.mocked(useOfertas).mockReturnValue({ ofertas: [], carregando: false, erro: null, modoDemo: true, criarDemo, ...resto });
    render(<Xepa />);
    expect(screen.getByText('Nenhuma xepa agora. Volte mais perto do fim da feira.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Criar ofertas de demonstração' }));
    expect(criarDemo).toHaveBeenCalled();
  });
});
