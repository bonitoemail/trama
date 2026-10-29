import {
  FIM,
  type Estado,
  type Passo,
  capitulo,
  continuar,
  escolher,
  escolhasDisponiveis,
  escolhasVisiveis,
  marcasDeFluxo,
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

/**
 * Quantos caminhos distintos (sequências de escolhas) cada capítulo tem. O capítulo pode ser
 * alcançado com várias combinações de marcas; o número mostrado é o da entrada com mais caminhos.
 * Só as marcas de fluxo contam, e cada estado (nó, marcas) é contado uma vez: percorrer caminho
 * por caminho trava quando os trilhos multiplicam as combinações.
 */
export function contarCaminhos(jogo: Jogo): Record<string, number> {
  const fluxo = marcasDeFluxo(jogo);
  const so = (m: string[]) => [...new Set(m.filter((x) => fluxo.has(x)))].sort();
  const entradas = new Map<string, Set<string>>([[jogo.primeiro_capitulo, new Set([''])]]);
  const resultado: Record<string, number> = {};
  const fila = [jogo.primeiro_capitulo];
  const feitos = new Set<string>();

  while (fila.length) {
    const capId = fila.shift()!;
    const cap = capitulo(jogo, capId);
    for (const entrada of entradas.get(capId) ?? []) {
      const chaveEntrada = `${capId}|${entrada}`;
      if (feitos.has(chaveEntrada)) continue;
      feitos.add(chaveEntrada);

      const memo = new Map<string, number>();
      const contar = (noId: string, marcas: string[]): number => {
        const chave = `${noId}|${marcas.join(',')}`;
        const pronto = memo.get(chave);
        if (pronto !== undefined) return pronto;
        const n = no(jogo, capId, noId);
        const disp = n.escolhas?.length ? escolhasDisponiveis(n, marcas) : [];
        const fimDoCapitulo = (m: string[]) => {
          const proximo = saidaDoCapitulo(cap, m);
          if (proximo !== FIM) {
            const set = entradas.get(proximo) ?? new Set<string>();
            const k = m.join(',');
            if (!set.has(k)) {
              set.add(k);
              entradas.set(proximo, set);
              if (!fila.includes(proximo)) fila.push(proximo);
            }
          }
          return 1;
        };
        let total: number;
        if (disp.length) {
          total = disp.reduce((s, e) => {
            const novas = so([...marcas, ...(e.marca ?? [])]);
            return s + (e.vai_para ? contar(e.vai_para, novas) : fimDoCapitulo(novas));
          }, 0);
        } else if (n.segue) total = contar(n.segue, marcas);
        else total = fimDoCapitulo(marcas);
        memo.set(chave, total);
        return total;
      };
      const n = contar(cap.inicio, entrada ? entrada.split(',') : []);
      resultado[capId] = Math.max(resultado[capId] ?? 0, n);
    }
  }
  return resultado;
}

/**
 * Quantas histórias completas o jogo tem: cada sequência distinta de escolhas do primeiro
 * capítulo até o epílogo. O que vem pela frente só depende do ponto da história e das marcas de
 * fluxo, então cada estado é contado uma vez e reaproveitado (sem percorrer caminho por caminho).
 */
export function contarPartidas(jogo: Jogo): number {
  const fluxo = marcasDeFluxo(jogo);
  const memo = new Map<string, number>();
  const contar = (e: Estado): number => {
    if (e.fase === 'fim_jogo') return 1;
    const chave = `${e.fase}|${e.capitulo}|${e.no}|${e.marcas.filter((m) => fluxo.has(m)).sort().join(',')}`;
    const pronto = memo.get(chave);
    if (pronto !== undefined) return pronto;
    let total: number;
    if (e.fase === 'fim_capitulo') total = contar(continuar(jogo, e));
    else {
      const n = no(jogo, e.capitulo, e.no);
      const disp = n.escolhas?.length ? escolhasDisponiveis(n, e.marcas) : [];
      total = disp.length ? disp.reduce((s, c) => s + contar(escolher(jogo, e, c.id)), 0) : contar(escolher(jogo, e, null));
    }
    memo.set(chave, total);
    return total;
  };
  return contar(novoJogo(jogo));
}
