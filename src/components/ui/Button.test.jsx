import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('chama onClick e tem área de toque de 44 px', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Publicar oferta</Button>);
    const botao = screen.getByRole('button', { name: 'Publicar oferta' });
    expect(botao).toHaveAttribute('type', 'button');
    expect(botao).toHaveClass('min-h-11');
    await userEvent.click(botao);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('desabilitado não chama onClick', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Publicar oferta</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Publicar oferta' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('com href vira link com cara de botão', () => {
    render(<Button href="/xepa">Ver a xepa</Button>);
    expect(screen.getByRole('link', { name: 'Ver a xepa' })).toHaveAttribute('href', '/xepa');
  });
});
