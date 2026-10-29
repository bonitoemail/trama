'use client';

import { useEffect } from 'react';
import type { Lugar } from './Inicio';
import type { Jogo } from '@/engine/schema';

type Explicacao = NonNullable<Jogo['metodo']>;

interface Props {
  /** "objetivo": propósito, editorial e quente. "metodo": ficha técnica, numerada e em grade. */
  tipo: 'objetivo' | 'metodo';
  explicacao: Explicacao;
  /** Número de histórias já formatado ("184 mil"), para o destaque do propósito. */
  partidas: string;
  contar: (t: string) => string;
  titulo: string;
  outra?: { titulo: string; tag: string };
  onOutra: () => void;
  onVoltar: () => void;
  acoes: (lugar: Lugar) => React.ReactNode;
}

/**
 * Telas de explicação, abertas pela capa: "Para que serve o Trama" e "Como fazemos as previsões".
 * Mesma moldura (topo com Voltar, ações da partida presas embaixo no celular e paradas à direita
 * no PC), mas linguagens diferentes de propósito.
 */
export default function Metodo({ tipo, explicacao: e, partidas, contar, titulo, outra, onOutra, onVoltar, acoes }: Props) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const tecla = (ev: KeyboardEvent) => ev.key === 'Escape' && onVoltar();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [onVoltar, tipo]);

  return (
    <div className={`capa explica explica-${tipo}`}>
      <header className="topo">
        <button type="button" className="voltar" onClick={onVoltar}>
          <span aria-hidden>←</span> Voltar
        </button>
        <button type="button" className="marca" onClick={onVoltar} aria-label={`${titulo}: voltar ao início`}>
          {titulo}
        </button>
        <span />
      </header>

      <div className="moldura">
        <main className="interna">
          {tipo === 'objetivo' ? <Proposito e={e} partidas={partidas} contar={contar} /> : <Ficha e={e} />}

          {outra && (
            <button type="button" className="cruzado" onClick={onOutra}>
              <span>
                <small>{outra.tag}</small>
                <b>{outra.titulo}</b>
              </span>
              <span className="circulo-seta" aria-hidden>
                →
              </span>
            </button>
          )}
        </main>
        <aside className="lado">
          <div className="partida-lado">{acoes('lado')}</div>
        </aside>
      </div>

      <div className="barra-partida visivel barra-interna">
        <div>{acoes('barra')}</div>
      </div>
    </div>
  );
}

/** Propósito: uma frase grande e as ideias em linhas largas, sem números. */
function Proposito({ e, partidas, contar }: { e: Explicacao; partidas: string; contar: (t: string) => string }) {
  return (
    <>
      <header className="abre">
        <p className="rot">O propósito</p>
        <h1>{e.titulo}</h1>
        <p className="frase">{contar(e.texto)}</p>
      </header>
      <ol className="ideias">
        {e.etapas.map((b, i) => {
          // O bloco com {partidas} no título vira um dado grande: "Mais de" · 184 mil · "histórias".
          if (b.titulo.includes('{partidas}')) {
            const [antes, depois] = b.titulo.split('{partidas}').map((s) => s.trim());
            return (
              <li key={i} className="ideia dado">
                <h2 className="numero" aria-label={contar(b.titulo)}>
                  {antes && <small className="antes">{antes}</small>}
                  {partidas}
                  {depois && <small>{depois}</small>}
                </h2>
                <p>{contar(b.texto)}</p>
              </li>
            );
          }
          if (b.destaque) {
            return (
              <li key={i} className="ideia citacao">
                <h2 className="rot">{b.titulo}</h2>
                <blockquote>{b.destaque}</blockquote>
                <p>{contar(b.texto)}</p>
              </li>
            );
          }
          return (
            <li key={i} className="ideia">
              <h2>{contar(b.titulo)}</h2>
              <p>{contar(b.texto)}</p>
            </li>
          );
        })}
      </ol>
      {e.nota && <p className="nota-fim">{e.nota}</p>}
    </>
  );
}

/** Método: etapas numeradas, o esquema base → leituras → saídas, as lentes em grade e o limite. */
function Ficha({ e }: { e: Explicacao }) {
  return (
    <>
      <header className="abre">
        <p className="rot">O método</p>
        <h1>{e.titulo}</h1>
        <p className="lead">{e.texto}</p>
      </header>

      <section className="secao" aria-labelledby="etapas-rot">
        <p className="rot" id="etapas-rot">
          Etapas
        </p>
        <ol className="etapas">
          {e.etapas.map((b, i) => (
            <li key={i} className="etapa">
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2>{b.titulo}</h2>
                <p>{b.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {(e.esquema || e.lentes) && (
        <section className="secao" aria-labelledby="lentes-rot">
          <p className="rot" id="lentes-rot">
            As lentes
          </p>
          {e.esquema && (
            <div className="esquema">
              <Caixa b={e.esquema.base} />
              <div className="seta-baixo" aria-hidden />
              <Caixa b={e.esquema.leituras} />
              <div className="seta-baixo" aria-hidden />
              <div className="saidas">
                <Caixa b={e.esquema.concordam} />
                <Caixa b={e.esquema.divergem} />
              </div>
            </div>
          )}
          {e.lentes && (
            <ul className="lentes">
              {e.lentes.map((l, i) => (
                <li key={l.nome} className="lente">
                  <span className="n">L{i + 1}</span>
                  <h3>{l.nome}</h3>
                  <p>{l.texto}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {e.nota && (
        <div className="limite">
          <b>O limite do método</b>
          <p>{e.nota}</p>
        </div>
      )}
    </>
  );
}

function Caixa({ b }: { b: { titulo: string; texto: string } }) {
  return (
    <div className="caixa">
      <b>{b.titulo}</b>
      {b.texto}
    </div>
  );
}
