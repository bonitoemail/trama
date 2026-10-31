import type { Relogio } from '@/engine/relogios';
import type { Jogo, No } from '@/engine/schema';

/**
 * Tela /escolhas: o que os jogadores escolheram, somado. Função pura: recebe as contagens do
 * Supabase (escolhas_contagem, escolhas_cruzamento) e o conteúdo, e monta os blocos pela mesma
 * regra para todas as decisões. Ninguém escolhe à mão o que aparece, a não ser os cruzamentos.
 */

/** Uma decisão só aparece com pelo menos tantas escolhas (DESIGN 9.2). */
export const MINIMO = 50;
/** Até quanto uma escolha é "rara". */
export const RARA_ATE = 6;

export interface Contagem {
  tipo: 'escolha' | 'fim_capitulo' | 'partidas';
  capitulo: string;
  no: string;
  escolha: string;
  /** Dia no horário de Brasília (AAAA-MM-DD); nulo na linha do total de partidas. */
  dia: string | null;
  n: number;
}


/** Duas decisões na mesma partida: quem fez `grupo` em `a` contra quem fez outra coisa, e quantos fizeram `alvo` em `b`. */
export interface Cruzamento {
  a: string;
  grupo: string[];
  b: string;
  alvo: string[];
}

/** Escolhido por nós (o único bloco que não sai sozinho): a primeira decisão do jogo contra a aposta nos EUA. */
export const CRUZAMENTOS: Cruzamento[] = [{ a: 'cap01/pedido', grupo: ['preventiva'], b: 'cap01/eleicao_eua', alvo: ['democratas'] }];

export interface LinhaCruzada {
  escolha_a: string;
  escolha_b: string;
  n: number;
}

export interface Opcao {
  rotulo: string;
  n: number;
  pct: number;
  /** A escolha que a realidade decidiu. */
  real?: boolean;
}

export interface Decisao {
  capitulo: string;
  numero: number;
  no: string;
  titulo: string;
  total: number;
  /** Da mais escolhida para a menos. */
  opcoes: Opcao[];
  /** "Antes da notícia": quando a realidade começa a decidir. Placar: quando decidiu. */
  data?: string;
  /** "Antes da notícia" com a data já passada e a escolha ainda não travada: contam só os votos até lá. */
  aguardando?: boolean;
}

export interface Rara {
  rotulo: string;
  titulo: string;
  numero: number;
  total: number;
  pct: number;
}

export interface Finais {
  capitulo: string;
  numero: number;
  titulo: string;
  total: number;
  itens: Opcao[];
}

export interface Cruzado {
  /** Rótulo da escolha que separa os dois grupos. */
  grupo: string;
  /** Rótulo da escolha contada depois. */
  alvo: string;
  linhas: { quem: string; total: number; pct: number }[];
}

/** Fim de capítulo: quantos escolheram cada opção de uma decisão (só com o mínimo de escolhas). */
export interface PorDecisao {
  total: number;
  /** Porcentagem por rótulo de escolha. */
  pct: Record<string, number>;
  /** A realidade decidiu nesta data; contam só as escolhas de antes. */
  real?: string;
  /** Um relógio pendente vai decidir nesta data. */
  decide?: string;
}

export interface Painel {
  atualizado: string;
  partidas: number;
  /** Chave "cap/no". */
  porDecisao: Record<string, PorDecisao>;
  antes: Decisao[];
  placar: Decisao[];
  divididas: Decisao[];
  maioria: Decisao[];
  raras: Rara[];
  finais: Finais[];
  cruzados: Cruzado[];
  /**
   * Palpites cravados por decisão ("cap/no"; notas/palpites.md). Antes de fecharem, só o total
   * (porcentagem influenciaria quem ainda vai cravar); depois da trava, o placar, com o mínimo.
   */
  palpites?: Record<string, { total: number; placar?: { total: number; opcoes: Opcao[] } }>;
}

const pct = (n: number, total: number) => (total ? Math.round((100 * n) / total) : 0);

/** Porcentagens que somam 100 (maior resto): 62,5% e 37,5% viram 63 e 37, não 63 e 38. */
export function porcentagens<T extends { n: number }>(itens: T[]): (T & { pct: number })[] {
  const total = itens.reduce((s, i) => s + i.n, 0);
  if (!total) return itens.map((i) => ({ ...i, pct: 0 }));
  const exatos = itens.map((i) => (100 * i.n) / total);
  const base = exatos.map(Math.floor);
  const falta = 100 - base.reduce((s, x) => s + x, 0);
  [...exatos.keys()].sort((a, b) => exatos[b] - base[b] - (exatos[a] - base[a]) || a - b).slice(0, falta).forEach((k) => base[k]++);
  return itens.map((i, k) => ({ ...i, pct: base[k] }));
}

function acharNo(jogo: Jogo, ref: string): { cap: Jogo['capitulos'][number]; no: No } | null {
  const [c, n] = ref.split(':')[0].split('/');
  const cap = jogo.capitulos.find((x) => x.id === c);
  const no = cap?.nos.find((x) => x.id === n);
  return cap && no ? { cap, no } : null;
}

