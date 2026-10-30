'use client';

import { Fontes } from './Fatos';
import { Moldura } from './Metodo';
import { isoPorExtenso } from '@/engine/calendario';
import type { Jogo } from '@/engine/schema';

interface Props {
  acertos: NonNullable<Jogo['acertos']>;
  titulo: string;
  onVoltar: () => void;
  principal: { rotulo: string; curto: string; onClick: () => void };
  capitulo: string;
}

/**
 * Registro de acertos: na mesma linguagem de "Como fazemos" (sans, quieta). Cada item mostra o que
 * o jogo escreveu, com o link para o commit em que entrou, o que aconteceu, com as fontes, e o que
 * não bateu. O mais novo em cima.
 */
export default function Acertos({ acertos: a, titulo, onVoltar, principal, capitulo }: Props) {
  const itens = [...a.itens].sort((x, y) => y.cumprido.data.localeCompare(x.cumprido.data));

  return (
    <Moldura classe="metodo acertos" titulo={titulo} onVoltar={onVoltar} principal={principal} capitulo={capitulo}>
      <h1>{a.titulo}</h1>
      <p className="lead">{a.texto}</p>

      <ol className="registro">
        {itens.map((i) => {
          const [dia, hora] = i.previsto.data.split(' ');
          return (
            <li key={i.titulo}>
              <h2>{i.titulo}</h2>

              <p className="marco">
                Previsto em {isoPorExtenso(dia)}, às {hora.replace(':', 'h')}
              </p>
              <blockquote>{i.previsto.texto}</blockquote>
              <p className="detalhe">
                {i.previsto.caminho ? `${i.previsto.caminho}. ` : ''}
                <a href={`${a.commits}${i.previsto.commit}`} target="_blank" rel="noreferrer">
                  Ver no histórico público ({i.previsto.commit})
                </a>
              </p>

              <p className="marco">Aconteceu em {isoPorExtenso(i.cumprido.data)}</p>
              <p>{i.cumprido.texto}</p>
              <Fontes urls={i.cumprido.fontes} />

              <p className="marco">O que não bateu</p>
              <p className="detalhe">{i.diferenca}</p>
            </li>
          );
        })}
      </ol>

      <h3>O que fica de fora</h3>
      <p className="limite">{a.nota}</p>
      <ul className="codigo">
        <li>
          <a href={a.historico} target="_blank" rel="noreferrer">
            O histórico das rodadas, com o que foi reescrito
            <span className="sinal" aria-hidden>
              ↗
            </span>
          </a>
        </li>
      </ul>
    </Moldura>
  );
}
