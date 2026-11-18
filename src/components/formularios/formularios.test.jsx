import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import OfertaForm from './OfertaForm';
import ReservaForm from './ReservaForm';

const props = (extra = {}) => ({
  modo: 'caixa',
  valores: {
    produto: 'Tilápia (filé)', categoria: 'peixe', emoji: '🐟', unidade: 'kg', quantidade: '',
    precoNormal: 39.9, precoXepa: 29.9, venderAte: '2026-11-15T16:50:00.000Z', aceitaDoacao: true,
  },
  erros: {},
  categorias: [{ valor: 'peixe', rotulo: 'Peixe', emoji: '🐟' }],
  precoSugerido: 29.9,
  prazoMaximo: new Date('2026-11-15T16:50:00.000Z'),
  opcoesPrazo: [{ valor: '2026-11-15T16:50:00.000Z', rotulo: 'até 13h50' }],
  enviando: false,
  onAlterar: vi.fn(),
  onEnviar: vi.fn(),
  ...extra,
});

describe('OfertaForm', () => {
  it('na caixa, o prazo aparece travado com a explicação', () => {
    render(<OfertaForm {...props()} />);
    expect(screen.getByText('Vender até 13h50')).toBeInTheDocument();
    expect(screen.getByText('O horário limite vem da caixa. Dá para encerrar antes, nunca depois.')).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Vender até' })).not.toBeInTheDocument();
  });

  it('na edição, o prazo vira uma lista que só encurta', () => {
    const opcoesPrazo = [{ valor: 'a', rotulo: 'até 13h50' }, { valor: 'b', rotulo: 'até 13h20' }];
    render(<OfertaForm {...props({ modo: 'editar', opcoesPrazo })} />);
    expect(screen.getByRole('combobox', { name: 'Vender até' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'até 13h20' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar mudanças' })).toBeInTheDocument();
  });

  it('usa o preço sugerido com um toque', async () => {
    const onAlterar = vi.fn();
    render(<OfertaForm {...props({ onAlterar })} />);
    await userEvent.click(screen.getByRole('button', { name: /Usar sugestão/ }));
    expect(onAlterar).toHaveBeenCalledWith('precoXepa', 29.9);
  });

  it('mostra o erro de cada campo e o erro geral', () => {
    const erros = { precoXepa: 'O preço da xepa precisa ser menor que o normal.', geral: 'Caixa no descarte. Não venda nem doe.' };
    render(<OfertaForm {...props({ erros })} />);
    expect(screen.getByText('O preço da xepa precisa ser menor que o normal.')).toBeInTheDocument();
    expect(screen.getByText('Caixa no descarte. Não venda nem doe.')).toBeInTheDocument();
  });

  it('envia e trava o botão enquanto publica', async () => {
    const onEnviar = vi.fn();
    const { rerender } = render(<OfertaForm {...props({ onEnviar })} />);
    await userEvent.click(screen.getByRole('button', { name: 'Publicar oferta' }));
    expect(onEnviar).toHaveBeenCalledTimes(1);
    rerender(<OfertaForm {...props({ enviando: true })} />);
    expect(screen.getByRole('button', { name: 'Publicando…' })).toBeDisabled();
  });
});

describe('ReservaForm', () => {
  const comum = { erros: {}, disponivel: 3, unidade: 'kg', venderAte: '2026-11-15T16:50:00.000Z', enviando: false };

  it('compra: apelido, quantidade e reserva até o prazo', async () => {
    const onAlterar = vi.fn();
    const onEnviar = vi.fn();
    render(
      <ReservaForm
        {...comum}
        tipo="compra"
        valores={{ quantidade: 1, apelido: '' }}
        opcoesRetirada={[]}
        precisaCaixaTermica={false}
        onAlterar={onAlterar}
        onEnviar={onEnviar}
      />,
    );
    await userEvent.type(screen.getByLabelText('Seu apelido'), 'A');
    expect(onAlterar).toHaveBeenCalledWith('apelido', 'A');
    expect(screen.getByText('Sem pagamento pelo site. Você paga na banca.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reservar e retirar até 13h50' }));
    expect(onEnviar).toHaveBeenCalledTimes(1);
  });

  it('doação: escolhe o horário e lembra da caixa térmica', () => {
    render(
      <ReservaForm
        {...comum}
        tipo="doacao"
        valores={{ quantidade: 1, apelido: 'Cozinha Esperança', retirarAte: '' }}
        erros={{ temCaixaTermica: 'Para levar peixe ou queijo, precisa de caixa térmica.' }}
        opcoesRetirada={[{ valor: '2026-11-15T15:30:00.000Z', rotulo: '12h30' }]}
        precisaCaixaTermica
        onAlterar={vi.fn()}
        onEnviar={vi.fn()}
      />,
    );
    expect(screen.getByRole('combobox', { name: 'Horário da retirada' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '12h30' })).toBeInTheDocument();
    expect(screen.getByText('Para levar peixe ou queijo, precisa de caixa térmica.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Combinar retirada' })).toBeInTheDocument();
  });
});
