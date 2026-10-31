import { carregarJogo } from '@/engine/load';
import type { Jogo } from '@/engine/schema';
import { rpc } from '@/lib/supabase';

/**
 * O quanto um caminho é raro, para o cartão de compartilhar do fim de capítulo (lib/cartao.ts).
 * GET /api/raridade?cap=cap01&c=pedido.preventiva,itamaraty.ignora (cenas na ordem do capítulo, cada uma uma vez)
 * Responde { maisComuns, maisRaros, total } (porcentagens dos caminhos que fecharam o capítulo),
 * ou 204 sem Supabase, com caminho que não bate com o conteúdo, ou com menos de MINIMO caminhos.
 */

/** Abaixo disso, o número não diz nada: o cartão sai sem ele. */
const MINIMO = 30;

let jogo: Jogo | null = null;

export async function GET(req: Request) {
  jogo ??= carregarJogo();
  const url = new URL(req.url);
  const cap = jogo.capitulos.find((c) => c.id === url.searchParams.get('cap'));
  const caminho = (url.searchParams.get('c') ?? '').split(',').filter(Boolean).map((p) => {
    const [no, escolha] = p.split('.');
    return { no, escolha };
  });
  // Caminho canônico: cada cena uma vez, na ordem do capítulo. Cena repetida somava o peso de novo
  // (dava "100%" forjado), e ordens diferentes do mesmo caminho furavam o cache (auditoria de 31/10, A2).
  const ordem = cap ? cap.nos.map((n) => n.id) : [];
  const indices = caminho.map((p) => ordem.indexOf(p.no));
  const valido = cap && caminho.length > 0 &&
    indices.every((i, k) => i >= 0 && (k === 0 || i > indices[k - 1])) &&
    caminho.every((p) => cap.nos.find((n) => n.id === p.no)?.escolhas?.some((e) => e.id === p.escolha));
  if (!valido) return new Response(null, { status: 204 });

  const r = await rpc('caminho_raridade', { p_capitulo: cap.id, p_caminho: caminho });
  if (!r) return new Response(null, { status: 204 });
  if (r instanceof Error || !r.ok) {
    console.error('caminho_raridade falhou:', r instanceof Error ? r.message : `${r.status} ${await r.text()}`);
    return new Response(null, { status: 204 });
  }
  const [linha] = (await r.json()) as { mais_comuns: number; mais_raros: number; total: number }[];
  if (!linha || Number(linha.total) < MINIMO) return new Response(null, { status: 204 });

  return Response.json(
    { maisComuns: linha.mais_comuns, maisRaros: linha.mais_raros, total: Number(linha.total) },
    // O mesmo caminho dá o mesmo número por dez minutos: a CDN guarda pela URL.
    { headers: { 'cache-control': 'public, s-maxage=600, stale-while-revalidate=3600' } },
  );
}
