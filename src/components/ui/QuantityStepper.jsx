import { formatarQuantidade } from '@/domain/precos';

// Botões de menos e mais para escolher a quantidade, sem precisar digitar
export default function QuantityStepper({ valor, min = 1, max, unidade, onChange }) {
  const podeDiminuir = valor > min;
  const podeAumentar = max === undefined || valor < max;
  const classeBotao =
    'flex h-11 w-11 items-center justify-center rounded-control bg-paper-2 hover:bg-paper-3 active:bg-paper-3 text-xl font-bold text-ink ' +
    'disabled:cursor-not-allowed disabled:opacity-55';

  return (
    <div className="flex items-center justify-between rounded-control border border-muted bg-card px-2 py-1">
      <button type="button" aria-label="Diminuir" disabled={!podeDiminuir} onClick={() => onChange(valor - 1)} className={classeBotao}>
        −
      </button>
      <span aria-live="polite" className="text-lg font-bold">
        {formatarQuantidade(valor, unidade)}
      </span>
      <button type="button" aria-label="Aumentar" disabled={!podeAumentar} onClick={() => onChange(valor + 1)} className={classeBotao}>
        +
      </button>
    </div>
  );
}
