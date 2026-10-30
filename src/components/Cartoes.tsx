'use client';

import { useEffect, useState } from 'react';
import { dominio } from '@/engine/fontes';

/** Fato real da cena, já filtrado pelas marcas. */
export interface FatoDaCena {
  texto: string;
  fontes: string[];
}

interface Props {
  /** Cada texto é um cartão. */
  textos: string[];
  imagem?: string;
  /** Linha pequena acima do texto em todos os cartões (lugar, eco da escolha). */
  topo?: React.ReactNode;
  /** Conteúdo extra do primeiro cartão, abaixo da imagem (ex.: título do capítulo). */
  abertura?: React.ReactNode;
  /** "Fatos e fontes", parte 1: o que aconteceu de verdade, com as fontes. */
  fatos?: FatoDaCena[];
  /** "Fatos e fontes", parte 2: como cada lado vê (posições, não fatos). */
  lados?: string[];
  /** Escolhas ou botão de seguir: aparecem só no último cartão. */
  children: React.ReactNode;
}

/**
 * Leitura em formato stories: um cartão por vez, toque à direita avança, à esquerda volta.
 * O estado reinicia quando o componente é remontado (a cena usa `key` por nó).
 */
export default function Cartoes({ textos, imagem, topo, abertura, fatos, lados, children }: Props) {
  const total = Math.max(1, textos.length);
  const [i, setI] = useState(0);
  const [aberto, setAberto] = useState(false);
  const ultimo = i === total - 1;
  const temFontes = Boolean(fatos?.length || lados?.length);

  const avancar = () => setI((x) => Math.min(total - 1, x + 1));
  const voltar = () => setI((x) => Math.max(0, x - 1));
  /** Como nos stories: da metade da tela para a esquerda volta, para a direita avança. */
  const naEsquerda = (e: { clientX: number }) => e.clientX < window.innerWidth / 2;
  const voltaNoUltimo = ultimo && i > 0;

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLButtonElement) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        avancar();
      }
      if (e.key === 'ArrowLeft') voltar();
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  });

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [i]);

  // No último cartão as opções ficam fora da área de toque; tocar à esquerda, fora de botões e links, ainda volta.
  useEffect(() => {
    if (!voltaNoUltimo) return;
    const clique = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('button, a, .fim-cartoes')) return;
      if (naEsquerda(e)) voltar();
    };
    window.addEventListener('click', clique);
    return () => window.removeEventListener('click', clique);
  }, [voltaNoUltimo]);

  return (
    <div className="cartoes">
      <div className="progresso" aria-hidden>
        {Array.from({ length: total }, (_, k) => (
          <span key={k} className={k <= i ? 'feito' : ''} />
        ))}
      </div>

      {/* Enquanto há cartões pela frente, a tela inteira é área de toque (como nos stories):
          a metade esquerda volta, a direita avança. */}
      {!ultimo && (
        <div
          className="toque-tela"
          role="button"
          aria-label="Toque para continuar"
          onClick={(e) => (naEsquerda(e) ? voltar() : avancar())}
        />
      )}
      <div className={`cartao ${ultimo ? 'ultimo' : ''}`} key={i}>
        {imagem &&
          (i === 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="ilustracao" src={`/${imagem}`} alt="" />
          ) : (
            // A mesma imagem volta como faixa nos cartões seguintes: o cartão nunca fica sem chão.
            // eslint-disable-next-line @next/next/no-img-element
            <img className="faixa" src={`/${imagem}`} alt="" />
          ))}
        {i === 0 && abertura}
        {topo}
        <p className="texto">{textos[i]}</p>
        {!ultimo && <p className="toque">toque para continuar</p>}
      </div>

      {ultimo && (
        <div className="fim-cartoes">
          {(i > 0 || temFontes) && (
            <div className="apoio">
              {i > 0 && (
                <button type="button" className="voltar-cartao" onClick={voltar}>
                  ← voltar
                </button>
              )}
              {temFontes && (
                <button type="button" className="saiba-botao" aria-expanded={aberto} onClick={() => setAberto((a) => !a)}>
                  {aberto ? 'fechar' : 'fatos e fontes'}
                </button>
              )}
            </div>
          )}
          {aberto && temFontes && (
            // Separa o que é fato (com fonte) do que é leitura de cada lado, e diz o que é simulação.
            <div className="saiba">
              {fatos && fatos.length > 0 && (
                <section>
                  <p className="saiba-rotulo">O que aconteceu</p>
                  <ul className="saiba-fatos">
                    {fatos.map((f, k) => (
                      <li key={k}>
                        <p>{f.texto}</p>
                        <p className="saiba-fontes">
                          {f.fontes.map((u) => (
                            <a key={u} href={u} target="_blank" rel="noreferrer">
                              {dominio(u)}
                            </a>
                          ))}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {lados && lados.length > 0 && (
                <section>
                  <p className="saiba-rotulo">Como cada lado vê</p>
                  {lados.map((d, k) => (
                    <p key={k} className="saiba-lado">
                      {d}
                    </p>
                  ))}
                </section>
              )}
              <p className="saiba-nota">
                A cena é simulação. Os fatos acima são reais: cada um tem documento oficial ou duas fontes independentes, de linhas
                editoriais diferentes.
              </p>
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
