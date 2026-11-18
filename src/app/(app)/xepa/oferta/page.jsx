'use client';
import { Suspense, useCallback, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useOferta } from '@/hooks/useOferta';
import { useReservas } from '@/hooks/useReservas';
import { CATEGORIAS_COM_FRIO } from '@/domain/constantes';
import { formatarHora } from '@/domain/tempo';
import ReservaForm from '@/components/formularios/ReservaForm';
import AppHeader from '@/components/layout/AppHeader';
import PriceTag from '@/components/oferta/PriceTag';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import Toast from '@/components/ui/Toast';

function SemOferta({ texto }) {
  return (
    <>
      <AppHeader titulo="Oferta" voltarPara="/xepa" />
      <main className="flex flex-col gap-4 px-4 pb-10 pt-4 md:px-8">
        <p className="rounded-control bg-card p-4 font-bold">{texto}</p>
        <Link href="/xepa" className="flex min-h-11 items-center justify-center font-bold text-accent underline">
          Ver outras ofertas
        </Link>
      </main>
    </>
  );
}

// Selo de confiança (RN8): só oferta de caixa com sensor diz "temperatura conferida"
function Confianca({ oferta }) {
  const comFrio = CATEGORIAS_COM_FRIO.includes(oferta.categoria);
  let titulo;
  if (oferta.fonteCaixa === 'sensor' && oferta.conferidaEm) titulo = `Temperatura conferida às ${formatarHora(oferta.conferidaEm)}`;
  else if (oferta.fonteCaixa === 'simulada' && oferta.conferidaEm) titulo = `Conferida às ${formatarHora(oferta.conferidaEm)} (simulação)`;
  else titulo = 'Sem caixa térmica: fruta e verdura';

  return (
    <div className={`rounded-control p-3 ${oferta.fonteCaixa ? 'bg-ok-bg text-ok-ink' : 'bg-paper-2 text-ink'}`}>
      <p className="font-bold">
        
        <span>{titulo}</span>
      </p>
      {comFrio && (
        <p className="text-sm">
          {`Segura para venda até ${formatarHora(oferta.venderAte)}. Bom para o almoço de hoje. Prepare assim que chegar em casa.`}
        </p>
      )}
    </div>
  );
}

function DetalheOferta() {
  const id = useSearchParams().get('id');
  const { oferta, disponivel, carregando, erro, recarregar } = useOferta(id);
  const { reservar } = useReservas('compra');
  const [valores, setValores] = useState({ quantidade: 1, apelido: '' });
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [reservou, setReservou] = useState(false);
  const [aviso, setAviso] = useState(null);
  const fecharAviso = useCallback(() => setAviso(null), []);

  if (!id) return <SemOferta texto="Essa oferta não existe mais." />;
  if (carregando) return <LoadingState />;
  if (erro) return <ErrorState mensagem={erro} onTentarDeNovo={recarregar} />;
  if (!oferta) return <SemOferta texto="Essa oferta não existe mais." />;
  if (!reservou && (!oferta.ativa || disponivel <= 0)) return <SemOferta texto="Essa oferta acabou." />;

  function alterar(campo, valor) {
    setValores((atuais) => ({ ...atuais, [campo]: valor }));
    setErros((atuais) => ({ ...atuais, [campo]: undefined }));
  }

  async function enviar() {
    setEnviando(true);
    const resultado = await reservar({ ofertaId: id, ...valores });
    setEnviando(false);
    if (resultado.ok) {
      setErros({});
      setReservou(true);
      setAviso(`Reserva feita! Retire na banca até ${formatarHora(resultado.reserva.retirarAte)}.`);
      setValores({ quantidade: 1, apelido: '' });
      recarregar();
    } else {
      setErros(resultado.erros ?? {});
    }
  }

  return (
    <>
      <AppHeader titulo={oferta.produto} subtitulo={`${oferta.banca}, ${oferta.feira}`} voltarPara="/xepa" />
      <main className="grid items-start gap-4 px-4 pb-10 pt-4 md:grid-cols-2 md:gap-8 md:px-8">
        <div className="flex flex-col gap-4">
          <PriceTag precoNormal={oferta.precoNormal} precoXepa={oferta.precoXepa} unidade={oferta.unidade} grande />
          <Confianca oferta={oferta} />
        </div>

        {reservou ? (
          <div className="flex flex-col gap-3 rounded-card border border-rule p-4">
            <p className="font-bold">Sua reserva está guardada neste celular.</p>
            <Link href="/xepa/reservas" className="flex min-h-11 items-center justify-center rounded-control bg-accent px-4 font-bold text-accent-ink">
              Ver minhas reservas
            </Link>
          </div>
        ) : (
          <section aria-labelledby="titulo-reserva" className="flex flex-col gap-3 rounded-card border border-rule p-4">
            <h2 id="titulo-reserva" className="font-display text-lg font-extrabold">
              Reservar
            </h2>
            <ReservaForm
              tipo="compra"
              valores={valores}
              erros={erros}
              disponivel={disponivel}
              unidade={oferta.unidade}
              venderAte={oferta.venderAte}
              enviando={enviando}
              onAlterar={alterar}
              onEnviar={enviar}
            />
          </section>
        )}
      </main>
      {aviso && <Toast mensagem={aviso} onFechar={fecharAviso} />}
    </>
  );
}

export default function PaginaDetalheOferta() {
  return (
    <Suspense fallback={<LoadingState />}>
      <DetalheOferta />
    </Suspense>
  );
}
