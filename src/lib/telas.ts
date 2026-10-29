/** As telas fora do jogo e a partida, cada uma com endereço próprio. */
export type Tela = 'capa' | 'objetivo' | 'metodo' | 'partida';

export const CAMINHOS: Record<Tela, string> = {
  capa: '/',
  objetivo: '/para-que-serve',
  metodo: '/como-fazemos',
  partida: '/partida',
};

export function telaDoCaminho(caminho: string): Tela {
  const limpo = caminho.replace(/\/+$/, '') || '/';
  return (Object.keys(CAMINHOS) as Tela[]).find((t) => CAMINHOS[t] === limpo) ?? 'capa';
}
