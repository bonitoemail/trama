'use client';

import { useSyncExternalStore } from 'react';

/**
 * Valores que só existem no navegador (o dia de hoje em Brasília, o que está no localStorage), lidos
 * sem quebrar a hidratação: no servidor e no primeiro desenho valem null, e depois o valor real.
 * Só para valores simples (texto): o React compara por igualdade a cada desenho.
 */

const nada = () => () => {};

/** O dia de hoje em Brasília (AAAA-MM-DD), ou null no servidor. */
export function useHoje(): string | null {
  return useSyncExternalStore(
    nada,
    () => new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' }),
    () => null,
  );
}

/** O texto guardado numa chave do localStorage, ou null (no servidor, sem a chave, ou com o armazenamento bloqueado). */
export function useGuardado(chave: string): string | null {
  return useSyncExternalStore(
    nada,
    () => {
      try {
        return localStorage.getItem(chave);
      } catch {
        return null;
      }
    },
    () => null,
  );
}
