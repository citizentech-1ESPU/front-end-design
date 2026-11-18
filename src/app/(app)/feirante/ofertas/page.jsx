'use client';
import { Suspense, useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useOfertas } from '@/hooks/useOfertas';
import { formatarQuantidade } from '@/domain/precos';
import { formatarHora } from '@/domain/tempo';
import AppHeader from '@/components/layout/AppHeader';
import BottomNav from '@/components/layout/BottomNav';
import PriceTag from '@/components/oferta/PriceTag';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import FilterChips from '@/components/ui/FilterChips';
import LoadingState from '@/components/ui/LoadingState';
import Toast from '@/components/ui/Toast';

function avisoInicial(parametros) {
  if (parametros.get('publicada')) return 'Oferta publicada! Os fregueses perto da feira já veem.';
  if (parametros.get('editada')) return 'Mudanças salvas.';
  return null;
}

// Uma oferta da banca, com WhatsApp, editar, encerrar e excluir
function CartaoDaOferta({ oferta, onEncerrar, onExcluir }) {
  const reservados = Math.max(0, oferta.quantidade - oferta.disponivel);
  return (
    <article className="flex flex-col gap-2 rounded-card border border-rule p-4">
      <header className="flex items-start justify-between gap-2">
        <h2 className="font-display text-lg font-extrabold">
          {oferta.produto}
        </h2>
        <span className="whitespace-nowrap rounded-full bg-warn-bg px-2.5 py-0.5 text-sm font-bold text-warn">
          {`até ${formatarHora(oferta.venderAte)}`}
        </span>
      </header>
      <PriceTag precoNormal={oferta.precoNormal} precoXepa={oferta.precoXepa} unidade={oferta.unidade} />
      <p className="text-sm text-muted">
        {`${formatarQuantidade(oferta.quantidade, oferta.unidade)} anunciados, ${formatarQuantidade(reservados, oferta.unidade)} reservados`}
      </p>
      <a
        href={oferta.linkWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 items-center justify-center gap-2 rounded-control bg-ok-bg px-4 font-bold text-ok-ink"
      >
        Mandar no WhatsApp
      </a>
      <div className="grid grid-cols-2 gap-2">
        <Button variante="secundario" href={`/feirante/ofertas/editar?id=${oferta.id}`}>
          Editar
        </Button>
        {oferta.ativa ? (
          <Button variante="secundario" onClick={() => onEncerrar(oferta)}>
            Encerrar
          </Button>
        ) : (
          <span />
        )}
      </div>
      <Button variante="perigo" onClick={() => onExcluir(oferta)}>
        Excluir
      </Button>
    </article>
  );
}

function SuasOfertas() {
  const parametros = useSearchParams();
  const { ofertas, carregando, erro, encerrar, excluir, recarregar, modoDemo, criarDemo } = useOfertas('feirante');
  const [aba, setAba] = useState('ativas');
  const [paraExcluir, setParaExcluir] = useState(null);
  const [aviso, setAviso] = useState(() => avisoInicial(parametros));
  const fecharAviso = useCallback(() => setAviso(null), []);

  const ativas = ofertas.filter((o) => o.ativa);
  const encerradas = ofertas.filter((o) => !o.ativa);
  const lista = aba === 'ativas' ? ativas : encerradas;

  async function confirmarExclusao() {
    const oferta = paraExcluir;
    setParaExcluir(null);
    const resultado = await excluir(oferta.id);
    setAviso(resultado.ok ? 'Oferta excluída.' : resultado.erro);
  }

  async function encerrarOferta(oferta) {
    const resultado = await encerrar(oferta.id);
    setAviso(resultado.ok ? 'Oferta encerrada.' : resultado.erro);
  }

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
        mensagem="Nenhuma oferta ainda. Quando uma caixa ficar amarela, anuncie aqui."
        rotuloAcao={modoDemo ? 'Criar ofertas de demonstração' : undefined}
        onAcao={criarDemonstracao}
      />
    );
  } else if (lista.length === 0) {
    conteudo = <EmptyState mensagem={aba === 'ativas' ? 'Nenhuma oferta ativa agora.' : 'Nenhuma oferta encerrada.'} />;
  } else {
    conteudo = lista.map((oferta) => (
      <CartaoDaOferta key={oferta.id} oferta={oferta} onEncerrar={encerrarOferta} onExcluir={setParaExcluir} />
    ));
  }

  return (
    <>
      <AppHeader titulo="Suas ofertas" subtitulo="Banca Mar Azul" />
      <main className="flex flex-col gap-4 px-4 pb-24">
        <FilterChips
          opcoes={[
            { valor: 'ativas', rotulo: `Ativas (${ativas.length})` },
            { valor: 'encerradas', rotulo: 'Encerradas' },
          ]}
          ativa={aba}
          onChange={setAba}
        />
        {conteudo}
        <Button variante="secundario" href="/feirante/anunciar">
          Anunciar fruta ou verdura
        </Button>
      </main>

      <ConfirmDialog
        aberto={paraExcluir !== null}
        titulo={paraExcluir ? `Excluir a oferta de ${paraExcluir.produto.toLowerCase()}?` : ''}
        mensagem="Ela some para os fregueses, e as reservas dela são canceladas."
        onConfirmar={confirmarExclusao}
        onCancelar={() => setParaExcluir(null)}
      />
      {aviso && <Toast mensagem={aviso} onFechar={fecharAviso} />}
      <BottomNav perfil="feirante" ativa="ofertas" />
    </>
  );
}

export default function PaginaSuasOfertas() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SuasOfertas />
    </Suspense>
  );
}
