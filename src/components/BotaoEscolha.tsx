'use client';

import { useEffect, useRef, useState } from 'react';
import { isoPorExtenso } from '@/engine/calendario';
import type { StatusEscolha } from '@/engine/engine';

/** Tempo segurando para a escolha valer. A barra (CSS) anima no mesmo tempo. */
export const SEGURAR_MS = 500;
/** Quanto tempo o lembrete fica depois de um toque curto. */
const LEMBRETE_MS = 2200;
/** A demonstração começa um instante depois de as opções aparecerem, para a pessoa ver o botão parado antes. */
const DEMO_ATRASO_MS = 700;
const DEMO_MS = 1800;
/** Capítulo em que a barra já se mostrou nesta visita (recarregar a página conta como visita nova). */
let demonstradoEm: string | null = null;

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
  /**
   * Capítulo atual, no primeiro botão livre da cena: na primeira decisão de cada capítulo da visita,
   * a barra enche sozinha uma vez e mostra o gesto. A maioria tocava rápido na primeira decisão, e
   * de novo depois da pausa entre capítulos (rodada de 30/10, 18h).
   */
  demonstrarEm?: string;
  /** O que segurar faz: decidir no jogo (padrão) ou cravar um palpite (Cravar.tsx). */
  verbo?: 'decidir' | 'cravar';
}

/**
 * Escolha irreversível: só vale depois de segurar. Soltar antes cancela.
 * Teclado: segurar Enter ou espaço. Um temporizador decide; o CSS só desenha a barra,
 * então a decisão não depende da taxa de quadros do navegador.
 */
export default function BotaoEscolha({ letra, rotulo, status, dataReal, apagado, decidido, onDecidir, onToqueCurto, demonstrarEm, verbo = 'decidir' }: Props) {
  const [segurando, setSegurando] = useState(false);
  const [lembrete, setLembrete] = useState(false);
  const [demonstrando, setDemonstrando] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerLembrete = useRef<ReturnType<typeof setTimeout> | null>(null);
  const travada = status === 'travada';

  useEffect(() => {
    if (!demonstrarEm || demonstradoEm === demonstrarEm) return;
    // A marca só é posta quando a demonstração começa: o efeito duplo do modo de desenvolvimento não a perde.
    let fim: ReturnType<typeof setTimeout> | undefined;
    const inicio = setTimeout(() => {
      demonstradoEm = demonstrarEm;
      setDemonstrando(true);
      fim = setTimeout(() => setDemonstrando(false), DEMO_MS);
    }, DEMO_ATRASO_MS);
    return () => {
      clearTimeout(inicio);
      if (fim) clearTimeout(fim);
    };
  }, [demonstrarEm]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    if (timerLembrete.current) clearTimeout(timerLembrete.current);
  }, []);

  function comecar() {
    if (travada || decidido || apagado || timer.current) return;
    setLembrete(false);
    setDemonstrando(false);
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
      ? verbo === 'cravar' ? 'cravado' : 'decidido'
      : segurando
        ? 'segure…'
        : lembrete
          ? 'segure até a barra encher'
        : demonstrando
          ? `segure assim para ${verbo}`
        : status === 'real'
          ? `aconteceu em ${dataReal ? isoPorExtenso(dataReal) : ''} · segure para seguir`
          : `segure para ${verbo}`;

  return (
    <button
      type="button"
      className={`escolha ${status} ${decidido ? 'decidida' : ''} ${apagado ? 'apagada' : ''} ${segurando ? 'segurando' : ''} ${lembrete ? 'lembrete' : ''} ${demonstrando ? 'demonstra' : ''}`}
      disabled={travada}
      // O leitor de tela ouve o mesmo que a dica mostra (aconteceu em…, segure até a barra encher, decidido).
      aria-label={`${rotulo}. ${dica}.`}
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
