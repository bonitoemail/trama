'use client';

import { useEffect, useState } from 'react';
import type { Painel } from './escolhas';

/** null enquanto carrega; 'vazio' sem números (dev sem Supabase, ou a API falhou). */
export type Carga = Painel | 'vazio' | null;

// Uma busca por visita: a capa, o fim de capítulo e /escolhas leem a mesma resposta.
let pedido: Promise<Painel | null> | null = null;

function lerPainel(): Promise<Painel | null> {
  pedido ??= fetch('/api/escolhas')
    .then((r) => (r.status === 200 ? (r.json() as Promise<Painel>) : null))
    .catch(() => null)
    .then((p) => {
      // Falhou: a próxima tela tenta de novo, em vez de mostrar "indisponível" até recarregar.
      if (!p) pedido = null;
      return p;
    });
  return pedido;
}

/** Os números de /api/escolhas (refeitos a cada hora no servidor). */
export function usePainel(ligado = true): Carga {
  const [carga, setCarga] = useState<Carga>(null);
  useEffect(() => {
    if (!ligado) return;
    let vivo = true;
    lerPainel().then((p) => vivo && setCarga(p ?? 'vazio'));
    return () => {
      vivo = false;
    };
  }, [ligado]);
  return carga;
}
