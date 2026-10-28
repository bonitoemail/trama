import { FIM, escolhasDisponiveis, saidaDoCapitulo } from './engine';
import type { Capitulo, Condicao, Jogo, Texto } from './schema';

export interface Relatorio {
  erros: string[];
  avisos: string[];
  estatisticas: {
    estados: number;
    nosAlcancados: number;
    nosTotais: number;
    /** Combinações distintas de marcas com que se chega ao fim do jogo. */
    finaisDistintos: number;
    truncado: boolean;
  };
}

const LIMITE_ESTADOS = 500_000;

function marcasDaCondicao(c: Condicao | undefined, out: Set<string>) {
  if (!c) return;
  if ('tem' in c) out.add(c.tem);
  else if ('nao_tem' in c) out.add(c.nao_tem);
  else for (const sub of 'todas' in c ? c.todas : c.qualquer) marcasDaCondicao(sub, out);
}

function marcasDoTexto(t: Texto, out: Set<string>) {
  if (typeof t === 'string') return;
  for (const p of t) if (typeof p !== 'string') marcasDaCondicao(p.se, out);
}

/** Checagens que não dependem de jogar: ids, referências, marcas. */
function estrutura(jogo: Jogo, erros: string[], avisos: string[]) {
  const capIds = new Set<string>();
  for (const cap of jogo.capitulos) {
    if (capIds.has(cap.id)) erros.push(`Capítulo duplicado: ${cap.id}`);
    capIds.add(cap.id);
  }
  if (!capIds.has(jogo.primeiro_capitulo)) {
    erros.push(`primeiro_capitulo "${jogo.primeiro_capitulo}" não existe`);
  }

  const criadas = new Set<string>();
  const usadas = new Set<string>();
  marcasDoTexto(jogo.epilogo.texto, usadas);

  for (const cap of jogo.capitulos) {
    const noIds = new Set<string>();
    for (const n of cap.nos) {
      if (noIds.has(n.id)) erros.push(`${cap.id}: nó duplicado ${n.id}`);
      noIds.add(n.id);
    }
    if (!noIds.has(cap.inicio)) erros.push(`${cap.id}: início "${cap.inicio}" não existe`);

    for (const n of cap.nos) {
      const onde = `${cap.id}/${n.id}`;
      marcasDoTexto(n.texto, usadas);
      if (n.escolhas && n.segue) erros.push(`${onde}: tem escolhas e "segue" ao mesmo tempo`);
      if (n.segue && !noIds.has(n.segue)) erros.push(`${onde}: segue para nó inexistente "${n.segue}"`);
      if (n.escolhas && n.escolhas.length < 2) avisos.push(`${onde}: só uma escolha escrita`);

      const escIds = new Set<string>();
      for (const e of n.escolhas ?? []) {
        if (escIds.has(e.id)) erros.push(`${onde}: escolha duplicada ${e.id}`);
        escIds.add(e.id);
        if (e.vai_para && !noIds.has(e.vai_para)) {
          erros.push(`${onde}/${e.id}: vai_para nó inexistente "${e.vai_para}"`);
        }
        marcasDaCondicao(e.se, usadas);
        for (const m of e.marca ?? []) criadas.add(m);
      }
    }

    for (const s of cap.saidas) {
      if (s.para !== FIM && !capIds.has(s.para)) erros.push(`${cap.id}: saída para capítulo inexistente "${s.para}"`);
      marcasDaCondicao(s.quando, usadas);
    }
  }

  for (const m of usadas) if (!criadas.has(m)) erros.push(`Marca "${m}" é testada mas nenhuma escolha a cria`);
  for (const m of criadas) if (!usadas.has(m)) avisos.push(`Marca "${m}" é criada mas nunca usada`);
}

/**
 * Joga todas as combinações possíveis (capítulo, nó, marcas) para achar
 * becos sem saída, capítulos sem saída e nós que ninguém alcança.
 */
function exploracao(jogo: Jogo, erros: string[], avisos: string[]): Relatorio['estatisticas'] {
  const caps = new Map<string, Capitulo>(jogo.capitulos.map((c) => [c.id, c]));
  const vistos = new Set<string>();
  const alcancados = new Set<string>();
  const finais = new Set<string>();
  const problemas = new Set<string>();
  const fila: Array<{ cap: string; no: string; marcas: string[] }> = [];

  const enfileirar = (cap: string, no: string, marcas: string[]) => {
    const chave = `${cap}|${no}|${marcas.join(',')}`;
    if (vistos.has(chave)) return;
    vistos.add(chave);
    fila.push({ cap, no, marcas });
  };

  const entrarNoCapitulo = (capId: string, marcas: string[]) => {
    if (capId === FIM) return void finais.add(marcas.join(','));
    const c = caps.get(capId);
    if (c) enfileirar(c.id, c.inicio, marcas);
  };

  const fimDeCapitulo = (cap: Capitulo, marcas: string[]) => {
    try {
      entrarNoCapitulo(saidaDoCapitulo(cap, marcas), marcas);
    } catch {
      problemas.add(`${cap.id}: nenhuma saída vale para as marcas [${marcas.join(', ') || 'nenhuma'}]`);
    }
  };

  entrarNoCapitulo(jogo.primeiro_capitulo, []);

  let truncado = false;
  while (fila.length) {
    if (vistos.size > LIMITE_ESTADOS) {
      truncado = true;
      break;
    }
    const { cap: capId, no: noId, marcas } = fila.pop()!;
    const cap = caps.get(capId)!;
    const n = cap.nos.find((x) => x.id === noId);
    if (!n) continue; // já reportado em estrutura()
    alcancados.add(`${capId}/${noId}`);

    if (n.escolhas && n.escolhas.length) {
      const disp = escolhasDisponiveis(n, marcas);
      if (disp.length === 0) {
        problemas.add(`${capId}/${noId}: beco sem saída, nenhuma escolha disponível com [${marcas.join(', ') || 'nenhuma'}]`);
      }
      for (const e of disp) {
        const novas = [...new Set([...marcas, ...(e.marca ?? [])])].sort();
        if (e.vai_para) enfileirar(capId, e.vai_para, novas);
        else fimDeCapitulo(cap, novas);
      }
    } else if (n.segue) {
      enfileirar(capId, n.segue, marcas);
    } else {
      fimDeCapitulo(cap, marcas);
    }
  }

  erros.push(...problemas);
  let total = 0;
  for (const c of jogo.capitulos) {
    for (const n of c.nos) {
      total++;
      if (!truncado && !alcancados.has(`${c.id}/${n.id}`)) avisos.push(`${c.id}/${n.id}: nó inalcançável`);
    }
  }
  if (truncado) avisos.push(`Exploração parou em ${LIMITE_ESTADOS} estados; nós inalcançáveis não foram checados`);
  if (!truncado && finais.size === 0) erros.push('Nenhum caminho chega ao fim do jogo');

  return { estados: vistos.size, nosAlcancados: alcancados.size, nosTotais: total, finaisDistintos: finais.size, truncado };
}

export function validar(jogo: Jogo): Relatorio {
  const erros: string[] = [];
  const avisos: string[] = [];
  estrutura(jogo, erros, avisos);
  // Referências quebradas fariam a exploração mentir; só explora estrutura sã.
  const estatisticas = erros.length
    ? { estados: 0, nosAlcancados: 0, nosTotais: 0, finaisDistintos: 0, truncado: false }
    : exploracao(jogo, erros, avisos);
  return { erros, avisos, estatisticas };
}
