import { formatarPreco } from '@/domain/precos';

// Preço normal riscado e o preço da xepa em destaque, por unidade (kg, dúzia...)
export default function PriceTag({ precoNormal, precoXepa, unidade, grande = false }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className="sr-only">De </span>
      <s className="text-sm text-muted">{formatarPreco(precoNormal)}</s>
      <span className="sr-only">por </span>
      <strong className={`font-display font-extrabold text-ink ${grande ? 'text-3xl' : 'text-xl'}`}>
        {`${formatarPreco(precoXepa)}/${unidade}`}
      </strong>
    </p>
  );
}
