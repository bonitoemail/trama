'use client';

import { useEffect, useState } from 'react';
import { compartilharArquivo, desenharPlacar } from '@/lib/cartao';
import type { Decisao } from '@/lib/escolhas';

/** O link do placar leva a origem, para contar quantos chegam por ele. */
const LINK = 'https://tramabr.app/?origem=placar';

/**
 * "Compartilhar o placar", em cada aposta que a realidade decidiu (/escolhas). O post de stories é
 * preparado quando o bloco aparece, porque o menu de compartilhar só abre dentro do toque.
 */
export default function CompartilharPlacar({ d }: { d: Decisao }) {
  const [arquivo, setArquivo] = useState<File | null>(null);

  useEffect(() => {
    let vivo = true;
    desenharPlacar({ titulo: d.titulo, total: d.total, opcoes: d.opcoes }).then((blob) => {
      if (vivo && blob) setArquivo(new File([blob], `trama-placar-${d.no}.png`, { type: 'image/png' }));
    });
    return () => {
      vivo = false;
    };
  }, [d]);

  return (
    <button
      type="button"
      className="compartilhar-placar"
      disabled={!arquivo}
      onClick={() => arquivo && compartilharArquivo(arquivo, `Antes da notícia, os jogadores do Trama apostaram. ${LINK}`)}
    >
      {arquivo ? 'Compartilhar o placar' : 'Preparando o placar…'}
    </button>
  );
}
