'use client';

import { useEffect } from 'react';
import type { Jogo } from '@/engine/schema';

type MetodoT = NonNullable<Jogo['metodo']>;

/** "Como fazemos as previsões": as etapas do método e as seis lentes do painel. */
export default function Metodo({ metodo, onVoltar }: { metodo: MetodoT; onVoltar: () => void }) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && onVoltar();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [onVoltar]);

  return (
    <article className="metodo">
      <button type="button" className="metodo-voltar" onClick={onVoltar}>
        ← Voltar
      </button>
      <h1 className="metodo-titulo">{metodo.titulo}</h1>
      <p className="lead">{metodo.texto}</p>

      <ol className="metodo-etapas">
        {metodo.etapas.map((e, i) => (
          <li key={i}>
            <span className="num">{i + 1}</span>
            <div>
              <h2>{e.titulo}</h2>
              <p>{e.texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="rotulo">As seis lentes</h2>
      <ul className="lentes">
        {metodo.lentes.map((l) => (
          <li key={l.nome}>
            <h3>{l.nome}</h3>
            <p>{l.texto}</p>
          </li>
        ))}
      </ul>

      {metodo.nota && <p className="aviso">{metodo.nota}</p>}
    </article>
  );
}
