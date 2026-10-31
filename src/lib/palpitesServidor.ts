import { type Palpite, novoCodigo } from './palpites';
import { rpc } from './supabase';

/**
 * Os palpites no banco (tabela `palpites`, funções `cravar`, `palpite` e `palpites_contagem`).
 * No `npm run dev`, sem REGISTRO_EM_DEV=1, ficam só na memória do servidor: dá para testar o recibo
 * de ponta a ponta sem sujar o placar de verdade (a mesma regra do registro de partidas).
 */

const naMemoria = (): boolean => process.env.NODE_ENV === 'development' && process.env.REGISTRO_EM_DEV !== '1';

// Sobrevive à recarga de módulo do dev; zera ao reiniciar o servidor.
const memoria = ((globalThis as { __palpites?: Map<string, Palpite & { aparelho: string }> }).__palpites ??= new Map());

export interface Cravado {
  codigo: string;
  escolha: string;
  criado_em: string;
}

/**
 * Crava. Se o aparelho já cravou nesta decisão, devolve o palpite que já existia. 'limite' quando o
 * aparelho passou do teto de palpites (a função do banco não grava); null se o banco falhou.
 */
export async function cravarNoBanco(p: { aparelho: string; capitulo: string; no: string; escolha: string; origem: string }): Promise<Cravado | 'limite' | null> {
  if (naMemoria()) {
    const ja = [...memoria.entries()].find(([, x]) => x.aparelho === p.aparelho && x.capitulo === p.capitulo && x.no === p.no);
    if (ja) return { codigo: ja[0], escolha: ja[1].escolha, criado_em: ja[1].criado_em };
    const codigo = novoCodigo();
    const criado_em = new Date().toISOString();
    memoria.set(codigo, { ...p, criado_em });
    return { codigo, escolha: p.escolha, criado_em };
  }
  const r = await rpc('cravar', {
    p_codigo: novoCodigo(),
    p_aparelho: p.aparelho,
    p_capitulo: p.capitulo,
    p_no: p.no,
    p_escolha: p.escolha,
    p_origem: p.origem,
  });
  if (!r || r instanceof Error || !r.ok) {
    if (r) console.error('cravar falhou:', r instanceof Error ? r.message : `${r.status} ${await r.text()}`);
    return null;
  }
  const [linha] = (await r.json()) as Cravado[];
  return linha ?? 'limite';
}

/** O palpite pelo código do recibo, ou null. */
export async function lerPalpite(codigo: string): Promise<Palpite | null> {
  if (naMemoria()) {
    const x = memoria.get(codigo);
    return x ? { capitulo: x.capitulo, no: x.no, escolha: x.escolha, criado_em: x.criado_em } : null;
  }
  const r = await rpc('palpite', { p_codigo: codigo });
  if (!r || r instanceof Error || !r.ok) return null;
  const [linha] = (await r.json()) as Palpite[];
  return linha ?? null;
}

export interface ContagemPalpite {
  capitulo: string;
  no: string;
  escolha: string;
  /** Dia de Brasília (AAAA-MM-DD). */
  dia: string;
  n: number;
}

/** Quantos cravaram cada opção, por dia. O placar só usa os de antes da notícia. */
export async function contarPalpites(guardar?: number): Promise<ContagemPalpite[] | null> {
  if (naMemoria()) {
    const dias = new Map<string, ContagemPalpite>();
    for (const x of memoria.values()) {
      const dia = new Date(x.criado_em).toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
      const k = `${x.capitulo}/${x.no}/${x.escolha}/${dia}`;
      const c = dias.get(k) ?? { capitulo: x.capitulo, no: x.no, escolha: x.escolha, dia, n: 0 };
      c.n += 1;
      dias.set(k, c);
    }
    return [...dias.values()];
  }
  const r = await rpc('palpites_contagem', {}, guardar);
  if (!r || r instanceof Error || !r.ok) return null;
  return ((await r.json()) as ContagemPalpite[]).map((l) => ({ ...l, n: Number(l.n) }));
}
