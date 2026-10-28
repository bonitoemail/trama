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

export default function Fluxograma({ cap, passos, vistos }: Props) {
  const layout = useMemo(() => layoutDoCapitulo(cap), [cap]);
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const pos = new Map(layout.nos.map((n) => [n.id, n]));
  const percorridos = new Set(passos.map((p) => p.no));
  const ultimo = passos[passos.length - 1];
  if (ultimo) percorridos.add(SAIDA);

  const reais = new Set(
    cap.nos.flatMap((n) => (n.escolhas ?? []).filter((e) => e.real).map((e) => `${n.id}:${e.id}`)),
  );
  const arestaPercorrida = (de: string, escolha: string | null) =>
    passos.some((p) => p.no === de && p.escolha === escolha);
  const noVisto = (id: string) => id === SAIDA || percorridos.has(id) || vistos.has(`${cap.id}/${id}`);
  const arestaVista = (de: string, escolha: string | null) =>
    escolha === null ? noVisto(de) : vistos.has(`${cap.id}/${de}:${escolha}`);

  const totalNos = cap.nos.length;
  const nosVistos = cap.nos.filter((n) => noVisto(n.id)).length;
  const sel = selecionado ? cap.nos.find((n) => n.id === selecionado) : null;

  return (
    <figure className="fluxo">
      <svg
        viewBox={`0 0 ${layout.largura} ${layout.altura}`}
        width="100%"
        style={{ maxWidth: layout.largura * 1.6 }}
        role="img"
        aria-label={`Fluxograma do capítulo ${cap.numero}: ${nosVistos} de ${totalNos} momentos descobertos`}
      >
        {layout.arestas.map((a, i) => {
          const de = pos.get(a.de)!;
          const para = pos.get(a.para)!;
          const meio = (de.y + para.y) / 2;
          // Escolhas diferentes que levam ao mesmo nó abrem em leque, para nenhuma sumir.
          const irmas = layout.arestas.filter((b) => b.de === a.de && b.para === a.para);
          const k = irmas.indexOf(a);
          const leque = (k - (irmas.length - 1) / 2) * 26;
          const d = `M ${de.x} ${de.y} C ${de.x + leque} ${meio}, ${para.x + leque} ${meio}, ${para.x} ${para.y}`;
          const cls = arestaPercorrida(a.de, a.escolha) ? 'percorrida' : arestaVista(a.de, a.escolha) ? 'vista' : 'oculta';
          const real = a.escolha !== null && reais.has(`${a.de}:${a.escolha}`) ? 'real' : '';
          return <path key={i} d={d} className={`aresta ${cls} ${real}`} />;
        })}
        {layout.nos.map((n) => {
          const saida = n.id === SAIDA;
          const cls = percorridos.has(n.id) ? 'percorrido' : noVisto(n.id) ? 'visto' : 'oculto';
          return (
            <g
              key={n.id}
              className={`no ${cls} ${selecionado === n.id ? 'sel' : ''}`}
              transform={`translate(${n.x} ${n.y})`}
              onClick={() => !saida && setSelecionado(n.id === selecionado ? null : n.id)}
            >
              {saida ? <rect x={-14} y={-6} width={28} height={12} rx={6} /> : <circle r={11} />}
              {cls === 'oculto' && (
                <path d="M -3.5 -1 v -2 a 3.5 3.5 0 0 1 7 0 v 2 M -5 -1 h 10 v 6 h -10 z" className="cadeado" />
              )}
            </g>
          );
        })}
      </svg>
      <figcaption>
        {sel ? (
          noVisto(sel.id) ? (
            <span>{sel.lugar ?? 'Sem título'}</span>
          ) : (
            <span>Momento ainda não descoberto</span>
          )
        ) : (
          <span>
            {nosVistos} de {totalNos} momentos descobertos · toque num nó
          </span>
        )}
      </figcaption>
    </figure>
  );
}
