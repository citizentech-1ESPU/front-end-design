'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCaixas } from '@/hooks/useCaixas';
import { useOfertaForm } from '@/hooks/useOfertaForm';
import { formatarDuracao } from '@/domain/tempo';
import OfertaForm from '@/components/formularios/OfertaForm';
import AppHeader from '@/components/layout/AppHeader';
import LoadingState from '@/components/ui/LoadingState';

// O formulário só aparece depois que a caixa foi encontrada, para já vir preenchido por ela
function Formulario({ caixa }) {
  const router = useRouter();
  const form = useOfertaForm({ caixa, oferta: null });

  async function publicar() {
    const resultado = await form.enviar();
    if (resultado.ok) router.push('/feirante/ofertas?publicada=1');
  }

  return (
    <OfertaForm
      modo={form.modo}
      valores={form.valores}
      erros={form.erros}
      categorias={form.categorias}
      precoSugerido={form.precoSugerido}
      prazoMaximo={form.prazoMaximo}
      opcoesPrazo={form.opcoesPrazo}
      enviando={form.enviando}
      onAlterar={form.alterar}
      onEnviar={publicar}
    />
  );
}

function Anunciar() {
  const idCaixa = useSearchParams().get('caixa');
  const { caixas, carregando } = useCaixas();

  // Sem caixa na URL: anúncio de fruta, verdura ou outro, com prazo até o fim da feira
  if (!idCaixa) {
    return (
      <>
        <AppHeader titulo="Anunciar na xepa" subtitulo="Fruta, verdura e outros" voltarPara="/feirante" />
        <main className="px-4 pb-10">
          <Formulario caixa={null} />
        </main>
      </>
    );
  }

  if (carregando) return <LoadingState />;

  const caixa = caixas.find((c) => c.id === idCaixa) ?? null;

  // RN1: caixa em descarte, sem leitura ou com leitura antiga não gera oferta. O motivo vem pronto do hook.
  if (!caixa || !caixa.podeAnunciar) {
    const motivo = caixa ? caixa.motivoBloqueio ?? 'Essa caixa não pode anunciar agora.' : 'Essa caixa não existe.';
    return (
      <>
        <AppHeader titulo="Anunciar na xepa" voltarPara="/feirante" />
        <main className="flex flex-col gap-4 px-4 pb-10">
          <p className="rounded-control bg-bad-bg p-4 font-bold text-bad">{motivo}</p>
          <Link href="/feirante" className="flex min-h-11 items-center justify-center font-bold text-accent underline">
            Voltar para as caixas
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader
        titulo="Anunciar na xepa"
        subtitulo={`${caixa.nome}, ainda segura por ${formatarDuracao(caixa.minutosRestantes)}`}
        voltarPara="/feirante"
      />
      <main className="px-4 pb-10">
        <Formulario caixa={caixa} />
      </main>
    </>
  );
}

// useSearchParams precisa de <Suspense> porque o site é exportado como páginas estáticas
export default function PaginaAnunciar() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Anunciar />
    </Suspense>
  );
}
