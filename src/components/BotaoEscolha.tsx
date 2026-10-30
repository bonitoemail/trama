'use client';

import { useEffect, useRef, useState } from 'react';
import type { StatusEscolha } from '@/engine/engine';

/** Tempo segurando para a escolha valer. A barra (CSS) anima no mesmo tempo. */
export const SEGURAR_MS = 800;
/** Quanto tempo o lembrete fica depois de um toque curto. */
const LEMBRETE_MS = 2200;

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
  /** Soltou antes da hora (toque rápido): o botão lembra de segurar, e o jogo registra. */
  onToqueCurto?: () => void;
}

/**
 * Escolha irreversível: só vale depois de segurar. Soltar antes cancela.
 * Teclado: segurar Enter ou espaço. Um temporizador decide; o CSS só desenha a barra,
 * então a decisão não depende da taxa de quadros do navegador.
 */
export default function BotaoEscolha({ letra, rotulo, status, dataReal, apagado, decidido, onDecidir, onToqueCurto }: Props) {
  const [segurando, setSegurando] = useState(false);
  const [lembrete, setLembrete] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerLembrete = useRef<ReturnType<typeof setTimeout> | null>(null);
  const travada = status === 'travada';

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    if (timerLembrete.current) clearTimeout(timerLembrete.current);
  }, []);

  function comecar() {
    if (travada || decidido || apagado || timer.current) return;
    setLembrete(false);
    setSegurando(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setSegurando(false);
      onDecidir();
    }, SEGURAR_MS);
  }

  /** `curto`: o dedo saiu do botão porque soltou, não porque rolou a tela ou foi cancelado. */
  function soltar(curto = false) {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = null;
    setSegurando(false);
    // Um toque rápido era cancelado em silêncio, e quem não sabia que precisava segurar achava que tinha travado.
    if (!curto) return;
    setLembrete(true);
    if (timerLembrete.current) clearTimeout(timerLembrete.current);
    timerLembrete.current = setTimeout(() => setLembrete(false), LEMBRETE_MS);
    onToqueCurto?.();
  }

  const dica = travada
    ? 'não aconteceu'
    : decidido
      ? 'decidido'
      : segurando
        ? 'segure…'
        : lembrete
          ? 'segure até a barra encher'
        : status === 'real'
          ? `aconteceu em ${dataReal} · segure para seguir`
          : 'segure para decidir';

  return (
    <button
      type="button"
      className={`escolha ${status} ${decidido ? 'decidida' : ''} ${apagado ? 'apagada' : ''} ${segurando ? 'segurando' : ''} ${lembrete ? 'lembrete' : ''}`}
      disabled={travada}
      aria-label={`${rotulo}. ${travada ? 'Não aconteceu.' : 'Segure para decidir.'}`}
      style={{ ['--segurar' as string]: `${SEGURAR_MS}ms` }}
      onPointerDown={(e) => {
        e.preventDefault();
        comecar();
      }}
      onPointerUp={() => soltar(true)}
      onPointerLeave={() => soltar()}
      onPointerCancel={() => soltar()}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
          e.preventDefault();
          comecar();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') soltar(true);
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
