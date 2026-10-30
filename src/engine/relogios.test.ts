import { describe, expect, it } from 'vitest';
import { carregarJogo } from './load';
import { aConfirmar } from './relogios';
import type { Jogo } from './schema';

const jogo = carregarJogo();

describe('a confirmar (tela /acertos)', () => {
  it('uma linha por decisão, pela data mais próxima, sem relógio conferido nem cena sem escolha', () => {
    const lista = aConfirmar(jogo, [
      { data: '2027-02-01', afeta: ['cap02/a_mesa', 'cap03/abertura'], status: 'pendente' },
      { data: '2026-11-04', afeta: ['cap02/a_mesa'], status: 'pendente' },
      { data: '2026-11-03', afeta: ['cap01/eleicao_eua:democratas'], status: 'pendente' },
      { data: '2026-11-01', afeta: ['cap01/pl'], status: 'aconteceu' },
      { afeta: ['cap01/pedido'], status: 'pendente' },
    ]);
    expect(lista.map((d) => [d.no, d.data])).toEqual([
      ['eleicao_eua', '2026-11-03'],
      ['a_mesa', '2026-11-04'],
    ]);
    expect(lista[0]).toMatchObject({ titulo: 'A eleição nos Estados Unidos', numero: 1 });
  });

  it('decisão travada pela realidade sai da lista', () => {
    const j: Jogo = structuredClone(jogo);
    j.capitulos[0].nos.find((n) => n.id === 'eleicao_eua')!.escolhas![0].real = { data: '2026-11-04', fontes: ['https://a.gov', 'https://b.gov'] };
    expect(aConfirmar(j, [{ data: '2026-11-03', afeta: ['cap01/eleicao_eua'], status: 'pendente' }])).toEqual([]);
  });
});
