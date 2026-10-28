'use client';

import { useEffect, useRef, useState } from 'react';
import type { StatusEscolha } from '@/engine/engine';

/** Tempo segurando para a escolha valer. A barra (CSS) anima no mesmo tempo. */
export const SEGURAR_MS = 800;

interface Props {
  letra: string;
  rotulo: string;
  status: StatusEscolha;
  dataReal?: string;
  /** Outra opção já foi decidida: este botão some. */
  apagado: boolean;
  /** Este botão é o decidido (fica marcado até a cena mudar). */
  decidido: boolean;
  onDecidir: () => void;
}

/**
 * Escolha irreversível: só vale depois de segurar. Soltar antes cancela.
 * Teclado: segurar Enter ou espaço. Um temporizador decide; o CSS só desenha a barra,
 * então a decisão não depende da taxa de quadros do navegador.
 */
export default function BotaoEscolha({ letra, rotulo, status, dataReal, apagado, decidido, onDecidir }: Props) {
  const [segurando, setSegurando] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const travada = status === 'travada';

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function comecar() {
    if (travada || decidido || apagado || timer.current) return;
    setSegurando(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setSegurando(false);
      onDecidir();
    }, SEGURAR_MS);
  }

  function soltar() {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = null;
    setSegurando(false);
  }

  const dica = travada
    ? 'não aconteceu'
    : decidido
      ? 'decidido'
      : segurando
        ? 'segure…'
        : status === 'real'
          ? `aconteceu em ${dataReal} · segure para seguir`
          : 'segure para decidir';

  return (
    <button
      type="button"
      className={`escolha ${status} ${decidido ? 'decidida' : ''} ${apagado ? 'apagada' : ''} ${segurando ? 'segurando' : ''}`}
      disabled={travada}
      aria-label={`${rotulo}. ${travada ? 'Não aconteceu.' : 'Segure para decidir.'}`}
      style={{ ['--segurar' as string]: `${SEGURAR_MS}ms` }}
      onPointerDown={(e) => {
        e.preventDefault();
        comecar();
      }}
      onPointerUp={soltar}
      onPointerLeave={soltar}
      onPointerCancel={soltar}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
          e.preventDefault();
          comecar();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') soltar();
      }}
    >
      <span className="barra" />
      <span className="letra">{letra}</span>
      <span className="corpo">
        <span className="rotulo-escolha">{rotulo}</span>
        <span className="dica">{dica}</span>
      </span>
    </button>
  );
}
