'use client';

import { SITE_CURTO } from './site';

/**
 * O cartão de compartilhar do fim de capítulo, desenhado no navegador (1080×1920, formato de stories).
 * Desenho aprovado em estilo/sketches-compartilhar/cartao.html (versão A): a imagem do final, o quanto
 * o caminho é raro e o final. As fontes são as da capa (next/font), lidas das variáveis do CSS.
 */

export const LARGURA = 1080;
export const ALTURA = 1920;

const COR = { fundo: '#111314', texto: '#ece8df', texto2: '#9d9a93', linha: '#26292b', real: '#f29a2e' };
const MARGEM = 96;

/** Resposta de /api/raridade: porcentagens dos caminhos que fecharam o capítulo. */
export interface Raridade {
  maisComuns: number;
  maisRaros: number;
  total: number;
}

export interface DadosDoCartao {
  capitulo: string;
  final: string;
  imagem: string | null;
  raridade: Raridade | null;
}

/**
 * A frase do número. Quem fica na metade de cima é raro; quem fica embaixo não recebe um número fraco
 * ("mais raro que 28%"): a frase vira, e o cartão diz que é o Brasil da maioria.
 */
export function fraseDoNumero(r: Raridade): { numero: string; frase: string } {
  if (r.maisComuns >= r.maisRaros) {
    return { numero: `${r.maisComuns}%`, frase: 'dos jogadores fizeram escolhas mais comuns que as minhas.' };
  }
  return { numero: `${r.maisRaros}%`, frase: 'dos jogadores fizeram escolhas mais raras que as minhas. Meu Brasil é o da maioria.' };
}

function fonte(variavel: string, reserva: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(variavel).trim();
  return v || reserva;
}

function carregarImagem(src: string): Promise<HTMLImageElement | null> {
  return new Promise((ok) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => ok(null);
    img.src = src;
  });
}

/** Quebra o texto em linhas que cabem na largura. */
function linhas(ctx: CanvasRenderingContext2D, texto: string, largura: number): string[] {
  const out: string[] = [];
  let atual = '';
  for (const palavra of texto.split(/\s+/)) {
    const tentativa = atual ? `${atual} ${palavra}` : palavra;
    if (ctx.measureText(tentativa).width > largura && atual) {
      out.push(atual);
      atual = palavra;
    } else atual = tentativa;
  }
  if (atual) out.push(atual);
  return out;
}

/** Escreve um parágrafo a partir de `y` (topo da primeira linha) e devolve onde ele termina. */
function paragrafo(ctx: CanvasRenderingContext2D, texto: string, y: number, tamanho: number, alturaLinha: number): number {
  for (const l of linhas(ctx, texto, LARGURA - 2 * MARGEM)) {
    ctx.fillText(l, MARGEM, y + tamanho);
    y += alturaLinha;
  }
  return y;
}

