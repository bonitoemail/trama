'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Dica from './Dica';
import Fatos, { Fonte } from './Fatos';
import Metodo from './Metodo';
import Regua from './Regua';
import { dataCurta, regua } from '@/engine/calendario';
import type { Jogo } from '@/engine/schema';

interface Props {
  jogo: Jogo;
  partidas: number;
  /** "Capítulo 1 · A carta" da partida salva; sem partida, não vem. */
  capituloAtual?: string;
  /** "Capítulo 1 · A carta" de onde começa uma partida nova. */
  capituloInicial: string;
  onContinuar: () => void;
  onComecar: () => void;
}

/**
 * Tela inicial em torno do presente: título, a régua "Pela frente" e o cartão "Agora" com o
 * último fato real e as ações da partida. Depois, os fatos anteriores, as portas para as telas
 * de explicação e "Como funciona". No celular, quando o cartão sai da tela, uma barra presa
 * embaixo traz a ação principal; no PC são três colunas e o cartão fica parado à esquerda.
 */
export default function Inicio({ jogo, partidas, capituloAtual, capituloInicial, onContinuar, onComecar }: Props) {
  const [confirmar, setConfirmar] = useState(false);
  const [pagina, setPagina] = useState<'metodo' | 'objetivo' | null>(null);
  const [longe, setLonge] = useState(false);
  const cartao = useRef<HTMLElement>(null);
  const voltar = useCallback(() => setPagina(null), []);
  const contar = (t: string) => t.replaceAll('{partidas}', emMil(partidas));

  const ap = jogo.apresentacao;
  const agora = jogo.prologo[jogo.prologo.length - 1];
  const antes = jogo.prologo.slice(0, -1);
  const pelaFrente = regua(jogo);

  useEffect(() => {
    const el = cartao.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(([e]) => setLonge(!e.isIntersecting), { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [pagina]);

  const acoes = { capituloAtual, capituloInicial, confirmar, setConfirmar, onContinuar, onComecar };

  const explicacao = pagina === 'metodo' ? jogo.metodo : pagina === 'objetivo' ? jogo.objetivo : undefined;
  if (pagina && explicacao) {
    const outra = pagina === 'metodo' ? jogo.objetivo : jogo.metodo;
    return (
      <Metodo
        tipo={pagina}
        explicacao={explicacao}
        partidas={emMil(partidas)}
        contar={contar}
        titulo={jogo.titulo}
        outra={outra && { titulo: outra.titulo, tag: pagina === 'metodo' ? 'O propósito' : 'O método' }}
        onOutra={() => setPagina(pagina === 'metodo' ? 'objetivo' : 'metodo')}
        onVoltar={voltar}
        acoes={(lugar) => <Acoes {...acoes} lugar={lugar} />}
      />
    );
  }

  return (
    <div className="capa">
      <main className="pagina">
        <header className="cabeca">
          <h1 className="marca luz">{jogo.titulo}</h1>
          <p className="ficha">{ap?.ficha ?? 'Experiência interativa · Brasil até 2030'}</p>
        </header>

        {pelaFrente && <Regua regua={pelaFrente} />}

        <div className="grade">
          <div className="col-agora">
            <article className="agora" ref={cartao} aria-labelledby="agora-tit">
              <div className="agora-topo">
                <div className="agora-rotulo">
                  <span>Agora</span>
                  <Dica rotulo="O que é o Agora?">
                    A história começa a partir desta notícia, a mais recente que importa. Daqui em diante, é ficção.
                  </Dica>
                </div>
                <time>{dataCurta(agora.data)}</time>
              </div>
              <h2 id="agora-tit">{agora.titulo ?? agora.texto}</h2>
              {agora.titulo && <p className="agora-texto">{agora.texto}</p>}
              {agora.fonte && <Fonte url={agora.fonte} />}
              <div className="corte">depois disso, é ficção</div>
              <Acoes {...acoes} lugar="cartao" />
            </article>
          </div>

          {antes.length > 0 && (
            <section className="bloco" aria-labelledby="antes">
              <p className="rot" id="antes">
                Antes disso · o que já aconteceu
              </p>
              <Fatos fatos={antes} />
            </section>
          )}

          <div className="col-apoio">
            {(jogo.objetivo || jogo.metodo) && (
              <section className="bloco portas" aria-label={`Sobre o ${jogo.titulo}`}>
                {jogo.objetivo && (
                  <Porta tag="O propósito" titulo={jogo.objetivo.titulo} onClick={() => setPagina('objetivo')}>
                    {contar(jogo.objetivo.chamada ?? jogo.objetivo.texto)}
                  </Porta>
                )}
                {jogo.metodo && (
                  <Porta tag="O método" titulo={jogo.metodo.titulo} onClick={() => setPagina('metodo')}>
                    {contar(jogo.metodo.chamada ?? jogo.metodo.texto)}
                  </Porta>
                )}
              </section>
            )}
            {ap && (
              <section className="bloco" aria-labelledby="como">
                <p className="rot" id="como">
                  Como funciona
                </p>
                <ol className="passos">
                  {ap.passos.map((p, i) => (
                    <li key={i}>
                      <span className="n">{String(i + 1).padStart(2, '0')}</span>
                      <b>{p.titulo}</b>
                      <span>{p.texto}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
            <p className="aviso">{jogo.aviso}</p>
          </div>
        </div>
      </main>

      <div className={`barra-partida barra-capa ${longe ? 'visivel' : ''}`} aria-hidden={!longe}>
        <div>
          {confirmar ? (
            <Botao onClick={() => cartao.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })} seta="↑" foco={longe}>
              Confirmar nova partida
            </Botao>
          ) : capituloAtual ? (
            <Botao onClick={onContinuar} detalhe={capituloAtual} foco={longe}>
              Continuar partida
            </Botao>
          ) : (
            <Botao onClick={onComecar} detalhe={capituloInicial} foco={longe}>
              Começar daqui
            </Botao>
          )}
        </div>
      </div>
    </div>
  );
}

export type Lugar = 'cartao' | 'lado' | 'barra';

/** Ações da partida. No cartão da capa e na barra/coluna das telas de explicação. */
function Acoes({
  lugar,
  capituloAtual,
  capituloInicial,
  confirmar,
  setConfirmar,
  onContinuar,
  onComecar,
}: {
  lugar: Lugar;
  capituloAtual?: string;
  capituloInicial: string;
  confirmar: boolean;
  setConfirmar: (v: boolean) => void;
  onContinuar: () => void;
  onComecar: () => void;
}) {
  // No cartão, o capítulo vai dentro do botão; ao lado, vai em cima, como legenda.
  const noBotao = lugar === 'cartao';
  if (confirmar) {
    return (
      <div className="acoes-partida">
        <p className="nota-acao">A partida atual será perdida. As escolhas não voltam.</p>
        <Botao onClick={onComecar}>Começar do zero</Botao>
        <button type="button" className="sub" onClick={() => setConfirmar(false)}>
          Manter a partida atual
        </button>
      </div>
    );
  }
  if (capituloAtual) {
    return (
      <div className="acoes-partida">
        {!noBotao && (
          <p className="onde">
            Sua partida<b>{capituloAtual}</b>
          </p>
        )}
        <Botao onClick={onContinuar} detalhe={noBotao ? capituloAtual : undefined}>
          Continuar partida
        </Botao>
        <button type="button" className="sub" onClick={() => setConfirmar(true)}>
          Começar uma nova partida
        </button>
      </div>
    );
  }
  return (
    <div className="acoes-partida">
      {!noBotao && (
        <p className="onde">
          Começa no<b>{capituloInicial}</b>
        </p>
      )}
      <Botao onClick={onComecar} detalhe={noBotao ? capituloInicial : undefined}>
        {noBotao ? 'Começar daqui' : 'Começar'}
      </Botao>
    </div>
  );
}

function Botao({
  children,
  detalhe,
  seta = '→',
  foco = true,
  onClick,
}: {
  children: React.ReactNode;
  detalhe?: string;
  seta?: string;
  /** false tira o botão da ordem do Tab (barra escondida). */
  foco?: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className="botao-partida" onClick={onClick} tabIndex={foco ? undefined : -1}>
      <span>
        {children}
        {detalhe && <small>{detalhe}</small>}
      </span>
      <span className="circulo" aria-hidden>
        {seta}
      </span>
    </button>
  );
}

function Porta({ tag, titulo, children, onClick }: { tag: string; titulo: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" className="porta" onClick={onClick}>
      <span className="porta-texto">
        <span className="tag">{tag}</span>
        <b>{titulo}</b>
        <span className="t">{children}</span>
      </span>
      <span className="circulo-linha" aria-hidden>
        →
      </span>
    </button>
  );
}

/** 184320 vira "184 mil"; abaixo de mil, o número inteiro. Arredonda para baixo: o texto diz "mais de". */
function emMil(n: number): string {
  return n >= 1000 ? `${Math.floor(n / 1000).toLocaleString('pt-BR')} mil` : String(n);
}
