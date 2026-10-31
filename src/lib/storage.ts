import type { Estado } from '@/engine/engine';
import type { Aposta } from './apostas';

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

const CHAVE_APOSTAS = 'trama:apostas';

/** Apostas por "cap/no" (lib/apostas.ts). */
export function lerApostas(): Record<string, Aposta> {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_APOSTAS) ?? '{}') as Record<string, Aposta>;
  } catch {
    return {};
  }
}

/** Guarda a escolha feita numa decisão ainda aberta, com o dia de Brasília. A mais nova vale. */
export function salvarAposta(chave: string, escolha: string) {
  try {
    const dia = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
    localStorage.setItem(CHAVE_APOSTAS, JSON.stringify({ ...lerApostas(), [chave]: { escolha, dia } }));
  } catch {}
}
