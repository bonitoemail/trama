import { carregarJogo } from '@/engine/load';
import type { Jogo } from '@/engine/schema';
import { validarEvento } from '@/lib/registro';
import { rpc } from '@/lib/supabase';

/**
 * Recebe um evento da partida, confere contra o conteúdo e grava no Supabase pela função
 * registrar(), a única porta de escrita (a chave pública não lê nem grava nada).
 * Responde 204 sempre: quem joga não precisa saber se o registro deu certo.
 */

let jogo: Jogo | null = null;

export async function POST(req: Request) {
  // Partidas de teste no `npm run dev` não entram na conta, a não ser com REGISTRO_EM_DEV=1.
  if (process.env.NODE_ENV === 'development' && process.env.REGISTRO_EM_DEV !== '1') return new Response(null, { status: 204 });

  jogo ??= carregarJogo();
  const evento = validarEvento(jogo, await req.json().catch(() => null));
  if (!evento) return new Response(null, { status: 204 });

  const r = await rpc('registrar', {
    p_partida: evento.partida,
    p_tipo: evento.tipo,
    p_versao: evento.versao,
    p_origem: evento.origem ?? 'direto',
    p_capitulo: evento.capitulo ?? '',
    p_no: evento.no ?? '',
    p_escolha: evento.escolha ?? '',
  });
  if (!r) return new Response(null, { status: 204 });
  if (r instanceof Error || !r.ok) {
    console.error('registro falhou:', r instanceof Error ? r.message : `${r.status} ${await r.text()}`);
  }
  return new Response(null, { status: 204 });
}
