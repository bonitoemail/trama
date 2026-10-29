import { falta, isoCurta, type Regua as ReguaT } from '@/engine/calendario';

/** No celular cabem o Agora, os próximos marcos e o fim; os do meio viram "+N". */
const NO_CELULAR = 2;

/**
 * "Pela frente": paradas em espaços iguais, do último fato real ao último marco do calendário.
 * Não é proporcional ao tempo de propósito: mostra o que vem, não quanto já passou.
 */
export default function Regua({ regua }: { regua: ReguaT }) {
  const fim = regua.marcos[regua.marcos.length - 1];
  const meio = regua.marcos.slice(0, -1);
  const escondidos = Math.max(0, meio.length - NO_CELULAR);

  return (
    <section className="regua" aria-labelledby="regua-rot">
      <div className="regua-topo">
        <p className="rot" id="regua-rot">
          Pela frente
        </p>
        <p className="falta">
          <b>{falta(regua.agora, fim.data)}</b> até {fim.data.slice(0, 4)}
        </p>
      </div>
      <ol className="estacoes">
        <li className="estacao aqui">
          <span className="ponto" />
          <b>Agora</b>
          <time dateTime={regua.agora}>{isoCurta(regua.agora)}</time>
        </li>
        {meio.map((m, i) => (
          <li key={m.data} className={`estacao ${i >= NO_CELULAR ? 'so-pc' : ''}`}>
            <span className="ponto" />
            <b>{m.nome}</b>
            <time dateTime={m.data}>{isoCurta(m.data)}</time>
          </li>
        ))}
        {escondidos > 0 && (
          <li className="estacao salto so-cel" aria-hidden>
            <b>+{escondidos}</b>
          </li>
        )}
        <li className="estacao ultima">
          <span className="ponto" />
          <b>{fim.nome}</b>
          <time dateTime={fim.data}>{isoCurta(fim.data)}</time>
        </li>
      </ol>
    </section>
  );
}
