// Telas do app (feirante, freguês e ONG): no celular, uma coluna; no computador, a largura toda até 72rem
export default function AppLayout({ children }) {
  return <div className="app mx-auto min-h-dvh w-full max-w-6xl bg-paper">{children}</div>;
}
