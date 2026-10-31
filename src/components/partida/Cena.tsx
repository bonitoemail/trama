'use client';

import { useRef, useState } from 'react';
import BotaoEscolha from '../BotaoEscolha';
import Cartoes from '../Cartoes';
import Cravar from '../Cravar';
import { Acao, AoAparecer, Cabecalho } from './Pecas';
import { isoPorExtenso } from '@/engine/calendario';
import { type Estado, type Passo, capitulo, escolhasExibidas, no, paragrafos, vale } from '@/engine/engine';
import type { AConfirmar } from '@/engine/relogios';
import type { Jogo } from '@/engine/schema';
import { registrarNaTela } from '@/lib/registro';
import { salvarAposta } from '@/lib/storage';

/** Quanto a escolha fica marcada na tela antes de a cena mudar: um instante para a decisão pesar. */
const PESO_MS = 650;

/**
 * Uma cena da partida, nos quatro tipos: abertura, decisão, consequência e final. O tipo sai da
 * estrutura do roteiro (primeira cena, tem escolha, tem `segue`); nenhum campo extra no YAML.
 * Quem chama monta uma por cena (`key`), e o estado da decisão começa do zero a cada uma.
 */
export default function Cena({
  jogo,
  estado,
  sair,
  onAvancar,
  onEscolher,
  convite,
}: {
  jogo: Jogo;
  estado: Estado;
  sair: React.ReactNode;
  /** Cena sem escolha: seguir para a próxima. */
  onAvancar: () => void;
  /** Cena de decisão: a escolha feita (depois do instante em que ela fica marcada). */
  onEscolher: (escolha: string) => void;
  /**
   * A decisão que o jogador acabou de fazer, se a realidade ainda vai decidi-la e os palpites estão
   * abertos: a cena seguinte convida a cravar um palpite (notas/palpites.md, versão B do sketch).
   */
  convite?: AConfirmar;
}) {
  const [decidindo, setDecidindo] = useState<string | null>(null);
  const [cravando, setCravando] = useState(false);
  // Dois botões segurados ao mesmo tempo (dois dedos) disparam antes de o estado mudar: o ref barra o segundo.
  const decidindoRef = useRef<string | null>(null);

  const cap = capitulo(jogo, estado.capitulo);
  const atual = no(jogo, cap.id, estado.no);
  const opcoes = escolhasExibidas(atual, estado.marcas);
  const tipo = tipoDeCena(estado.no === cap.inicio, opcoes.length > 0, Boolean(atual.segue));
  const eco = tipo === 'consequencia' || tipo === 'final' ? ecoDaEscolha(jogo, estado.historico) : null;
  const textos = paragrafos(atual.texto, estado.marcas);
  // "Fatos e fontes": os fatos que valem para estas marcas e a leitura de cada lado.
  const fatos = atual.fatos?.filter((f) => vale(f.se, estado.marcas));
  const lados = atual.lados ? paragrafos(atual.lados, estado.marcas) : undefined;
  const chave = `${cap.id}/${atual.id}`;
  const lugar = atual.lugar && <p className="lugar">{atual.lugar}</p>;
  const linhaEco = eco && <p className="eco">Porque {eco}…</p>;
  // Fora dos cartões: a área de toque deles cobre a tela, e o convite precisa receber o clique.
  const palpite = convite && (
    <>
      <p className="convite-palpite">
        No jogo, você escolheu. Na vida real, isso se decide em {isoPorExtenso(convite.data)}.{' '}
        <button type="button" onClick={() => setCravando(true)}>
          Cravar meu palpite
        </button>
      </p>
      {cravando && <Cravar decisao={convite} onFechar={() => setCravando(false)} />}
    </>
  );

  if (tipo === 'abertura') {
    return (
      <main className="tela cena cena-abertura">
        {palpite}
        <Cartoes
          textos={textos}
          imagem={atual.imagem}
          fatos={fatos}
          lados={lados}
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
          <Acao primario onClick={onAvancar}>
            Começar o capítulo
          </Acao>
        </Cartoes>
        {sair}
      </main>
    );
  }

  if (tipo === 'consequencia') {
    return (
      <main className="tela cena cena-consequencia">
        <Cabecalho numero={cap.numero} titulo={cap.titulo} periodo={cap.periodo} />
        {palpite}
        <article className="despacho">
          <Cartoes textos={textos} imagem={atual.imagem} fatos={fatos} lados={lados} topo={<>{linhaEco}{lugar}</>}>
            <Acao onClick={onAvancar}>Seguir</Acao>
          </Cartoes>
        </article>
        {sair}
      </main>
    );
  }

  if (tipo === 'final') {
    return (
      <main className="tela cena cena-final">
        {palpite}
        <Cartoes
          textos={textos}
          imagem={atual.imagem}
          fatos={fatos}
          lados={lados}
          abertura={<p className="rotulo desfecho">Desfecho do capítulo {cap.numero}</p>}
          topo={<>{linhaEco}{lugar}</>}
        >
          <Acao primario onClick={onAvancar}>
            Fechar o capítulo
          </Acao>
        </Cartoes>
        {sair}
      </main>
    );
  }

  const primeiraLivre = opcoes.findIndex((o) => o.status !== 'travada');
  return (
    <main className="tela cena">
      <Cabecalho numero={cap.numero} titulo={cap.titulo} periodo={cap.periodo} />
      {palpite}
      <Cartoes textos={textos} imagem={atual.imagem} fatos={fatos} lados={lados} topo={lugar}>
        <AoAparecer acao={() => registrarNaTela('decisao_vista', jogo.versao, estado.capitulo, estado.no)} />
        <p className="pergunta">O que acontece agora?</p>
        <div className="escolhas">
          {opcoes.map(({ escolha: e, status }, i) => (
            <BotaoEscolha
              demonstrarEm={i === primeiraLivre ? estado.capitulo : undefined}
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
                setTimeout(() => onEscolher(e.id), PESO_MS);
              }}
            />
          ))}
        </div>
      </Cartoes>
      {sair}
    </main>
  );
}

type TipoCena = 'abertura' | 'decisao' | 'consequencia' | 'final';

function tipoDeCena(primeiro: boolean, temEscolha: boolean, segue: boolean): TipoCena {
  if (primeiro && !temEscolha) return 'abertura';
  if (temEscolha) return 'decisao';
  return segue ? 'consequencia' : 'final';
}

/** O rótulo da última escolha feita, pronto para "Porque …". */
function ecoDaEscolha(jogo: Jogo, historico: Passo[]): string | null {
  const ultimo = historico[historico.length - 1];
  if (!ultimo?.escolha) return null;
  const rotulo = no(jogo, ultimo.capitulo, ultimo.no).escolhas?.find((e) => e.id === ultimo.escolha)?.rotulo;
  if (!rotulo) return null;
  // "O relator…" vira "o relator…"; nomes próprios ficam como estão.
  return /^(O|A|Os|As) /.test(rotulo) ? rotulo[0].toLowerCase() + rotulo.slice(1) : rotulo;
}
