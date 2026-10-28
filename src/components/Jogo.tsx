'use client';

import { useEffect, useState } from 'react';
import Fluxograma from './Fluxograma';
import {
  type Estado,
  type Passo,
  capitulo,
  continuar,
  escolher,
  escolhasExibidas,
  no,
  novoJogo,
  paragrafos,
} from '@/engine/engine';
import type { Jogo as JogoT } from '@/engine/schema';
import { apagarPartida, lerPartida, lerVistos, salvarPartida, salvarVistos } from '@/lib/storage';

type Tela = 'carregando' | 'abertura' | 'prologo' | 'partida';

export default function Jogo({ jogo }: { jogo: JogoT }) {
  const [tela, setTela] = useState<Tela>('carregando');
  const [estado, setEstado] = useState<Estado | null>(null);
  const [vistos, setVistos] = useState<Set<string>>(new Set());
  const [confirmarNova, setConfirmarNova] = useState(false);

  useEffect(() => {
    // Uma partida salva que não bate mais com o conteúdo (nó ou capítulo removido) é descartada.
    const salva = lerPartida(jogo.versao);
    let valida = salva;
    try {
      if (salva) {
        no(jogo, salva.capitulo, salva.no);
        salva.historico.forEach((p) => no(jogo, p.capitulo, p.no));
      }
    } catch {
      valida = null;
      apagarPartida(jogo.versao);
    }
    setEstado(valida);
    setVistos(lerVistos());
    setTela('abertura');
  }, [jogo.versao]);

  // Rola para o topo a cada nova cena.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tela, estado?.no, estado?.fase, estado?.capitulo]);

  function atualizar(novo: Estado, marcarVisto: string[] = []) {
    setEstado(novo);
    salvarPartida(novo);
    if (marcarVisto.length) {
      const v = new Set(vistos);
      marcarVisto.forEach((x) => v.add(x));
      setVistos(v);
      salvarVistos(v);
    }
  }

  function comecar() {
    apagarPartida(jogo.versao);
    setEstado(null);
    setConfirmarNova(false);
    setTela('prologo');
  }

  if (tela === 'carregando') return <main className="tela" />;

  if (tela === 'abertura') {
    return (
      <main className="tela abertura">
        <h1 className="marca">{jogo.titulo}</h1>
        <p className="sub">O que pode acontecer com o Brasil até 2030. Você decide.</p>
        <p className="aviso">{jogo.aviso}</p>
        <div className="acoes">
          {estado && !confirmarNova && (
            <button className="botao primario" onClick={() => setTela('partida')}>
              Continuar partida
            </button>
          )}
          {estado && !confirmarNova && (
            <button className="botao" onClick={() => setConfirmarNova(true)}>
              Nova partida
            </button>
          )}
          {estado && confirmarNova && (
            <>
              <p className="nota">A partida atual será perdida. As escolhas não voltam.</p>
              <button className="botao primario" onClick={comecar}>Começar do zero</button>
              <button className="botao" onClick={() => setConfirmarNova(false)}>Manter a atual</button>
            </>
          )}
          {!estado && (
            <button className="botao primario" onClick={comecar}>
              Começar
            </button>
          )}
        </div>
      </main>
    );
  }

  if (tela === 'prologo' || !estado) {
    return (
      <main className="tela prologo">
        <p className="rotulo">Prólogo · o que já aconteceu</p>
        <ol className="fatos">
          {jogo.prologo.map((f) => (
            <li key={f.data}>
              <time>{f.data}</time>
              <p>{f.texto}</p>
              {f.fonte && (
                <a href={f.fonte} target="_blank" rel="noreferrer">
                  fonte
                </a>
              )}
            </li>
          ))}
        </ol>
        <p className="ponte">Daqui em diante, nada aconteceu ainda.</p>
        <button
          className="botao primario"
          onClick={() => {
            atualizar(novoJogo(jogo));
            setTela('partida');
          }}
        >
          O que acontece agora?
        </button>
      </main>
    );
  }

  const cap = capitulo(jogo, estado.capitulo);
  const passosDoCap = (capId: string): Passo[] => estado.historico.filter((p) => p.capitulo === capId);

  if (estado.fase === 'fim_jogo') {
    const capsJogados = [...new Set(estado.historico.map((p) => p.capitulo))].map((id) => capitulo(jogo, id));
    return (
      <main className="tela fim">
        <p className="rotulo">Epílogo</p>
        <h2>{jogo.epilogo.titulo}</h2>
        {paragrafos(jogo.epilogo.texto, estado.marcas).map((p, i) => (
          <p key={i} className="texto">{p}</p>
        ))}
        {capsJogados.map((c) => (
          <section key={c.id} className="resumo-cap">
            <h3>
              {c.numero}. {c.titulo}
            </h3>
            <Fluxograma cap={c} passos={passosDoCap(c.id)} vistos={vistos} />
          </section>
        ))}
        <button className="botao primario" onClick={comecar}>
          Jogar de novo
        </button>
      </main>
    );
  }

  if (estado.fase === 'fim_capitulo') {
    const passos = passosDoCap(cap.id);
    const escolhidas = passos
      .filter((p) => p.escolha)
      .map((p) => no(jogo, cap.id, p.no).escolhas!.find((e) => e.id === p.escolha)!.rotulo);
    return (
      <main className="tela fim-cap">
        <p className="rotulo">Fim do capítulo {cap.numero}</p>
        <h2>{cap.titulo}</h2>
        <Fluxograma cap={cap} passos={passos} vistos={vistos} />
        <ol className="caminho">
          {escolhidas.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ol>
        <button className="botao primario" onClick={() => atualizar(continuar(jogo, estado))}>
          {estado.proximo === 'FIM' ? 'Ver o desfecho' : 'Próximo capítulo'}
        </button>
      </main>
    );
  }

  const atual = no(jogo, cap.id, estado.no);
  const opcoes = escolhasExibidas(atual, estado.marcas);
  const primeiroNo = estado.no === cap.inicio;

  return (
    <main className="tela cena" key={`${cap.id}/${atual.id}`}>
      <header className="cabecalho">
        <span>
          Capítulo {cap.numero} · {cap.titulo}
        </span>
        <span>{cap.periodo}</span>
      </header>
      {atual.imagem && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="ilustracao" src={`/${atual.imagem}`} alt="" />
      )}
      {cap.rascunho && primeiroNo && <p className="rascunho">rascunho</p>}
      {atual.lugar && <p className="lugar">{atual.lugar}</p>}
      {paragrafos(atual.texto, estado.marcas).map((p, i) => (
        <p key={i} className="texto">{p}</p>
      ))}
      <div className="escolhas">
        {opcoes.length ? (
          opcoes.map(({ escolha: e, status }) => (
            <button
              key={e.id}
              className={`botao escolha ${status}`}
              disabled={status === 'travada'}
              onClick={() =>
                atualizar(escolher(jogo, estado, e.id), [`${cap.id}/${atual.id}`, `${cap.id}/${atual.id}:${e.id}`])
              }
            >
              {e.rotulo}
              {status === 'real' && <span className="selo">aconteceu em {e.real!.data}</span>}
              {status === 'travada' && <span className="selo">não aconteceu</span>}
            </button>
          ))
        ) : (
          <button
            className="botao primario"
            onClick={() => atualizar(escolher(jogo, estado, null), [`${cap.id}/${atual.id}`])}
          >
            Continuar
          </button>
        )}
      </div>
    </main>
  );
}
