'use client';

import { useEffect } from 'react';
import type { Jogo } from '@/engine/schema';

type Explicacao = NonNullable<Jogo['metodo']>;
type Passo = NonNullable<Jogo['apresentacao']>['passos'][number];

interface Props {
  /** "objetivo": leitura corrida em serifa. "metodo": sans, etapas numeradas, lentes em lista. */
  tipo: 'objetivo' | 'metodo';
  explicacao: Explicacao;
  /** "Como funciona", no fim da tela do propósito. */
  passos?: Passo[];
  /** Número de histórias já formatado ("184 mil"). */
  partidas: string;
  contar: (t: string) => string;
  titulo: string;
  /** Título da outra tela de explicação, para o link do fim. */
  outra?: string;
  onOutra: () => void;
  onVoltar: () => void;
  principal: { rotulo: string; curto: string; onClick: () => void };
  capitulo: string;
}

/**
 * Telas "Para que serve o Trama" e "Como fazemos as previsões". Mesma moldura (topo com Voltar e
 * a partida sempre à mão), linguagens diferentes: o propósito em serifa corrida, o método em sans
 * numerada. Esc volta, como o gesto de voltar do celular.
 */
export default function Metodo({ tipo, explicacao: e, passos, partidas, contar, titulo, outra, onOutra, onVoltar, principal, capitulo }: Props) {
  useEffect(() => {
    const tecla = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape' && !document.querySelector('.ajuda.aberta')) onVoltar();
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [onVoltar]);

  return (
    <div className="capa explica">
      <header className="topo">
        <button type="button" className="voltar" onClick={onVoltar}>
          <span aria-hidden>‹</span> Voltar
        </button>
        <button type="button" className="marca" onClick={onVoltar} aria-label={`${titulo}: voltar ao início`}>
          {titulo}
        </button>
        <button type="button" className="pilula" onClick={principal.onClick}>
          {principal.curto}
        </button>
      </header>

      <main className={`texto ${tipo}`}>
        {tipo === 'objetivo' ? <Proposito e={e} passos={passos} partidas={partidas} contar={contar} /> : <Ficha e={e} />}

        <div className="fim">
          <button type="button" className="botao-claro" onClick={principal.onClick}>
            {principal.rotulo}
          </button>
          <p className="legenda">{capitulo}</p>
        </div>
        {outra && (
          <button type="button" className="outra" onClick={onOutra}>
            {outra}
          </button>
        )}
      </main>
    </div>
  );
}

function Proposito({ e, passos, partidas, contar }: { e: Explicacao; passos?: Passo[]; partidas: string; contar: (t: string) => string }) {
  return (
    <>
      <h1>{e.titulo}</h1>
      <p className="frase">{contar(e.texto)}</p>
      {e.etapas.map((b, i) => {
        // O bloco com {partidas} no título vira o número grande; o texto explica.
        if (b.titulo.includes('{partidas}')) {
          return (
            <div key={i}>
              <p className="numero" aria-label={contar(b.titulo)}>
                {partidas}
              </p>
              <p>{contar(b.texto)}</p>
            </div>
          );
        }
        if (b.destaque) {
          return (
            <div key={i}>
              <p className="citacao">{b.destaque}</p>
              <p>{contar(b.texto)}</p>
            </div>
          );
        }
        return (
          <div key={i}>
            <h2>{contar(b.titulo)}</h2>
            <p>{contar(b.texto)}</p>
          </div>
        );
      })}

      {passos && passos.length > 0 && (
        <section className="como" aria-labelledby="como">
          <h2 id="como">Como funciona</h2>
          <ol className="passos">
            {passos.map((p, i) => (
              <li key={i}>
                <div>
                  <b>{p.titulo}</b>
                  <span>{p.texto}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {e.nota && <p className="nota-fim">{e.nota}</p>}
    </>
  );
}

function Ficha({ e }: { e: Explicacao }) {
  return (
    <>
      <h1>{e.titulo}</h1>
      <p className="lead">{e.texto}</p>
      <ol className="etapas">
        {e.etapas.map((b, i) => (
          <li key={i}>
            <div>
              <h2>{b.titulo}</h2>
              <p>{b.texto}</p>
            </div>
          </li>
        ))}
      </ol>

      {e.lentes && (
        <>
          <h3>As seis lentes</h3>
          <ul className="lentes">
            {e.lentes.map((l) => (
              <li key={l.nome}>
                <b>{l.nome}</b>
                <span>{l.texto}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {e.nota && (
        <>
          <h3>O limite do método</h3>
          <p className="limite">{e.nota}</p>
        </>
      )}
    </>
  );
}
