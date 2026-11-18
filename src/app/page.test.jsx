import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CAIXAS_FALSAS } from '@/data/falsos';
import { useCaixas } from '@/hooks/useCaixas';
import { usePerfil } from '@/hooks/usePerfil';
import Landing from './page';

vi.mock('@/hooks/useCaixas', () => ({ useCaixas: vi.fn() }));
vi.mock('@/hooks/usePerfil', () => ({ usePerfil: vi.fn() }));

const definirPerfil = vi.fn();

beforeEach(() => {
  definirPerfil.mockClear();
  vi.mocked(usePerfil).mockReturnValue({ perfil: null, definirPerfil, temCaixaTermica: false, definirCaixaTermica: vi.fn() });
  vi.mocked(useCaixas).mockReturnValue({ caixas: CAIXAS_FALSAS, carregando: false, erro: null, atualizadoEm: null });
});

describe('Landing', () => {
  it('apresenta a solução com um único h1 e as duas ações do hero', () => {
    render(<Landing />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'A caixa avisa a hora da xepa.' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Sou feirante' })[0]).toHaveAttribute('href', '/feirante');
    expect(screen.getAllByRole('link', { name: 'Quero comprar xepa' })[0]).toHaveAttribute('href', '/xepa');
  });

  it('mostra as quatro caixas no hero, com o estado escrito', () => {
    render(<Landing />);
    const painel = screen.getByRole('figure', { name: /Caixa 1 lida agora do ThingSpeak/ });
    expect(within(painel).getAllByRole('listitem')).toHaveLength(4);
    expect(within(painel).getByText('Hora da xepa')).toBeInTheDocument();
  });

  it('avisa enquanto lê as caixas e mostra o erro do hook', () => {
    vi.mocked(useCaixas).mockReturnValue({ caixas: [], carregando: true, erro: null, atualizadoEm: null });
    const { unmount } = render(<Landing />);
    expect(screen.getByText('Lendo as caixas…')).toBeInTheDocument();
    unmount();
    vi.mocked(useCaixas).mockReturnValue({ caixas: [], carregando: false, erro: 'Sem leitura recente da caixa. Confira a conexão.', atualizadoEm: null });
    render(<Landing />);
    expect(screen.getByText('Sem leitura recente da caixa. Confira a conexão.')).toBeInTheDocument();
  });

  it('explica a regra das 2h e 4h numa tabela', () => {
    render(<Landing />);
    const tabela = screen.getByRole('heading', { level: 2, name: 'Duas horas, quatro horas' }).closest('section');
    expect(within(tabela).getAllByRole('row')).toHaveLength(5);
    expect(within(tabela).getByText('4h ou mais acima de 5 °C')).toBeInTheDocument();
  });

  it('guarda o perfil ao entrar como ONG', async () => {
    render(<Landing />);
    await userEvent.click(screen.getAllByRole('link', { name: 'Sou de uma ONG' })[0]);
    expect(definirPerfil).toHaveBeenCalledWith('ong');
  });

  it('troca de perfil pelas abas, também com as setas do teclado', async () => {
    render(<Landing />);
    const feirante = screen.getByRole('tab', { name: 'Feirante' });
    expect(feirante).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Feirante' })).toBeVisible();

    await userEvent.click(screen.getByRole('tab', { name: 'Freguês' }));
    expect(screen.getByRole('tabpanel', { name: 'Freguês' })).toBeVisible();

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'ONG' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'ONG' })).toHaveAttribute('aria-selected', 'true');
  });

  it('dá crédito à foto da feira no rodapé', () => {
    render(<Landing />);
    expect(screen.getByRole('link', { name: 'Wilfredor' })).toHaveAttribute('href', expect.stringContaining('commons.wikimedia.org'));
  });
});
