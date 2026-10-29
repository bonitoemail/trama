import Jogo from '@/components/Jogo';
import { contarCaminhos, contarPartidas } from '@/engine/historia';
import { carregarJogo } from '@/engine/load';
import { validar } from '@/engine/validate';

export const dynamic = 'force-static';

export default function Page() {
  const jogo = carregarJogo();
  const { erros } = validar(jogo);

  // Conteúdo quebrado nunca chega ao jogador: em dev aparece a lista, no build falha.
  if (erros.length) {
    if (process.env.NODE_ENV === 'production') throw new Error(`Conteúdo inválido:\n${erros.join('\n')}`);
    return (
      <main className="erros">
        <h1>Conteúdo com erro</h1>
        <ul>{erros.map((e) => <li key={e}>{e}</li>)}</ul>
      </main>
    );
  }

  return <Jogo jogo={jogo} caminhos={contarCaminhos(jogo)} partidas={contarPartidas(jogo)} />;
}
