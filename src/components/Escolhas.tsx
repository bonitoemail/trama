'use client';

import { Moldura } from './Metodo';
import { isoPorExtenso } from '@/engine/calendario';
import type { Jogo } from '@/engine/schema';
import type { Decisao, Opcao } from '@/lib/escolhas';
import { usePainel } from '@/lib/painel';
import CompartilharPlacar from './CompartilharPlacar';

interface Props {
  textos: NonNullable<Jogo['escolhas']>;
  titulo: string;
  /** Link do placar para o registro de acertos (o que o próprio jogo escreveu e aconteceu). */
  acertos?: { titulo: string; onClick: () => void };
  onVoltar: () => void;
  principal: { rotulo: string; curto: string; onClick: () => void };
  capitulo: string;
}

/**
 * O que os jogadores escolheram, somado (sem link na capa). Mesma moldura e linguagem de
 * "Como fazemos": sans, quieta, sem cartões. As barras são cinza; a mais escolhida só fica mais clara,
 * sem cor de lado. Os números vêm de /api/escolhas, refeitos a cada hora.
 */
export default function Escolhas({ textos: t, titulo, acertos, onVoltar, principal, capitulo }: Props) {
  const carga = usePainel();
  const p = carga && carga !== 'vazio' ? carga : null;

  return (
    <Moldura classe="metodo pagina-escolhas" titulo={titulo} onVoltar={onVoltar} principal={principal} capitulo={capitulo}>
      <h1>{t.titulo}</h1>
      <p className="lead">{t.texto}</p>
      <p className="aviso">{t.aviso}</p>
      {p && <p className="conta">{`${p.partidas.toLocaleString('pt-BR')} histórias começadas, atualizado em ${quando(p.atualizado)}`}</p>}
      {carga === null && <p className="conta">Somando as escolhas…</p>}
      {carga === 'vazio' && <p className="conta">Os números não estão disponíveis agora. Tente de novo mais tarde.</p>}

      {p && (
        <>
          {/* A aposta que a realidade decidiu ganha o topo (sketch em estilo/sketches-3-11): quantos acertaram, numa frase. */}
          {p.placar.length > 0 && (
            <section className="placar">
              <h2>A realidade decidiu</h2>
              <p className="sub">Contam só as escolhas feitas antes da notícia.</p>
              {p.placar.map((d) => {
                const real = d.opcoes.find((o) => o.real);
                return (
                  <div key={d.no} className="decisao">
                    <p className="manchete">
                      <b>{real?.pct ?? 0}%</b> dos jogadores acertaram, em {d.total.toLocaleString('pt-BR')} escolhas.
                    </p>
                    <p className="cena">
                      <b>{d.titulo}</b>, cap. {d.numero}, em {isoPorExtenso(d.data!)}
                    </p>
                    <Barras opcoes={d.opcoes} semDestaque />
                    <CompartilharPlacar d={d} />
                  </div>
                );
              })}
            </section>
          )}

          {p.antes.length > 0 && (
            <section>
              <h2>Antes da notícia</h2>
              <p className="sub">Escolhas que a realidade vai decidir. Quando decidir, mostramos quantos jogadores tinham acertado.</p>
              {p.antes.map((d) => (
                <Bloco key={d.no} d={d}>
                  <p className="espera">
                    {d.aguardando ? (
                      <>
                        A notícia que pode decidir esta escolha é de <b>{isoPorExtenso(d.data!)}</b>. Contam só as escolhas feitas antes, e o placar sai quando o resultado for conferido.
                      </>
                    ) : (
                      <>
                        A realidade começa a decidir em <b>{isoPorExtenso(d.data!)}</b>. Depois disso, esta decisão vai para o placar, com a data e as fontes.
                      </>
                    )}
                  </p>
                </Bloco>
              ))}
            </section>
          )}
          {acertos && (p.antes.length > 0 || p.placar.length > 0) && (
            <p className="ponte">
              Isto é o que os jogadores apostaram. O que as cenas do Trama escreveram antes, e se a realidade confirmou, fica em{' '}
              <button type="button" onClick={acertos.onClick}>
                {acertos.titulo}
              </button>
              .
            </p>
          )}

          {p.divididas.length > 0 && (
            <section>
              <h2>Onde os jogadores se dividem</h2>
              <p className="sub">As decisões em que as duas escolhas mais comuns ficaram mais perto uma da outra.</p>
              {p.divididas.map((d) => (
                <Bloco key={d.no} d={d} />
              ))}
            </section>
          )}

          {p.maioria.length > 0 && (
            <section>
              <h2>Onde a maioria concorda</h2>
              <p className="sub">As decisões em que uma escolha passou da metade.</p>
              {p.maioria.map((d) => (
                <Bloco key={d.no} d={d} />
              ))}
            </section>
          )}

          {p.raras.length > 0 && (
            <section>
              <h2>O que quase ninguém escolhe</h2>
              <p className="sub">Caminhos que existem no jogo e poucos jogadores tomam.</p>
              <ul className="raras">
                {p.raras.map((r) => (
                  <li key={r.rotulo}>
                    <span className="nome">
                      {r.rotulo}
                      <small>{`${r.titulo}, cap. ${r.numero}, ${r.total} escolhas`}</small>
                    </span>
                    <span className="pct">{r.pct}%</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {p.finais.map((f) => (
            <section key={f.capitulo}>
              <h2>Como termina o capítulo {f.numero}</h2>
              <p className="sub">Para onde as escolhas levaram quem chegou ao fim de &ldquo;{f.titulo}&rdquo;.</p>
              <div className="decisao">
                <Barras opcoes={f.itens} />
                <p className="votos">{f.total} histórias chegaram ao fim do capítulo</p>
              </div>
            </section>
          ))}

          {p.cruzados.map((c) => (
            <section key={c.grupo}>
              <h2>Uma escolha muda a outra?</h2>
              <p className="sub">
                Quantos escolheram &ldquo;{c.alvo}&rdquo;, entre quem escolheu &ldquo;{c.grupo}&rdquo; antes e entre quem escolheu outra opção.
              </p>
              <div className="decisao">
                <Barras opcoes={c.linhas.map((l) => ({ rotulo: l.quem, n: l.total, pct: l.pct }))} semDestaque />
                <p className="votos">
                  {`${c.linhas.map((l) => l.total).join(' e ')} histórias. Diferença de ${Math.abs(c.linhas[0].pct - c.linhas[1].pct)} pontos.`}
                </p>
              </div>
            </section>
          ))}
        </>
      )}

      <section className="como-contamos">
        <h3>Como contamos</h3>
        {t.metodo.map((m) => (
          <p key={m}>{m}</p>
        ))}
      </section>
    </Moldura>
  );
}

function Bloco({ d, children }: { d: Decisao; children?: React.ReactNode }) {
  return (
    <div className="decisao">
      <p className="cena">
        <b>{d.titulo}</b>, cap. {d.numero}
      </p>
      <Barras opcoes={d.opcoes} />
      <p className="votos">{d.total} escolhas</p>
      {children}
    </div>
  );
}

/** Barras finas. A mais escolhida (ou as empatadas no topo) fica mais clara; a real ganha o fio. */
function Barras({ opcoes, semDestaque }: { opcoes: Opcao[]; semDestaque?: boolean }) {
  const topo = Math.max(...opcoes.map((o) => o.n));
  return (
    <ul className="opcoes">
      {opcoes.map((o) => (
        <li key={o.rotulo} className={`opcao ${!semDestaque && o.n === topo ? 'mais' : ''} ${o.real ? 'real' : ''}`}>
          <span className="nome">
            {o.rotulo}
            {o.real && <small>aconteceu</small>}
          </span>
          <span className="pct">{o.pct}%</span>
          <span className="trilho" aria-hidden>
            <span style={{ width: `${o.pct}%` }} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** "30 de outubro, às 13h" no horário de Brasília. */
function quando(iso: string): string {
  const d = new Date(iso);
  const dia = d.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
  const hora = Number(d.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: 'numeric', hourCycle: 'h23' }));
  return `${isoPorExtenso(dia)}, às ${hora}h`;
}
