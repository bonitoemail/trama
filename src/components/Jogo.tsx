'use client';

import { useEffect, useRef, useState } from 'react';
import BotaoEscolha from './BotaoEscolha';
import Cartoes from './Cartoes';
import Compartilhar from './Compartilhar';
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
  vale,
} from '@/engine/engine';
import type { AConfirmar } from '@/engine/relogios';
import type { Jogo as JogoT } from '@/engine/schema';
import { useNavegacao } from '@/lib/navegacao';
import { guardarOrigem, registrarInicio, registrarMudanca, registrarNaTela } from '@/lib/registro';
import { apagarPartida, lerApostas, lerPartida, lerVistos, salvarAposta, salvarPartida, salvarVistos } from '@/lib/storage';
import { tituloDaTela, type Tela } from '@/lib/telas';

export default function Jogo({
  jogo,
  caminhos,
  partidas,
  aConfirmar,
  inicial,
}: {
  jogo: JogoT;
  caminhos: Record<string, number>;
  /** Histórias completas possíveis (contarPartidas), mostradas na tela inicial. */
  partidas: number;
  /** Decisões que a realidade ainda vai decidir (relógios), para a tela /acertos. */
  aConfirmar: AConfirmar[];
  /** Tela do endereço em que a pessoa chegou (/, /o-que-e, /como-fazemos, /acertos, /partida). */
  inicial: Tela;
}) {
  const { tela, ir, voltar, corrigir } = useNavegacao(inicial);
  const [carregado, setCarregado] = useState(false);
  const [estado, setEstado] = useState<Estado | null>(null);
  const [vistos, setVistos] = useState<Set<string>>(new Set());
  const [decidindo, setDecidindo] = useState<string | null>(null);
  // Dois botões segurados ao mesmo tempo (dois dedos) disparam antes de o estado mudar: o ref barra o segundo.
  const decidindoRef = useRef<string | null>(null);
  // Saiu pelo X: a capa confirma que a partida ficou salva (só nessa volta).
  const [saiu, setSaiu] = useState(false);

  useEffect(() => {
    guardarOrigem();
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
    // Escolhas de partidas salvas antes de as apostas existirem: se a cena ainda não foi decidida
    // pela realidade, a escolha foi feita antes da notícia e conta como aposta de hoje.
    const apostas = lerApostas();
    valida?.historico.forEach((p) => {
      const chave = `${p.capitulo}/${p.no}`;
      if (p.escolha && !apostas[chave] && !no(jogo, p.capitulo, p.no).escolhas?.some((e) => e.real)) salvarAposta(chave, p.escolha);
    });
    setEstado(valida);
    setVistos(lerVistos());
    setCarregado(true);
    // /partida sem partida salva não tem o que mostrar: vira a capa.
    if (!valida && inicial === 'partida') corrigir('capa');
  }, [jogo.versao, inicial, corrigir]);

  // O título da aba acompanha a tela (o do servidor só vale para a primeira).
  useEffect(() => {
    const t = tituloDaTela(jogo, tela);
    document.title = t ? `${t} · ${jogo.titulo}` : jogo.titulo;
  }, [tela, jogo]);

  // Rola para o topo a cada nova cena (a rolagem entre telas fica com useNavegacao).
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [estado?.no, estado?.fase, estado?.capitulo]);

  function atualizar(novo: Estado, marcarVisto: string[] = []) {
    registrarMudanca(estado, novo);
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
    registrarInicio(jogo.versao);
    atualizar(novoJogo(jogo));
    if (tela !== 'partida') ir('partida');
  }

  // A partida depende do navegador (localStorage); a capa e as telas de explicação não: saem prontas
  // do servidor, para prévias, buscadores e celular lento (auditoria de 31/10, A5). Quem tem partida
  // salva vê "Começar" por um instante, até a leitura trocar por "Continuar partida".
  if (!carregado && tela === 'partida') return <main className="tela" />;

  if (tela !== 'partida' || !estado) {
    return (
      <Inicio
        jogo={jogo}
        tela={tela === 'partida' ? 'capa' : tela}
        partidas={partidas}
        aConfirmar={aConfirmar}
        capituloAtual={estado ? nomeDoCapitulo(capitulo(jogo, estado.capitulo)) : undefined}
        capituloInicial={nomeDoCapitulo(capitulo(jogo, jogo.primeiro_capitulo))}
        partidaSalva={saiu && Boolean(estado)}
        onIr={ir}
        onVoltar={voltar}
        onContinuar={() => {
          setSaiu(false);
          ir('partida');
        }}
        onComecar={comecar}
      />
    );
  }

  const cap = capitulo(jogo, estado.capitulo);
  const sair = (
    <Sair
      onClick={() => {
        setSaiu(true);
        voltar();
      }}
    />
  );

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
        <div className="acoes">
          <Acao primario onClick={comecar}>
            Jogar de novo
          </Acao>
          <Acao onClick={voltar}>Voltar ao início</Acao>
        </div>
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
          escolhas={jogo.escolhas ? { titulo: jogo.escolhas.titulo, onClick: () => ir('escolhas') } : undefined}
        />
        {/* Fixo no rodapé: no celular, a linha do tempo empurrava o botão para 2 telas abaixo, e 36% paravam aqui. */}
        <div className="seguir">
          {/* O cartão de stories do capítulo (estilo/sketches-compartilhar): cada jogador pode trazer o próximo. */}
          <Compartilhar
            capitulo={cap.id}
            rotuloCapitulo={`Capítulo ${cap.numero}, ${cap.titulo}`}
            final={no(jogo, cap.id, estado.no).titulo ?? cap.titulo}
            imagem={no(jogo, cap.id, estado.no).imagem ?? null}
            caminho={estado.historico
              .filter((p) => p.capitulo === cap.id && p.escolha)
              .map((p) => ({ no: p.no, escolha: p.escolha! }))
              // Na ordem do capítulo, que é a que /api/raridade aceita (um caminho, uma URL, um cache).
              .sort((x, y) => cap.nos.findIndex((n) => n.id === x.no) - cap.nos.findIndex((n) => n.id === y.no))}
            onCompartilhado={() => registrarNaTela('compartilhar', jogo.versao, cap.id, estado.no)}
          />
          <Acao primario onClick={() => atualizar(continuar(jogo, estado))}>
            {estado.proximo === 'FIM' ? 'Ver o desfecho' : 'Próximo capítulo'}
          </Acao>
        </div>
        {sair}
      </main>
    );
  }

  const atual = no(jogo, cap.id, estado.no);
  const opcoes = escolhasExibidas(atual, estado.marcas);
  const primeiroNo = estado.no === cap.inicio;
  const tipo = tipoDeCena(primeiroNo, opcoes.length > 0, Boolean(atual.segue));
  const eco = tipo === 'consequencia' || tipo === 'final' ? ecoDaEscolha(jogo, estado.historico) : null;
  const textos = paragrafos(atual.texto, estado.marcas);
  // "Fatos e fontes": os fatos que valem para estas marcas e a leitura de cada lado.
  const fatos = atual.fatos?.filter((f) => vale(f.se, estado.marcas));
  const lados = atual.lados ? paragrafos(atual.lados, estado.marcas) : undefined;
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
          fatos={fatos} lados={lados}
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
        {sair}
      </main>
    );
  }

  if (tipo === 'consequencia') {
    return (
      <main className="tela cena cena-consequencia" key={chave}>
        <Cabecalho numero={cap.numero} titulo={cap.titulo} periodo={cap.periodo} />
        <article className="despacho">
          <Cartoes textos={textos} imagem={atual.imagem} fatos={fatos} lados={lados} topo={<>{linhaEco}{lugar}</>}>
            <Acao onClick={avancar}>Seguir</Acao>
          </Cartoes>
        </article>
        {sair}
      </main>
    );
  }

  if (tipo === 'final') {
    return (
      <main className="tela cena cena-final" key={chave}>
        <Cartoes
          textos={textos}
          imagem={atual.imagem}
          fatos={fatos} lados={lados}
          abertura={<p className="rotulo desfecho">Desfecho do capítulo {cap.numero}</p>}
          topo={<>{linhaEco}{lugar}</>}
        >
          <Acao primario onClick={avancar}>Fechar o capítulo</Acao>
        </Cartoes>
        {sair}
      </main>
    );
  }

  return (
    <main className="tela cena" key={chave}>
      <Cabecalho numero={cap.numero} titulo={cap.titulo} periodo={cap.periodo} />
      <Cartoes textos={textos} imagem={atual.imagem} fatos={fatos} lados={lados} topo={lugar}>
        <AoAparecer acao={() => registrarNaTela('decisao_vista', jogo.versao, estado.capitulo, estado.no)} />
        <p className="pergunta">O que acontece agora?</p>
        <div className="escolhas">
          {opcoes.map(({ escolha: e, status }, i) => (
            <BotaoEscolha
              demonstrarEm={i === opcoes.findIndex((o) => o.status !== 'travada') ? estado.capitulo : undefined}
              key={e.id}
              letra={String.fromCharCode(65 + i)}
              rotulo={e.rotulo}
              status={status}
              dataReal={e.real?.data}
              decidido={decidindo === e.id}
              apagado={decidindo !== null && decidindo !== e.id}
              onToqueCurto={() => registrarNaTela('toque_curto', jogo.versao, estado.capitulo, estado.no)}
              onDecidir={() => {
                if (decidindoRef.current) return;
                decidindoRef.current = e.id;
                // Escolha em decisão ainda aberta é aposta: a capa conta quando a realidade decidir.
                if (status === 'livre') salvarAposta(chave, e.id);
                setDecidindo(e.id);
                // Um instante para a decisão pesar antes de a cena mudar.
                setTimeout(() => {
                  setDecidindo(null);
                  decidindoRef.current = null;
                  atualizar(escolher(jogo, estado, e.id), [chave, `${chave}:${e.id}`]);
                }, 650);
              }}
            />
          ))}
        </div>
      </Cartoes>
      {sair}
    </main>
  );
}

/** Roda `acao` uma vez, quando aparece: as opções só montam no último cartão da cena. */
function AoAparecer({ acao }: { acao: () => void }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(acao, []);
  return null;
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

/**
 * Sair a qualquer momento, embaixo de tudo: um X delicado. No PC, o balão diz que a partida fica
 * salva; no celular, a capa confirma ao chegar (o toque já sai, não dá para mostrar balão antes).
 */
function Sair({ onClick }: { onClick: () => void }) {
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

/** "Capítulo 1, A carta". */
function nomeDoCapitulo(c: { numero: number; titulo: string }): string {
  return `Capítulo ${c.numero}, ${c.titulo}`;
}
