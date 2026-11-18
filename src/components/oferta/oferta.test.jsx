import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { formatarPreco } from '@/domain/precos';
import OfferCard from './OfferCard';
import PriceTag from './PriceTag';
import ReservaCard from './ReservaCard';

// O Intl usa espaço inseparável depois do "R$"; o Testing Library troca por espaço comum no texto da tela
const preco = (valor) => formatarPreco(valor).replace(/\s/g, ' ');

describe('PriceTag', () => {
  it('mostra o preço normal riscado e o da xepa por unidade', () => {
    render(<PriceTag precoNormal={39.9} precoXepa={29.9} unidade="kg" />);
    expect(screen.getByText(`${preco(29.9)}/kg`)).toBeInTheDocument();
    expect(screen.getByText(preco(39.9)).tagName).toBe('S');
  });
});

describe('OfferCard', () => {
  const base = {
    id: '1', produto: 'Tilápia (filé)', emoji: '🐟', categoria: 'peixe', banca: 'Banca Mar Azul', distanciaM: 350,
    precoNormal: 39.9, precoXepa: 29.9, unidade: 'kg', venderAte: '2026-11-15T16:50:00.000Z', fonteCaixa: 'sensor',
  };

  it.each([
    ['sensor', 'temperatura conferida'],
    ['simulada', 'conferida (simulação)'],
    [null, 'sem frio'],
  ])('o selo da oferta com fonte %s é "%s" (RN8)', (fonteCaixa, selo) => {
    render(<OfferCard oferta={{ ...base, fonteCaixa }} disponivel={3} onClick={vi.fn()} />);
    expect(screen.getByText(selo)).toBeInTheDocument();
  });

  it('mostra banca, distância, prazo e disponível, e abre a oferta', async () => {
    const onClick = vi.fn();
    render(<OfferCard oferta={base} disponivel={3} onClick={onClick} />);
    expect(screen.getByText('Banca Mar Azul, a 350 m')).toBeInTheDocument();
    expect(screen.getByText('até 13h50')).toBeInTheDocument();
    expect(screen.getByText('3 kg disponíveis')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Tilápia \(filé\)/ }));
    expect(onClick).toHaveBeenCalled();
  });

  it('distância a partir de 1 km', () => {
    render(<OfferCard oferta={{ ...base, distanciaM: 1200 }} disponivel={3} onClick={vi.fn()} />);
    expect(screen.getByText('Banca Mar Azul, a 1,2 km')).toBeInTheDocument();
  });
});

describe('ReservaCard', () => {
  it('mostra a compra e cancela', async () => {
    const onCancelar = vi.fn();
    const reserva = {
      id: 'r1', tipo: 'compra', quantidade: 2, apelido: 'Ana', retirarAte: '2026-11-15T16:50:00.000Z',
      oferta: { produto: 'Tilápia (filé)', unidade: 'kg', banca: 'Banca Mar Azul' },
    };
    render(<ReservaCard reserva={reserva} onCancelar={onCancelar} />);
    expect(screen.getByText('2 kg de Tilápia (filé)')).toBeInTheDocument();
    expect(screen.getByText('Retire na Banca Mar Azul até 13h50')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar reserva' }));
    expect(onCancelar).toHaveBeenCalledWith('r1');
  });

  it('doação mostra o horário combinado', () => {
    const reserva = {
      id: 'r2', tipo: 'doacao', quantidade: 5, apelido: 'Cozinha Esperança', retirarAte: '2026-11-15T15:30:00.000Z',
      oferta: { produto: 'Tomate', unidade: 'kg', banca: 'Hortifrúti Bom Preço' },
    };
    render(<ReservaCard reserva={reserva} onCancelar={vi.fn()} />);
    expect(screen.getByText('Retirada às 12h30 na Hortifrúti Bom Preço')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar retirada' })).toBeInTheDocument();
  });

  it('oferta excluída pela banca', () => {
    render(
      <ReservaCard reserva={{ id: 'r3', tipo: 'compra', quantidade: 1, retirarAte: '2026-11-15T16:50:00.000Z', oferta: null }} onCancelar={vi.fn()} />,
    );
    expect(screen.getByText('Oferta encerrada pela banca')).toBeInTheDocument();
  });
});
