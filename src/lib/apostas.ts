import type { Jogo } from '@/engine/schema';

/**
 * As apostas do jogador: a escolha feita em cada decisão ainda aberta, com o dia (Brasília).
 * Ficam no navegador, fora da partida, para sobreviver a "Começar outra partida". Quando a
 * realidade decide uma delas, a capa conta se aconteceu (sketch em estilo/sketches-3-11).
 */
export interface Aposta {
  escolha: string;
  dia: string;
}

/** Quantos dias depois da notícia a capa ainda lembra a aposta. */
export const LEMBRAR_DIAS = 7;

export interface ApostaDecidida {
  /** "cap01/eleicao_eua", a chave de porDecisao. */
  chave: string;
  minha: string;
  aconteceu: string;
  acertou: boolean;
  data: string;
}

/**
 * A aposta mais recente que a realidade decidiu: feita antes do dia da notícia, com a notícia até
 * LEMBRAR_DIAS atrás. Quem escolheu depois da notícia já sabia, e não apostou.
 */
export function apostaDecidida(jogo: Jogo, apostas: Record<string, Aposta>, hoje: string): ApostaDecidida | null {
  let melhor: ApostaDecidida | null = null;
  for (const cap of jogo.capitulos) {
    for (const no of cap.nos) {
      const real = no.escolhas?.find((e) => e.real);
      const chave = `${cap.id}/${no.id}`;
      const aposta = apostas[chave];
      if (!real?.real || !aposta || aposta.dia >= real.real.data) continue;
      const dias = (Date.parse(hoje) - Date.parse(real.real.data)) / 86_400_000;
      if (dias < 0 || dias > LEMBRAR_DIAS) continue;
      const minha = no.escolhas!.find((e) => e.id === aposta.escolha);
      if (!minha) continue;
      if (melhor && melhor.data >= real.real.data) continue;
      melhor = { chave, minha: minha.rotulo, aconteceu: real.rotulo, acertou: minha.rotulo === real.rotulo, data: real.real.data };
    }
  }
  return melhor;
}
