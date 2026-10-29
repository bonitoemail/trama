'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { Jogo } from '@/engine/schema';

type Fato = Jogo['prologo'][number];

/**
 * "O que já aconteceu": os fatos reais do prólogo como um changelog, o mais novo em cima.
 * Uma linha por fato (data + manchete); tocar abre o texto e a fonte.
 * Fechada, mostra o fato mais novo e a ponta do seguinte; rola por dentro. No PC, a alça embaixo
 * arrasta para cima e para baixo para mostrar mais (no celular a alça fica escondida).
 */
export default function Fatos({ fatos }: { fatos: Fato[] }) {
  const [aberto, setAberto] = useState<number | null>(null);
  const ultimo = fatos[fatos.length - 1];
  // O YAML guarda em ordem cronológica; o changelog mostra do mais recente para o mais antigo.
  const recentes = fatos.map((f, i) => ({ f, i })).reverse();

  const lista = useRef<HTMLOListElement>(null);
  const [base, setBase] = useState<number | null>(null);
  const [altura, setAltura] = useState<number | null>(null);

  // Altura fechada: o primeiro fato inteiro + a data e o começo da manchete do segundo.
  useLayoutEffect(() => {
    const primeiro = lista.current?.querySelector('li');
    if (primeiro) setBase(primeiro.offsetHeight + PONTA);
  }, []);

  function arrastar(e: React.PointerEvent<HTMLDivElement>) {
    const ol = lista.current;
    if (!ol || base === null) return;
    e.preventDefault();
    const inicioY = e.clientY;
    const inicioAltura = ol.clientHeight;
    const mover = (ev: PointerEvent) => {
      const maximo = ol.scrollHeight;
      setAltura(Math.min(maximo, Math.max(base, inicioAltura + ev.clientY - inicioY)));
    };
    const soltar = () => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerup', soltar);
      document.body.classList.remove('arrastando');
    };
    document.body.classList.add('arrastando');
    window.addEventListener('pointermove', mover);
    window.addEventListener('pointerup', soltar);
  }

  return (
    <section className="fatos-lista">
      <header className="fatos-topo">
        <span>O que já aconteceu</span>
        <span className="atualizado">
          até <strong>{semAno(ultimo.data)}</strong> · depois disso, é ficção
        </span>
      </header>
      <ol ref={lista} style={base === null ? undefined : { height: altura ?? base }}>
        {recentes.map(({ f, i }) => {
          const abre = aberto === i;
          return (
            <li key={`${f.data}-${i}`} className={abre ? 'aberto' : ''}>
              <button type="button" className="linha-fato" aria-expanded={abre} onClick={() => setAberto(abre ? null : i)}>
                <time>{semAno(f.data)}</time>
                <span className="manchete">{f.titulo ?? f.texto}</span>
                <span className="mais" aria-hidden>
                  {abre ? '−' : '+'}
                </span>
              </button>
              {abre && (
                <div className="corpo-fato">
                  <p>{f.texto}</p>
                  {f.fonte && (
                    <a href={f.fonte} target="_blank" rel="noreferrer">
                      fonte: {dominio(f.fonte)} ↗
                    </a>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <div
        className="alca"
        role="separator"
        aria-orientation="horizontal"
        aria-label="Arraste para mostrar mais fatos"
        onPointerDown={arrastar}
        onDoubleClick={() => setAltura(null)}
      >
        <span />
      </div>
    </section>
  );
}

/** Quanto do segundo fato aparece com a lista fechada (px). */
const PONTA = 34;

/** "28 de outubro de 2026, à noite" vira "28 de outubro, à noite": o ano é sempre o mesmo por enquanto. */
function semAno(data: string): string {
  return data.replace(/ de \d{4}/, '');
}

function dominio(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
