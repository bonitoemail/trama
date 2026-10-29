/**
 * Regra das fontes (CLAUDE.md, skill atualizar-jogo): um fato só entra com documento oficial ou com
 * pelo menos duas fontes independentes, de linhas editoriais diferentes. Aqui fica o que dá para
 * conferir por máquina: o oficial, a independência (veículos diferentes) e a Wikipédia fora. Se as
 * linhas editoriais são mesmo diferentes, quem confere é a pessoa (ou a rodada) que escreveu.
 */

/** Terminações de órgãos públicos: Executivo, Judiciário, Legislativo, Ministério Público, EUA. */
const OFICIAIS = ['.gov.br', '.jus.br', '.leg.br', '.mp.br', '.def.br', '.gov', '.mil'];

/** Sufixos de dois níveis: em "folha.uol.com.br" o veículo é "uol.com.br"; em "cnn.com", "cnn.com". */
const SUFIXOS_DUPLOS = ['com.br', 'org.br', 'net.br', 'gov.br', 'jus.br', 'leg.br', 'mp.br', 'blog.br', 'co.uk'];

export function dominio(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function ehOficial(url: string): boolean {
  const d = dominio(url);
  return OFICIAIS.some((s) => d.endsWith(s));
}

/** O veículo por trás do endereço: "noticias.uol.com.br" e "uol.com.br" contam como o mesmo. */
export function veiculo(url: string): string {
  const d = dominio(url);
  const partes = d.split('.');
  return partes.slice(SUFIXOS_DUPLOS.some((s) => d.endsWith(`.${s}`)) ? -3 : -2).join('.');
}

/** O que está errado com estas fontes, ou nada. */
export function problemasDasFontes(fontes: string[]): string[] {
  const problemas: string[] = [];
  if (fontes.some((f) => /wikipedia\.org/.test(dominio(f)))) problemas.push('a Wikipédia não conta como fonte');
  const validas = fontes.filter((f) => !/wikipedia\.org/.test(dominio(f)));
  if (validas.some(ehOficial)) return problemas;
  const veiculos = new Set(validas.map(veiculo));
  if (veiculos.size < 2) problemas.push('precisa de documento oficial ou de duas fontes de veículos diferentes');
  return problemas;
}
