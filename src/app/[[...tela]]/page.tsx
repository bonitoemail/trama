import type { Metadata } from 'next';
import Jogo from '@/components/Jogo';
import { contarCaminhos, contarPartidas } from '@/engine/historia';
import { carregarJogo, carregarRelogios } from '@/engine/load';
import { aConfirmar } from '@/engine/relogios';
import { validar } from '@/engine/validate';
import { CAMINHOS, telaDoCaminho, tituloDaTela, type Tela } from '@/lib/telas';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = Promise<{ tela?: string[] }>;

/** Um endereço por tela; todas renderizam o mesmo jogo, que só muda o que mostra. */
export function generateStaticParams() {
  return Object.values(CAMINHOS).map((c) => ({ tela: c === '/' ? [] : c.slice(1).split('/') }));
}

async function telaDe(params: Params): Promise<Tela> {
  const { tela } = await params;
  return telaDoCaminho(`/${(tela ?? []).join('/')}`);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const jogo = carregarJogo();
  const tela = await telaDe(params);
  const titulo = tituloDaTela(jogo, tela);
  return titulo ? { title: `${titulo} · ${jogo.titulo}` } : {};
}

export default async function Page({ params }: { params: Params }) {
  const jogo = carregarJogo();
  const { erros } = validar(jogo);

  // Conteúdo quebrado nunca chega ao jogador: em dev aparece a lista, no build falha.
  if (erros.length) {
    if (process.env.NODE_ENV === 'production') throw new Error(`Conteúdo inválido:\n${erros.join('\n')}`);
    return (
      <main className="erros">
        <h1>Conteúdo com erro</h1>
        <ul>{erros.map((e) => <li key={e}>{e}</li>)}</ul>
      </main>
    );
  }

  return (
    <Jogo
      jogo={jogo}
      caminhos={contarCaminhos(jogo)}
      partidas={contarPartidas(jogo)}
      aConfirmar={aConfirmar(jogo, carregarRelogios())}
      inicial={await telaDe(params)}
    />
  );
}