export async function desenharCartao(d: DadosDoCartao): Promise<Blob | null> {
  const serif = fonte('--capa-serif', 'Georgia, serif');
  const sans = fonte('--capa-sans', 'system-ui, sans-serif');
  const titulo = fonte('--titulo', 'sans-serif');
  await Promise.all([
    document.fonts.load(`400 52px ${serif}`),
    document.fonts.load(`500 220px ${serif}`),
    document.fonts.load(`400 34px ${sans}`),
    document.fonts.load(`500 64px ${titulo}`, 'TRAMA'),
  ]).catch(() => {});

  const canvas = document.createElement('canvas');
  canvas.width = LARGURA;
  canvas.height = ALTURA;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.fillStyle = COR.fundo;
  ctx.fillRect(0, 0, LARGURA, ALTURA);

  // A imagem do final ocupa o topo, recortada como object-fit: cover.
  const altImagem = 760;
  const img = d.imagem ? await carregarImagem(`/${d.imagem}`) : null;
  if (img) {
    const escala = Math.max(LARGURA / img.width, altImagem / img.height);
    const w = img.width * escala;
    const h = img.height * escala;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, LARGURA, altImagem);
    ctx.clip();
    ctx.drawImage(img, (LARGURA - w) / 2, (altImagem - h) / 2, w, h);
    ctx.restore();
  }

  let y = (img ? altImagem : 160) + 88;
  ctx.fillStyle = COR.texto2;
  ctx.font = `400 34px ${sans}`;
  y = paragrafo(ctx, d.capitulo, y, 34, 48) + 40;

  if (d.raridade) {
    const { numero, frase } = fraseDoNumero(d.raridade);
    ctx.fillStyle = COR.texto;
    ctx.font = `500 220px ${serif}`;
    ctx.fillText(numero, MARGEM - 8, y + 180);
    y += 198 + 28;
    ctx.font = `400 52px ${serif}`;
    y = paragrafo(ctx, frase, y, 52, 68) + 56;
    ctx.fillStyle = COR.linha;
    ctx.fillRect(MARGEM, y, LARGURA - 2 * MARGEM, 2);
    y += 40;
  }

  ctx.fillStyle = COR.texto2;
  ctx.font = `400 34px ${sans}`;
  y = paragrafo(ctx, 'Meu Brasil terminou assim:', y, 34, 50) + 6;
  ctx.fillStyle = COR.texto;
  // Sem o número, o final é o assunto do cartão e cresce.
  const tamFinal = d.raridade ? 48 : 88;
  ctx.font = `500 ${tamFinal}px ${serif}`;
  paragrafo(ctx, d.final, y, tamFinal, tamFinal * 1.25);

  // Rodapé: a pergunta, o endereço e o título com a luz verde e amarela parada no meio.
  const base = ALTURA - 104;
  ctx.fillStyle = COR.texto;
  ctx.font = `400 44px ${serif}`;
  ctx.fillText('E o seu?', MARGEM, base - 58);
  ctx.fillStyle = COR.texto2;
  ctx.font = `400 36px ${sans}`;
  ctx.fillText(SITE_CURTO, MARGEM, base);

  marca(ctx, titulo, 64, 'direita', base);

  return paraPng(canvas);
}

/** O título TRAMA com a luz verde e amarela parada no meio, alinhado à margem esquerda ou direita. */
function marca(ctx: CanvasRenderingContext2D, titulo: string, tamanho: number, lado: 'esquerda' | 'direita', base: number) {
  ctx.font = `500 ${tamanho}px ${titulo}`;
  const letras = [...'TRAMA'];
  // O título da capa tem .04em entre as letras; o canvas não espaça, então cada letra vai no lugar.
  const espaco = tamanho * 0.04;
  const larguras = letras.map((c) => ctx.measureText(c).width);
  const total = larguras.reduce((a, b) => a + b, 0) + espaco * (letras.length - 1);
  const x0 = lado === 'direita' ? LARGURA - MARGEM - total : MARGEM;
  const luz = ctx.createLinearGradient(x0, 0, x0 + total, 0);
  luz.addColorStop(0, COR.texto);
  luz.addColorStop(0.3, COR.texto);
  luz.addColorStop(0.42, '#2fae5b');
  luz.addColorStop(0.5, '#f7d23e');
  luz.addColorStop(0.58, '#2fae5b');
  luz.addColorStop(0.7, COR.texto);
  luz.addColorStop(1, COR.texto);
  ctx.fillStyle = luz;
  let x = x0;
  letras.forEach((c, i) => {
    ctx.fillText(c, x, base);
    x += larguras[i] + espaco;
  });
}

function paraPng(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((ok) => canvas.toBlob((b) => ok(b), 'image/png'));
}

/** Uma decisão que a realidade decidiu, somada em /escolhas (só votos de antes da notícia). */
export interface DadosDoPlacar {
  titulo: string;
  total: number;
  opcoes: { rotulo: string; pct: number; real?: boolean }[];
}

/**
 * A frase do placar. Se a maioria acertou, o número é de quem acertou; se errou, a surpresa é o
 * assunto: quem acertou é minoria, e a frase diz quanto a maioria escolheu outra coisa.
 */
export function fraseDoPlacar(d: DadosDoPlacar): { numero: string; frase: string } {
  const pct = d.opcoes.find((o) => o.real)?.pct ?? 0;
  const topo = Math.max(...d.opcoes.map((o) => o.pct));
  if (pct >= topo) return { numero: `${pct}%`, frase: 'dos jogadores acertaram o que aconteceu.' };
  if (pct === 0) return { numero: '0%', frase: `dos jogadores escolheram o que aconteceu. ${topo}% escolheram outra coisa.` };
  return { numero: `${pct}%`, frase: `dos jogadores acertaram. ${topo}% escolheram outra coisa.` };
}

