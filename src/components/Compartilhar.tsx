'use client';

import { useEffect, useState } from 'react';
import { desenharCartao, type DadosDoCartao, type Raridade } from '@/lib/cartao';

interface Props {
  capitulo: string;
  /** "Capítulo 1, A carta". */
  rotuloCapitulo: string;
  final: string;
  imagem: string | null;
  /** As escolhas do capítulo, para o número de raridade. */
  caminho: { no: string; escolha: string }[];
  /** Saiu o cartão (menu de compartilhar ou download): o jogo registra. */
  onCompartilhado?: () => void;
}

/** O link do cartão leva a origem, para contar quantos chegam por ele. */
const LINK = 'https://tramabr.app/?origem=cartao';

/**
 * "Compartilhar meu Brasil", no fim do capítulo. O cartão é preparado assim que a tela abre:
 * o menu de compartilhar do celular só abre dentro do toque, sem esperar rede nem desenho.
 * Sem esse menu (computador), baixa a imagem.
 */
export default function Compartilhar({ capitulo, rotuloCapitulo, final, imagem, caminho, onCompartilhado }: Props) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const chave = caminho.map((p) => `${p.no}.${p.escolha}`).join(',');

  useEffect(() => {
    let vivo = true;
    (async () => {
      let raridade: Raridade | null = null;
      if (chave) {
        const r = await fetch(`/api/raridade?cap=${encodeURIComponent(capitulo)}&c=${encodeURIComponent(chave)}`).catch(() => null);
        if (r?.status === 200) raridade = await r.json().catch(() => null);
      }
      const dados: DadosDoCartao = { capitulo: rotuloCapitulo, final, imagem, raridade };
      const blob = await desenharCartao(dados);
      if (vivo && blob) setArquivo(new File([blob], `trama-meu-brasil-${capitulo}.png`, { type: 'image/png' }));
    })();
    return () => {
      vivo = false;
    };
  }, [capitulo, rotuloCapitulo, final, imagem, chave]);

  function compartilhar() {
    if (!arquivo) return;
    const pedido = { files: [arquivo], text: `Meu Brasil no Trama. E o seu? ${LINK}` };
    if (navigator.canShare?.(pedido)) {
      navigator.share(pedido).then(
        () => onCompartilhado?.(),
        () => {}, // Fechou o menu sem escolher: nada a fazer.
      );
      return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(arquivo);
    a.download = arquivo.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
    onCompartilhado?.();
  }

  return (
    <button type="button" className="botao compartilhar" onClick={compartilhar} disabled={!arquivo}>
      <span>{arquivo ? 'Compartilhar meu Brasil' : 'Preparando o cartão…'}</span>
      <span className="seta" aria-hidden>
        ↗
      </span>
    </button>
  );
}
