import { dataCurta } from '@/engine/calendario';
import type { Jogo } from '@/engine/schema';

type Fato = Jogo['prologo'][number];

/**
 * Os fatos reais anteriores ao "Agora", como changelog: o mais novo em cima, uma linha por fato
 * (data + manchete); tocar abre o texto e a fonte.
 */
export default function Fatos({ fatos }: { fatos: Fato[] }) {
  // O YAML guarda em ordem cronológica; a lista mostra do mais recente para o mais antigo.
  const recentes = [...fatos].reverse();

  return (
    <ol className="fatos">
      {recentes.map((f, i) => (
        <li key={`${f.data}-${i}`}>
          <details>
            <summary>
              <time>{dataCurta(f.data)}</time>
              <span className="tit">{f.titulo ?? f.texto}</span>
              <span className="mais" aria-hidden>
                +
              </span>
            </summary>
            <div className="fato-corpo">
              <p>{f.texto}</p>
              {f.fonte && <Fonte url={f.fonte} />}
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}

export function Fonte({ url }: { url: string }) {
  return (
    <a className="fonte" href={url} target="_blank" rel="noreferrer">
      {dominio(url)} ↗
    </a>
  );
}

function dominio(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
