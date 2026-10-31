import { carregarJogo, carregarRelogios } from '@/engine/load';
import { aConfirmar } from '@/engine/relogios';
import { CRUZAMENTOS, corteDoCruzamento, montarPainel, type Contagem, type LinhaCruzada, type Painel } from '@/lib/escolhas';
import { MINIMO_PALPITES, placarDePalpites } from '@/lib/palpites';
import { contarPalpites } from '@/lib/palpitesServidor';
import { rpc } from '@/lib/supabase';

/**
 * O painel de /escolhas montado no servidor: lê as somas no Supabase (nenhuma partida sai de lá) e
 * monta os blocos. Usado por /api/escolhas e pela imagem de prévia (/api/og). Sem Supabase, null.
 */

/** As somas mudam devagar: uma leitura por hora basta. */
export const GUARDAR = 3600;

async function ler<T>(funcao: string, corpo?: Record<string, unknown>): Promise<T[] | null> {
  const r = await rpc(funcao, corpo, GUARDAR);
  if (!r) return null;
  if (r instanceof Error || !r.ok) {
    console.error(`${funcao} falhou:`, r instanceof Error ? r.message : `${r.status} ${await r.text()}`);
    return null;
  }
  return r.json();
}

export async function painelDoServidor(): Promise<Painel | null> {
  const linhas = await ler<Contagem>('escolhas_contagem');
  if (!linhas) return null;

  const jogo = carregarJogo();
  const relogios = carregarRelogios();
  const agora = new Date();
  const hoje = agora.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });

  const separar = (ref: string) => ref.split('/');
  const cruzadas = await Promise.all(
    CRUZAMENTOS.map(async (c) => {
      const [a_capitulo, a_no] = separar(c.a);
      const [b_capitulo, b_no] = separar(c.b);
      // Só partidas que escolheram as duas antes da notícia (auditoria de 31/10, A3).
      const ate = corteDoCruzamento(jogo, c, relogios, hoje);
      return (await ler<LinhaCruzada>('escolhas_cruzamento', { a_capitulo, a_no, b_capitulo, b_no, ate })) ?? [];
    }),
  );

  const painel = montarPainel(jogo, linhas.map((l) => ({ ...l, n: Number(l.n) })), {
    hoje,
    agora: agora.toISOString(),
    relogios,
    cruzadas: cruzadas.map((ls) => ls.map((l) => ({ ...l, n: Number(l.n) }))),
  });

  // Palpites: o total das decisões ainda abertas e o placar das que a realidade decidiu.
  const contagem = await contarPalpites(GUARDAR);
  if (contagem?.length) {
    const palpites: NonNullable<Painel['palpites']> = {};
    for (const d of aConfirmar(jogo, relogios)) {
      const total = contagem.filter((l) => l.capitulo === d.capitulo && l.no === d.no).reduce((s, l) => s + l.n, 0);
      if (total) palpites[`${d.capitulo}/${d.no}`] = { total };
    }
    for (const cap of jogo.capitulos) {
      for (const no of cap.nos) {
        const real = no.escolhas?.find((e) => e.real)?.real;
        const placar = real && placarDePalpites(jogo, contagem, cap.id, no.id, real.data);
        if (placar && placar.total) palpites[`${cap.id}/${no.id}`] = { total: placar.total, ...(placar.total >= MINIMO_PALPITES ? { placar } : {}) };
      }
    }
    painel.palpites = palpites;
  }
  return painel;
}
