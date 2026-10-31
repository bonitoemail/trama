'use client';

import Compartilhar from '../Compartilhar';
import LinhaDoTempo from '../LinhaDoTempo';
import { Acao } from './Pecas';
import { type Estado, capitulo, no } from '@/engine/engine';
import { linhaDoTempo } from '@/engine/historia';
import type { Jogo } from '@/engine/schema';

/** O fim de um capítulo: a linha do tempo da partida, o cartão para compartilhar e o botão de seguir. */
export default function FimDeCapitulo({
  jogo,
  estado,
  caminhos,
  sair,
  onEscolhas,
  onCompartilhado,
  onSeguir,
}: {
  jogo: Jogo;
  estado: Estado;
  caminhos: Record<string, number>;
  sair: React.ReactNode;
  /** Link para a tela do que os jogadores escolheram. */
  onEscolhas?: () => void;
  onCompartilhado: () => void;
  onSeguir: () => void;
}) {
  const cap = capitulo(jogo, estado.capitulo);
  const final = no(jogo, cap.id, estado.no);
  // Na ordem do capítulo, que é a que /api/raridade aceita (um caminho, uma URL, um cache).
  const caminho = estado.historico
    .filter((p) => p.capitulo === cap.id && p.escolha)
    .map((p) => ({ no: p.no, escolha: p.escolha! }))
    .sort((x, y) => cap.nos.findIndex((n) => n.id === x.no) - cap.nos.findIndex((n) => n.id === y.no));

  return (
    <main className="tela fim-cap">
      <p className="rotulo">
        Fim do capítulo {cap.numero} · {cap.titulo}
      </p>
      <h2>A linha do tempo que você escolheu</h2>
      <LinhaDoTempo
        momentos={linhaDoTempo(jogo, estado.historico).filter((m) => m.capitulo === cap.id)}
        caminhosPossiveis={caminhos[cap.id] ?? 0}
        escolhas={jogo.escolhas && onEscolhas ? { titulo: jogo.escolhas.titulo, onClick: onEscolhas } : undefined}
      />
      {/* Fixo no rodapé: no celular, a linha do tempo empurrava o botão para 2 telas abaixo, e 36% paravam aqui. */}
      <div className="seguir">
        {/* O cartão de stories do capítulo (estilo/sketches-compartilhar): cada jogador pode trazer o próximo. */}
        <Compartilhar
          capitulo={cap.id}
          rotuloCapitulo={`Capítulo ${cap.numero}, ${cap.titulo}`}
          final={final.titulo ?? cap.titulo}
          imagem={final.imagem ?? null}
          caminho={caminho}
          onCompartilhado={onCompartilhado}
        />
        <Acao primario onClick={onSeguir}>
          {estado.proximo === 'FIM' ? 'Ver o desfecho' : 'Próximo capítulo'}
        </Acao>
      </div>
      {sair}
    </main>
  );
}
