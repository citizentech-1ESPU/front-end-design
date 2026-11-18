'use client';
import { useEffect } from 'react';

// Aviso que aparece no rodapé ("Reserva feita!") e some sozinho depois de alguns segundos
export default function Toast({ mensagem, onFechar, duracaoMs = 4000 }) {
  useEffect(() => {
    const temporizador = setTimeout(onFechar, duracaoMs);
    return () => clearTimeout(temporizador); // não chama onFechar se a tela fechar antes
  }, [onFechar, duracaoMs]);

  return (
    <div className="fixed inset-x-0 bottom-20 z-40 mx-auto flex max-w-lg justify-center px-4">
      <p role="status" className="w-full rounded-control bg-ink px-4 py-3 text-center font-bold text-paper">
        {mensagem}
      </p>
    </div>
  );
}
