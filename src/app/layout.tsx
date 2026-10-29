import type { Metadata, Viewport } from 'next';
import { Unbounded } from 'next/font/google';
import './globals.css';

// Fonte só do título da marca, para separá-lo do texto do jogo.
const titulo = Unbounded({ subsets: ['latin'], weight: ['500'], variable: '--titulo' });

export const metadata: Metadata = {
  title: 'Trama',
  description: 'Uma história ramificada sobre o que pode acontecer com o Brasil até 2030.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f0f11',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={titulo.variable}>
      <body>{children}</body>
    </html>
  );
}
