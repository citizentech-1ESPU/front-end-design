import { DESCARTE_APOS_MIN, XEPA_APOS_MIN } from '@/domain/constantes';
import { formatarDuracao } from '@/domain/tempo';

// Barra do tempo que a caixa passou acima de 5 °C, de 0h a 5h, com as marcas de 2h (xepa) e 4h (descarte).
// O fundo já mostra as três faixas (verde, amarelo, vermelho), como no protótipo.
const MAXIMO_MIN = 300;

function corDoPreenchimento(minutosFora) {
  if (minutosFora >= DESCARTE_APOS_MIN) return 'bg-bad';
  if (minutosFora >= XEPA_APOS_MIN) return 'bg-warn-solid';
  return 'bg-ok';
}

export default function TimeBar({ minutosFora }) {
  const valor = Math.min(Math.max(0, minutosFora ?? 0), MAXIMO_MIN);
  const texto = `Somou ${formatarDuracao(minutosFora ?? 0)} fora do frio (limite: 4h)`;
  const largura = `${(valor / MAXIMO_MIN) * 100}%`;

  return (
    <div className="flex flex-col gap-1">
      <div
        role="progressbar"
        aria-label="Tempo fora do frio"
        aria-valuemin="0"
        aria-valuemax={String(MAXIMO_MIN)}
        aria-valuenow={String(valor)}
        aria-valuetext={texto}
        className="relative h-2.5 overflow-hidden rounded-full bg-[linear-gradient(90deg,var(--color-ok-bg)_0_40%,var(--color-warn-bg)_40%_80%,var(--color-bad-bg)_80%_100%)]"
      >
        <div data-testid="preenchimento" className={`h-full rounded-full ${corDoPreenchimento(valor)}`} style={{ width: largura }} />
      </div>
      <div aria-hidden="true" className="relative h-4 text-xs text-muted">
        <span className="absolute left-0">0h</span>
        <span className="absolute left-[40%] -translate-x-1/2">2h</span>
        <span className="absolute left-[80%] -translate-x-1/2">4h</span>
      </div>
      <p className="text-sm text-muted">{texto}</p>
    </div>
  );
}
