// Rótulo + campo + dica + erro. O campo filho precisa usar o mesmo id, para o rótulo ficar ligado a ele.
export default function FormField({ id, rotulo, dica, erro, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-bold text-ink">
        {rotulo}
      </label>
      {children}
      {dica && <p className="text-sm text-muted">{dica}</p>}
      {erro && (
        <p role="alert" className="text-sm font-bold text-bad">
          {erro}
        </p>
      )}
    </div>
  );
}

// Classe comum dos campos de texto, para todos terem a mesma cara
export const CLASSE_CAMPO =
  'min-h-11 w-full rounded-control border border-muted bg-card px-3 py-2 text-base font-bold text-ink ' +
  'outline-offset-[-2px] focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-55';
