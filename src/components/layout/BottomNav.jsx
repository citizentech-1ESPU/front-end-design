import Link from 'next/link';

// As três abas de cada perfil, só com o rótulo escrito. A aba atual fica azul, com um traço em cima.
const ABAS = {
  feirante: [
    { id: 'caixas', rotulo: 'Caixas', href: '/feirante' },
    { id: 'ofertas', rotulo: 'Ofertas', href: '/feirante/ofertas' },
  ],
  fregues: [
    { id: 'ofertas', rotulo: 'Ofertas', href: '/xepa' },
    { id: 'reservas', rotulo: 'Reservas', href: '/xepa/reservas' },
  ],
  ong: [
    { id: 'doacoes', rotulo: 'Doações', href: '/ong' },
    { id: 'retiradas', rotulo: 'Retiradas', href: '/ong/retiradas' },
  ],
};

const PERFIL = { id: 'perfil', rotulo: 'Perfil', href: '/' };

export default function BottomNav({ perfil, ativa }) {
  const abas = [...(ABAS[perfil] ?? []), PERFIL];
  return (
    <nav aria-label="Navegação" className="fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-card md:inset-x-auto md:bottom-auto md:right-[max(2rem,calc(50%-34rem))] md:top-4 md:rounded-full md:border md:bg-paper md:px-2">
      <ul className="flex justify-around md:gap-1">
        {abas.map((aba) => {
          const atual = aba.id === ativa;
          return (
            <li key={aba.id} className="flex-1 md:flex-none">
              <Link
                href={aba.href}
                aria-current={atual ? 'page' : undefined}
                className={`flex min-h-14 items-center justify-center border-t-2 text-base font-bold transition-colors hover:text-accent md:min-h-11 md:border-t-0 md:border-b-2 md:px-4 ${
                  atual ? 'border-accent text-accent' : 'border-transparent text-muted'
                }`}
              >
                {aba.rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
