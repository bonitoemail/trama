import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import Recibo from '@/components/Recibo';
import { carregarJogo, carregarRelogios } from '@/engine/load';
import { CODIGO, horaDoPalpite, MINIMO_PALPITES, placarDePalpites, situacao } from '@/lib/palpites';
import { contarPalpites, lerPalpite } from '@/lib/palpitesServidor';
import { SITE } from '@/lib/site';

/**
 * O recibo de um palpite (notas/palpites.md): o que foi cravado, quando (hora do servidor) e, depois
 * da notícia, se aconteceu. Pronto do servidor, para a prévia de link mostrar o palpite. Cada link é
 * de uma pessoa: fora dos buscadores.
 */
export const dynamic = 'force-dynamic';

type Params = Promise<{ codigo: string }>;

// Os metadados e a página leem o mesmo palpite: uma leitura do banco por visita.
const montar = cache(async (codigo: string) => {
  if (!CODIGO.test(codigo)) return null;
  const p = await lerPalpite(codigo);
  if (!p) return null;
  const jogo = carregarJogo();
  const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
  const s = situacao(jogo, carregarRelogios(), p, hoje);
  if (!s) return null;
  // Os números dos outros só depois da trava, contando os palpites de antes da notícia.
  let placar = null;
  if (s.estado === 'acertou' || s.estado === 'errou') {
    const contagem = await contarPalpites(600);
    const pl = contagem ? placarDePalpites(jogo, contagem, p.capitulo, p.no, s.data) : null;
    if (pl && pl.total >= MINIMO_PALPITES) placar = pl;
  }
  return { jogo, p, s, placar };
});

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { codigo } = await params;
  const m = await montar(codigo);
  if (!m) return { title: 'Palpite · Trama', robots: { index: false } };
  const title = `Meu palpite: ${m.s.minha} · Trama`;
  const description =
    m.s.estado === 'acertou' ? `Aconteceu. Cravado em ${horaDoPalpite(m.p.criado_em)}.`
    : m.s.estado === 'errou' ? `Não aconteceu. Aconteceu: ${m.s.aconteceu}.`
    : `Cravado em ${horaDoPalpite(m.p.criado_em)}, sobre "${m.s.titulo}". E o seu palpite?`;
  const imagem = { url: `/api/og?palpite=${codigo}`, width: 1200, height: 630, alt: title };
  return {
    title,
    description,
    robots: { index: false },
    openGraph: { title, description, url: `/palpite/${codigo}`, images: [imagem], siteName: m.jogo.titulo, locale: 'pt_BR', type: 'website' },
    twitter: { title, description, images: [imagem.url] },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { codigo } = await params;
  const m = await montar(codigo);
  if (!m) notFound();
  return (
    <Recibo
      codigo={codigo}
      link={`${SITE}/palpite/${codigo}`}
      situacao={m.s}
      hora={horaDoPalpite(m.p.criado_em)}
      placar={m.placar}
      titulo={m.jogo.titulo}
    />
  );
}
