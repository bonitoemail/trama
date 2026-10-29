'use client';

import { useEffect, useRef, useState } from 'react';
import Dica from './Dica';
import Fatos, { Fontes } from './Fatos';
import Metodo from './Metodo';
import { diaEMes, falta, isoPorExtenso, regua } from '@/engine/calendario';
import type { Jogo } from '@/engine/schema';
import { CAMINHOS, type Tela } from '@/lib/telas';

interface Props {
  jogo: Jogo;
  tela: Exclude<Tela, 'partida'>;
  partidas: number;
  /** "Capítulo 1, A carta" da partida salva; sem partida, não vem. */
  capituloAtual?: string;
  /** "Capítulo 1, A carta" de onde começa uma partida nova. */
  capituloInicial: string;
  /** Acabou de sair do jogo pelo X: confirma que a partida ficou salva. */
  partidaSalva?: boolean;
  onIr: (tela: Tela, opcoes?: { trocar?: boolean }) => void;
  onVoltar: () => void;
  onContinuar: () => void;
  onComecar: () => void;
}

/**
 * Capa e telas de explicação. Ousadia só no título; o resto quieto. Na capa, a notícia do Agora,
 * a partida e o que vem pela frente; depois, atrás de um toque, os fatos, o propósito e o método.
 * No PC, duas colunas: o agora parado à esquerda, o aprofundamento rolando à direita, com os
 * fatos já abertos.
 */
export default function Inicio({ jogo, tela, partidas, capituloAtual, capituloInicial, partidaSalva, onIr, onVoltar, onContinuar, onComecar }: Props) {
  const [confirmar, setConfirmar] = useState(false);
  // "mais de 234 milhões de histórias": com milhões, o número pede "de" antes da palavra que vem depois.
  const numero = emMil(partidas);
  const contar = (t: string) => t.replaceAll('{partidas} ', `${numero}${partidas >= 1_000_000 ? ' de' : ''} `).replaceAll('{partidas}', numero);
  const principal = capituloAtual ? onContinuar : onComecar;

  if (tela !== 'capa') {
    const explicacao = tela === 'metodo' ? jogo.metodo : jogo.objetivo;
    const outra = tela === 'metodo' ? jogo.objetivo : jogo.metodo;
    if (explicacao) {
      return (
        <Metodo
          tipo={tela}
          explicacao={explicacao}
          passos={tela === 'objetivo' ? jogo.apresentacao?.passos : undefined}
          partidas={numero}
          contar={contar}
          titulo={jogo.titulo}
          outra={outra?.titulo}
          onOutra={() => onIr(tela === 'metodo' ? 'objetivo' : 'metodo', { trocar: true })}
          onVoltar={onVoltar}
          principal={{ rotulo: capituloAtual ? 'Continuar partida' : 'Começar', curto: capituloAtual ? 'Continuar' : 'Começar', onClick: principal }}
          capitulo={capituloAtual ?? capituloInicial}
        />
      );
    }
  }

  const agora = jogo.prologo[jogo.prologo.length - 1];
  const antes = jogo.prologo.slice(0, -1);
  const pelaFrente = regua(jogo);

  return (
    <main className="capa inicio">
      <header className="cabeca">
        <h1 className="marca luz">{jogo.titulo}</h1>
        {jogo.apresentacao?.ficha && <p>{jogo.apresentacao.ficha}</p>}
      </header>

      <div className="esquerda">
        <section className="agora" aria-labelledby="agora-tit">
          <p className="quando">
            <span>Agora, {diaEMes(agora.data)}</span>
            <Dica rotulo="O que é o Agora?">
              A simulação começa a partir desta notícia, a mais recente que importa. Daqui em diante, é você quem decide o que
              acontece.
            </Dica>
          </p>
          <h2 id="agora-tit">{agora.titulo ?? agora.texto}</h2>
          <Fontes urls={agora.fontes} />
        </section>

        <div className="partida">
          {confirmar ? (
            <>
              <p className="nota">A partida atual será apagada. As escolhas não voltam.</p>
              <button type="button" className="botao-claro" onClick={onComecar}>
                Começar do zero
              </button>
              <button type="button" className="link-sub" onClick={() => setConfirmar(false)}>
                Manter a partida atual
              </button>
            </>
          ) : (
            <>
              <button type="button" className="botao-claro" onClick={principal}>
                {capituloAtual ? 'Continuar partida' : 'Começar'}
              </button>
              <p className="legenda">{capituloAtual ?? capituloInicial}</p>
              {partidaSalva && <p className="salva">Partida salva neste aparelho</p>}
              {capituloAtual && (
                <button type="button" className="link-sub" onClick={() => setConfirmar(true)}>
                  Começar outra partida
                </button>
              )}
            </>
          )}
        </div>

        {pelaFrente && <PelaFrente agora={pelaFrente.agora} marcos={pelaFrente.marcos} />}
      </div>

      <div className="direita">
        {/* As duas telas vêm antes dos fatos: "o que é isso?" é a primeira dúvida de quem chega. */}
        <ul className="mais">
          {jogo.objetivo && (
            <li>
              <Linha tela="objetivo" onIr={onIr}>
                {jogo.objetivo.titulo}
              </Linha>
            </li>
          )}
          {jogo.metodo && (
            <li>
              <Linha tela="metodo" onIr={onIr}>
                {jogo.metodo.titulo}
              </Linha>
            </li>
          )}
          {antes.length > 0 && (
            <li>
              <FatosAbertosNoPc total={antes.length}>
                <Fatos fatos={antes} />
              </FatosAbertosNoPc>
            </li>
          )}
        </ul>
        <p className="aviso">{jogo.aviso}</p>
      </div>
    </main>
  );
}

