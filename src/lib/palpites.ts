import { isoPorExtenso } from '@/engine/calendario';
import { type AConfirmar, aConfirmar, type Relogio } from '@/engine/relogios';
import type { Jogo } from '@/engine/schema';
import { porcentagens } from './escolhas';

/**
 * Palpites (notas/palpites.md): o jogador crava o que acha que vai acontecer numa decisão que a
 * realidade ainda vai decidir, e recebe um código para ver o resultado, sem login. Funções puras:
 * a rota, o recibo e a capa usam as mesmas regras.
 */

/** O palpite como o banco devolve (o recibo nunca mostra o aparelho). */
export interface Palpite {
  capitulo: string;
  no: string;
  escolha: string;
  /** Hora do servidor, ISO. */
  criado_em: string;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export const CODIGO = /^[a-z0-9]{8}$/;

/**
 * As decisões em que dá para cravar hoje: as que um relógio com data vai decidir, ainda sem trava,
 * até o fim do dia anterior ao da notícia (a mesma régua do placar: só vale o que veio antes).
 */
export function abertas(lista: AConfirmar[], hoje: string): AConfirmar[] {
  return lista.filter((d) => hoje < d.data && d.escolhas.length > 1);
}

/** Corpo de POST /api/palpite validado contra o conteúdo e a data. O resto é descartado. */
export function validarPalpite(
  jogo: Jogo,
  relogios: Relogio[],
  hoje: string,
  corpo: unknown,
): { aparelho: string; capitulo: string; no: string; escolha: string } | null {
  if (!corpo || typeof corpo !== 'object') return null;
  const c = corpo as Record<string, unknown>;
  const texto = (v: unknown) => (typeof v === 'string' ? v : '');
  const aparelho = texto(c.aparelho);
  if (!UUID.test(aparelho)) return null;
  const decisao = abertas(aConfirmar(jogo, relogios), hoje).find((d) => d.capitulo === c.capitulo && d.no === c.no);
  const escolha = decisao?.escolhas.find((e) => e.id === c.escolha);
  return decisao && escolha ? { aparelho, capitulo: decisao.capitulo, no: decisao.no, escolha: escolha.id } : null;
}

/** Código do recibo: 8 letras e números minúsculos, aleatórios (36^8, uns 2,8 trilhões). */
export function novoCodigo(): string {
  const alfabeto = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  // 252 é o maior múltiplo de 36 abaixo de 256: sem viés de módulo, sorteando de novo o que passar.
  let out = '';
  for (const b of bytes) out += b < 252 ? alfabeto[b % 36] : alfabeto[crypto.getRandomValues(new Uint8Array(1))[0] % 36];
  return out;
}

export type Estado = 'aberto' | 'fechado' | 'acertou' | 'errou';

/** O que o recibo mostra: a pergunta, o palpite, quando a realidade decide e, depois, o resultado. */
export interface Situacao {
  titulo: string;
  minha: string;
  /** Dia da notícia (o relógio, ou a trava quando a realidade já decidiu). */
  data: string;
  estado: Estado;
  aconteceu?: string;
  fontes?: string[];
}

export function situacao(jogo: Jogo, relogios: Relogio[], p: Palpite, hoje: string): Situacao | null {
  const no = jogo.capitulos.find((c) => c.id === p.capitulo)?.nos.find((n) => n.id === p.no);
  const minha = no?.escolhas?.find((e) => e.id === p.escolha);
  if (!no || !minha) return null;
  const titulo = no.titulo ?? no.lugar ?? no.id;
  const real = no.escolhas?.find((e) => e.real);
  if (real?.real) {
    const acertou = real.rotulo === minha.rotulo;
    return { titulo, minha: minha.rotulo, data: real.real.data, estado: acertou ? 'acertou' : 'errou', aconteceu: real.rotulo, fontes: real.real.fontes };
  }
  const data = aConfirmar(jogo, relogios).find((d) => d.capitulo === p.capitulo && d.no === p.no)?.data;
  if (!data) return { titulo, minha: minha.rotulo, data: '', estado: 'fechado' };
  return { titulo, minha: minha.rotulo, data, estado: hoje < data ? 'aberto' : 'fechado' };
}

/** "31 de outubro, às 14h12", no horário de Brasília. */
export function horaDoPalpite(iso: string): string {
  const d = new Date(iso);
  const dia = d.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
  const [h, m] = d.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).split(':');
  return `${isoPorExtenso(dia)}, às ${Number(h)}h${m}`;
}

