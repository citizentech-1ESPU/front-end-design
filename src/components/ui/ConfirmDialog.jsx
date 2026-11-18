'use client';
import { useEffect, useId, useRef } from 'react';

// Pergunta antes de uma ação que não tem volta (excluir oferta, cancelar reserva).
// Abre com o foco no "Cancelar" (o caminho seguro), fecha com Esc e o Tab fica preso nos dois botões.
export default function ConfirmDialog({ aberto, titulo, mensagem, rotuloConfirmar = 'Excluir', onConfirmar, onCancelar }) {
  const idTitulo = useId();
  const cancelar = useRef(null);
  const confirmar = useRef(null);

  useEffect(() => {
    if (!aberto) return undefined;
    cancelar.current?.focus();

    function tecla(evento) {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        onCancelar();
      }
      if (evento.key === 'Tab') {
        // Tab circula só entre "Cancelar" e o botão de confirmar
        const primeiro = cancelar.current;
        const ultimo = confirmar.current;
        if (evento.shiftKey && document.activeElement === primeiro) {
          evento.preventDefault();
          ultimo?.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
          evento.preventDefault();
          primeiro?.focus();
        }
      }
    }

    document.addEventListener('keydown', tecla);
    return () => document.removeEventListener('keydown', tecla); // limpeza ao fechar
  }, [aberto, onCancelar]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 sm:items-center">
      <div role="dialog" aria-modal="true" aria-labelledby={idTitulo} className="w-full max-w-md rounded-card bg-paper p-5">
        <h2 id={idTitulo} className="font-display text-lg font-extrabold">
          {titulo}
        </h2>
        {mensagem && <p className="mt-2 text-muted">{mensagem}</p>}
        <div className="mt-5 flex gap-3">
          <button
            ref={cancelar}
            type="button"
            onClick={onCancelar}
            className="min-h-11 flex-1 rounded-control bg-paper-2 px-4 font-bold text-ink transition-colors hover:bg-paper-3 active:bg-paper-3"
          >
            Cancelar
          </button>
          <button
            ref={confirmar}
            type="button"
            onClick={onConfirmar}
            className="min-h-11 flex-1 rounded-control bg-bad px-4 font-bold text-accent-ink transition-colors hover:opacity-90 active:opacity-90"
          >
            {rotuloConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
