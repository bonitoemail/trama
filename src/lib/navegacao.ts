'use client';

import { useCallback, useEffect, useState } from 'react';
import { CAMINHOS, telaDoCaminho, type Tela } from './telas';

/** O que guardamos em cada entrada do histórico, ao lado do que o Next já guarda. */
interface Marca {
  /** Esta entrada foi aberta a partir da capa: voltar é desfazer no histórico. */
  daCapa?: boolean;
  /** Altura da rolagem quando a pessoa saiu desta entrada. */
  rolagem?: number;
}

function marca(): Marca {
  return (window.history.state?.trama as Marca | undefined) ?? {};
}

function gravar(m: Marca, url?: string, empurrar = false) {
  const estado = { ...window.history.state, trama: m };
  if (empurrar) window.history.pushState(estado, '', url);
  else window.history.replaceState(estado, '', url);
}

/**
 * Navegação entre capa, páginas internas e partida, sem recarregar. O gesto de voltar do celular,
 * o botão do navegador, o "Voltar" da tela e o Esc fazem a mesma coisa; a capa reabre na altura em
 * que a pessoa estava; quem chega por link direto e volta vai para a capa, nunca para fora do site.
 */
export function useNavegacao(inicial: Tela) {
  const [tela, setTela] = useState<Tela>(inicial);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    const aoVoltar = () => {
      setTela(telaDoCaminho(window.location.pathname));
      const y = marca().rolagem ?? 0;
      requestAnimationFrame(() => window.scrollTo({ top: y }));
    };
    window.addEventListener('popstate', aoVoltar);
    return () => window.removeEventListener('popstate', aoVoltar);
  }, []);

  /** Abre uma tela. `trocar`: substitui a atual (de uma página interna para a outra). */
  const ir = useCallback((nova: Tela, { trocar = false } = {}) => {
    gravar({ ...marca(), rolagem: window.scrollY });
    if (trocar) gravar({ daCapa: marca().daCapa }, CAMINHOS[nova]);
    else gravar({ daCapa: true }, CAMINHOS[nova], true);
    setTela(nova);
    window.scrollTo({ top: 0 });
  }, []);

  const voltar = useCallback(() => {
    if (marca().daCapa) {
      window.history.back();
      return;
    }
    gravar({}, CAMINHOS.capa);
    setTela('capa');
    window.scrollTo({ top: 0 });
  }, []);

  /** Corrige o endereço sem mexer no histórico (ex.: /partida sem partida salva vira /). */
  const corrigir = useCallback((nova: Tela) => {
    gravar(marca(), CAMINHOS[nova]);
    setTela(nova);
  }, []);

  return { tela, ir, voltar, corrigir };
}
