'use client';

import { useEffect, useState } from 'react';
import BotaoEscolha from './BotaoEscolha';
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
            <Acao primario onClick={() => setTela('partida')}>Continuar partida</Acao>
          )}
          {estado && !confirmarNova && <Acao onClick={() => setConfirmarNova(true)}>Nova partida</Acao>}
          {estado && confirmarNova && (
            <>
              <p className="nota">A partida atual será perdida. As escolhas não voltam.</p>
              <Acao primario onClick={comecar}>Começar do zero</Acao>
              <Acao onClick={() => setConfirmarNova(false)}>Manter a atual</Acao>
            </>
          )}
          {!estado && (
            <Acao primario onClick={comecar}>
              Começar
            </Acao>
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
        <Acao
          primario
          onClick={() => {
            atualizar(novoJogo(jogo));
            setTela('partida');
          }}
        >
          O que acontece agora?
        </Acao>
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
        <Acao primario onClick={comecar}>
          Jogar de novo
        </Acao>
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
  const ilustracao = atual.imagem && (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="ilustracao" src={`/${atual.imagem}`} alt="" />
  );
  const avancar = () => atualizar(escolher(jogo, estado, null), [`${cap.id}/${atual.id}`]);

  // Na decisão e na consequência, a ilustração é uma pausa no meio da leitura.
  // Na abertura e no final, ela abre a cena.
  const meio = tipo === 'abertura' || tipo === 'final' ? 0 : Math.ceil(textos.length / 2);
  const corpo = (
    <>
      {textos.slice(0, meio).map((p, i) => (
        <p key={i} className="texto">{p}</p>
      ))}
      {meio > 0 && ilustracao}
      {textos.slice(meio).map((p, i) => (
        <p key={meio + i} className="texto">{p}</p>
      ))}
    </>
  );

  if (tipo === 'abertura') {
    return (
      <main className="tela cena cena-abertura" key={`${cap.id}/${atual.id}`}>
        <div className="hero">
          {ilustracao}
          <div className="hero-titulo">
            <p className="rotulo">Capítulo {cap.numero}</p>
            <h1>{cap.titulo}</h1>
            <p className="periodo">{cap.periodo}</p>
            {cap.rascunho && <p className="rascunho">rascunho</p>}
          </div>
        </div>
        {atual.lugar && <p className="lugar">{atual.lugar}</p>}
        {corpo}
        <div className="acoes-cena">
          <Acao primario onClick={avancar}>Começar o capítulo</Acao>
        </div>
      </main>
    );
  }

  if (tipo === 'consequencia') {
    return (
      <main className="tela cena cena-consequencia" key={`${cap.id}/${atual.id}`}>
        <Cabecalho numero={cap.numero} titulo={cap.titulo} periodo={cap.periodo} />
        <article className="despacho">
          {eco && <p className="eco">Porque {eco}…</p>}
          {atual.lugar && <p className="lugar">{atual.lugar}</p>}
          {corpo}
        </article>
        <div className="acoes-cena">
          <Acao onClick={avancar}>Seguir</Acao>
        </div>
      </main>
    );
  }

  if (tipo === 'final') {
    return (
      <main className="tela cena cena-final" key={`${cap.id}/${atual.id}`}>
        <div className="hero">{ilustracao}</div>
        <p className="rotulo desfecho">Desfecho do capítulo {cap.numero}</p>
        {eco && <p className="eco">Porque {eco}…</p>}
        {atual.lugar && <p className="lugar">{atual.lugar}</p>}
        {corpo}
        <div className="acoes-cena">
          <Acao primario onClick={avancar}>Fechar o capítulo</Acao>
        </div>
      </main>
    );
  }

  return (
    <main className="tela cena" key={`${cap.id}/${atual.id}`}>
      <Cabecalho numero={cap.numero} titulo={cap.titulo} periodo={cap.periodo} />
      {atual.lugar && <p className="lugar">{atual.lugar}</p>}
      {corpo}
      <div className="escolhas">
        {opcoes.length ? (
          opcoes.map(({ escolha: e, status }, i) => (
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
                  atualizar(escolher(jogo, estado, e.id), [`${cap.id}/${atual.id}`, `${cap.id}/${atual.id}:${e.id}`]);
                }, 650);
              }}
            />
          ))
        ) : (
          <Acao primario onClick={avancar}>Continuar</Acao>
        )}
      </div>
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
