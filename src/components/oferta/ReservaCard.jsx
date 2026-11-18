import { formatarQuantidade } from '@/domain/precos';
import { formatarHora } from '@/domain/tempo';
import Button from '@/components/ui/Button';

// Reserva do freguês (compra) ou retirada combinada da ONG (doação), com o botão de cancelar.
// Se a banca excluiu a oferta, a reserva continua aparecendo, para a pessoa saber o que houve.
export default function ReservaCard({ reserva, onCancelar }) {
  const { oferta } = reserva;
  const doacao = reserva.tipo === 'doacao';
  const hora = formatarHora(reserva.retirarAte);

  return (
    <article className="flex flex-col gap-2 rounded-card border border-rule p-4">
      {oferta ? (
        <>
          <h2 className="font-display text-lg font-extrabold">
            {`${formatarQuantidade(reserva.quantidade, oferta.unidade)} de ${oferta.produto}`}
          </h2>
          <p className="font-bold">{doacao ? `Retirada às ${hora} na ${oferta.banca}` : `Retire na ${oferta.banca} até ${hora}`}</p>
          {!doacao && <p className="text-sm text-muted">Pague na banca, na hora de retirar.</p>}
        </>
      ) : (
        <p className="font-bold text-muted">Oferta encerrada pela banca</p>
      )}
      <Button variante="perigo" onClick={() => onCancelar(reserva.id)}>
        {doacao ? 'Cancelar retirada' : 'Cancelar reserva'}
      </Button>
    </article>
  );
}
