import './globals.css';

export const metadata = {
  title: 'Xepa Certa',
  description: 'A caixa térmica avisa a hora da xepa. O site leva a sobra boa a quem precisa, antes de estragar.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
