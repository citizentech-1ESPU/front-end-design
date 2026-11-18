import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Toggle from './Toggle';

describe('Toggle', () => {
  it('é um interruptor acessível', async () => {
    const onChange = vi.fn();
    render(<Toggle id="caixaTermica" rotulo="Temos caixa térmica" ligado={false} onChange={onChange} />);
    const chave = screen.getByRole('switch', { name: 'Temos caixa térmica' });
    expect(chave).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(chave);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
