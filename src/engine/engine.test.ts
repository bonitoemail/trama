import { describe, expect, it } from 'vitest';
import { continuar, escolher, escolhasDisponiveis, no, novoJogo, paragrafos, vale } from './engine';
import { carregarJogo } from './load';
import { JogoSchema, type Jogo } from './schema';
import { validar } from './validate';

function jogoMinimo(over: Partial<Jogo> = {}): Jogo {
  return JogoSchema.parse({
    versao: 't',
    titulo: 'T',
    aviso: 'a',
    prologo: [{ data: 'd', texto: 'x' }],
    primeiro_capitulo: 'c1',
    epilogo: { id: 'e', titulo: 'E', texto: 'fim' },
    capitulos: [
      {
        id: 'c1',
        numero: 1,
        titulo: 'Um',
        periodo: 'p',
        inicio: 'a',
        nos: [
          { id: 'a', texto: 'A', escolhas: [
            { id: 'x', rotulo: 'X', marca: ['mx'], vai_para: 'b' },
            { id: 'y', rotulo: 'Y', marca: ['my'], vai_para: 'b' },
          ] },
          { id: 'b', texto: 'B', segue: 'c' },
          { id: 'c', texto: 'C', escolhas: [
            { id: 'so_x', rotulo: 'Só X', se: { tem: 'mx' } },
            { id: 'todos', rotulo: 'Todos' },
          ] },
        ],
        saidas: [{ para: 'c2', quando: { tem: 'mx' } }, { para: 'FIM' }],
      },
      {
        id: 'c2',
        numero: 2,
        titulo: 'Dois',
        periodo: 'p',
        inicio: 'z',
        nos: [{ id: 'z', texto: 'Z' }],
        saidas: [{ para: 'FIM' }],
      },
    ],
    ...over,
  });
}

describe('condições', () => {
  it('avalia tem, nao_tem, todas e qualquer', () => {
    const m = ['a', 'b'];
    expect(vale({ tem: 'a' }, m)).toBe(true);
    expect(vale({ nao_tem: 'a' }, m)).toBe(false);
    expect(vale({ todas: [{ tem: 'a' }, { tem: 'c' }] }, m)).toBe(false);
    expect(vale({ qualquer: [{ tem: 'c' }, { tem: 'b' }] }, m)).toBe(true);
    expect(vale(undefined, m)).toBe(true);
  });

  it('monta parágrafos condicionais com senao', () => {
    const t = ['Sempre.', { se: { tem: 'a' }, texto: 'Com A.' }, { se: { tem: 'z' }, texto: 'Com Z.', senao: 'Sem Z.' }];
    expect(paragrafos(t, ['a'])).toEqual(['Sempre.', 'Com A.', 'Sem Z.']);
  });
});

describe('motor', () => {
  it('percorre escolha, nó de texto, fim de capítulo e próximo capítulo', () => {
    const j = jogoMinimo();
    let s = novoJogo(j);
    s = escolher(j, s, 'x');
    expect(s.no).toBe('b');
    expect(s.marcas).toEqual(['mx']);
    s = escolher(j, s, null);
    expect(s.no).toBe('c');
    expect(escolhasDisponiveis(no(j, 'c1', 'c'), s.marcas).map((e) => e.id)).toEqual(['so_x', 'todos']);
    s = escolher(j, s, 'todos');
    expect(s.fase).toBe('fim_capitulo');
    expect(s.proximo).toBe('c2');
    s = continuar(j, s);
    expect(s).toMatchObject({ fase: 'jogando', capitulo: 'c2', no: 'z' });
    s = escolher(j, s, null);
    s = continuar(j, s);
    expect(s.fase).toBe('fim_jogo');
    expect(s.historico.map((p) => p.escolha)).toEqual(['x', null, 'todos', null]);
  });

  it('esconde escolha condicional e segue a saída padrão', () => {
    const j = jogoMinimo();
    let s = escolher(j, novoJogo(j), 'y');
    s = escolher(j, s, null);
    expect(escolhasDisponiveis(no(j, 'c1', 'c'), s.marcas).map((e) => e.id)).toEqual(['todos']);
    expect(() => escolher(j, s, 'so_x')).toThrow(/indisponível/);
    s = escolher(j, s, 'todos');
    expect(s.proximo).toBe('FIM');
  });

  it('não deixa pular um nó que exige escolha', () => {
    const j = jogoMinimo();
    expect(() => escolher(j, novoJogo(j), null)).toThrow(/exige uma escolha/);
  });
});

describe('validador', () => {
  it('aceita o jogo mínimo', () => {
    expect(validar(jogoMinimo()).erros).toEqual([]);
  });

  it('acha referência quebrada e marca nunca criada', () => {
    const j = jogoMinimo();
    j.capitulos[0].nos[1].segue = 'nao_existe';
    j.capitulos[0].saidas[0].quando = { tem: 'fantasma' };
    const { erros } = validar(j);
    expect(erros.some((e) => e.includes('nao_existe'))).toBe(true);
    expect(erros.some((e) => e.includes('fantasma'))).toBe(true);
  });

  it('acha beco sem saída e capítulo sem saída', () => {
    const j = jogoMinimo();
    j.capitulos[0].nos[2].escolhas = [
      { id: 'p', rotulo: 'P', se: { tem: 'mx' } },
      { id: 'q', rotulo: 'Q', se: { tem: 'mx' } },
    ];
    j.capitulos[0].saidas = [{ para: 'c2', quando: { tem: 'mx' } }];
    const { erros } = validar(j);
    expect(erros.some((e) => e.includes('beco sem saída'))).toBe(true);
  });

  it('o conteúdo real em content/ é válido', () => {
    const { erros } = validar(carregarJogo());
    expect(erros).toEqual([]);
  });
});
