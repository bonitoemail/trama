import type { Jogo, Texto } from './schema';

/**
 * O formato dos cartões (roteiro/prompts/escrita.md e DESIGN 8.2), conferido pelo validador.
 * Só avisa: o texto é escrito por gente e por agentes, e a régua serve para pegar o que escapou.
 */

export const PALAVRAS_POR_CARTAO = 35; // a regra diz "cerca de 30"; a folga evita alarme por uma palavra
export const CARTOES_POR_CENA = 4;
export const PALAVRAS_POR_ROTULO = 10;

/** Termos que não entram em cartão nem em rótulo; o técnico vai para "Fatos e fontes". */
const TERMOS = ['CCJ', 'rito', 'monocrática', 'monocrático', 'difusão vermelha', 'decurso', 'quórum', 'preventiva', 'de ofício', 'PLOA'];

// `\b` não vê "é" como letra ("inquérito" daria "rito"): a borda da palavra é qualquer coisa que não seja letra.
const JARGAO: Array<[RegExp, string]> = TERMOS.map((t) => [new RegExp(`(?<!\\p{L})${t}(?!\\p{L})`, 'iu'), t]);

const palavras = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

function jargao(s: string): string[] {
  return JARGAO.filter(([re]) => re.test(s)).map(([, nome]) => nome);
}

/** Cada parágrafo possível do texto (os dois lados de um condicional contam). */
function versoes(t: Texto): string[] {
  const partes = typeof t === 'string' ? [t] : t;
  return partes.flatMap((p) => (typeof p === 'string' ? [p] : [p.texto, p.senao].filter((x): x is string => Boolean(x))));
}

/**
 * Quantos cartões uma cena pode mostrar. Os fixos contam todos; dos condicionais, conta-se um só,
 * porque a regra pede que, havendo vários, eles sejam exclusivos entre si.
 */
function cartoesPossiveis(t: Texto): number {
  if (typeof t === 'string') return 1;
  const fixos = t.filter((p) => typeof p === 'string').length;
  return fixos + (t.length > fixos ? 1 : 0);
}

export function avisosDeFormato(jogo: Jogo): string[] {
  const avisos: string[] = [];
  for (const cap of jogo.capitulos) {
    for (const n of cap.nos) {
      const onde = `${cap.id}/${n.id}`;
      const cartoes = cartoesPossiveis(n.texto);
      if (cartoes > CARTOES_POR_CENA) avisos.push(`${onde}: ${cartoes} cartões (máximo ${CARTOES_POR_CENA})`);
      for (const c of versoes(n.texto)) {
        const w = palavras(c);
        if (w > PALAVRAS_POR_CARTAO) avisos.push(`${onde}: cartão com ${w} palavras: "${c.slice(0, 50)}…"`);
        for (const j of jargao(c)) avisos.push(`${onde}: jargão no cartão ("${j}")`);
      }
      // Decisões e finais aparecem na tela /escolhas pelo nome curto.
      if ((n.escolhas?.length || !n.segue) && !n.titulo) avisos.push(`${onde}: sem titulo (nome curto da decisão ou do final)`);
      for (const e of n.escolhas ?? []) {
        const w = palavras(e.rotulo);
        if (w > PALAVRAS_POR_ROTULO) avisos.push(`${onde}: rótulo "${e.id}" com ${w} palavras: "${e.rotulo}"`);
        for (const j of jargao(e.rotulo)) avisos.push(`${onde}: jargão no rótulo "${e.id}" ("${j}")`);
      }
    }
  }
  return avisos;
}
