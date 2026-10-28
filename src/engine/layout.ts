import type { Capitulo } from './schema';

/**
 * Posições do fluxograma de um capítulo, de cima para baixo (pensado para celular).
 * Profundidade = caminho mais longo a partir do início, para que um nó onde vários galhos
 * convergem fique abaixo de todos eles. Um nó extra "saida" fecha o capítulo.
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

export interface Espacamento {
  dx: number;
  dy: number;
  margem: number;
}

const PADRAO: Espacamento = { dx: 96, dy: 84, margem: 40 };

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

export function layoutDoCapitulo(cap: Capitulo, esp: Espacamento = PADRAO): Layout {
  const { dx: DX, dy: DY, margem: MARGEM } = esp;
  const arestas = arestasDoCapitulo(cap);
  const prof = new Map<string, number>([[cap.inicio, 0]]);
  const ordem: string[] = [cap.inicio];
  // Ordem de descoberta (largura) decide a posição dentro da linha.
  for (let i = 0; i < ordem.length; i++) {
    const atual = ordem[i];
    for (const a of arestas) {
      if (a.de !== atual || a.para === SAIDA || prof.has(a.para)) continue;
      prof.set(a.para, prof.get(atual)! + 1);
      ordem.push(a.para);
    }
  }
  // Relaxa para o caminho mais longo; o limite de voltas protege contra ciclos.
  for (let volta = 0; volta < cap.nos.length; volta++) {
    let mudou = false;
    for (const a of arestas) {
      if (a.para === SAIDA || !prof.has(a.de) || a.de === a.para) continue;
      const d = prof.get(a.de)! + 1;
      if (d > prof.get(a.para)! && d <= cap.nos.length) {
        prof.set(a.para, d);
        mudou = true;
      }
    }
    if (!mudou) break;
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
  // Um nó sozinho na linha esconderia uma aresta que pula essa linha (ex.: uma escolha que
  // vai direto adiante). Nesses casos o nó sai do eixo e a aresta passa livre pelo centro.
  const pulada = (d: number) =>
    arestas.some((a) => prof.has(a.de) && prof.get(a.de)! < d && prof.get(a.para)! > d);
  const deslocados = new Set([...linhas].filter(([d, ids]) => ids.length === 1 && pulada(d)).map(([d]) => d));

  const maisLarga = Math.max(...[...linhas.values()].map((l) => l.length), deslocados.size ? 2 : 1);
  const largura = MARGEM * 2 + (maisLarga - 1) * DX;

  const nos: NoLayout[] = [];
  for (const [d, ids] of linhas) {
    const inicioX = (largura - (ids.length - 1) * DX) / 2;
    const desvio = deslocados.has(d) ? DX / 2 : 0;
    ids.forEach((id, i) => nos.push({ id, x: inicioX + i * DX + desvio, y: MARGEM + d * DY }));
  }
  return { nos, arestas, largura, altura: MARGEM * 2 + fundo * DY };
}