/**
 * Soma as escolhas de uma cena. Escolhas com o mesmo rótulo (variantes por marca) viram uma.
 * Quando a realidade decidiu (ou a notícia já saiu e falta travar), contam só as escolhas feitas
 * antes do dia da notícia: quem joga depois já sabe o resultado.
 */
function somar(cap: Jogo['capitulos'][number], no: No, linhas: Contagem[], noticia?: string): Decisao & { condicional: Set<string> } {
  const real = no.escolhas?.find((e) => e.real);
  const corte = real?.real?.data ?? noticia;
  const porRotulo = new Map<string, Opcao>();
  const variantes = new Map<string, boolean[]>();
  for (const e of no.escolhas ?? []) {
    if (!porRotulo.has(e.rotulo)) porRotulo.set(e.rotulo, { rotulo: e.rotulo, n: 0, pct: 0, ...(real ? { real: e === real } : {}) });
    variantes.set(e.rotulo, [...(variantes.get(e.rotulo) ?? []), Boolean(e.se)]);
  }
  for (const l of linhas) {
    if (l.tipo !== 'escolha' || l.capitulo !== cap.id || l.no !== no.id) continue;
    if (corte && (!l.dia || l.dia >= corte)) continue;
    const e = no.escolhas?.find((x) => x.id === l.escolha);
    if (e) porRotulo.get(e.rotulo)!.n += l.n;
  }
  const total = [...porRotulo.values()].reduce((s, o) => s + o.n, 0);
  // Escolha que só aparece para alguns: fica de fora das raras (é rara porque pouca gente a vê).
  const condicional = new Set([...variantes].filter(([, se]) => se.every(Boolean)).map(([r]) => r));
  const opcoes = porcentagens([...porRotulo.values()].filter((o) => o.n > 0 || !condicional.has(o.rotulo))).sort((x, y) => y.n - x.n);
  return { capitulo: cap.id, numero: cap.numero, no: no.id, titulo: no.titulo ?? no.lugar ?? no.id, total, opcoes, ...(real ? { data: real.real!.data } : {}), condicional };
}

const semCondicional = ({ condicional: _, ...d }: Decisao & { condicional: Set<string> }): Decisao => d;
const chave = (d: Decisao) => `${d.capitulo}/${d.no}`;

export function montarPainel(
  jogo: Jogo,
  linhas: Contagem[],
  opcoes: { hoje: string; agora: string; relogios?: Relogio[]; cruzadas?: LinhaCruzada[][] },
): Painel {
  const partidas = linhas.find((l) => l.tipo === 'partidas')?.n ?? 0;

  // Antes da notícia: cenas que um relógio pendente com data vai decidir (a data mais próxima).
  // Se a data chegou e ninguém travou a escolha ainda, a cena continua aqui, com os votos até a data.
  const quando = new Map<string, string>();
  for (const r of opcoes.relogios ?? []) {
    if (!r.data || (r.status && r.status !== 'pendente')) continue;
    for (const ref of r.afeta ?? []) {
      const k = ref.split(':')[0];
      if (!quando.has(k) || r.data < quando.get(k)!) quando.set(k, r.data);
    }
  }
  const passou = (k: string) => quando.has(k) && quando.get(k)! <= opcoes.hoje;

  const todas = jogo.capitulos.flatMap((cap) =>
    cap.nos.filter((n) => n.escolhas?.length).map((n) => somar(cap, n, linhas, passou(`${cap.id}/${n.id}`) ? quando.get(`${cap.id}/${n.id}`) : undefined)),
  );
  const contam = todas.filter((d) => d.total >= MINIMO);

  const antes = contam
    .filter((d) => !d.data && quando.has(chave(d)))
    .map((d) => ({ ...semCondicional(d), data: quando.get(chave(d)), ...(passou(chave(d)) ? { aguardando: true } : {}) }))
    .sort((x, y) => x.data!.localeCompare(y.data!) || y.total - x.total)
    .slice(0, 3);

  const placar = contam
    .filter((d) => d.data)
    .map(semCondicional)
    .sort((x, y) => y.data!.localeCompare(x.data!));

  const usadas = new Set([...antes, ...placar].map(chave));
  const livres = contam.filter((d) => !usadas.has(chave(d)) && d.opcoes.length >= 2);

  // Divididas: as duas escolhas mais comuns mais perto uma da outra.
  const vao = (d: Decisao) => (d.opcoes[0].n - d.opcoes[1].n) / d.total;
  const divididas = [...livres].sort((x, y) => vao(x) - vao(y) || y.total - x.total).slice(0, 3);
  divididas.forEach((d) => usadas.add(chave(d)));

  // Maioria: uma escolha passou da metade.
  const lider = (d: Decisao) => d.opcoes[0].n / d.total;
  const maioria = livres
    .filter((d) => !usadas.has(chave(d)) && lider(d) > 0.5)
    .sort((x, y) => lider(y) - lider(x) || y.total - x.total)
    .slice(0, 3);

  // Raras: a menos escolhida de cada decisão, se ficou em até 6% e todo mundo que chegou ali a viu.
  const raras = contam
    .filter((d) => !d.data && !antes.some((a) => chave(a) === chave(d)))
    .flatMap((d) => {
      const o = d.opcoes.filter((x) => !d.condicional.has(x.rotulo)).at(-1);
      return o && o.pct <= RARA_ATE ? [{ rotulo: o.rotulo, titulo: d.titulo, numero: d.numero, total: d.total, pct: o.pct }] : [];
    })
    .sort((x, y) => x.pct - y.pct || y.total - x.total)
    .slice(0, 4);

  // Finais: para onde as escolhas levaram quem fechou o capítulo.
  const finais = jogo.capitulos.flatMap((cap) => {
    const porTitulo = new Map<string, number>();
    for (const l of linhas) {
      if (l.tipo !== 'fim_capitulo' || l.capitulo !== cap.id) continue;
      const no = cap.nos.find((n) => n.id === l.no);
      if (!no || no.escolhas?.length || no.segue) continue;
      const t = no.titulo ?? no.lugar ?? no.id;
      porTitulo.set(t, (porTitulo.get(t) ?? 0) + l.n);
    }
    const total = [...porTitulo.values()].reduce((s, n) => s + n, 0);
    if (total < MINIMO) return [];
    const itens = porcentagens([...porTitulo].map(([rotulo, n]) => ({ rotulo, n }))).sort((x, y) => y.n - x.n);
    // Finais muito raros (menos de 3%) viram uma linha só, para a lista não ficar maior que a tela.
    const poucos = itens.filter((i) => i.pct < 3);
    const lista = poucos.length > 1 ? [...itens.filter((i) => i.pct >= 3), juntar(poucos)] : itens;
    return [{ capitulo: cap.id, numero: cap.numero, titulo: cap.titulo, total, itens: lista }];
  });

  const cruzados = CRUZAMENTOS.flatMap((c, i) => cruzar(jogo, c, opcoes.cruzadas?.[i] ?? []));

  const porDecisao = Object.fromEntries(
    contam.map((d) => [
      chave(d),
      {
        total: d.total,
        pct: Object.fromEntries(d.opcoes.map((o) => [o.rotulo, o.pct])),
        ...(d.data ? { real: d.data } : quando.has(chave(d)) ? { decide: quando.get(chave(d)) } : {}),
      },
    ]),
  );

  return { atualizado: opcoes.agora, partidas, porDecisao, antes, placar, divididas: divididas.map(semCondicional), maioria: maioria.map(semCondicional), raras, finais, cruzados };
}

