import Link from 'next/link';

// Topo de cada tela: a logo (que leva à página inicial), o "Voltar" (quando tem para onde voltar),
// o título e o subtítulo. O título é o único h1 da tela, para o leitor de tela saber onde a pessoa está.
export default function AppHeader({ titulo, subtitulo, voltarPara }) {
  return (
    <header className="border-b border-rule px-4 pb-4 pt-3 md:px-8 md:pb-6 md:pt-4">
      <Link href="/" aria-label="Xepa Certa, página inicial" className="inline-flex rounded-control">
        {/* Logo compacta: 52 px de altura é o mínimo para o "certa" ficar legível (LEIA-ME da logo) */}
        <img src="/logo/xepa-certa-logo-compacta.svg" alt="" width="95" height="52" />
      </Link>
      <div className="mt-3 flex items-center gap-1">
        {voltarPara && (
          <Link
            href={voltarPara}
            aria-label="Voltar"
            className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-3xl leading-none text-accent hover:bg-accent-wash"
          >
            <span aria-hidden="true">‹</span>
          </Link>
        )}
        <h1 className="font-display font-extrabold">{titulo}</h1>
      </div>
      {subtitulo && <p className="mt-1 text-muted">{subtitulo}</p>}
    </header>
  );
}
