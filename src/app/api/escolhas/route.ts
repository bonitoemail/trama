import { carregarJogo, carregarRelogios } from '@/engine/load';
import { CRUZAMENTOS, montarPainel, type Contagem, type LinhaCruzada } from '@/lib/escolhas';
import { rpc } from '@/lib/supabase';

/**
 * Números da tela /escolhas: lê as somas no Supabase (nenhuma partida sai de lá), monta os blocos
 * e guarda o resultado por uma hora. Sem Supabase (dev sem .env.local), responde 204 e a tela avisa.
 */
export const revalidate = 3600;

async function ler<T>(funcao: string, corpo?: Record<string, unknown>): Promise<T[] | null> {
  const r = await rpc(funcao, corpo, revalidate);
  if (!r) return null;
  if (r instanceof Error || !r.ok) {
    console.error(`${funcao} falhou:`, r instanceof Error ? r.message : `${r.status} ${await r.text()}`);
    return null;
  }
  return r.json();
}

export async function GET() {
  const linhas = await ler<Contagem>('escolhas_contagem');
  if (!linhas) return new Response(null, { status: 204 });

  const separar = (ref: string) => ref.split('/');
  const cruzadas = await Promise.all(
    CRUZAMENTOS.map(async (c) => {
      const [a_capitulo, a_no] = separar(c.a);
      const [b_capitulo, b_no] = separar(c.b);
      return (await ler<LinhaCruzada>('escolhas_cruzamento', { a_capitulo, a_no, b_capitulo, b_no })) ?? [];
    }),
  );

  const agora = new Date();
  const hoje = agora.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
  const painel = montarPainel(carregarJogo(), linhas.map((l) => ({ ...l, n: Number(l.n) })), {
    hoje,
    agora: agora.toISOString(),
    relogios: carregarRelogios(),
    cruzadas: cruzadas.map((ls) => ls.map((l) => ({ ...l, n: Number(l.n) }))),
  });
  return Response.json(painel);
}
