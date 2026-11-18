// Interruptor liga/desliga ("Temos caixa térmica", "Se sobrar, oferecer às ONGs").
// É um botão com role="switch": o leitor de tela diz "ligado" ou "desligado".
export default function Toggle({ id, rotulo, ligado, onChange }) {
  const idRotulo = `${id}-rotulo`;
  return (
    <div className="flex min-h-11 items-center gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={ligado ? 'true' : 'false'}
        aria-labelledby={idRotulo}
        onClick={() => onChange(!ligado)}
        className="flex h-11 w-14 shrink-0 items-center justify-center rounded-full"
      >
        {/* Área de toque de 44 px; o trilho visível é menor, como no protótipo */}
        <span aria-hidden="true" className={`relative h-7 w-12 rounded-full transition-colors ${ligado ? 'bg-ok' : 'bg-muted'}`}>
          <span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-card transition-transform ${ligado ? 'translate-x-5' : 'translate-x-0'}`} />
        </span>
      </button>
      <span id={idRotulo} className="font-bold">
        {rotulo}
      </span>
    </div>
  );
}
