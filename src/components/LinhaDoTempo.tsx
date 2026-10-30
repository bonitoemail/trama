'use client';

import { isoPorExtenso } from '@/engine/calendario';
import type { Momento } from '@/engine/historia';
import { RARA_ATE, type Painel } from '@/lib/escolhas';
import { usePainel } from '@/lib/painel';

interface Props {
  momentos: Momento[];
  /** Caminhos distintos que o capítulo tem (contarCaminhos). */
  caminhosPossiveis: number;
  /** Link para a tela do que os jogadores escolheram. */
  escolhas?: { titulo: string; onClick: () => void };
}

/**
 * "A linha do tempo que você escolheu": a partida contada como crônica.
 * Mostra quantas portas ficaram fechadas em cada decisão, sem revelar quais, e quantos jogadores
 * escolheram o mesmo. Só aqui, no fim do capítulo: durante a decisão, o número influenciaria a escolha.
 */
export default function LinhaDoTempo({ momentos, caminhosPossiveis, escolhas }: Props) {
  const carga = usePainel(Boolean(escolhas));
  const painel = carga && carga !== 'vazio' ? carga : null;
  const juntos = painel ? quantos(momentos, painel) : new Map<Momento, number>();
  // A escolha mais rara do capítulo, se ficou em até 6% (a mesma régua de "raras" em /escolhas).
  const rara = [...juntos].filter(([m, p]) => p <= RARA_ATE && !m.real).sort((a, b) => a[1] - b[1])[0]?.[0];
  // A frase inteira ("dos jogadores escolheram o mesmo que você") só na primeira; depois, curta.
  const primeira = [...juntos.keys()].find((m) => !m.real && !painel?.porDecisao[`${m.capitulo}/${m.no}`]?.decide);

  return (
    <section className="linha" aria-label="A linha do tempo que você escolheu">
      <ol>
        {momentos.map((m) => {
          const decisao = m.escolha !== null;
          return (
            <li key={`${m.capitulo}/${m.no}`} className={decisao ? 'decisao' : 'acontecimento'}>
              <span className="marco" aria-hidden />
              {m.imagem && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="mini" src={`/${m.imagem}`} alt="" loading="lazy" />
              )}
              <div className="conteudo">
                {m.lugar && <p className="quando">{m.lugar}</p>}
                {decisao ? (
                  <>
                    <p className="feita">{m.escolha}</p>
                    {juntos.has(m) && (
                      <Juntos
                        pct={juntos.get(m)!}
                        momento={m}
                        decide={painel!.porDecisao[`${m.capitulo}/${m.no}`]?.decide}
                        rara={m === rara}
                        primeira={m === primeira}
                      />
                    )}
                    {m.real ? (
                      <p className="outras real">aconteceu de verdade em {m.real}</p>
                    ) : m.alternativas > 0 ? (
                      <p className="outras">
                        em outras linhas do tempo: {m.alternativas} {m.alternativas === 1 ? 'caminho' : 'caminhos'}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="resumo">{primeiraFrase(m.resumo)}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {caminhosPossiveis > 1 && (
        <p className="dimensao">
          Este capítulo tem <strong>{caminhosPossiveis}</strong> caminhos possíveis. Você viveu um.
        </p>
      )}
      {escolhas && (
        <button type="button" className="ver-escolhas" onClick={escolhas.onClick}>
          {escolhas.titulo}
        </button>
      )}
    </section>
  );
}

/** Porcentagem da escolha feita em cada decisão que já tem o mínimo de escolhas. */
function quantos(momentos: Momento[], painel: Painel): Map<Momento, number> {
  const r = new Map<Momento, number>();
  for (const m of momentos) {
    const pct = m.escolha ? painel.porDecisao[`${m.capitulo}/${m.no}`]?.pct[m.escolha] : undefined;
    if (pct !== undefined) r.set(m, pct);
  }
  return r;
}

function Juntos({ pct, momento, decide, rara, primeira }: { pct: number; momento: Momento; decide?: string; rara: boolean; primeira: boolean }) {
  const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
  if (momento.real) {
    return (
      <p className="juntos">
        <b>{pct}%</b> apostaram nisso antes da notícia.
      </p>
    );
  }
  if (decide) {
    return (
      <p className="juntos">
        <b>{pct}%</b> apostaram nisso.{' '}
        <span className="espera">
          {decide > hoje ? `A realidade decide em ${isoPorExtenso(decide)}.` : 'A realidade já começou a decidir.'}
        </span>
      </p>
    );
  }
  return (
    <p className="juntos">
      <b>{pct}%</b> {primeira ? 'dos jogadores escolheram o mesmo que você' : 'escolheram o mesmo'}.
      {rara && <span className="rara"> A escolha mais rara do seu capítulo.</span>}
    </p>
  );
}

function primeiraFrase(texto: string): string {
  const fim = texto.search(/[.!?](\s|$)/);
  return fim > 0 ? texto.slice(0, fim + 1) : texto;
}
