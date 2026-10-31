import { describe, expect, it } from 'vitest';
import { carregarJogo } from '@/engine/load';
import { apostaDecidida } from './apostas';
import { fraseDoPlacar } from './cartao';

/** O jogo real, com a eleição americana travada em 3/11 (só no teste). */
function jogoComTrava(id: string) {
  const jogo = structuredClone(carregarJogo());
  const no = jogo.capitulos.find((c) => c.id === 'cap01')!.nos.find((n) => n.id === 'eleicao_eua')!;
  no.escolhas!.find((e) => e.id === id)!.real = { data: '2026-11-03', fontes: ['https://apnews.com/a', 'https://www.reuters.com/b'] };
  return jogo;
}

describe('apostaDecidida', () => {
  it('conta a aposta feita antes da notícia, acertando ou não', () => {
    const jogo = jogoComTrava('democratas');
    expect(apostaDecidida(jogo, { 'cap01/eleicao_eua': { escolha: 'democratas', dia: '2026-10-31' } }, '2026-11-04')).toMatchObject({
      chave: 'cap01/eleicao_eua',
      acertou: true,
      minha: 'Os democratas ganham a Câmara e o Senado',
    });
    expect(apostaDecidida(jogo, { 'cap01/eleicao_eua': { escolha: 'republicanos', dia: '2026-10-31' } }, '2026-11-04')).toMatchObject({
      acertou: false,
      aconteceu: 'Os democratas ganham a Câmara e o Senado',
    });
  });
  it('não conta quem escolheu no dia da notícia ou depois, nem passada uma semana', () => {
    const jogo = jogoComTrava('democratas');
    expect(apostaDecidida(jogo, { 'cap01/eleicao_eua': { escolha: 'democratas', dia: '2026-11-03' } }, '2026-11-04')).toBeNull();
    expect(apostaDecidida(jogo, { 'cap01/eleicao_eua': { escolha: 'democratas', dia: '2026-10-31' } }, '2026-11-11')).toBeNull();
    expect(apostaDecidida(carregarJogo(), { 'cap01/eleicao_eua': { escolha: 'democratas', dia: '2026-10-31' } }, '2026-11-04')).toBeNull();
  });
});

describe('fraseDoPlacar', () => {
  const opcoes = (real: number) =>
    [70, 20, 10].map((pct, i) => ({ rotulo: `op${i}`, pct, ...(i === real ? { real: true } : {}) }));
  it('a maioria acertou: o número é de quem acertou', () => {
    expect(fraseDoPlacar({ titulo: 't', total: 378, opcoes: opcoes(0) })).toEqual({ numero: '70%', frase: 'dos jogadores acertaram o que aconteceu.' });
  });
  it('a maioria errou: a frase diz onde ela apostou', () => {
    expect(fraseDoPlacar({ titulo: 't', total: 378, opcoes: opcoes(1) })).toEqual({ numero: '20%', frase: 'dos jogadores acertaram. 70% apostaram em outra coisa.' });
  });
});
