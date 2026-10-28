import type { Capitulo, Condicao, Escolha, Jogo, No, Texto } from './schema';

/**
 * Motor puro: sem React, sem navegador. Recebe o jogo e o estado, devolve o próximo estado.
 * As escolhas são irreversíveis: não existe função de voltar.
 */

export interface Passo {
  capitulo: string;
  no: string;
  escolha: string | null; // null = nó só de texto (segue)
}

export type Fase = 'jogando' | 'fim_capitulo' | 'fim_jogo';

export interface Estado {
  versao: string;
  fase: Fase;
  capitulo: string;
  no: string;
  marcas: string[];
  historico: Passo[];
  /** Preenchido em fim_capitulo: para onde a história vai. */
  proximo: string | null;
}

export const FIM = 'FIM';

export function vale(cond: Condicao | undefined, marcas: ReadonlySet<string> | string[]): boolean {
  if (!cond) return true;
  const set = marcas instanceof Set ? marcas : new Set(marcas);
  if ('tem' in cond) return set.has(cond.tem);
  if ('nao_tem' in cond) return !set.has(cond.nao_tem);
  if ('todas' in cond) return cond.todas.every((c) => vale(c, set));
  return cond.qualquer.some((c) => vale(c, set));
}

/** Resolve o texto condicional em parágrafos prontos para exibir. */
export function paragrafos(texto: Texto, marcas: string[]): string[] {
  const partes = typeof texto === 'string' ? [texto] : texto;
  const out: string[] = [];
  for (const p of partes) {
    const t = typeof p === 'string' ? p : vale(p.se, marcas) ? p.texto : p.senao;
    if (t) out.push(...t.trim().split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean));
  }
  return out;
}

export function capitulo(jogo: Jogo, id: string): Capitulo {
  const c = jogo.capitulos.find((x) => x.id === id);
  if (!c) throw new Error(`Capítulo inexistente: ${id}`);
  return c;
}

export function no(jogo: Jogo, capId: string, noId: string): No {
  const n = capitulo(jogo, capId).nos.find((x) => x.id === noId);
  if (!n) throw new Error(`Nó inexistente: ${capId}/${noId}`);
  return n;
}

export function escolhasDisponiveis(n: No, marcas: string[]): Escolha[] {
  return (n.escolhas ?? []).filter((e) => vale(e.se, marcas));
}

export function saidaDoCapitulo(cap: Capitulo, marcas: string[]): string {
  const s = cap.saidas.find((x) => vale(x.quando, marcas));
  if (!s) throw new Error(`Capítulo ${cap.id} sem saída para as marcas [${marcas.join(', ')}]`);
  return s.para;
}

export function novoJogo(jogo: Jogo): Estado {
  const cap = capitulo(jogo, jogo.primeiro_capitulo);
  return {
    versao: jogo.versao,
    fase: 'jogando',
    capitulo: cap.id,
    no: cap.inicio,
    marcas: [],
    historico: [],
    proximo: null,
  };
}

function encerrarCapitulo(jogo: Jogo, estado: Estado): Estado {
  const proximo = saidaDoCapitulo(capitulo(jogo, estado.capitulo), estado.marcas);
  return { ...estado, fase: 'fim_capitulo', proximo };
}

/** Escolhe uma opção (ou, com null, avança um nó só de texto). */
export function escolher(jogo: Jogo, estado: Estado, escolhaId: string | null): Estado {
  if (estado.fase !== 'jogando') throw new Error(`Não dá para escolher na fase ${estado.fase}`);
  const atual = no(jogo, estado.capitulo, estado.no);

  if (escolhaId === null) {
    if (escolhasDisponiveis(atual, estado.marcas).length > 0) {
      throw new Error(`O nó ${atual.id} exige uma escolha`);
    }
    const passo: Passo = { capitulo: estado.capitulo, no: atual.id, escolha: null };
    const avancado = { ...estado, historico: [...estado.historico, passo] };
    return atual.segue ? { ...avancado, no: atual.segue } : encerrarCapitulo(jogo, avancado);
  }

  const escolha = escolhasDisponiveis(atual, estado.marcas).find((e) => e.id === escolhaId);
  if (!escolha) throw new Error(`Escolha indisponível: ${atual.id}/${escolhaId}`);

  const marcas = [...new Set([...estado.marcas, ...(escolha.marca ?? [])])];
  const passo: Passo = { capitulo: estado.capitulo, no: atual.id, escolha: escolha.id };
  const avancado: Estado = { ...estado, marcas, historico: [...estado.historico, passo] };
  return escolha.vai_para ? { ...avancado, no: escolha.vai_para } : encerrarCapitulo(jogo, avancado);
}

/** Depois do fluxograma: entra no próximo capítulo ou termina o jogo. */
export function continuar(jogo: Jogo, estado: Estado): Estado {
  if (estado.fase !== 'fim_capitulo' || !estado.proximo) {
    throw new Error(`Não dá para continuar na fase ${estado.fase}`);
  }
  if (estado.proximo === FIM) return { ...estado, fase: 'fim_jogo', proximo: null };
  const cap = capitulo(jogo, estado.proximo);
  return { ...estado, fase: 'jogando', capitulo: cap.id, no: cap.inicio, proximo: null };
}
