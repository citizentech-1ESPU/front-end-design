import { Archivo, Atkinson_Hyperlegible } from 'next/font/google';
import './globals.css';

// Atkinson Hyperlegible no texto: feita para leitura fácil ("letras legíveis", pág. 22 do PDF)
const atkinson = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-atkinson',
  display: 'swap',
});

// Archivo nos títulos, a mesma família desenhada na logo
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-archivo',
  display: 'swap',
});

export const metadata = {
  title: 'Xepa Certa: a caixa térmica que avisa a hora da xepa',
  description: 'Sensor na caixa térmica da feira, xepa anunciada no celular e sobra boa doada antes de estragar.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1D4E89',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${atkinson.variable} ${archivo.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
