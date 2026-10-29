'use client';

import { useState } from 'react';
import type { Jogo } from '@/engine/schema';

type Fato = Jogo['prologo'][number];

/**
 * "O que já aconteceu": os fatos reais do prólogo como um changelog, o mais novo em cima.
 * Uma linha por fato (data + manchete); tocar abre o texto e a fonte.
 */
export default function Fatos({ fatos }: { fatos: Fato[] }) {
  const [aberto, setAberto] = useState<number | null>(null);
  const ultimo = fatos[fatos.length - 1];
  // O YAML guarda em ordem cronológica; o changelog mostra do mais recente para o mais antigo.
  const recentes = fatos.map((f, i) => ({ f, i })).reverse();


  return (
    <section className="fatos-lista">
      <header className="fatos-topo">
        <span>O que já aconteceu</span>
        <span className="atualizado">
          até <strong>{semAno(ultimo.data)}</strong> · depois disso, é ficção
        </span>
      </header>
      <ol>
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
    </section>
  );
}

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
