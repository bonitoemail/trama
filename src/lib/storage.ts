import type { Estado } from '@/engine/engine';

/**
 * Partida em andamento e nós já vistos (em qualquer partida) ficam no navegador.
 * Tudo em try/catch: modo privado ou armazenamento bloqueado não pode quebrar o jogo.
 */

const chavePartida = (versao: string) => `trama:partida:${versao}`;
const CHAVE_VISTOS = 'trama:vistos';

export function lerPartida(versao: string): Estado | null {
  try {
    const raw = localStorage.getItem(chavePartida(versao));
    return raw ? (JSON.parse(raw) as Estado) : null;
  } catch {
    return null;
  }
}

export function salvarPartida(estado: Estado) {
  try {
    localStorage.setItem(chavePartida(estado.versao), JSON.stringify(estado));
  } catch {}
}

export function apagarPartida(versao: string) {
  try {
    localStorage.removeItem(chavePartida(versao));
  } catch {}
}

/** Ids no formato "cap/no" e "cap/no:escolha". */
export function lerVistos(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(CHAVE_VISTOS) ?? '[]') as string[]);
  } catch {
    return new Set();
  }
}

export function salvarVistos(vistos: Set<string>) {
  try {
    localStorage.setItem(CHAVE_VISTOS, JSON.stringify([...vistos]));
  } catch {}
}
