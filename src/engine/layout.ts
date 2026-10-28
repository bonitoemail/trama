import type { Capitulo } from './schema';

/**
 * Posições do fluxograma de um capítulo, de cima para baixo (pensado para celular).
 * Profundidade = menor distância a partir do início. Um nó extra "saida" fecha o capítulo.
 */

export const SAIDA = '__saida__';

export interface NoLayout {
  id: string;
  x: number;
  y: number;
}

export interface ArestaLayout {
  de: string;
  para: string;
  /** null = nó de texto (segue) */
  escolha: string | null;
}

export interface Layout {
  nos: NoLayout[];
  arestas: ArestaLayout[];
  largura: number;
  altura: number;
}

const DX = 96;
const DY = 84;
const MARGEM = 40;

export function arestasDoCapitulo(cap: Capitulo): ArestaLayout[] {
  const out: ArestaLayout[] = [];
  for (const n of cap.nos) {
    if (n.escolhas?.length) {
      for (const e of n.escolhas) out.push({ de: n.id, para: e.vai_para ?? SAIDA, escolha: e.id });
    } else {
      out.push({ de: n.id, para: n.segue ?? SAIDA, escolha: null });
    }
  }
  return out;
}

export function layoutDoCapitulo(cap: Capitulo): Layout {
  const arestas = arestasDoCapitulo(cap);
  const prof = new Map<string, number>([[cap.inicio, 0]]);
  const ordem: string[] = [cap.inicio];
  for (let i = 0; i < ordem.length; i++) {
    const atual = ordem[i];
    for (const a of arestas) {
      if (a.de !== atual || a.para === SAIDA || prof.has(a.para)) continue;
      prof.set(a.para, prof.get(atual)! + 1);
      ordem.push(a.para);
    }
  }
  // Nós inalcançáveis ainda aparecem, no fim, para o autor enxergar o problema.
  for (const n of cap.nos) {
    if (!prof.has(n.id)) {
      prof.set(n.id, Math.max(0, ...prof.values()) + 1);
      ordem.push(n.id);
    }
  }
  const fundo = Math.max(...prof.values()) + 1;
  prof.set(SAIDA, fundo);
  ordem.push(SAIDA);

  const linhas = new Map<number, string[]>();
  for (const id of ordem) {
    const d = prof.get(id)!;
    linhas.set(d, [...(linhas.get(d) ?? []), id]);
  }
  const maisLarga = Math.max(...[...linhas.values()].map((l) => l.length));
  const largura = MARGEM * 2 + (maisLarga - 1) * DX;

  const nos: NoLayout[] = [];
  for (const [d, ids] of linhas) {
    const inicioX = (largura - (ids.length - 1) * DX) / 2;
    ids.forEach((id, i) => nos.push({ id, x: inicioX + i * DX, y: MARGEM + d * DY }));
  }
  return { nos, arestas, largura, altura: MARGEM * 2 + fundo * DY };
}
