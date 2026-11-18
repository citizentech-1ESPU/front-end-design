'use client';
import { useCallback, useState } from 'react';
import { useReservas } from '@/hooks/useReservas';
import AppHeader from '@/components/layout/AppHeader';
import BottomNav from '@/components/layout/BottomNav';
import ReservaCard from '@/components/oferta/ReservaCard';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import Toast from '@/components/ui/Toast';

// Minhas reservas: as compras feitas neste navegador (sem login), com cancelar
export default function MinhasReservas() {
  const { reservas, carregando, erro, cancelar } = useReservas('compra');
  const [paraCancelar, setParaCancelar] = useState(null);
  const [aviso, setAviso] = useState(null);
  const fecharAviso = useCallback(() => setAviso(null), []);

  async function confirmar() {
    const id = paraCancelar;
    setParaCancelar(null);
    const resultado = await cancelar(id);
    setAviso(resultado.ok ? 'Reserva cancelada.' : resultado.erro);
  }

  let conteudo;
  if (carregando) conteudo = <LoadingState />;
  else if (erro) conteudo = <ErrorState mensagem={erro} onTentarDeNovo={() => window.location.reload()} />;
  else if (reservas.length === 0) conteudo = <EmptyState mensagem="Você ainda não reservou nada." rotuloAcao="Ver a xepa" hrefAcao="/xepa" />;
  else
    conteudo = (
      <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reservas.map((reserva) => (
          <ReservaCard key={reserva.id} reserva={reserva} onCancelar={setParaCancelar} />
        ))}
      </div>
    );

  return (
    <>
      <AppHeader titulo="Minhas reservas" subtitulo="Guardadas neste celular" />
      <main className="flex flex-col gap-3 px-4 pb-24 pt-4 md:px-8 md:pb-12">{conteudo}</main>
      <ConfirmDialog
        aberto={paraCancelar !== null}
        titulo="Cancelar a reserva?"
        mensagem="A quantidade volta para os outros fregueses."
        rotuloConfirmar="Cancelar reserva"
        onConfirmar={confirmar}
        onCancelar={() => setParaCancelar(null)}
      />
      {aviso && <Toast mensagem={aviso} onFechar={fecharAviso} />}
      <BottomNav perfil="fregues" ativa="reservas" />
    </>
  );
}
