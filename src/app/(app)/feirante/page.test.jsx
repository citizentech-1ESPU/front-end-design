import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CAIXAS_FALSAS } from '@/data/falsos';
import { useCaixas } from '@/hooks/useCaixas';
import SuasCaixas from './page';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/hooks/useCaixas', () => ({ useCaixas: vi.fn() }));

describe('Suas caixas', () => {
  it('mostra as caixas, a hora da última atualização e leva para anunciar', async () => {
    vi.mocked(useCaixas).mockReturnValue({
      caixas: [CAIXAS_FALSAS[2]], carregando: false, erro: null, atualizadoEm: new Date('2026-11-15T15:10:00Z'),
    });
    render(<SuasCaixas />);
    expect(screen.getByRole('heading', { level: 1, name: 'Suas caixas' })).toBeInTheDocument();
    expect(screen.getByText('Atualizado às 12h10')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Anunciar na xepa' }));
    expect(push).toHaveBeenCalledWith('/feirante/anunciar?caixa=caixa-3');
  });

  it('mostra o carregando', () => {
    vi.mocked(useCaixas).mockReturnValue({ caixas: [], carregando: true, erro: null, atualizadoEm: null });
    render(<SuasCaixas />);
    expect(screen.getByText('Carregando…')).toBeInTheDocument();
  });
});
