'use client';

import { useCallback, useState } from 'react';
import Fatos from './Fatos';
import Metodo from './Metodo';
import type { Jogo } from '@/engine/schema';

interface Props {
  jogo: Jogo;
  partidas: number;
  temPartida: boolean;
  onContinuar: () => void;
  onComecar: () => void;
}

/**
 * Tela inicial como primeira página de jornal: título, linha fina e "Como funciona" já abertos;
 * os fatos reais em seguida, como cobertura datada. As ações ficam sempre à mão: presas embaixo
 * no celular; no PC, na coluna da esquerda, que fica parada enquanto os fatos rolam à direita.
 * O título fica sozinho no alto, centralizado, sobre as duas colunas no PC.
 */
export default function Inicio({ jogo, partidas, temPartida, onContinuar, onComecar }: Props) {
  const [confirmar, setConfirmar] = useState(false);
  const [pagina, setPagina] = useState<'metodo' | 'objetivo' | null>(null);
  const ap = jogo.apresentacao;
  const voltar = useCallback(() => setPagina(null), []);
  const contar = (t: string) => t.replaceAll('{partidas}', emMil(partidas));

  const acoes = (
    <div className="inicio-acoes">
      {confirmar ? (
        <>
          <p className="nota">A partida atual será perdida. As escolhas não voltam.</p>
          <Botao primario onClick={onComecar}>Começar do zero</Botao>
          <button type="button" className="link-acao" onClick={() => setConfirmar(false)}>
            Manter a partida atual
          </button>
        </>
      ) : temPartida ? (
        <>
          <Botao primario onClick={onContinuar}>Continuar partida</Botao>
          <button type="button" className="link-acao" onClick={() => setConfirmar(true)}>
            Começar uma nova partida
          </button>
        </>
      ) : (
        <Botao primario onClick={onComecar}>Começar</Botao>
      )}
    </div>
  );

  const explicacao = pagina === 'metodo' ? jogo.metodo : pagina === 'objetivo' ? jogo.objetivo : undefined;
  if (explicacao) {
    const comNumero = {
      ...explicacao,
      texto: contar(explicacao.texto),
      etapas: explicacao.etapas.map((e) => ({ titulo: contar(e.titulo), texto: contar(e.texto) })),
    };
    return (
      <main className="inicio pagina-metodo">
        <Metodo metodo={comNumero} numerada={pagina === 'metodo'} onVoltar={voltar} />
        {acoes}
      </main>
    );
  }

  return (
    <main className="inicio">
      <header className="inicio-cabeca">
        <h1 className="marca">{jogo.titulo}</h1>
        <p className="ficha">{jogo.apresentacao?.ficha ?? 'Ficção sobre o Brasil · 2026 → 2030'}</p>
      </header>

      <div className="inicio-coluna">
        {ap && (
          <section className="como" aria-labelledby="como-titulo">
            <p className="lead">{contar(ap.texto)}</p>
            {jogo.objetivo && (
              <button type="button" className="link-metodo link-objetivo" onClick={() => setPagina('objetivo')}>
                {jogo.objetivo.titulo} <span aria-hidden>→</span>
              </button>
            )}
            <h2 className="rotulo" id="como-titulo">
              Como funciona
            </h2>
            <ol className="passos">
              {ap.passos.map((p, i) => (
                <li key={i}>
                  <span className="num">{i + 1}</span>
                  <div>
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
            {jogo.metodo && (
              <button type="button" className="link-metodo" onClick={() => setPagina('metodo')}>
                {jogo.metodo.titulo} <span aria-hidden>→</span>
              </button>
            )}
          </section>
        )}

        {acoes}
      </div>

      <div className="inicio-fatos">
        <Fatos fatos={jogo.prologo} />
        <p className="aviso">{jogo.aviso}</p>
      </div>
    </main>
  );
}

function Botao({ children, onClick, primario = false }: { children: React.ReactNode; onClick: () => void; primario?: boolean }) {
  return (
    <button type="button" className={`botao ${primario ? 'primario' : ''}`} onClick={onClick}>
      <span>{children}</span>
      <span className="seta" aria-hidden>
        →
      </span>
    </button>
  );
}

/** 61440 vira "61 mil"; abaixo de mil, o número inteiro. Arredonda para baixo: o texto diz "mais de". */
function emMil(n: number): string {
  return n >= 1000 ? `${Math.floor(n / 1000).toLocaleString('pt-BR')} mil` : String(n);
}
