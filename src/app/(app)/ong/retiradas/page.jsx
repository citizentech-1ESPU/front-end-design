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

// Minhas retiradas: as doações combinadas neste navegador, com cancelar
export default function MinhasRetiradas() {
  const { reservas, carregando, erro, cancelar } = useReservas('doacao');
  const [paraCancelar, setParaCancelar] = useState(null);
  const [aviso, setAviso] = useState(null);
  const fecharAviso = useCallback(() => setAviso(null), []);

  async function confirmar() {
    const id = paraCancelar;
    setParaCancelar(null);
    const resultado = await cancelar(id);
    setAviso(resultado.ok ? 'Retirada cancelada.' : resultado.erro);
  }

  let conteudo;
  if (carregando) conteudo = <LoadingState />;
  else if (erro) conteudo = <ErrorState mensagem={erro} onTentarDeNovo={() => window.location.reload()} />;
  else if (reservas.length === 0) conteudo = <EmptyState mensagem="Nenhuma retirada combinada." rotuloAcao="Ver doações" hrefAcao="/ong" />;
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
      <AppHeader titulo="Minhas retiradas" subtitulo="Guardadas neste celular" />
      <main className="flex flex-col gap-3 px-4 pb-24 pt-4 md:px-8 md:pb-12">{conteudo}</main>
      <ConfirmDialog
        aberto={paraCancelar !== null}
        titulo="Cancelar a retirada?"
        mensagem="A doação volta para outras ONGs."
        rotuloConfirmar="Cancelar retirada"
        onConfirmar={confirmar}
        onCancelar={() => setParaCancelar(null)}
      />
      {aviso && <Toast mensagem={aviso} onFechar={fecharAviso} />}
      <BottomNav perfil="ong" ativa="retiradas" />
    </>
  );
}
