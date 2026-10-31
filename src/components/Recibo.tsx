'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Moldura } from './Metodo';
import { isoPorExtenso } from '@/engine/calendario';
import { dominio } from '@/engine/fontes';
import { calendario, type PlacarDePalpites, type Situacao } from '@/lib/palpites';
import { guardarOrigem } from '@/lib/registro';
import { linkCom } from '@/lib/site';

interface Props {
  codigo: string;
  link: string;
  situacao: Situacao;
  /** "31 de outubro, às 14h12". */
  hora: string;
  placar: PlacarDePalpites | null;
  titulo: string;
}

/**
 * O recibo do palpite (sketch em estilo/sketches-palpites): o palpite, a hora em que foi cravado, quando
 * a realidade decide e, depois, o resultado. Lembrar no calendário (um .ics feito aqui, sem servidor) e
 * compartilhar (o link, com a prévia do palpite). Linguagem da capa.
 */
export default function Recibo({ codigo, link, situacao: s, hora, placar, titulo }: Props) {
  const router = useRouter();
  const [copiado, setCopiado] = useState(false);
  // Quem chega pelo link compartilhado (?origem=palpite) leva a origem para a partida que começar.
  useEffect(() => guardarOrigem(), []);
  const decidido = s.estado === 'acertou' || s.estado === 'errou';
  const inicio = () => router.push('/');
  const jogar = { rotulo: 'Jogar o Trama', curto: 'Jogar', onClick: inicio };

  function lembrar() {
    const blob = new Blob([calendario(s, link, codigo)], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `trama-palpite-${codigo}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
  }

  async function compartilhar() {
    const texto = decidido
      ? `${s.estado === 'acertou' ? 'Acertei' : 'Errei'} meu palpite no Trama: "${s.titulo}". E o seu?`
      : `Cravei meu palpite no Trama sobre "${s.titulo}". E o seu?`;
    const url = `${link}?origem=palpite`;
    if (navigator.share) {
      await navigator.share({ text: texto, url }).catch(() => {});
      return;
    }
    await navigator.clipboard?.writeText(`${texto} ${url}`).catch(() => {});
    setCopiado(true);
  }

  return (
    <Moldura classe="recibo" titulo={titulo} onVoltar={inicio} principal={jogar} capitulo={decidido ? 'O próximo palpite está na capa' : 'Simulação preditiva do Brasil até 2030'}>
      <p className="sobre">Meu palpite</p>
      <h1>{s.minha}</h1>
      <p className="quando">
        Cravado em <b>{hora}</b>, sobre {/^(O|A|Os|As) /.test(s.titulo) ? s.titulo.charAt(0).toLowerCase() + s.titulo.slice(1) : `“${s.titulo}”`}.
      </p>

      <div className="estado">
        {s.estado === 'aberto' && (
          <>
            A realidade decide em <b>{isoPorExtenso(s.data)}</b>.
            <small>Os palpites fecham no fim do dia anterior. Quantos cravaram cada opção só aparece depois.</small>
          </>
        )}
        {s.estado === 'fechado' && (
          <>
            Os palpites fecharam. A realidade ainda não decidiu.
            <small>O resultado entra aqui quando for conferido em duas fontes.</small>
          </>
        )}
        {decidido && (
          <>
            {s.estado === 'acertou' ? <span className="sim">Aconteceu.</span> : <>Não aconteceu. Aconteceu: {s.aconteceu}.</>} A realidade decidiu em{' '}
            {isoPorExtenso(s.data)}.
            {s.fontes && <small>Fontes: {s.fontes.map(dominio).join(', ')}</small>}
          </>
        )}
      </div>

      {placar && (
        <div className="placar-palpites">
          <ul>
            {placar.opcoes.map((o) => (
              <li key={o.rotulo} className={o.real ? 'real' : ''}>
                <span className="nome">
                  {o.rotulo}
                  {o.real && <small>aconteceu</small>}
                </span>
                <span className="pct">{o.pct}%</span>
                <span className="trilho" aria-hidden>
                  <span style={{ width: `${o.pct}%` }} />
                </span>
              </li>
            ))}
          </ul>
          <p className="nota">{placar.total.toLocaleString('pt-BR')} palpites cravados antes da notícia. Não é pesquisa de opinião.</p>
        </div>
      )}

      <div className="acoes-recibo">
        {s.estado === 'aberto' && (
          <button type="button" className="botao-claro" onClick={lembrar}>
            Lembrar no calendário
          </button>
        )}
        <button type="button" className="botao-borda" onClick={compartilhar}>
          {decidido ? 'Compartilhar o resultado' : 'Compartilhar meu palpite'}
        </button>
        {copiado && <p className="nota">Link copiado.</p>}
      </div>

      <p className="nota codigo">
        Guarde este link: é por ele que você vê o resultado, de qualquer aparelho. Código <code>{codigo}</code>.{' '}
        <a href={linkCom('recibo')}>Fazer outro palpite</a>
      </p>
    </Moldura>
  );
}
