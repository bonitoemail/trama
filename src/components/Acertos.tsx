'use client';

import { useEffect, useState } from 'react';
import { Fontes } from './Fatos';
import { Moldura } from './Metodo';
import { isoPorExtenso } from '@/engine/calendario';
import type { AConfirmar } from '@/engine/relogios';
import type { Jogo } from '@/engine/schema';

type Item = NonNullable<Jogo['acertos']>['itens'][number];
type Grupo = 'confirmou' | 'nao_confirmou' | 'a_confirmar';

interface Props {
  acertos: NonNullable<Jogo['acertos']>;
  /** Decisões que a realidade ainda vai decidir, dos relógios (aConfirmar). */
  aConfirmar: AConfirmar[];
  titulo: string;
  /** Link para o que os jogadores apostaram (tela /escolhas). */
  escolhas?: { titulo: string; onClick: () => void };
  onVoltar: () => void;
  principal: { rotulo: string; curto: string; onClick: () => void };
  capitulo: string;
}

const NOMES: Record<Grupo, string> = { confirmou: 'se confirmou', nao_confirmou: 'não se confirmou', a_confirmar: 'a confirmar' };

/**
 * "O jogo e a realidade": o que as cenas escreveram antes e o que a realidade fez depois. Três números
 * no topo, que também filtram; uma linha por item, que abre o detalhe. Os sinais são formas, não
 * cores (cheio, riscado, tracejado): nenhuma cor de lado. Mesma linguagem de "Como fazemos".
 */
