import type { Jogo } from '@/engine/schema';

/** As telas fora do jogo e a partida, cada uma com endereço próprio. */
export type Tela = 'capa' | 'objetivo' | 'metodo' | 'acertos' | 'escolhas' | 'partida';

export const CAMINHOS: Record<Tela, string> = {
  capa: '/',
  objetivo: '/o-que-e',
  metodo: '/como-fazemos',
  acertos: '/acertos',
  // Sem link na capa: chega-se por /acertos ou pelo endereço.
  escolhas: '/escolhas',
  partida: '/partida',
};

/** Endereços antigos que ainda chegam por links compartilhados (o servidor também redireciona). */
const ANTIGOS: Record<string, Tela> = { '/para-que-serve': 'objetivo' };

/** Título da página interna, para a aba ("Como fazemos as previsões · Trama"); capa e partida não têm. */
export function tituloDaTela(jogo: Jogo, tela: Tela): string | undefined {
  if (tela === 'objetivo') return jogo.objetivo?.titulo;
  if (tela === 'metodo') return jogo.metodo?.titulo;
  if (tela === 'acertos') return jogo.acertos?.titulo;
  if (tela === 'escolhas') return jogo.escolhas?.titulo;
}

export function telaDoCaminho(caminho: string): Tela {
  const limpo = caminho.replace(/\/+$/, '') || '/';
  return (Object.keys(CAMINHOS) as Tela[]).find((t) => CAMINHOS[t] === limpo) ?? ANTIGOS[limpo] ?? 'capa';
}
