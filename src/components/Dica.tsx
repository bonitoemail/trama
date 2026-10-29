'use client';

import { useEffect, useId, useRef, useState } from 'react';

/**
 * "?" com balão. Toque abre e fecha; tocar fora fecha. No PC abre com o mouse em cima ou com
 * o foco do teclado. Esc sempre fecha.
 */
export default function Dica({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  const [aberta, setAberta] = useState(false);
  const caixa = useRef<HTMLSpanElement>(null);
  const ponteiro = useRef<string | null>(null);
  const id = useId();

  useEffect(() => {
    const fora = (e: PointerEvent) => {
      if (!caixa.current?.contains(e.target as Node)) setAberta(false);
    };
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setAberta(false);
    document.addEventListener('pointerdown', fora);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('pointerdown', fora);
      document.removeEventListener('keydown', tecla);
    };
  }, []);

  return (
    <span
      ref={caixa}
      className={`ajuda ${aberta ? 'aberta' : ''}`}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setAberta(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setAberta(false)}
    >
      <button
        type="button"
        className="ajuda-botao"
        aria-label={rotulo}
        aria-describedby={id}
        aria-expanded={aberta}
        onPointerDown={(e) => (ponteiro.current = e.pointerType)}
        onFocus={() => ponteiro.current === null && setAberta(true)}
        onBlur={() => setAberta(false)}
        onClick={() => {
          // Com mouse o hover já abriu: clicar não fecha. Toque e teclado alternam.
          if (ponteiro.current === 'mouse') setAberta(true);
          else setAberta((a) => !a);
          ponteiro.current = null;
        }}
      >
        ?
      </button>
      <span className="balao" role="tooltip" id={id}>
        {children}
      </span>
    </span>
  );
}
