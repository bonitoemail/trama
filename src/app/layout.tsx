import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { IBM_Plex_Sans, Source_Serif_4, Unbounded } from 'next/font/google';
import './globals.css';
import './capa.css';
import { SITE } from '@/lib/site';

// Fonte só do título da marca, para separá-lo do texto do jogo.
const titulo = Unbounded({ subsets: ['latin'], weight: ['500'], variable: '--titulo' });
// Fontes da capa e das telas de explicação (Inicio.tsx); o jogo em si segue com as suas.
const capaSerif = Source_Serif_4({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--capa-serif' });
const capaSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--capa-sans' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Trama',
  description: 'Uma história ramificada sobre o que pode acontecer com o Brasil até 2030.',
  openGraph: { siteName: 'Trama', locale: 'pt_BR', type: 'website' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f0f11',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={[titulo, capaSerif, capaSans].map((f) => f.variable).join(' ')}>
      <body>
        {children}
        {/* Visitas por página, sem cookie (Vercel Web Analytics); as escolhas vão pelo registro próprio. */}
        <Analytics />
      </body>
    </html>
  );
}
