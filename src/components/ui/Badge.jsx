// Selo pequeno: "temperatura conferida", "simulação", "sem frio", prazo...
// Cada tipo usa um par de cores que passa no contraste AA (texto sobre o fundo do mesmo par).
const TIPOS = {
  neutro: 'bg-paper-2 text-muted',
  ok: 'bg-ok-bg text-ok',
  warn: 'bg-warn-bg text-warn',
  bad: 'bg-bad-bg text-bad',
  ice: 'bg-ice-bg text-ice',
};

export default function Badge({ tipo = 'neutro', children }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-sm font-bold ${TIPOS[tipo] ?? TIPOS.neutro}`}>
      {children}
    </span>
  );
}
