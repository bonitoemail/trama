'use client';

import { useEffect } from 'react';

/** Peças comuns às telas da partida (cena, fim de capítulo, epílogo). */

/** Botão de ação (não é escolha): texto à esquerda, seta à direita. */
export function Acao({
  children,
  onClick,
  primario = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primario?: boolean;
}) {
  return (
    <button type="button" className={`botao ${primario ? 'primario' : ''}`} onClick={onClick}>
      <span>{children}</span>
      <span className="seta" aria-hidden>
        →
      </span>
    </button>
  );
}

/**
 * Sair a qualquer momento, embaixo de tudo: um X delicado. No PC, o balão diz que a partida fica
 * salva; no celular, a capa confirma ao chegar (o toque já sai, não dá para mostrar balão antes).
 */
export function Sair({ onClick }: { onClick: () => void }) {
  return (
    <div className="sair">
      <button type="button" className="sair-x" aria-label="Sair. Sua partida fica salva neste aparelho." onClick={onClick}>
        <svg viewBox="0 0 12 12" aria-hidden>
          <path d="M1 1l10 10M11 1L1 11" />
        </svg>
      </button>
      <span className="sair-balao" aria-hidden>
        Sair. Sua partida fica salva.
      </span>
    </div>
  );
}

export function Cabecalho({ numero, titulo, periodo }: { numero: number; titulo: string; periodo: string }) {
  return (
    <header className="cabecalho">
      <span>
        Capítulo {numero} · {titulo}
      </span>
      <span>{periodo}</span>
    </header>
  );
}

/** Roda `acao` uma vez, quando aparece: as opções só montam no último cartão da cena. */
export function AoAparecer({ acao }: { acao: () => void }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(acao, []);
  return null;
}

/** "Capítulo 1, A carta". */
export function nomeDoCapitulo(c: { numero: number; titulo: string }): string {
  return `Capítulo ${c.numero}, ${c.titulo}`;
}
