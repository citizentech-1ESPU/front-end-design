import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';

describe('AppHeader', () => {
  it('título como h1 e link de voltar', () => {
    render(<AppHeader titulo="Anunciar na xepa" subtitulo="Tilápia · ainda segura por 1h40" voltarPara="/feirante" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Anunciar na xepa' })).toBeInTheDocument();
    expect(screen.getByText('Tilápia · ainda segura por 1h40')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voltar' })).toHaveAttribute('href', '/feirante');
  });
});

describe('BottomNav', () => {
  it.each([
    ['feirante', ['Caixas', 'Ofertas', 'Perfil']],
    ['fregues', ['Ofertas', 'Reservas', 'Perfil']],
    ['ong', ['Doações', 'Retiradas', 'Perfil']],
  ])('abas do perfil %s', (perfil, abas) => {
    render(<BottomNav perfil={perfil} ativa="perfil" />);
    expect(screen.getAllByRole('link')).toHaveLength(3);
    abas.forEach((aba) => expect(screen.getByRole('link', { name: aba })).toBeInTheDocument());
  });

  it('marca a aba atual', () => {
    render(<BottomNav perfil="feirante" ativa="ofertas" />);
    const aba = screen.getByRole('link', { name: 'Ofertas' });
    expect(aba).toHaveAttribute('aria-current', 'page');
    expect(aba).toHaveAttribute('href', '/feirante/ofertas');
  });
});
