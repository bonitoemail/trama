import type { Estado } from '@/engine/engine';
import type { Jogo } from '@/engine/schema';

/**
 * Registro anônimo das partidas: começou, escolheu, fechou capítulo, abriu o seguinte, chegou ao fim.
 * Sem login, sem nome, sem IP: a partida é um id aleatório guardado no navegador.
 * Enviar nunca trava nem interrompe o jogo; se falhar, a partida segue.
 */

export type TipoEvento = 'inicio' | 'escolha' | 'fim_capitulo' | 'inicio_capitulo' | 'fim_jogo';

export interface Evento {
  partida: string;
  tipo: TipoEvento;
  versao: string;
  origem?: string;
  capitulo?: string;
  no?: string;
  escolha?: string;
}

type Mudanca = Omit<Evento, 'partida' | 'versao' | 'origem'>;

/** O que aconteceu entre dois estados da partida: a escolha feita, o capítulo fechado, o fim. */
export function eventosDaMudanca(antes: Estado | null, depois: Estado): Mudanca[] {
  const out: Mudanca[] = [];
  const passos = antes ? depois.historico.slice(antes.historico.length) : [];
  for (const p of passos) {
    if (p.escolha) out.push({ tipo: 'escolha', capitulo: p.capitulo, no: p.no, escolha: p.escolha });
  }
  if (depois.fase === 'fim_capitulo' && antes?.fase !== 'fim_capitulo') {
    out.push({ tipo: 'fim_capitulo', capitulo: depois.capitulo, no: depois.no });
  }
  // Tocou em "Próximo capítulo": separa quem parou na tela de fim de quem parou na abertura seguinte.
  if (depois.fase === 'jogando' && antes?.fase === 'fim_capitulo') {
    out.push({ tipo: 'inicio_capitulo', capitulo: depois.capitulo, no: depois.no });
  }
  if (depois.fase === 'fim_jogo' && antes?.fase !== 'fim_jogo') out.push({ tipo: 'fim_jogo' });
  return out;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const ORIGEM = /^[a-z0-9-]{1,40}$/;

/** "Instagram Bio" vira "instagram-bio"; o que não couber no formato vira null. */
export function limparOrigem(bruta: string | null | undefined): string | null {
  const o = (bruta ?? '').trim().toLowerCase().replace(/[\s_]+/g, '-');
  return ORIGEM.test(o) ? o : null;
}

/**
 * No servidor: aceita só evento que bate com o conteúdo publicado (capítulo, cena e escolha
 * existem). O resto é descartado em silêncio.
 */
export function validarEvento(jogo: Jogo, corpo: unknown): Evento | null {
  if (!corpo || typeof corpo !== 'object') return null;
  const e = corpo as Record<string, unknown>;
  const texto = (v: unknown) => (typeof v === 'string' ? v : undefined);
  const partida = texto(e.partida);
  const tipo = texto(e.tipo) as TipoEvento | undefined;
  if (!partida || !UUID.test(partida)) return null;
  if (texto(e.versao) !== jogo.versao) return null;

  const base: Evento = { partida, tipo: tipo!, versao: jogo.versao, origem: limparOrigem(texto(e.origem)) ?? 'direto' };
  if (tipo === 'inicio' || tipo === 'fim_jogo') return base;

  const cap = jogo.capitulos.find((c) => c.id === e.capitulo);
  const cena = cap?.nos.find((n) => n.id === e.no);
  if (!cap || !cena) return null;
  if (tipo === 'fim_capitulo') return { ...base, capitulo: cap.id, no: cena.id };
  if (tipo === 'inicio_capitulo') return cena.id === cap.inicio ? { ...base, capitulo: cap.id, no: cena.id } : null;
  if (tipo === 'escolha') {
    const escolha = cena.escolhas?.find((x) => x.id === e.escolha);
    return escolha ? { ...base, capitulo: cap.id, no: cena.id, escolha: escolha.id } : null;
  }
  return null;
}

// ——— no navegador ———

const CHAVE_PARTIDA = 'trama:registro:partida';
const CHAVE_ORIGEM = 'trama:registro:origem';

/** Guarda de onde a pessoa veio (?origem= ou utm_source) e limpa o endereço, para o link compartilhado não levar a origem junto. */
export function guardarOrigem() {
  try {
    const url = new URL(window.location.href);
    const origem = limparOrigem(url.searchParams.get('origem') ?? url.searchParams.get('utm_source'));
    if (origem && !localStorage.getItem(CHAVE_ORIGEM)) localStorage.setItem(CHAVE_ORIGEM, origem);
    if (url.searchParams.has('origem') || url.searchParams.has('utm_source')) {
      ['origem', 'utm_source', 'utm_medium', 'utm_campaign'].forEach((p) => url.searchParams.delete(p));
      history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    }
  } catch {}
}

function idDaPartida(nova: boolean): string {
  try {
    let id = nova ? null : localStorage.getItem(CHAVE_PARTIDA);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(CHAVE_PARTIDA, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function enviar(evento: Evento) {
  try {
    fetch('/api/evento', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(evento),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

function origemGuardada(): string | undefined {
  try {
    return localStorage.getItem(CHAVE_ORIGEM) ?? undefined;
  } catch {
    return undefined;
  }
}

/** Partida nova: id novo e o evento de início. */
export function registrarInicio(versao: string) {
  enviar({ partida: idDaPartida(true), tipo: 'inicio', versao, origem: origemGuardada() });
}

/** Cada passo da partida: manda o que mudou entre o estado antigo e o novo. */
export function registrarMudanca(antes: Estado | null, depois: Estado) {
  const mudancas = eventosDaMudanca(antes, depois);
  if (!mudancas.length) return;
  const partida = idDaPartida(false);
  const origem = origemGuardada();
  mudancas.forEach((m) => enviar({ ...m, partida, versao: depois.versao, origem }));
}
