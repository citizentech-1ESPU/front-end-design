'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOferta } from '@/hooks/useOferta';
import { useOfertaForm } from '@/hooks/useOfertaForm';
import OfertaForm from '@/components/formularios/OfertaForm';
import AppHeader from '@/components/layout/AppHeader';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';

function Aviso({ texto }) {
  return (
    <main className="flex flex-col gap-4 px-4 pb-10">
      <p className="rounded-control border border-rule p-4 font-bold">{texto}</p>
      <Link href="/feirante/ofertas" className="flex min-h-11 items-center justify-center font-bold text-accent underline">
        Voltar para suas ofertas
      </Link>
    </main>
  );
}

// O formulário só monta com a oferta carregada, para já vir preenchido com ela
function Formulario({ oferta }) {
  const router = useRouter();
  const form = useOfertaForm({ caixa: null, oferta });

  async function salvar() {
    const resultado = await form.enviar();
    if (resultado.ok) router.push('/feirante/ofertas?editada=1');
  }

  return (
    <main className="px-4 pb-10">
      <OfertaForm
        modo="editar"
        valores={form.valores}
        erros={form.erros}
        categorias={form.categorias}
        precoSugerido={form.precoSugerido}
        prazoMaximo={form.prazoMaximo}
        opcoesPrazo={form.opcoesPrazo}
        enviando={form.enviando}
        onAlterar={form.alterar}
        onEnviar={salvar}
      />
    </main>
  );
}

function EditarOferta() {
  const id = useSearchParams().get('id');
  const { oferta, carregando, erro, recarregar } = useOferta(id);

  let conteudo;
  if (carregando) conteudo = <LoadingState />;
  else if (erro) conteudo = <ErrorState mensagem={erro} onTentarDeNovo={recarregar} />;
  else if (!oferta) conteudo = <Aviso texto="Essa oferta não existe mais." />;
  else if (!oferta.ativa) conteudo = <Aviso texto="Essa oferta já foi encerrada." />;
  else conteudo = <Formulario oferta={oferta} />;

  return (
    <>
      <AppHeader titulo="Editar oferta" subtitulo={oferta?.produto} voltarPara="/feirante/ofertas" />
      {conteudo}
    </>
  );
}

export default function PaginaEditarOferta() {
  return (
    <Suspense fallback={<LoadingState />}>
      <EditarOferta />
    </Suspense>
  );
}
