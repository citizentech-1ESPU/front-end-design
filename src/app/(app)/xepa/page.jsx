'use client';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOfertas } from '@/hooks/useOfertas';
import AppHeader from '@/components/layout/AppHeader';
import BottomNav from '@/components/layout/BottomNav';
import OfferCard from '@/components/oferta/OfferCard';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import FilterChips from '@/components/ui/FilterChips';
import LoadingState from '@/components/ui/LoadingState';
import Toast from '@/components/ui/Toast';

const FILTROS = [
  { valor: 'tudo', rotulo: 'Tudo' },
  { valor: 'peixe', rotulo: 'Peixe' },
  { valor: 'queijo', rotulo: 'Queijo' },
  { valor: 'fruta', rotulo: 'Frutas' },
  { valor: 'verdura', rotulo: 'Verduras' },
  { valor: 'outro', rotulo: 'Outros' },
];

// Xepa perto de você: ofertas ativas, da banca mais perto para a mais longe (useOfertas, Dani)
export default function Xepa() {
  const router = useRouter();
  const { ofertas, carregando, erro, recarregar, modoDemo, criarDemo } = useOfertas('fregues');
  const [filtro, setFiltro] = useState('tudo');
  const [aviso, setAviso] = useState(null);
  const fecharAviso = useCallback(() => setAviso(null), []);

  const visiveis = filtro === 'tudo' ? ofertas : ofertas.filter((o) => o.categoria === filtro);

  async function criarDemonstracao() {
    const resultado = await criarDemo();
    if (!resultado.ok) setAviso(resultado.erro);
  }

  let conteudo;
  if (carregando) conteudo = <LoadingState />;
  else if (erro) conteudo = <ErrorState mensagem={erro} onTentarDeNovo={recarregar} />;
  else if (ofertas.length === 0) {
    conteudo = (
      <EmptyState
        mensagem="Nenhuma xepa agora. Volte mais perto do fim da feira."
        rotuloAcao={modoDemo ? 'Criar ofertas de demonstração' : undefined}
        onAcao={criarDemonstracao}
      />
    );
  } else if (visiveis.length === 0) {
    conteudo = <EmptyState mensagem="Nada desse tipo agora. Tente outro filtro." />;
  } else {
    conteudo = (
      <>
        <p role="status" className="text-sm text-muted">
          {visiveis.length === 1 ? '1 oferta' : `${visiveis.length} ofertas`}
        </p>
        <ul className="flex flex-col gap-3">
          {visiveis.map((oferta) => (
            <li key={oferta.id}>
              <OfferCard oferta={oferta} disponivel={oferta.disponivel} onClick={() => router.push(`/xepa/oferta?id=${oferta.id}`)} />
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <>
      <AppHeader titulo="Xepa perto de você" subtitulo="Feira da Av. Eng. Caetano Álvares, hoje" />
      <main className="flex flex-col gap-4 px-4 pt-4">
        <FilterChips opcoes={FILTROS} ativa={filtro} onChange={setFiltro} />
        {conteudo}
      </main>
      <div aria-hidden="true" className="h-20" />
      {aviso && <Toast mensagem={aviso} onFechar={fecharAviso} />}
      <BottomNav perfil="fregues" ativa="ofertas" />
    </>
  );
}