/** "Pela frente: eleição nos EUA, em 3 de novembro. Faltam 3 anos e 11 meses para a eleição para presidente de 2030." */
function PelaFrente({ agora, marcos }: { agora: string; marcos: { data: string; nome: string }[] }) {
  const prox = marcos[0];
  const fim = marcos[marcos.length - 1];
  return (
    <p className="adiante">
      Pela frente:{' '}
      <b>
        {minuscula(prox.nome)}, em {isoPorExtenso(prox.data)}
      </b>
      .
      {fim !== prox && (
        <>
          {' '}
          Faltam {falta(agora, fim.data)} para a {minuscula(fim.nome)} de {fim.data.slice(0, 4)}.
        </>
      )}
    </p>
  );
}

/** Lista de fatos: fechada atrás de um toque no celular, aberta no PC (há espaço, e dá contexto). */
function FatosAbertosNoPc({ total, children }: { total: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const pc = window.matchMedia('(min-width: 960px)');
    const ajustar = () => ref.current && (ref.current.open = pc.matches);
    ajustar();
    pc.addEventListener('change', ajustar);
    return () => pc.removeEventListener('change', ajustar);
  }, []);
  return (
    <details ref={ref} className="fatos-caixa">
      <summary className="linha-mais">
        O que já aconteceu
        <span>
          {total} {total > 1 ? 'fatos' : 'fato'} <span className="sinal" aria-hidden>⌄</span>
        </span>
      </summary>
      {children}
    </details>
  );
}

/** Link para uma tela interna: endereço de verdade (abre em nova aba, dá para enviar), sem recarregar. */
function Linha({ tela, onIr, children }: { tela: Tela; onIr: Props['onIr']; children: React.ReactNode }) {
  return (
    <a
      className="linha-mais"
      href={CAMINHOS[tela]}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onIr(tela);
      }}
    >
      {children}
      <span className="sinal" aria-hidden>
        ›
      </span>
    </a>
  );
}

function minuscula(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/**
 * 184320 vira "184 mil"; 234555264 vira "234 milhões"; abaixo de mil, o número inteiro.
 * Arredonda para baixo: o texto diz "mais de".
 */
function emMil(n: number): string {
  if (n >= 2_000_000) return `${Math.floor(n / 1_000_000).toLocaleString('pt-BR')} milhões`;
  if (n >= 1_000_000) return '1 milhão';
  return n >= 1000 ? `${Math.floor(n / 1000).toLocaleString('pt-BR')} mil` : String(n);
}
