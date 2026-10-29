import type { Jogo, Marco } from './schema';

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** "28 de outubro de 2026, mais tarde" vira "2026-10-28"; formato fora do padrão vira null. */
export function isoDoFato(data: string): string | null {
  const m = data.match(/^(\d{1,2}) de ([a-zç]+) de (\d{4})/i);
  if (!m) return null;
  const mes = MESES.indexOf(m[2].toLowerCase());
  if (mes < 0) return null;
  return `${m[3]}-${String(mes + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

/** "28 de outubro de 2026, mais tarde" vira "28 out · mais tarde". */
export function dataCurta(data: string): string {
  const iso = isoDoFato(data);
  if (!iso) return data;
  const [, mes, dia] = iso.split('-').map(Number);
  const resto = data.split(',').slice(1).join(',').trim().replace(/^à /, '');
  return `${dia} ${CURTOS[mes - 1]}${resto ? ` · ${resto}` : ''}`;
}

/** "2027-01-05" vira "5 jan 2027". */
export function isoCurta(iso: string): string {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return `${dia} ${CURTOS[mes - 1]} ${ano}`;
}

/** Meses inteiros entre duas datas ISO, por extenso: "3 anos e 11 meses". */
export function falta(de: string, ate: string): string {
  const [a1, m1, d1] = de.split('-').map(Number);
  const [a2, m2, d2] = ate.split('-').map(Number);
  const meses = (a2 - a1) * 12 + (m2 - m1) - (d2 < d1 ? 1 : 0);
  const anos = Math.floor(meses / 12);
  const resto = meses % 12;
  const partes = [];
  if (anos) partes.push(`${anos} ${anos > 1 ? 'anos' : 'ano'}`);
  if (resto) partes.push(`${resto} ${resto > 1 ? 'meses' : 'mês'}`);
  return partes.join(' e ') || 'menos de um mês';
}

export interface Regua {
  /** Data ISO do último fato real: a parada "Agora". */
  agora: string;
  /** Marcos depois do último fato, em ordem; o último é o fim da régua. */
  marcos: Marco[];
}

/** A régua da capa: do último fato do prólogo até o último marco do calendário. */
export function regua(jogo: Jogo): Regua | null {
  const agora = isoDoFato(jogo.prologo[jogo.prologo.length - 1].data);
  if (!agora || !jogo.calendario) return null;
  const marcos = jogo.calendario.filter((m) => m.data > agora).sort((a, b) => a.data.localeCompare(b.data));
  return marcos.length ? { agora, marcos } : null;
}

/** "28 de outubro de 2026, mais tarde" vira "28 de outubro". */
export function diaEMes(data: string): string {
  return data.replace(/ de \d{4}.*$/, '');
}

/** "28 de outubro de 2026, à noite" vira "28 out". */
export function diaMesCurto(data: string): string {
  return dataCurta(data).split(' · ')[0];
}

/** "2026-11-03" vira "3 de novembro". */
export function isoPorExtenso(iso: string): string {
  const [, mes, dia] = iso.split('-').map(Number);
  return `${dia} de ${MESES[mes - 1]}`;
}
