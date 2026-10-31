'use client';

/**
 * O cartão de compartilhar do fim de capítulo, desenhado no navegador (1080×1920, formato de stories).
 * Desenho aprovado em estilo/sketches-compartilhar/cartao.html (versão A): a imagem do final, o quanto
 * o caminho é raro e o final. As fontes são as da capa (next/font), lidas das variáveis do CSS.
 */

export const LARGURA = 1080;
export const ALTURA = 1920;

const COR = { fundo: '#111314', texto: '#ece8df', texto2: '#9d9a93', linha: '#26292b' };
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
  ctx.fillText('tramabr.app', MARGEM, base);

  ctx.font = `500 64px ${titulo}`;
  const marca = 'TRAMA';
  // O título da capa tem .04em entre as letras; o canvas não espaça, então cada letra vai no lugar.
  const espaco = 64 * 0.04;
  const larguras = [...marca].map((c) => ctx.measureText(c).width);
  const total = larguras.reduce((a, b) => a + b, 0) + espaco * (marca.length - 1);
  const x0 = LARGURA - MARGEM - total;
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
  [...marca].forEach((c, i) => {
    ctx.fillText(c, x, base);
    x += larguras[i] + espaco;
  });

  return new Promise((ok) => canvas.toBlob((b) => ok(b), 'image/png'));
}
