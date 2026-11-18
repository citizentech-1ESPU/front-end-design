import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import FilterChips from './FilterChips';

describe('FilterChips', () => {
  it('marca o filtro ativo e avisa a troca', async () => {
    const onChange = vi.fn();
    const opcoes = [{ valor: 'tudo', rotulo: 'Tudo' }, { valor: 'peixe', rotulo: 'Peixe' }];
    render(<FilterChips opcoes={opcoes} ativa="tudo" onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Tudo' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Peixe' })).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(screen.getByRole('button', { name: 'Peixe' }));
    expect(onChange).toHaveBeenCalledWith('peixe');
  });
});
