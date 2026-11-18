// Temperatura da caixa (7,8 °C) e para onde ela está indo (subindo, descendo ou estável).
// A seta é decorativa; o leitor de tela lê a palavra.
const LIMIAR_TENDENCIA = 0.5; // °C por hora: menos que isso conta como estável

const umaCasa = (valor) => valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function tendencia(taxaCh) {
  if (taxaCh > LIMIAR_TENDENCIA) return { seta: '↑', palavra: 'subindo', mostrarNumero: true };
  if (taxaCh < -LIMIAR_TENDENCIA) return { seta: '↓', palavra: 'descendo', mostrarNumero: true };
  return { seta: '→', palavra: 'estável', mostrarNumero: false };
}

export default function TemperatureReading({ temperaturaC, taxaCh }) {
  const semLeitura = temperaturaC === null || temperaturaC === undefined;
  const temTaxa = !semLeitura && taxaCh !== null && taxaCh !== undefined;
  const t = temTaxa ? tendencia(taxaCh) : null;

  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <p className="font-display text-3xl font-extrabold tracking-tight">
        {semLeitura ? '-- °C' : `${umaCasa(temperaturaC)} °C`}
      </p>
      {t && (
        <p className="text-sm font-bold text-muted">
          <span aria-hidden="true">{t.seta} </span>
          {t.mostrarNumero ? (
            <>
              <span className="sr-only">{t.palavra}</span> {umaCasa(Math.abs(taxaCh))} °C por hora
            </>
          ) : (
            <span>{t.palavra}</span>
          )}
        </p>
      )}
    </div>
  );
}
