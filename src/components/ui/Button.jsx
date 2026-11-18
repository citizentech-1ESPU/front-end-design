import Link from 'next/link';

// Botão do site. Variantes: primário (azul da marca), secundário (borda) e perigo (excluir).
// Com href, vira um link com a mesma aparência (ex.: "Ver a xepa").
const VARIANTES = {
  primario: 'bg-accent text-accent-ink border-2 border-accent hover:bg-accent-hover active:bg-accent-hover',
  secundario: 'bg-transparent text-accent border-2 border-accent hover:bg-accent-wash active:bg-accent-wash',
  perigo: 'bg-transparent text-bad border-2 border-bad hover:bg-bad-bg active:bg-bad-bg',
};

const BASE =
  'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-control px-5 py-2 text-base font-bold ' +
  'whitespace-nowrap no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-55';

export default function Button({ variante = 'primario', type = 'button', disabled, onClick, href, children }) {
  const classes = `${BASE} ${VARIANTES[variante] ?? VARIANTES.primario}`;
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
