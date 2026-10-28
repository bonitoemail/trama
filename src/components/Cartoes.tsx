'use client';

import { useEffect, useState } from 'react';

interface Props {
  /** Cada texto é um cartão. */
  textos: string[];
  imagem?: string;
  /** Linha pequena acima do texto em todos os cartões (lugar, eco da escolha). */
  topo?: React.ReactNode;
  /** Conteúdo extra do primeiro cartão, abaixo da imagem (ex.: título do capítulo). */
  abertura?: React.ReactNode;
  /** "Saiba mais": parágrafos opcionais, abertos só por quem quiser. */
  detalhe?: string[];
  /** Escolhas ou botão de seguir: aparecem só no último cartão. */
  children: React.ReactNode;
}

/**
 * Leitura em formato stories: um cartão por vez, toque à direita avança, à esquerda volta.
 * O estado reinicia quando o componente é remontado (a cena usa `key` por nó).
 */
export default function Cartoes({ textos, imagem, topo, abertura, detalhe, children }: Props) {
  const total = Math.max(1, textos.length);
  const [i, setI] = useState(0);
  const [aberto, setAberto] = useState(false);
  const ultimo = i === total - 1;

  const avancar = () => setI((x) => Math.min(total - 1, x + 1));
  const voltar = () => setI((x) => Math.max(0, x - 1));

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

  return (
    <div className="cartoes">
      <div className="progresso" aria-hidden>
        {Array.from({ length: total }, (_, k) => (
          <span key={k} className={k <= i ? 'feito' : ''} />
        ))}
      </div>

      <div
        className={`cartao ${ultimo ? 'ultimo' : ''}`}
        onClick={(e) => {
          if (ultimo) return;
          const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          if (e.clientX - r.left < r.width * 0.3) voltar();
          else avancar();
        }}
        role={ultimo ? undefined : 'button'}
        aria-label={ultimo ? undefined : 'Toque para continuar'}
        key={i}
      >
        {i === 0 && imagem && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="ilustracao" src={`/${imagem}`} alt="" />
        )}
        {i === 0 && abertura}
        {topo}
        <p className="texto">{textos[i]}</p>
        {!ultimo && <p className="toque">toque para continuar</p>}
      </div>

      {ultimo && (
        <div className="fim-cartoes">
          {i > 0 && (
            <button type="button" className="voltar-cartao" onClick={voltar}>
              ← voltar
            </button>
          )}
          {detalhe && detalhe.length > 0 && (
            <div className="saiba">
              <button type="button" className="saiba-botao" onClick={() => setAberto((a) => !a)}>
                {aberto ? 'fechar' : 'saiba mais'}
              </button>
              {aberto && detalhe.map((d, k) => <p key={k}>{d}</p>)}
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
