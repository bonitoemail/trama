'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import BotaoEscolha from './BotaoEscolha';
import { isoPorExtenso } from '@/engine/calendario';
import type { AConfirmar } from '@/engine/relogios';
import { origemGuardada } from '@/lib/registro';
import { idDoAparelho, salvarPalpite } from '@/lib/storage';

/**
 * A folha do palpite (sketch em estilo/sketches-palpites): a pergunta, as opções que todo jogador vê,
 * sem porcentagem, e segurar para cravar. Cravou, vai para o recibo. Um palpite por aparelho, e não
 * muda: se já havia um, o servidor devolve o mesmo, e a pessoa cai no recibo dele.
 */
export default function Cravar({ decisao, onFechar }: { decisao: AConfirmar; onFechar: () => void }) {
  const router = useRouter();
  const [cravando, setCravando] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const folha = useRef<HTMLDivElement>(null);
  // Quem abre passa uma função nova a cada desenho; o efeito do diálogo roda uma vez só.
  const fechar = useRef(onFechar);
  useEffect(() => {
    fechar.current = onFechar;
  }, [onFechar]);

  // Diálogo: o foco vai para a folha, a página por trás não rola, e Esc fecha. Ao fechar, o foco volta.
  useEffect(() => {
    const antes = document.activeElement as HTMLElement | null;
    const rolagem = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    folha.current?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fechar.current();
      // Tab fica dentro da folha.
      if (e.key === 'Tab' && folha.current) {
        const alvos = [...folha.current.querySelectorAll<HTMLElement>('button:not([disabled])')];
        const primeiro = alvos[0];
        const ultimo = alvos[alvos.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo?.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro?.focus();
        }
      }
    };
    window.addEventListener('keydown', tecla);
    return () => {
      window.removeEventListener('keydown', tecla);
      document.body.style.overflow = rolagem;
      antes?.focus();
    };
  }, []);

  async function cravar(escolha: string) {
    setCravando(escolha);
    setErro(null);
    const r = await fetch('/api/palpite', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ aparelho: idDoAparelho(), capitulo: decisao.capitulo, no: decisao.no, escolha, origem: origemGuardada() }),
    }).catch(() => null);
    const corpo = r ? await r.json().catch(() => null) : null;
    if (!r?.ok || !corpo?.codigo) {
      setCravando(null);
      setErro(corpo?.erro ?? 'Não deu para cravar agora. Tente de novo.');
      return;
    }
    salvarPalpite(`${decisao.capitulo}/${decisao.no}`, { codigo: corpo.codigo, escolha: corpo.escolha });
    router.push(`/palpite/${corpo.codigo}`);
  }

  return (
    <div className="folha-palpite" role="dialog" aria-modal="true" aria-labelledby="folha-titulo">
      <button type="button" className="folha-vela" aria-label="Fechar" onClick={onFechar} />
      <div className="folha" ref={folha} tabIndex={-1}>
        <div className="folha-alca" aria-hidden />
        <p className="folha-rot">Seu palpite · a realidade decide em {isoPorExtenso(decisao.data)}</p>
        <h3 id="folha-titulo">{decisao.titulo}</h3>
        <p className="folha-sub">O que você acha que vai acontecer de verdade? Não precisa ser o que escolheu no jogo.</p>
        <div className="escolhas">
          {decisao.escolhas.map((e, i) => (
            <BotaoEscolha
              key={e.id}
              letra={String.fromCharCode(65 + i)}
              rotulo={e.rotulo}
              status="livre"
              verbo="cravar"
              decidido={cravando === e.id}
              apagado={cravando !== null && cravando !== e.id}
              onDecidir={() => cravar(e.id)}
            />
          ))}
        </div>
        {erro && <p className="folha-erro">{erro}</p>}
        <p className="folha-nota">Um palpite por aparelho. Depois de cravado, não muda. Sem cadastro: você recebe um link para ver o resultado.</p>
      </div>
    </div>
  );
}
