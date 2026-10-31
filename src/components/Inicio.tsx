'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Acertos from './Acertos';
import Dica from './Dica';
import Fatos, { Fontes } from './Fatos';
import Escolhas from './Escolhas';
import Metodo from './Metodo';
import { agoraDaCapa, diaEMes, falta, isoPorExtenso, regua } from '@/engine/calendario';
import type { AConfirmar } from '@/engine/relogios';
import type { Jogo } from '@/engine/schema';
import { apostaDecidida } from '@/lib/apostas';
import { abertas } from '@/lib/palpites';
import { useGuardado, useHoje } from '@/lib/noNavegador';
import { usePainel, type Carga } from '@/lib/painel';
import { apostasDe, CHAVE_APOSTAS, CHAVE_PALPITES, palpitesDe } from '@/lib/storage';
import Cravar from './Cravar';
import { CAMINHOS, type Tela } from '@/lib/telas';

interface Props {
  jogo: Jogo;
  tela: Exclude<Tela, 'partida'>;
  partidas: number;
  aConfirmar: AConfirmar[];
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
export default function Inicio({ jogo, tela, partidas, aConfirmar, capituloAtual, capituloInicial, partidaSalva, onIr, onVoltar, onContinuar, onComecar }: Props) {
  const [confirmar, setConfirmar] = useState(false);
  // Na capa, só o número de histórias ao lado do link (porcentagem solta aqui viraria manchete de pesquisa).
  const painel = usePainel(tela === 'capa' && Boolean(jogo.escolhas));
  // "mais de 234 milhões de histórias": com milhões, o número pede "de" antes da palavra que vem depois.
  const numero = emMil(partidas);
  const contar = (t: string) => t.replaceAll('{partidas} ', `${numero}${partidas >= 1_000_000 ? ' de' : ''} `).replaceAll('{partidas}', numero);
  const principal = capituloAtual ? onContinuar : onComecar;
  const botao = { rotulo: capituloAtual ? 'Continuar partida' : 'Começar', curto: capituloAtual ? 'Continuar' : 'Começar', onClick: principal };

  if (tela === 'acertos' && jogo.acertos) {
    return (
      <Acertos
        acertos={jogo.acertos}
        aConfirmar={aConfirmar}
        titulo={jogo.titulo}
        escolhas={jogo.escolhas ? { titulo: jogo.escolhas.titulo, onClick: () => onIr('escolhas') } : undefined}
        onVoltar={onVoltar}
        principal={botao}
        capitulo={capituloAtual ?? capituloInicial}
      />
    );
  }

  if (tela === 'escolhas' && jogo.escolhas) {
    return (
      <Escolhas
        textos={jogo.escolhas}
        titulo={jogo.titulo}
        acertos={jogo.acertos ? { titulo: jogo.acertos.titulo, onClick: () => onIr('acertos') } : undefined}
        onVoltar={onVoltar}
        principal={botao}
        capitulo={capituloAtual ?? capituloInicial}
      />
    );
  }

  if (tela === 'objetivo' || tela === 'metodo') {
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
          acertos={tela === 'metodo' && jogo.acertos ? { titulo: jogo.acertos.titulo, onClick: () => onIr('acertos') } : undefined}
          onVoltar={onVoltar}
          principal={botao}
          capitulo={capituloAtual ?? capituloInicial}
        />
      );
    }
  }

  const { agora, antes } = agoraDaCapa(jogo.prologo);
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

        <ApostaNaCapa jogo={jogo} painel={painel} onPlacar={jogo.escolhas ? () => onIr('escolhas') : undefined} />
        <ProximoPalpite aConfirmar={aConfirmar} />

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
          {jogo.escolhas && (
            <li>
              <Linha
                tela="escolhas"
                onIr={onIr}
                extra={painel && painel !== 'vazio' && painel.partidas > 0 ? `${painel.partidas.toLocaleString('pt-BR')} histórias` : undefined}
              >
                {jogo.escolhas.titulo}
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
function Linha({ tela, onIr, extra, children }: { tela: Tela; onIr: Props['onIr']; extra?: string; children: React.ReactNode }) {
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
      <span>
        {extra && <span className="extra">{extra} </span>}
        <span className="sinal" aria-hidden>
          ›
        </span>
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

/**
 * Quem escolheu, antes da notícia, numa decisão que a realidade acabou de decidir vê, na capa, se aconteceu
 * (sketch em estilo/sketches-3-11/placar.html). As apostas ficam no navegador: lidas depois de montar.
 */
function ApostaNaCapa({ jogo, painel, onPlacar }: { jogo: Jogo; painel: Carga; onPlacar?: () => void }) {
  const hoje = useHoje();
  const guardadas = useGuardado(CHAVE_APOSTAS);
  const aposta = useMemo(() => (hoje ? apostaDecidida(jogo, apostasDe(guardadas), hoje) : null), [jogo, hoje, guardadas]);
  if (!aposta) return null;

  const pct = painel && painel !== 'vazio' ? painel.porDecisao[aposta.chave]?.pct[aposta.minha] : undefined;
  return (
    <p className="aposta">
      No jogo, antes da notícia, você escolheu <b>“{aposta.minha}”</b>.{' '}
      {aposta.acertou ? <span className="sim">Aconteceu.</span> : <>Não aconteceu. Aconteceu “{aposta.aconteceu}”.</>}
      {pct !== undefined && <> {pct}% dos jogadores escolheram o mesmo.</>}
      {onPlacar && (
        <>
          <br />
          <button type="button" className="link-sub" onClick={onPlacar}>
            Ver o placar
          </button>
        </>
      )}
    </p>
  );
}

/**
 * "O próximo palpite" (notas/palpites.md): a decisão que a realidade decide primeiro, com o link para
 * cravar sem precisar jogar. Quem já cravou neste aparelho vê o palpite e o link do recibo.
 * Some quando não há decisão aberta. Só no navegador: depende do dia e do que está guardado.
 */
function ProximoPalpite({ aConfirmar }: { aConfirmar: AConfirmar[] }) {
  const hoje = useHoje();
  const palpites = palpitesDe(useGuardado(CHAVE_PALPITES));
  const [cravando, setCravando] = useState(false);
  const proxima = hoje ? abertas(aConfirmar, hoje)[0] : undefined;
  if (!proxima || !hoje) return null;

  const cravado = palpites[`${proxima.capitulo}/${proxima.no}`];
  const minha = cravado && proxima.escolhas.find((e) => e.id === cravado.escolha)?.rotulo;
  const ultimoDia = new Date(Date.parse(`${proxima.data}T12:00:00Z`) - 86_400_000).toISOString().slice(0, 10);
  const fecha = ultimoDia === hoje ? 'Os palpites fecham hoje.' : `Os palpites fecham no fim de ${isoPorExtenso(ultimoDia)}.`;
  return (
    <section className="proximo-palpite" aria-label="O próximo palpite">
      <p className="sobre">O próximo palpite</p>
      <p className="decisao-palpite">{proxima.titulo}</p>
      {cravado && minha ? (
        <>
          <p className="nota">
            Você cravou: <b>“{minha}”</b>. A realidade decide em {isoPorExtenso(proxima.data)}.
          </p>
          <a className="link-sub" href={`/palpite/${cravado.codigo}`}>
            Ver o recibo
          </a>
        </>
      ) : (
        <>
          <p className="nota">
            A realidade decide em {isoPorExtenso(proxima.data)}. {fecha}
          </p>
          <button type="button" className="link-sub" onClick={() => setCravando(true)}>
            Cravar meu palpite
          </button>
          {cravando && <Cravar decisao={proxima} onFechar={() => setCravando(false)} />}
        </>
      )}
    </section>
  );
}
