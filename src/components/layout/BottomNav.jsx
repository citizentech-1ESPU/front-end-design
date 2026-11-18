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
    <nav aria-label="Navegação" className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg border-t border-rule bg-card">
      <ul className="flex justify-around">
        {abas.map((aba) => {
          const atual = aba.id === ativa;
          return (
            <li key={aba.id} className="flex-1">
              <Link
                href={aba.href}
                aria-current={atual ? 'page' : undefined}
                className={`flex min-h-14 items-center justify-center border-t-2 text-base font-bold transition-colors hover:text-accent ${
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
