// Telas do app (feirante, freguês e ONG): coluna de celular centralizada, também no computador
export default function AppLayout({ children }) {
  return <div className="app mx-auto min-h-dvh w-full max-w-lg bg-paper">{children}</div>;
}