/**
 * O lembrete de calendário (.ics): um evento de dia inteiro no dia da notícia, com o link do recibo.
 * Abre no calendário do iPhone, do Android e do computador; nada passa por servidor nosso.
 */
export function calendario(s: Situacao, link: string, codigo: string): string {
  const dia = s.data.replaceAll('-', '');
  const seguinte = new Date(Date.parse(`${s.data}T12:00:00Z`) + 86_400_000).toISOString().slice(0, 10).replaceAll('-', '');
  const escapar = (t: string) => t.replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
  // A norma do .ics quebra linhas longas em 75 bytes, com um espaço no começo de cada continuação.
  const bytes = (t: string) => new TextEncoder().encode(t).length;
  const dobrar = (linha: string) => {
    const partes: string[] = [];
    let atual = '';
    for (const ch of linha) {
      if (bytes(atual + ch) > (partes.length ? 74 : 75)) {
        partes.push(atual);
        atual = '';
      }
      atual += ch;
    }
    return [...partes, atual].join('\r\n ');
  };
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Trama//Palpites//PT-BR',
    'BEGIN:VEVENT',
    `UID:palpite-${codigo}@tramabr.app`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')}`,
    `DTSTART;VALUE=DATE:${dia}`,
    `DTEND;VALUE=DATE:${seguinte}`,
    `SUMMARY:${escapar(`Trama: a realidade decide "${s.titulo}"`)}`,
    `DESCRIPTION:${escapar(`Seu palpite: ${s.minha}. Veja se acertou: ${link}`)}`,
    `URL:${link}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ]
    .map(dobrar)
    .join('\r\n');
}

/** Abaixo disso, o placar de palpites não mostra número. */
export const MINIMO_PALPITES = 30;

export interface PlacarDePalpites {
  total: number;
  opcoes: { rotulo: string; n: number; pct: number; real?: boolean }[];
}

/**
 * Quantos cravaram cada opção de uma decisão, contando só os palpites de antes de `ate` (o dia da
 * notícia), na ordem do roteiro. Só se mostra depois que os palpites fecham (nunca antes: influenciaria).
 */
export function placarDePalpites(
  jogo: Jogo,
  contagem: { capitulo: string; no: string; escolha: string; dia: string; n: number }[],
  capitulo: string,
  no: string,
  ate: string,
): PlacarDePalpites | null {
  const escolhas = jogo.capitulos.find((c) => c.id === capitulo)?.nos.find((n) => n.id === no)?.escolhas;
  if (!escolhas?.length) return null;
  // Um desfecho por rótulo: as variantes por marca somam juntas, e a que aconteceu marca o rótulo.
  const rotuloDe = new Map(escolhas.map((e) => [e.id, e.rotulo]));
  const real = escolhas.find((e) => e.real)?.rotulo;
  const itens = [...new Set(escolhas.map((e) => e.rotulo))].map((rotulo) => ({
    rotulo,
    n: contagem
      .filter((l) => l.capitulo === capitulo && l.no === no && rotuloDe.get(l.escolha) === rotulo && l.dia < ate)
      .reduce((s, l) => s + l.n, 0),
    ...(rotulo === real ? { real: true } : {}),
  }));
  const total = itens.reduce((s, i) => s + i.n, 0);
  return { total, opcoes: porcentagens(itens) };
}
