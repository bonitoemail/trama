'use client';

import { useEffect, useState } from 'react';
import Inicio from './Inicio';
import Cena from './partida/Cena';
import Epilogo from './partida/Epilogo';
import FimDeCapitulo from './partida/FimDeCapitulo';
import { Sair, nomeDoCapitulo } from './partida/Pecas';
import { type Estado, capitulo, continuar, escolher, no, novoJogo } from '@/engine/engine';
import type { AConfirmar } from '@/engine/relogios';
import type { Jogo as JogoT } from '@/engine/schema';
import { useNavegacao } from '@/lib/navegacao';
import { guardarOrigem, registrarInicio, registrarMudanca, registrarNaTela } from '@/lib/registro';
import { apagarPartida, CHAVE_PALPITES, lerApostas, lerPartida, lerVistos, palpitesDe, salvarAposta, salvarPartida, salvarVistos } from '@/lib/storage';
import { useGuardado, useHoje } from '@/lib/noNavegador';
import { abertas } from '@/lib/palpites';
import { tituloDaTela, type Tela } from '@/lib/telas';

/**
 * A partida: carrega a salva, navega entre as telas, guarda cada passo e registra o que mudou.
 * As telas ficam em partida/ (Cena, FimDeCapitulo, Epilogo) e em Inicio (capa e explicações).
 */
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
  const hoje = useHoje();
  const palpites = palpitesDe(useGuardado(CHAVE_PALPITES));
  const [carregado, setCarregado] = useState(false);
  const [estado, setEstado] = useState<Estado | null>(null);
  const [vistos, setVistos] = useState<Set<string>>(new Set());
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
    // Carregar a partida salva é o caso em que o efeito sincroniza com um sistema de fora (o localStorage),
    // e acontece uma vez, depois de montar: sem isso, a página estática não hidrataria.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEstado(valida);
    setVistos(lerVistos());
    setCarregado(true);
    // /partida sem partida salva não tem o que mostrar: vira a capa.
    if (!valida && inicial === 'partida') corrigir('capa');
  }, [jogo, inicial, corrigir]);

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

  const sair = (
    <Sair
      onClick={() => {
        setSaiu(true);
        voltar();
      }}
    />
  );

  if (estado.fase === 'fim_jogo') {
    return <Epilogo jogo={jogo} estado={estado} caminhos={caminhos} onJogarDeNovo={comecar} onVoltar={voltar} />;
  }

  if (estado.fase === 'fim_capitulo') {
    return (
      <FimDeCapitulo
        jogo={jogo}
        estado={estado}
        caminhos={caminhos}
        sair={sair}
        onEscolhas={jogo.escolhas ? () => ir('escolhas') : undefined}
        onCompartilhado={() => registrarNaTela('compartilhar', jogo.versao, estado.capitulo, estado.no)}
        onSeguir={() => atualizar(continuar(jogo, estado))}
      />
    );
  }

  // Uma Cena por nó (key): o estado da decisão começa do zero a cada cena.
  const chave = `${estado.capitulo}/${estado.no}`;
  // A cena logo depois de uma decisão que a realidade ainda vai decidir convida a cravar um palpite,
  // se este aparelho ainda não cravou nela.
  const ultimo = estado.historico.at(-1);
  const convite =
    hoje && ultimo?.escolha && !palpites[`${ultimo.capitulo}/${ultimo.no}`]
      ? abertas(aConfirmar, hoje).find((d) => d.capitulo === ultimo.capitulo && d.no === ultimo.no)
      : undefined;
  return (
    <Cena
      key={chave}
      jogo={jogo}
      estado={estado}
      sair={sair}
      onAvancar={() => atualizar(escolher(jogo, estado, null), [chave])}
      onEscolher={(id) => atualizar(escolher(jogo, estado, id), [chave, `${chave}:${id}`])}
      convite={convite}
    />
  );
}
