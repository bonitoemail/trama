'use client';

import { useEffect, useState } from 'react';
import BotaoEscolha from './BotaoEscolha';
import Cartoes from './Cartoes';
import Inicio from './Inicio';
import LinhaDoTempo from './LinhaDoTempo';
import { linhaDoTempo } from '@/engine/historia';
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

type Tela = 'carregando' | 'abertura' | 'partida';

export default function Jogo({
  jogo,
  caminhos,
  partidas,
}: {
  jogo: JogoT;
  caminhos: Record<string, number>;
  /** Histórias completas possíveis (contarPartidas), mostradas na tela inicial. */
  partidas: number;
}) {
  const [tela, setTela] = useState<Tela>('carregando');
  const [estado, setEstado] = useState<Estado | null>(null);
  const [vistos, setVistos] = useState<Set<string>>(new Set());
  const [decidindo, setDecidindo] = useState<string | null>(null);

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
    atualizar(novoJogo(jogo));
    setTela('partida');
  }

  if (tela === 'carregando') return <main className="tela" />;

  if (tela === 'abertura' || !estado) {
    return (
      <Inicio jogo={jogo} partidas={partidas} temPartida={Boolean(estado)} onContinuar={() => setTela('partida')} onComecar={comecar} />
    );
  }

  const cap = capitulo(jogo, estado.capitulo);

  if (estado.fase === 'fim_jogo') {
    const capsJogados = [...new Set(estado.historico.map((p) => p.capitulo))].map((id) => capitulo(jogo, id));
    return (
      <main className="tela fim">
        <p className="rotulo">Epílogo</p>
        <h2>{jogo.epilogo.titulo}</h2>
        {paragrafos(jogo.epilogo.texto, estado.marcas).map((p, i) => (
          <p key={i} className="texto">{p}</p>
        ))}
        <h3 className="titulo-linha">A linha do tempo que você escolheu</h3>
        {capsJogados.map((c) => (
          <section key={c.id} className="resumo-cap">
            <p className="rotulo">
              Capítulo {c.numero} · {c.titulo}
            </p>
            <LinhaDoTempo
              momentos={linhaDoTempo(jogo, estado.historico).filter((m) => m.capitulo === c.id)}
              caminhosPossiveis={caminhos[c.id] ?? 0}
            />
          </section>
        ))}
        <Acao primario onClick={comecar}>
          Jogar de novo
        </Acao>
      </main>
    );
  }

  if (estado.fase === 'fim_capitulo') {
    return (
      <main className="tela fim-cap">
        <p className="rotulo">Fim do capítulo {cap.numero} · {cap.titulo}</p>
        <h2>A linha do tempo que você escolheu</h2>
        <LinhaDoTempo
          momentos={linhaDoTempo(jogo, estado.historico).filter((m) => m.capitulo === cap.id)}
          caminhosPossiveis={caminhos[cap.id] ?? 0}
        />
        <Acao primario onClick={() => atualizar(continuar(jogo, estado))}>
          {estado.proximo === 'FIM' ? 'Ver o desfecho' : 'Próximo capítulo'}
        </Acao>
      </main>
    );
  }

  const atual = no(jogo, cap.id, estado.no);
  const opcoes = escolhasExibidas(atual, estado.marcas);
  const primeiroNo = estado.no === cap.inicio;
  const tipo = tipoDeCena(primeiroNo, opcoes.length > 0, Boolean(atual.segue));
  const eco = tipo === 'consequencia' || tipo === 'final' ? ecoDaEscolha(jogo, estado.historico) : null;
  const textos = paragrafos(atual.texto, estado.marcas);
  const detalhe = atual.detalhe ? paragrafos(atual.detalhe, estado.marcas) : undefined;
  const avancar = () => atualizar(escolher(jogo, estado, null), [`${cap.id}/${atual.id}`]);
  const chave = `${cap.id}/${atual.id}`;
  const lugar = atual.lugar && <p className="lugar">{atual.lugar}</p>;
  const linhaEco = eco && <p className="eco">Porque {eco}…</p>;

  if (tipo === 'abertura') {
    return (
      <main className="tela cena cena-abertura" key={chave}>
        <Cartoes
          textos={textos}
          imagem={atual.imagem}
          detalhe={detalhe}
          abertura={
            <div className="hero-titulo">
              <p className="rotulo">Capítulo {cap.numero}</p>
              <h1>{cap.titulo}</h1>
              <p className="periodo">{cap.periodo}</p>
              {cap.rascunho && <p className="rascunho">rascunho</p>}
            </div>
          }
          topo={lugar}
        >
          <Acao primario onClick={avancar}>Começar o capítulo</Acao>
        </Cartoes>
      </main>
    );
  }

  if (tipo === 'consequencia') {
    return (
      <main className="tela cena cena-consequencia" key={chave}>
        <Cabecalho numero={cap.numero} titulo={cap.titulo} periodo={cap.periodo} />
        <article className="despacho">
          <Cartoes textos={textos} imagem={atual.imagem} detalhe={detalhe} topo={<>{linhaEco}{lugar}</>}>
            <Acao onClick={avancar}>Seguir</Acao>
          </Cartoes>
        </article>
      </main>
    );
  }

  if (tipo === 'final') {
    return (
      <main className="tela cena cena-final" key={chave}>
        <Cartoes
          textos={textos}
          imagem={atual.imagem}
          detalhe={detalhe}
          abertura={<p className="rotulo desfecho">Desfecho do capítulo {cap.numero}</p>}
          topo={<>{linhaEco}{lugar}</>}
        >
          <Acao primario onClick={avancar}>Fechar o capítulo</Acao>
        </Cartoes>
      </main>
    );
  }

  return (
    <main className="tela cena" key={chave}>
      <Cabecalho numero={cap.numero} titulo={cap.titulo} periodo={cap.periodo} />
      <Cartoes textos={textos} imagem={atual.imagem} detalhe={detalhe} topo={lugar}>
        <p className="pergunta">O que acontece agora?</p>
        <div className="escolhas">
          {opcoes.map(({ escolha: e, status }, i) => (
            <BotaoEscolha
              key={e.id}
              letra={String.fromCharCode(65 + i)}
              rotulo={e.rotulo}
              status={status}
              dataReal={e.real?.data}
              decidido={decidindo === e.id}
              apagado={decidindo !== null && decidindo !== e.id}
              onDecidir={() => {
                setDecidindo(e.id);
                // Um instante para a decisão pesar antes de a cena mudar.
                setTimeout(() => {
                  setDecidindo(null);
                  atualizar(escolher(jogo, estado, e.id), [chave, `${chave}:${e.id}`]);
                }, 650);
              }}
            />
          ))}
        </div>
      </Cartoes>
    </main>
  );
}

