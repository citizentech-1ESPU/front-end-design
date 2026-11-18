import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { CAIXAS_FALSAS } from '@/data/falsos';
import { useCaixas } from '@/hooks/useCaixas';
import { useOfertaForm } from '@/hooks/useOfertaForm';
import Anunciar from './page';

const { push, busca } = vi.hoisted(() => ({ push: vi.fn(), busca: { valor: '' } }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(busca.valor),
}));
vi.mock('@/hooks/useCaixas', () => ({ useCaixas: vi.fn() }));
vi.mock('@/hooks/useOfertaForm', () => ({ useOfertaForm: vi.fn() }));

const formulario = (extra) => ({
  modo: 'caixa',
  valores: {
    produto: 'Sardinha', categoria: 'peixe', emoji: '🐟', unidade: 'kg', quantidade: 4,
    precoNormal: 18, precoXepa: 13.5, venderAte: '2026-11-15T16:50:00.000Z', aceitaDoacao: true,
  },
  erros: {},
  alterar: vi.fn(),
  categorias: [{ valor: 'peixe', rotulo: 'Peixe', emoji: '🐟' }],
  precoSugerido: 13.5,
  prazoMaximo: new Date('2026-11-15T16:50:00.000Z'),
  opcoesPrazo: [],
  validar: vi.fn(),
  enviando: false,
  enviar: vi.fn(async () => ({ ok: true, oferta: { id: '9' } })),
  ...extra,
});

beforeEach(() => {
  vi.mocked(useCaixas).mockReturnValue({ caixas: CAIXAS_FALSAS, carregando: false, erro: null, atualizadoEm: new Date() });
});

describe('Anunciar na xepa', () => {
  it('caixa no descarte não deixa anunciar e explica por quê', () => {
    busca.valor = 'caixa=caixa-4';
    vi.mocked(useOfertaForm).mockReturnValue(formulario());
    render(<Anunciar />);
    expect(screen.getByText('Caixa no descarte. Não venda nem doe.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Publicar oferta' })).not.toBeInTheDocument();
  });

  it('publicar leva para Suas ofertas com o aviso', async () => {
    busca.valor = 'caixa=caixa-3';
    const enviar = vi.fn(async () => ({ ok: true, oferta: { id: '9' } }));
    vi.mocked(useOfertaForm).mockReturnValue(formulario({ enviar }));
    render(<Anunciar />);
    expect(screen.getByText('Sardinha, ainda segura por 1h40')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Publicar oferta' }));
    expect(enviar).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('/feirante/ofertas?publicada=1');
  });

  it('sem caixa, é o formulário de fruta e verdura', () => {
    busca.valor = '';
    vi.mocked(useOfertaForm).mockReturnValue(formulario({ modo: 'livre' }));
    render(<Anunciar />);
    expect(useOfertaForm).toHaveBeenCalledWith({ caixa: null, oferta: null });
    expect(screen.getByText('Fruta, verdura e outros')).toBeInTheDocument();
  });
});