export default function Acertos({ acertos: a, aConfirmar, titulo, escolhas, onVoltar, principal, capitulo }: Props) {
  const [filtro, setFiltro] = useState<Grupo | null>(null);
  const [abertos, setAbertos] = useState<Set<string>>(new Set());
  const itens = [...a.itens].sort((x, y) => y.realidade.data.localeCompare(x.realidade.data) || x.status.localeCompare(y.status));
  const conta: Record<Grupo, number> = {
    confirmou: itens.filter((i) => i.status === 'confirmou').length,
    nao_confirmou: itens.filter((i) => i.status === 'nao_confirmou').length,
    a_confirmar: aConfirmar.length,
  };
  const mostra = (g: Grupo) => !filtro || filtro === g;
  const alternar = (k: string) =>
    setAbertos((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });
  // O dia só no navegador: a página sai pronta do servidor no dia do build, e "daqui a 4 dias" mudaria.
  const [hoje, setHoje] = useState<string | null>(null);
  useEffect(() => setHoje(new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' })), []);

  return (
    <Moldura classe="metodo acertos" titulo={titulo} onVoltar={onVoltar} principal={principal} capitulo={capitulo}>
      <h1>{a.titulo}</h1>
      <p className="lead">{a.texto}</p>

      <div className="placar" role="group" aria-label="Mostrar só um grupo">
        {(Object.keys(NOMES) as Grupo[]).map((g) => (
          <button key={g} type="button" aria-pressed={!filtro || filtro === g} onClick={() => setFiltro((f) => (f === g ? null : g))}>
            <span className="n">
              {conta[g]} <Sinal g={g} />
            </span>
            <span className="r">{NOMES[g]}</span>
          </button>
        ))}
      </div>
      <p className="filtro">
        {filtro && (
          <>
            Mostrando só o que {NOMES[filtro].replace('a confirmar', 'falta confirmar')}.{' '}
            <button type="button" onClick={() => setFiltro(null)}>
              Ver tudo
            </button>
          </>
        )}
      </p>

      <ul className="lista">
        {itens
          .filter((i) => mostra(i.status))
          .map((i) => (
            <Linha
              key={i.titulo}
              g={i.status}
              titulo={i.titulo}
              meta={meta(i)}
              aberto={abertos.has(i.titulo)}
              onClick={() => alternar(i.titulo)}
            >
              <Detalhe i={i} commits={a.commits} />
            </Linha>
          ))}
        {mostra('a_confirmar') &&
          aConfirmar.map((d) => {
            const k = `${d.capitulo}/${d.no}`;
            const passou = hoje !== null && d.data <= hoje;
            return (
              <Linha
                key={k}
                g="a_confirmar"
                titulo={d.titulo}
                meta={
                  passou ? (
                    <>A notícia é de {isoPorExtenso(d.data)}. O resultado entra aqui quando for conferido.</>
                  ) : (
                    <>
                      A realidade começa a decidir em <b>{isoPorExtenso(d.data)}</b>{hoje && `, ${falta(hoje, d.data)}`}.
                    </>
                  )
                }
                aberto={abertos.has(k)}
                onClick={() => alternar(k)}
              >
                <div className="bloco">
                  <h3>O que o jogo deixa em aberto (cap. {d.numero})</h3>
                  <ul className="opcoes-abertas">
                    {d.opcoes.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                  <p className="miudo">
                    Quando a realidade decidir, a escolha fica travada no jogo e o resultado entra aqui.
                    {escolhas && (
                      <>
                        {' '}
                        <button type="button" onClick={escolhas.onClick}>
                          {escolhas.titulo}
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </Linha>
            );
          })}
      </ul>
      {(filtro ? conta[filtro] : itens.length + aConfirmar.length) === 0 && <p className="vazio">Nada aqui por enquanto.</p>}

      <p className="nota">
        {a.nota}{' '}
        <a href={a.historico} target="_blank" rel="noreferrer">
          O histórico das rodadas
        </a>
        .
      </p>
      {escolhas && (
        <button type="button" className="discreto" onClick={escolhas.onClick}>
          {escolhas.titulo}
        </button>
      )}
    </Moldura>
  );
}

function Sinal({ g }: { g: Grupo }) {
  return <span className={`sinal ${g}`} aria-hidden />;
}

function Linha({ g, titulo, meta, aberto, onClick, children }: { g: Grupo; titulo: string; meta: React.ReactNode; aberto: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <li className={`item ${g} ${aberto ? 'aberto' : ''}`}>
      <button type="button" className="linha" aria-expanded={aberto} onClick={onClick}>
        <Sinal g={g} />
        <span>
          <span className="titulo">
            <span className="so-leitor">{NOMES[g]}: </span>
            {titulo}
          </span>
          <span className="meta">{meta}</span>
        </span>
        <svg className="seta" viewBox="0 0 20 20" aria-hidden>
          <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <div className="detalhe">
        <div>
          <div className="corpo">{children}</div>
        </div>
      </div>
    </li>
  );
}

function Detalhe({ i, commits }: { i: Item; commits: string }) {
  const [dia, hora] = i.previsto.data.split(' ');
  return (
    <>
      <div className="par">
        <div className="bloco">
          <h3>O que o jogo escreveu</h3>
          <blockquote>{i.previsto.texto}</blockquote>
          <p className="miudo">
            {i.previsto.caminho ? `${i.previsto.caminho}. ` : ''}
            <a href={`${commits}${i.previsto.commit}`} target="_blank" rel="noreferrer">
              {isoPorExtenso(dia)}, {hora.replace(':', 'h')}, no histórico público ({i.previsto.commit})
            </a>
          </p>
        </div>
        <div className="bloco">
          <h3>O que aconteceu</h3>
          <p>{i.realidade.texto}</p>
          <Fontes urls={i.realidade.fontes} />
        </div>
      </div>
      <div className="bloco diferenca">
        <h3>{i.status === 'confirmou' ? 'O que não bateu' : 'O que mudou no jogo'}</h3>
        <p>{i.diferenca}</p>
      </div>
    </>
  );
}

/** "Escrito em 28 de outubro, confirmado em 29 de outubro. 1 dia antes." */
function meta(i: Item): React.ReactNode {
  const escrito = i.previsto.data.slice(0, 10);
  const dias = Math.round((Date.parse(i.realidade.data) - Date.parse(escrito)) / 86_400_000);
  if (i.status === 'nao_confirmou') {
    return <>Escrito em {isoPorExtenso(escrito)}. A realidade foi por outro caminho em {isoPorExtenso(i.realidade.data)}, e a cena foi reescrita.</>;
  }
  return (
    <>
      Escrito em {isoPorExtenso(escrito)}, confirmado em {isoPorExtenso(i.realidade.data)}.{' '}
      {dias > 0 && <b>{dias === 1 ? '1 dia antes.' : `${dias} dias antes.`}</b>}
    </>
  );
}

/** "daqui a 4 dias", "amanhã", "hoje". */
function falta(hoje: string, data: string): string {
  const d = Math.round((Date.parse(data) - Date.parse(hoje)) / 86_400_000);
  if (d <= 0) return 'hoje';
  if (d === 1) return 'amanhã';
  return `daqui a ${d} dias`;
}
