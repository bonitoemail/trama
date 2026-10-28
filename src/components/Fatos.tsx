'use client';

import { useState } from 'react';
import type { Jogo } from '@/engine/schema';

type Fato = Jogo['prologo'][number];

/**
 * "O que já aconteceu": os fatos reais do prólogo como um changelog.
 * Uma linha por fato (data + manchete); tocar abre o texto e a fonte.
 */
export default function Fatos({ fatos }: { fatos: Fato[] }) {
  const [aberto, setAberto] = useState<number | null>(null);
  const ultimo = fatos[fatos.length - 1];

  return (
    <section className="fatos-lista">
      <p className="atualizado">
        Atualizado com fatos até <strong>{ultimo.data}</strong>. Daí em diante, é ficção.
      </p>
      <ol>
        {fatos.map((f, i) => {
          const abre = aberto === i;
          return (
            <li key={`${f.data}-${i}`} className={abre ? 'aberto' : ''}>
              <button type="button" className="linha-fato" aria-expanded={abre} onClick={() => setAberto(abre ? null : i)}>
                <time>{f.data}</time>
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

function dominio(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