function juntar(itens: Opcao[]): Opcao {
  return { rotulo: `Outros ${itens.length} finais`, n: itens.reduce((s, i) => s + i.n, 0), pct: itens.reduce((s, i) => s + i.pct, 0) };
}

/**
 * Até que dia (exclusive) o cruzamento conta: o dia da notícia mais cedo entre as duas decisões, seja
 * a trava (`real.data`), seja um relógio pendente cuja data já chegou. Depois disso, quem joga já sabe
 * o resultado, ou é forçado à opção real. Sem notícia, nulo (conta tudo).
 */
export function corteDoCruzamento(jogo: Jogo, c: Cruzamento, relogios: Relogio[], hoje: string): string | null {
  const datas: string[] = [];
  for (const ref of [c.a, c.b]) {
    const real = acharNo(jogo, ref)?.no.escolhas?.find((e) => e.real)?.real?.data;
    if (real) datas.push(real);
    for (const r of relogios) {
      if (r.data && r.data <= hoje && (!r.status || r.status === 'pendente') && r.afeta?.some((x) => x.split(':')[0] === ref)) datas.push(r.data);
    }
  }
  return datas.length ? datas.sort()[0] : null;
}

function cruzar(jogo: Jogo, c: Cruzamento, linhas: LinhaCruzada[]): Cruzado[] {
  const a = acharNo(jogo, c.a);
  const b = acharNo(jogo, c.b);
  const grupo = a?.no.escolhas?.find((e) => e.id === c.grupo[0]);
  const alvo = b?.no.escolhas?.find((e) => e.id === c.alvo[0]);
  if (!grupo || !alvo) return [];

  const dentro = linhas.filter((l) => c.grupo.includes(l.escolha_a));
  const fora = linhas.filter((l) => !c.grupo.includes(l.escolha_a));
  const conta = (ls: LinhaCruzada[]) => {
    const total = ls.reduce((s, l) => s + l.n, 0);
    const n = ls.filter((l) => c.alvo.includes(l.escolha_b)).reduce((s, l) => s + l.n, 0);
    return { total, pct: pct(n, total) };
  };
  const linhasCruzadas = [
    { quem: `Escolheram "${grupo.rotulo}"`, ...conta(dentro) },
    { quem: 'Escolheram outra opção', ...conta(fora) },
  ];
  if (linhasCruzadas.some((l) => l.total < MINIMO)) return [];
  return [{ grupo: grupo.rotulo, alvo: alvo.rotulo, linhas: linhasCruzadas }];
}
