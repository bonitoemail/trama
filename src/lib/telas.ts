/** As telas fora do jogo e a partida, cada uma com endereço próprio. */
export type Tela = 'capa' | 'objetivo' | 'metodo' | 'partida';

export const CAMINHOS: Record<Tela, string> = {
  capa: '/',
  objetivo: '/o-que-e',
  metodo: '/como-fazemos',
  partida: '/partida',
};

/** Endereços antigos que ainda chegam por links compartilhados (o servidor também redireciona). */
const ANTIGOS: Record<string, Tela> = { '/para-que-serve': 'objetivo' };

export function telaDoCaminho(caminho: string): Tela {
  const limpo = caminho.replace(/\/+$/, '') || '/';
  return (Object.keys(CAMINHOS) as Tela[]).find((t) => CAMINHOS[t] === limpo) ?? ANTIGOS[limpo] ?? 'capa';
}