/** O post de stories do placar (sketch em estilo/sketches-3-11/placar.html). */
export async function desenharPlacar(d: DadosDoPlacar): Promise<Blob | null> {
  const serif = fonte('--capa-serif', 'Georgia, serif');
  const sans = fonte('--capa-sans', 'system-ui, sans-serif');
  const titulo = fonte('--titulo', 'sans-serif');
  await Promise.all([
    document.fonts.load(`400 50px ${serif}`),
    document.fonts.load(`500 260px ${serif}`),
    document.fonts.load(`400 36px ${sans}`),
    document.fonts.load(`500 72px ${titulo}`, 'TRAMA'),
  ]).catch(() => {});

  const canvas = document.createElement('canvas');
  canvas.width = LARGURA;
  canvas.height = ALTURA;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.fillStyle = COR.fundo;
  ctx.fillRect(0, 0, LARGURA, ALTURA);

  marca(ctx, titulo, 72, 'esquerda', 188);

  let y = 288;
  ctx.fillStyle = COR.texto2;
  ctx.font = `400 50px ${serif}`;
  y = paragrafo(ctx, `${d.titulo}: antes da notícia, ${d.total.toLocaleString('pt-BR')} jogadores do Trama escolheram.`, y, 50, 66) + 48;

  const { numero, frase } = fraseDoPlacar(d);
  ctx.fillStyle = COR.texto;
  ctx.font = `500 260px ${serif}`;
  ctx.fillText(numero, MARGEM - 10, y + 210);
  y += 264;
  ctx.font = `400 56px ${serif}`;
  y = paragrafo(ctx, frase, y, 56, 72) + 72;

  // As opções, com a que aconteceu em laranja.
  const larguraLinha = LARGURA - 2 * MARGEM;
  for (const o of d.opcoes) {
    ctx.fillStyle = COR.linha;
    ctx.fillRect(MARGEM, y, larguraLinha, 2);
    y += 28;
    ctx.font = `400 40px ${serif}`;
    ctx.fillStyle = o.real ? COR.texto : COR.texto2;
    const ls = linhas(ctx, o.rotulo, larguraLinha - 140);
    ls.forEach((l, i) => ctx.fillText(l, MARGEM, y + 40 + i * 52));
    ctx.font = `500 40px ${sans}`;
    ctx.textAlign = 'right';
    ctx.fillText(`${o.pct}%`, LARGURA - MARGEM, y + 40);
    ctx.textAlign = 'left';
    y += ls.length * 52;
    if (o.real) {
      ctx.fillStyle = COR.real;
      ctx.font = `400 30px ${sans}`;
      ctx.fillText('aconteceu', MARGEM, y + 34);
      y += 44;
    }
    y += 16;
    ctx.fillStyle = COR.linha;
    ctx.fillRect(MARGEM, y, larguraLinha, 8);
    ctx.fillStyle = o.real ? COR.real : '#3a3d3f';
    ctx.fillRect(MARGEM, y, (larguraLinha * o.pct) / 100, 8);
    y += 38;
  }

  const base = ALTURA - 104;
  ctx.fillStyle = COR.texto;
  ctx.font = `400 46px ${serif}`;
  ctx.fillText('O que vem depois, você decide.', MARGEM, base - 60);
  ctx.fillStyle = COR.texto2;
  ctx.font = `400 36px ${sans}`;
  ctx.fillText(SITE_CURTO, MARGEM, base);

  return paraPng(canvas);
}

/**
 * Abre o menu de compartilhar do celular com a imagem; sem ele (computador), baixa o arquivo.
 * Chame dentro do toque: o menu não abre depois de esperar rede ou desenho.
 * Resolve true quando a imagem saiu (compartilhada ou baixada).
 */
export function compartilharArquivo(arquivo: File, texto: string): Promise<boolean> {
  const pedido = { files: [arquivo], text: texto };
  if (navigator.canShare?.(pedido)) {
    return navigator.share(pedido).then(
      () => true,
      () => false, // Fechou o menu sem escolher.
    );
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(arquivo);
  a.download = arquivo.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
  return Promise.resolve(true);
}