type TipoCena = 'abertura' | 'decisao' | 'consequencia' | 'final';

/** O tipo sai da estrutura do roteiro; nenhum campo extra no YAML. */
function tipoDeCena(primeiro: boolean, temEscolha: boolean, segue: boolean): TipoCena {
  if (primeiro && !temEscolha) return 'abertura';
  if (temEscolha) return 'decisao';
  return segue ? 'consequencia' : 'final';
}

/** O rótulo da última escolha feita, pronto para "Porque …". */
function ecoDaEscolha(jogo: JogoT, historico: Passo[]): string | null {
  const ultimo = historico[historico.length - 1];
  if (!ultimo?.escolha) return null;
  const rotulo = no(jogo, ultimo.capitulo, ultimo.no).escolhas?.find((e) => e.id === ultimo.escolha)?.rotulo;
  if (!rotulo) return null;
  // "O relator…" vira "o relator…"; nomes próprios ficam como estão.
  return /^(O|A|Os|As) /.test(rotulo) ? rotulo[0].toLowerCase() + rotulo.slice(1) : rotulo;
}

function Cabecalho({ numero, titulo, periodo }: { numero: number; titulo: string; periodo: string }) {
  return (
    <header className="cabecalho">
      <span>
        Capítulo {numero} · {titulo}
      </span>
      <span>{periodo}</span>
    </header>
  );
}

/** Botão de ação (não é escolha): texto à esquerda, seta à direita. */
function Acao({
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
