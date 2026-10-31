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

export const CHAVE_APOSTAS = 'trama:apostas';

/** As apostas guardadas, a partir do texto da chave (vazio ou estragado vira nenhuma). */
export function apostasDe(texto: string | null): Record<string, Aposta> {
  try {
    return JSON.parse(texto ?? '{}') as Record<string, Aposta>;
  } catch {
    return {};
  }
}

/** Apostas por "cap/no" (lib/apostas.ts). */
export function lerApostas(): Record<string, Aposta> {
  try {
    return apostasDe(localStorage.getItem(CHAVE_APOSTAS));
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

const CHAVE_APARELHO = 'trama:aparelho';
export const CHAVE_PALPITES = 'trama:palpites';

/** Palpite cravado neste aparelho, por "cap/no": o código do recibo e a escolha. */
export interface PalpiteGuardado {
  codigo: string;
  escolha: string;
}

/**
 * Id anônimo do aparelho, para "um palpite por aparelho". Diferente do id da partida, que muda a cada
 * "Começar": este fica enquanto o navegador guardar.
 */
export function idDoAparelho(): string {
  try {
    let id = localStorage.getItem(CHAVE_APARELHO);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(CHAVE_APARELHO, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

/** Os palpites guardados, a partir do texto da chave (vazio ou estragado vira nenhum). */
export function palpitesDe(texto: string | null): Record<string, PalpiteGuardado> {
  try {
    return JSON.parse(texto ?? '{}') as Record<string, PalpiteGuardado>;
  } catch {
    return {};
  }
}

export function salvarPalpite(chave: string, p: PalpiteGuardado) {
  try {
    localStorage.setItem(CHAVE_PALPITES, JSON.stringify({ ...palpitesDe(localStorage.getItem(CHAVE_PALPITES)), [chave]: p }));
  } catch {}
}
