'use client';

import LinhaDoTempo from '../LinhaDoTempo';
import { Acao } from './Pecas';
import { type Estado, capitulo, paragrafos } from '@/engine/engine';
import { linhaDoTempo } from '@/engine/historia';
import type { Jogo } from '@/engine/schema';

/** O fim da história: o epílogo com os ecos das marcas e a linha do tempo de cada capítulo jogado. */
export default function Epilogo({
  jogo,
  estado,
  caminhos,
  onJogarDeNovo,
  onVoltar,
}: {
  jogo: Jogo;
  estado: Estado;
  caminhos: Record<string, number>;
  onJogarDeNovo: () => void;
  onVoltar: () => void;
}) {
  const capsJogados = [...new Set(estado.historico.map((p) => p.capitulo))].map((id) => capitulo(jogo, id));
  return (
    <main className="tela fim">
      <p className="rotulo">Epílogo</p>
      <h2>{jogo.epilogo.titulo}</h2>
      {paragrafos(jogo.epilogo.texto, estado.marcas).map((p, i) => (
        <p key={i} className="texto">{p}</p>
      ))}
      <h3 className="titulo-linha">A linha do tempo que você escolheu</h3>
      {capsJogados.map((c) => (
        <section key={c.id} className="resumo-cap">
          <p className="rotulo">
            Capítulo {c.numero} · {c.titulo}
          </p>
          <LinhaDoTempo
            momentos={linhaDoTempo(jogo, estado.historico).filter((m) => m.capitulo === c.id)}
            caminhosPossiveis={caminhos[c.id] ?? 0}
          />
        </section>
      ))}
      <div className="acoes">
        <Acao primario onClick={onJogarDeNovo}>
          Jogar de novo
        </Acao>
        <Acao onClick={onVoltar}>Voltar ao início</Acao>
      </div>
    </main>
  );
}
