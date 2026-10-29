import { diaMesCurto } from '@/engine/calendario';
import type { Jogo } from '@/engine/schema';

type Fato = Jogo['prologo'][number];

/** Os fatos reais anteriores ao "Agora", o mais novo em cima: data, manchete, texto e fonte. */
export default function Fatos({ fatos }: { fatos: Fato[] }) {
  // O YAML guarda em ordem cronológica; a lista mostra do mais recente para o mais antigo.
  const recentes = [...fatos].reverse();

  return (
    <ol className="fatos">
      {recentes.map((f, i) => (
        <li key={`${f.data}-${i}`}>
          <time>{diaMesCurto(f.data)}</time>
          <div>
            <p className="fato-tit">{f.titulo ?? f.texto}</p>
            {f.titulo && <p className="fato-texto">{f.texto}</p>}
            {f.fonte && <Fonte url={f.fonte} />}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Fonte({ url }: { url: string }) {
  return (
    <a className="fonte" href={url} target="_blank" rel="noreferrer">
      {dominio(url)}
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
