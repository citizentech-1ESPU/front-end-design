// Filtros por tipo (Tudo, Peixe, Queijo...). O ativo fica azul e com aria-pressed="true".
// Se não couber na tela, só a linha dos filtros rola para o lado, nunca a página.
export default function FilterChips({ opcoes, ativa, onChange }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {opcoes.map((opcao) => {
        const ligado = opcao.valor === ativa;
        return (
          <button
            key={opcao.valor}
            type="button"
            aria-pressed={ligado ? 'true' : 'false'}
            onClick={() => onChange(opcao.valor)}
            className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-bold transition-colors hover:border-accent ${
              ligado ? 'border-accent bg-accent text-accent-ink' : 'border-muted bg-transparent text-ink'
            }`}
          >
            {opcao.rotulo}
          </button>
        );
      })}
    </div>
  );
}
