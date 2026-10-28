'use client';

import type { Momento } from '@/engine/historia';

interface Props {
  momentos: Momento[];
  /** Caminhos distintos que o capítulo tem (contarCaminhos). */
  caminhosPossiveis: number;
}

/**
 * "A linha do tempo que você escolheu": a partida contada como crônica.
 * Mostra quantas portas ficaram fechadas em cada decisão, sem revelar quais.
 */
export default function LinhaDoTempo({ momentos, caminhosPossiveis }: Props) {
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
    </section>
  );
}

function primeiraFrase(texto: string): string {
  const fim = texto.search(/[.!?](\s|$)/);
  return fim > 0 ? texto.slice(0, fim + 1) : texto;
}
