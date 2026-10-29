import {
  FIM,
  type Estado,
  type Passo,
  capitulo,
  continuar,
  escolher,
  escolhasDisponiveis,
  escolhasVisiveis,
  no,
  novoJogo,
  paragrafos,
  saidaDoCapitulo,
} from './engine';
import type { Jogo } from './schema';

/** Um momento da linha do tempo de uma partida. */
export interface Momento {
  capitulo: string;
  no: string;
  lugar: string | null;
  imagem: string | null;
  /** Primeiro parágrafo da cena, como o jogador leu (com as marcas daquele momento). */
  resumo: string;
  /** Rótulo da escolha feita; null em cenas sem decisão. */
  escolha: string | null;
  /** Quantos outros caminhos eram possíveis naquele momento. */
  alternativas: number;
  /** A realidade decidiu este nó (data). */
  real: string | null;
}

/**
 * Reconstrói a partida passo a passo, refazendo as marcas na ordem em que foram ganhas,
 * para mostrar o que o jogador viu e quantas portas ficaram fechadas em cada decisão.
 */
export function linhaDoTempo(jogo: Jogo, historico: Passo[]): Momento[] {
  let marcas: string[] = [];
  return historico.map((p) => {
    const n = no(jogo, p.capitulo, p.no);
    const visiveis = escolhasVisiveis(n, marcas);
    const feita = p.escolha ? visiveis.find((e) => e.id === p.escolha) ?? null : null;
    const momento: Momento = {
      capitulo: p.capitulo,
      no: p.no,
      lugar: n.lugar ?? null,
      imagem: n.imagem ?? null,
      resumo: paragrafos(n.texto, marcas)[0] ?? '',
      escolha: feita?.rotulo ?? null,
      alternativas: feita ? Math.max(0, visiveis.length - 1) : 0,
      real: feita?.real?.data ?? null,
    };
    if (feita?.marca) marcas = [...new Set([...marcas, ...feita.marca])];
    return momento;
  });
}

const LIMITE_CAMINHOS = 200_000;

/**
 * Quantos caminhos distintos (sequências de escolhas) cada capítulo tem, considerando todas as
 * combinações de marcas com que se pode chegar nele e as travas da realidade.
 */
export function contarCaminhos(jogo: Jogo): Record<string, number> {
  const caminhos = new Map<string, Set<string>>();
  const entradas = new Map<string, Set<string>>([[jogo.primeiro_capitulo, new Set([''])]]);
  const fila = [jogo.primeiro_capitulo];
  let total = 0;

  while (fila.length && total < LIMITE_CAMINHOS) {
    const capId = fila.shift()!;
    const cap = capitulo(jogo, capId);
    const vistos = caminhos.get(capId) ?? new Set<string>();
    caminhos.set(capId, vistos);

    for (const entrada of entradas.get(capId) ?? []) {
      const pilha: Array<{ no: string; marcas: string[]; rastro: string }> = [
        { no: cap.inicio, marcas: entrada ? entrada.split(',') : [], rastro: '' },
      ];
      while (pilha.length && total < LIMITE_CAMINHOS) {
        const { no: noId, marcas, rastro } = pilha.pop()!;
        const n = no(jogo, capId, noId);
        const disp = n.escolhas?.length ? escolhasDisponiveis(n, marcas) : [];

        const encerrar = (m: string[], r: string) => {
          if (!vistos.has(r)) {
            vistos.add(r);
            total++;
          }
          const proximo = saidaDoCapitulo(cap, m);
          if (proximo === FIM) return;
          const chave = [...m].sort().join(',');
          const set = entradas.get(proximo) ?? new Set<string>();
          if (!set.has(chave)) {
            set.add(chave);
            entradas.set(proximo, set);
            if (!fila.includes(proximo)) fila.push(proximo);
          }
        };

        if (disp.length) {
          for (const e of disp) {
            const novas = [...new Set([...marcas, ...(e.marca ?? [])])];
            const r = `${rastro}/${noId}:${e.id}`;
            if (e.vai_para) pilha.push({ no: e.vai_para, marcas: novas, rastro: r });
            else encerrar(novas, r);
          }
        } else if (n.segue) {
          pilha.push({ no: n.segue, marcas, rastro });
        } else {
          encerrar(marcas, rastro);
        }
      }
    }
  }
  return Object.fromEntries([...caminhos].map(([id, s]) => [id, s.size]));
}

const LIMITE_PARTIDAS = 2_000_000;

/**
 * Quantas histórias completas o jogo tem: cada sequência distinta de escolhas do primeiro
 * capítulo até o epílogo. Para no limite (e devolve o limite) para não travar o build.
 */
export function contarPartidas(jogo: Jogo): number {
  let partidas = 0;
  const pilha: Estado[] = [novoJogo(jogo)];
  while (pilha.length && partidas < LIMITE_PARTIDAS) {
    const e = pilha.pop()!;
    if (e.fase === 'fim_jogo') {
      partidas++;
      continue;
    }
    if (e.fase === 'fim_capitulo') {
      pilha.push(continuar(jogo, e));
      continue;
    }
    const n = no(jogo, e.capitulo, e.no);
    const disp = n.escolhas?.length ? escolhasDisponiveis(n, e.marcas) : [];
    if (disp.length) disp.forEach((c) => pilha.push(escolher(jogo, e, c.id)));
    else pilha.push(escolher(jogo, e, null));
  }
  return partidas;
}
