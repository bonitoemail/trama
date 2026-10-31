import { ImageResponse } from 'next/og';
import { agoraDaCapa } from '@/engine/calendario';
import { carregarJogo } from '@/engine/load';
import { painelDoServidor } from '@/lib/painelServidor';
import type { Tela } from '@/lib/telas';

/**
 * A imagem de prévia de cada tela (WhatsApp, X, Instagram, Telegram), 1200×630. Sem ela o link chegava
 * mudo (relatório de tração de 31/10). Linguagem da capa: TRAMA com a luz parada, serifa para ler,
 * sans para o resto, sem pessoa real. A de /escolhas mostra o placar quando a realidade decidiu uma aposta.
 * GET /api/og?tela=capa|objetivo|metodo|acertos|escolhas
 */

const COR = { fundo: '#111314', texto: '#ece8df', texto2: '#9d9a93', linha: '#26292b', real: '#f29a2e' };

/** A fonte do Google em TTF, só com as letras do texto (o Google devolve TTF para um navegador antigo). */
async function fonte(familia: string, peso: number, texto: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${familia.replace(/ /g, '+')}:wght@${peso}&text=${encodeURIComponent(texto)}`,
      { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 6.1)' } },
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

interface Conteudo {
  rotulo: string;
  manchete: string;
  /** Destaque em laranja no começo da manchete (o número do placar). */
  numero?: string;
  pe: string;
}

async function conteudo(tela: Tela): Promise<Conteudo> {
  const jogo = carregarJogo();
  if (tela === 'objetivo' && jogo.objetivo) return { rotulo: jogo.objetivo.titulo, manchete: jogo.objetivo.texto, pe: 'Simulação preditiva do Brasil até 2030' };
  if (tela === 'metodo' && jogo.metodo) return { rotulo: jogo.metodo.titulo, manchete: jogo.metodo.texto, pe: 'Fontes, prompts e código públicos' };
  if (tela === 'acertos' && jogo.acertos) {
    const sim = jogo.acertos.itens.filter((i) => i.status === 'confirmou').length;
    const nao = jogo.acertos.itens.length - sim;
    return {
      rotulo: jogo.acertos.titulo,
      manchete: 'O que as cenas escreveram antes, e o que a realidade fez depois.',
      pe: `${sim} ${sim === 1 ? 'se confirmou' : 'se confirmaram'}, ${nao} não`,
    };
  }
  if (tela === 'escolhas' && jogo.escolhas) {
    const painel = await painelDoServidor();
    const decidida = painel?.placar[0];
    const real = decidida?.opcoes.find((o) => o.real);
    if (decidida && real) {
      return {
        rotulo: 'A realidade decidiu',
        numero: `${real.pct}%`,
        manchete: `dos jogadores do Trama acertaram a aposta “${decidida.titulo}”.`,
        pe: 'Só escolhas feitas antes da notícia. Não é pesquisa de opinião.',
      };
    }
    return {
      rotulo: jogo.escolhas.titulo,
      manchete: 'Onde os jogadores concordam, onde se dividem e o que apostam antes de a realidade decidir.',
      pe: painel ? `${painel.partidas.toLocaleString('pt-BR')} histórias. Não é pesquisa de opinião.` : 'Não é pesquisa de opinião.',
    };
  }
  const { agora } = agoraDaCapa(jogo.prologo);
  return {
    rotulo: jogo.apresentacao?.ficha ?? 'Simulação preditiva do Brasil até 2030',
    manchete: 'O que acontece com o Brasil depois da última notícia? Você decide.',
    pe: `Agora: ${agora.titulo ?? agora.texto}`,
  };
}

export async function GET(req: Request) {
  const tela = (new URL(req.url).searchParams.get('tela') ?? 'capa') as Tela;
  const c = await conteudo(tela);
  const textoSerif = `${c.numero ?? ''}${c.manchete}`;
  const [serif, sans, titulo] = await Promise.all([
    fonte('Source Serif 4', 500, textoSerif),
    fonte('IBM Plex Sans', 400, `${c.rotulo}${c.pe}tramabr.app`),
    fonte('Unbounded', 500, 'TRAMA'),
  ]);
  const fontes = [
    serif && { name: 'Serif', data: serif, weight: 500 as const },
    sans && { name: 'Sans', data: sans, weight: 400 as const },
    titulo && { name: 'Titulo', data: titulo, weight: 500 as const },
  ].filter((f): f is NonNullable<typeof f> => Boolean(f));

  const tamanho = textoSerif.length > 110 ? 50 : textoSerif.length > 70 ? 58 : 66;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: COR.fundo, padding: '72px 88px', fontFamily: 'Sans' }}>
        <div
          style={{
            display: 'flex',
            // Do tamanho do texto: com a largura toda, a luz caía fora das letras.
            alignSelf: 'flex-start',
            fontFamily: 'Titulo',
            fontSize: 58,
            letterSpacing: 2,
            color: 'transparent',
            backgroundImage: `linear-gradient(105deg, ${COR.texto} 0%, ${COR.texto} 30%, #2fae5b 42%, #f7d23e 50%, #2fae5b 58%, ${COR.texto} 70%, ${COR.texto} 100%)`,
            backgroundClip: 'text',
          }}
        >
          TRAMA
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
          <div style={{ fontSize: 28, color: COR.texto2, marginBottom: 20 }}>{c.rotulo}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', fontFamily: 'Serif', fontSize: tamanho, lineHeight: 1.18, color: COR.texto }}>
            {c.numero && <span style={{ color: COR.real, marginRight: 16 }}>{c.numero}</span>}
            <span>{c.manchete}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48, paddingTop: 24, borderTop: `2px solid ${COR.linha}`, fontSize: 26, color: COR.texto2 }}>
          <span style={{ maxWidth: 820 }}>{c.pe}</span>
          <span>tramabr.app</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontes,
      headers: { 'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    },
  );
}
