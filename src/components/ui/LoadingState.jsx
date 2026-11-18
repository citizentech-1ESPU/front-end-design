// "Carregando…" escrito (não só uma animação), anunciado pelo leitor de tela
export default function LoadingState({ mensagem = 'Carregando…' }) {
  return (
    <p role="status" className="p-6 text-center font-bold text-muted">
      {mensagem}
    </p>
  );
}
