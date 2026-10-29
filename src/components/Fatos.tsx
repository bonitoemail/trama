import { diaMesCurto } from '@/engine/calendario';
import { dominio } from '@/engine/fontes';
import type { Jogo } from '@/engine/schema';

type Fato = Jogo['prologo'][number];

/** Os fatos reais anteriores ao "Agora", o mais novo em cima: data, manchete, texto e fontes. */
export default function Fatos({ fatos }: { fatos: Fato[] }) {
  // O YAML guarda em ordem cronológica; a lista mostra do mais recente para o mais antigo.
  const recentes = [...fatos].reverse();

  return (
    <>
      <p className="regra-fontes">
        Só entra como fato o que tem documento oficial ou duas fontes independentes, de linhas editoriais diferentes.
      </p>
      <ol className="fatos">
        {recentes.map((f, i) => (
          <li key={`${f.data}-${i}`}>
            <time>{diaMesCurto(f.data)}</time>
            <div>
              <p className="fato-tit">{f.titulo ?? f.texto}</p>
              {f.titulo && <p className="fato-texto">{f.texto}</p>}
              <Fontes urls={f.fontes} />
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

/** Os veículos de um fato, lado a lado, cada um com seu link. */
export function Fontes({ urls }: { urls: string[] }) {
  return (
    <p className="fontes">
      {urls.map((u) => (
        <a key={u} className="fonte" href={u} target="_blank" rel="noreferrer">
          {dominio(u)}
        </a>
      ))}
    </p>
  );
}
