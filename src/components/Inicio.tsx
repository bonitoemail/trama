'use client';

import { useState } from 'react';
import Fatos from './Fatos';
import type { Jogo } from '@/engine/schema';

interface Props {
  jogo: Jogo;
  temPartida: boolean;
  onContinuar: () => void;
  onComecar: () => void;
}

/**
 * Tela inicial como primeira página de jornal: título, linha fina e "Como funciona" já abertos;
 * os fatos reais em seguida, como cobertura datada. As ações ficam sempre à mão: presas embaixo
 * no celular; no PC, na coluna da esquerda, que fica parada enquanto os fatos rolam à direita.
 */
export default function Inicio({ jogo, temPartida, onContinuar, onComecar }: Props) {
  const [confirmar, setConfirmar] = useState(false);
  const ap = jogo.apresentacao;

  return (
    <main className="inicio">
      <div className="inicio-coluna">
        <header className="inicio-cabeca">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="inicio-capa" src="/imagens/cap01/abertura.webp" alt="" />
          <p className="ficha">Ficção sobre o Brasil · out/2026 → 2030</p>
          <h1 className="marca">{jogo.titulo}</h1>
        </header>

        {ap && (
          <section className="como" aria-labelledby="como-titulo">
            <p className="lead">{ap.texto}</p>
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
          </section>
        )}

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
