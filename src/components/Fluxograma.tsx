'use client';

import { useMemo, useState } from 'react';
import type { Passo } from '@/engine/engine';
import { SAIDA, layoutDoCapitulo } from '@/engine/layout';
import type { Capitulo } from '@/engine/schema';

interface Props {
  cap: Capitulo;
  /** Passos desta partida dentro deste capítulo. */
  passos: Passo[];
  vistos: Set<string>;
}

// Miniatura 16:9 de cada nó; o espaçamento do layout acompanha o tamanho.
const TW = 96;
const TH = 54;
const ESPACO = { dx: 124, dy: 98, margem: 56 };

/**
 * Mapa do capítulo: só o caminho desta partida mostra as ilustrações.
 * O resto é um bloco cinza com "?" (contorno cheio se já visto em outra partida, tracejado se nunca).
 */
export default function Fluxograma({ cap, passos, vistos }: Props) {
  const layout = useMemo(() => layoutDoCapitulo(cap, ESPACO), [cap]);
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const pos = new Map(layout.nos.map((n) => [n.id, n]));
  const porId = new Map(cap.nos.map((n) => [n.id, n]));
  const percorridos = new Set(passos.map((p) => p.no));
  if (passos.length) percorridos.add(SAIDA);

  const reais = new Set(
    cap.nos.flatMap((n) => (n.escolhas ?? []).filter((e) => e.real).map((e) => `${n.id}:${e.id}`)),
  );
  const arestaPercorrida = (de: string, escolha: string | null) =>
    passos.some((p) => p.no === de && p.escolha === escolha);
  const noVisto = (id: string) => id === SAIDA || percorridos.has(id) || vistos.has(`${cap.id}/${id}`);
  const arestaVista = (de: string, escolha: string | null) =>
    escolha === null ? noVisto(de) : vistos.has(`${cap.id}/${de}:${escolha}`);

  const nosVistos = cap.nos.filter((n) => noVisto(n.id)).length;
  const sel = selecionado ? porId.get(selecionado) : null;

  // Arestas saem da base da miniatura e entram no topo da próxima.
  const borda = (id: string, lado: 'topo' | 'base') => {
    const p = pos.get(id)!;
    const meia = id === SAIDA ? 8 : TH / 2;
    return { x: p.x, y: lado === 'topo' ? p.y - meia : p.y + meia };
  };

  return (
    <figure className="fluxo">
      <svg
        viewBox={`0 0 ${layout.largura} ${layout.altura}`}
        width="100%"
        style={{ maxWidth: layout.largura * 1.25 }}
        role="img"
        aria-label={`Mapa do capítulo ${cap.numero}: ${nosVistos} de ${cap.nos.length} momentos descobertos`}
      >
        <defs>
          {layout.nos
            .filter((n) => n.id !== SAIDA)
            .map((n) => (
              <clipPath key={n.id} id={`mini-${cap.id}-${n.id}`}>
                <rect x={n.x - TW / 2} y={n.y - TH / 2} width={TW} height={TH} rx={6} />
              </clipPath>
            ))}
        </defs>

        {layout.arestas.map((a, i) => {
          const de = borda(a.de, 'base');
          const para = borda(a.para, 'topo');
          const meio = (de.y + para.y) / 2;
          // Escolhas diferentes que levam ao mesmo nó abrem em leque, para nenhuma sumir.
          const irmas = layout.arestas.filter((b) => b.de === a.de && b.para === a.para);
          const leque = (irmas.indexOf(a) - (irmas.length - 1) / 2) * 22;
          const d = `M ${de.x} ${de.y} C ${de.x + leque} ${meio}, ${para.x + leque} ${meio}, ${para.x} ${para.y}`;
          const cls = arestaPercorrida(a.de, a.escolha) ? 'percorrida' : arestaVista(a.de, a.escolha) ? 'vista' : 'oculta';
          const real = a.escolha !== null && reais.has(`${a.de}:${a.escolha}`) ? 'real' : '';
          return <path key={i} d={d} className={`aresta ${cls} ${real}`} />;
        })}

        {layout.nos.map((n) => {
          if (n.id === SAIDA) {
            return (
              <g key={n.id} className={`saida ${percorridos.has(SAIDA) ? 'percorrido' : ''}`}>
                <circle cx={n.x} cy={n.y} r={8} />
              </g>
            );
          }
          const no = porId.get(n.id)!;
          const estado = percorridos.has(n.id) ? 'percorrido' : noVisto(n.id) ? 'visto' : 'oculto';
          const x = n.x - TW / 2;
          const y = n.y - TH / 2;
          return (
            <g
              key={n.id}
              className={`mini ${estado} ${selecionado === n.id ? 'sel' : ''}`}
              onClick={() => setSelecionado(n.id === selecionado ? null : n.id)}
            >
              {estado === 'percorrido' && no.imagem ? (
                <image
                  href={`/${no.imagem}`}
                  x={x}
                  y={y}
                  width={TW}
                  height={TH}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#mini-${cap.id}-${n.id})`}
                />
              ) : (
                <rect className="fundo" x={x} y={y} width={TW} height={TH} rx={6} />
              )}
              <rect className="moldura" x={x} y={y} width={TW} height={TH} rx={6} />
              {estado !== 'percorrido' && (
                <text className="interrogacao" x={n.x} y={n.y + 6} textAnchor="middle">
                  ?
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption>
        {sel ? (
          noVisto(sel.id) ? <span>{sel.lugar ?? 'Sem título'}</span> : <span>Momento ainda não descoberto</span>
        ) : (
          <span>
            {nosVistos} de {cap.nos.length} momentos descobertos · toque numa cena
          </span>
        )}
      </figcaption>
    </figure>
  );
}
