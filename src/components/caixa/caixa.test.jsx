import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CAIXAS_FALSAS } from '@/data/falsos';
import BoxCard from './BoxCard';
import IceAlert from './IceAlert';
import StatusPill from './StatusPill';
import TemperatureReading from './TemperatureReading';
import TimeBar from './TimeBar';

describe('StatusPill', () => {
  it.each([
    ['normal', 'Venda normal'],
    ['gelo', 'Complete o gelo'],
    ['xepa', 'Hora da xepa'],
    ['descarte', 'Descarte'],
    ['sensor', 'Sem leitura'],
  ])('o estado %s aparece escrito: %s', (estado, texto) => {
    render(<StatusPill estado={estado} />);
    expect(screen.getByText(texto)).toBeInTheDocument();
  });

  it.each(['gelo', 'sensor'])('no estado %s só o ponto de LED pisca; o texto fica firme', (estado) => {
    const { container } = render(<StatusPill estado={estado} />);
    const pontos = container.querySelectorAll('.piscar');
    expect(pontos).toHaveLength(1);
    expect(pontos[0]).toHaveAttribute('aria-hidden', 'true');
    expect(pontos[0].textContent).toBe('');
  });

  it('sem piscar, não há ponto de LED', () => {
    const { container } = render(<StatusPill estado="normal" />);
    expect(container.querySelector('.piscar')).toBeNull();
  });
});

describe('TemperatureReading', () => {
  it('mostra a temperatura com vírgula e a tendência subindo', () => {
    render(<TemperatureReading temperaturaC={7.8} taxaCh={1.2} />);
    expect(screen.getByText('7,8 °C')).toBeInTheDocument();
    expect(screen.getByText('subindo')).toBeInTheDocument();
    expect(screen.getByText(/1,2 °C por hora/)).toBeInTheDocument();
  });

  it('descendo e estável', () => {
    const { rerender } = render(<TemperatureReading temperaturaC={3.9} taxaCh={-1.5} />);
    expect(screen.getByText('descendo')).toBeInTheDocument();
    rerender(<TemperatureReading temperaturaC={3} taxaCh={0.2} />);
    expect(screen.getByText('estável')).toBeInTheDocument();
  });

  it('sem leitura', () => {
    render(<TemperatureReading temperaturaC={null} taxaCh={null} />);
    expect(screen.getByText('-- °C')).toBeInTheDocument();
  });
});

describe('TimeBar', () => {
  it('mostra o tempo fora do frio como barra acessível', () => {
    render(<TimeBar minutosFora={140} />);
    const barra = screen.getByRole('progressbar', { name: 'Tempo fora do frio' });
    expect(barra).toHaveAttribute('aria-valuenow', '140');
    expect(barra).toHaveAttribute('aria-valuemax', '300');
    expect(screen.getByText('Somou 2h20 fora do frio (limite: 4h)')).toBeInTheDocument();
  });

  it('a barra enche até 5h e para', () => {
    render(<TimeBar minutosFora={400} />);
    expect(screen.getByRole('progressbar', { name: 'Tempo fora do frio' })).toHaveAttribute('aria-valuenow', '300');
    expect(screen.getByTestId('preenchimento')).toHaveStyle({ width: '100%' });
  });
});

describe('IceAlert', () => {
  it('avisa quantos minutos faltam, arredondando para cima', () => {
    render(<IceAlert minutosAte5C={11.2} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Complete o gelo: 12 min');
  });

  it('acima de 5 °C, o aviso é para agora', () => {
    render(<IceAlert minutosAte5C={null} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Complete o gelo agora');
  });
});

describe('BoxCard', () => {
  const [normal, gelo, xepa, descarte] = CAIXAS_FALSAS;

  it('caixa amarela mostra o prazo, o selo de simulação e o botão de anunciar', async () => {
    const onAnunciar = vi.fn();
    render(<BoxCard caixa={xepa} onAnunciar={onAnunciar} />);
    expect(screen.getByText('Hora da xepa')).toBeInTheDocument();
    expect(screen.getByText('Venda ou doe hoje, até 13h50.')).toBeInTheDocument();
    expect(screen.getByText('simulação')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Anunciar na xepa' }));
    expect(onAnunciar).toHaveBeenCalledWith('caixa-3');
  });

  it('caixa no descarte não tem botão de anunciar', () => {
    render(<BoxCard caixa={descarte} onAnunciar={vi.fn()} />);
    expect(screen.getByText('Não venda nem doe.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Anunciar na xepa' })).not.toBeInTheDocument();
  });

  it('caixa esquentando mostra o aviso de gelo', () => {
    render(<BoxCard caixa={gelo} onAnunciar={vi.fn()} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Complete o gelo: 12 min');
  });

  it('leitura antiga aparece com o motivo e bloqueia', () => {
    const antiga = {
      ...normal,
      leituraAntiga: true,
      leituraEm: '2026-11-15T15:01:00Z',
      podeAnunciar: false,
      motivoBloqueio: 'Sem leitura recente da caixa (última às 12h01). Confira a conexão.',
    };
    render(<BoxCard caixa={antiga} onAnunciar={vi.fn()} />);
    expect(screen.getByText('Sem leitura recente da caixa (última às 12h01). Confira a conexão.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Anunciar na xepa' })).not.toBeInTheDocument();
  });
});
