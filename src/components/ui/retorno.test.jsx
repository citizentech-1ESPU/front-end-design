import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ConfirmDialog from './ConfirmDialog';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import Toast from './Toast';

describe('ErrorState', () => {
  it('mostra a mensagem e tenta de novo', async () => {
    const onTentarDeNovo = vi.fn();
    render(<ErrorState mensagem="Sem conexão com o servidor. Tente de novo." onTentarDeNovo={onTentarDeNovo} />);
    expect(screen.getByText('Sem conexão com o servidor. Tente de novo.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(onTentarDeNovo).toHaveBeenCalledTimes(1);
  });
});

describe('EmptyState', () => {
  it('mostra a mensagem e a ação opcional', async () => {
    const onAcao = vi.fn();
    render(<EmptyState mensagem="Nenhuma xepa agora." rotuloAcao="Criar ofertas de demonstração" onAcao={onAcao} />);
    expect(screen.getByText('Nenhuma xepa agora.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Criar ofertas de demonstração' }));
    expect(onAcao).toHaveBeenCalled();
  });
});

const textos = { titulo: 'Excluir a oferta de sardinha?', mensagem: 'Ela some para os fregueses, e as reservas dela são canceladas.' };

describe('ConfirmDialog', () => {
  it('fica escondido quando fechado', () => {
    render(<ConfirmDialog aberto={false} {...textos} onConfirmar={vi.fn()} onCancelar={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('abre com foco no Cancelar, fecha com Esc e confirma', async () => {
    const onConfirmar = vi.fn();
    const onCancelar = vi.fn();
    render(<ConfirmDialog aberto {...textos} onConfirmar={onConfirmar} onCancelar={onCancelar} />);
    const dialogo = screen.getByRole('dialog', { name: 'Excluir a oferta de sardinha?' });
    expect(dialogo).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(onCancelar).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }));
    expect(onConfirmar).toHaveBeenCalledTimes(1);
  });
});

describe('Toast', () => {
  it('anuncia a mensagem e some sozinho em 4 s', () => {
    vi.useFakeTimers();
    const onFechar = vi.fn();
    render(<Toast mensagem="Reserva feita! Retire na banca até 13h50." onFechar={onFechar} />);
    expect(screen.getByRole('status')).toHaveTextContent('Reserva feita! Retire na banca até 13h50.');
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(onFechar).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
