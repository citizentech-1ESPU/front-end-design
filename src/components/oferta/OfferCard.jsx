import { formatarQuantidade } from '@/domain/precos';
import { formatarHora } from '@/domain/tempo';
import Badge from '@/components/ui/Badge';
import PriceTag from './PriceTag';
import SeloTemperatura from './SeloTemperatura';

// 350 → '350 m'; 1200 → '1,2 km'
export function formatarDistancia(metros) {
  if (metros < 1000) return `${Math.round(metros)} m`;
  return `${(metros / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`;
}

// Oferta na lista do freguês e da ONG. O cartão inteiro é um botão, fácil de tocar no celular.
export default function OfferCard({ oferta, disponivel, onClick }) {
  const textoDisponivel = `${formatarQuantidade(disponivel, oferta.unidade)} ${disponivel === 1 ? 'disponível' : 'disponíveis'}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full gap-4 rounded-card border border-rule p-3 text-left transition-colors hover:border-accent active:bg-accent-wash"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-display text-lg font-extrabold leading-tight">{oferta.produto}</span>
        <span className="text-sm text-muted">{`${oferta.banca}, a ${formatarDistancia(oferta.distanciaM ?? 0)}`}</span>
        <PriceTag precoNormal={oferta.precoNormal} precoXepa={oferta.precoXepa} unidade={oferta.unidade} />
        <span className="flex flex-wrap gap-1.5">
          <SeloTemperatura fonteCaixa={oferta.fonteCaixa} />
          <Badge tipo="warn">{`até ${formatarHora(oferta.venderAte)}`}</Badge>
        </span>
        <span className="text-sm font-bold">{textoDisponivel}</span>
      </span>
    </button>
  );
}
