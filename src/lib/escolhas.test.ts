import { describe, expect, it } from 'vitest';
import { carregarJogo } from '@/engine/load';
import type { Jogo } from '@/engine/schema';
import { MINIMO, montarPainel, type Contagem } from './escolhas';

const jogo = carregarJogo();
const esc = (no: string, escolha: string, n: number, dia = '2026-10-30', capitulo = 'cap01'): Contagem => ({ tipo: 'escolha', capitulo, no, escolha, dia, n });
const fim = (no: string, n: number, capitulo = 'cap01'): Contagem => ({ tipo: 'fim_capitulo', capitulo, no, escolha: '', dia: '2026-10-30', n });
const base = { hoje: '2026-10-30', agora: '2026-10-30T16:00:00Z' };

describe('tela /escolhas', () => {
  it('só mostra decisão com o mínimo de escolhas', () => {
    const p = montarPainel(jogo, [esc('pedido', 'preventiva', 20), esc('pedido', 'espera', 19)], base);
    expect(MINIMO).toBe(50);
    expect([...p.divididas, ...p.maioria]).toEqual([]);
  });

  it('separa divididas, maioria e raras pela mesma regra', () => {
    const linhas = [
      { tipo: 'partidas', capitulo: '', no: '', escolha: '', dia: null, n: 400 } as Contagem,
      esc('pedido', 'preventiva', 50), esc('pedido', 'espera', 48), esc('pedido', 'pgr', 2),
      esc('o_exilio', 'asilo', 80), esc('o_exilio', 'voz', 10), esc('o_exilio', 'governo', 6), esc('o_exilio', 'discreto', 4),
    ];
    const p = montarPainel(jogo, linhas, base);
    expect(p.partidas).toBe(400);
    expect(p.divididas.map((d) => d.no)).toEqual(['pedido', 'o_exilio']);
    expect(p.divididas[0]).toMatchObject({ titulo: 'O pedido de prisão de Flávio', total: 100 });
    // A escolha sem voto aparece com 0%, e a menos escolhida vira rara.
    expect(p.divididas[0].opcoes.map((o) => o.pct)).toEqual([50, 48, 2, 0]);
    expect(p.raras[0]).toMatchObject({ rotulo: 'Moraes não prende, mas bloqueia parte dos bens', pct: 0 });
    // o_exilio já entrou nas divididas: não repete na maioria.
    expect(p.maioria).toEqual([]);
  });

  it('põe em "antes da notícia" a cena que um relógio futuro vai decidir', () => {
    const linhas = [esc('eleicao_eua', 'democratas', 70, '2026-10-29'), esc('eleicao_eua', 'dividido', 30, '2026-10-29')];
    const relogios = [{ data: '2026-11-03', afeta: ['cap01/eleicao_eua'], status: 'pendente' }];
    expect(montarPainel(jogo, linhas, { ...base, relogios }).antes[0]).toMatchObject({ no: 'eleicao_eua', data: '2026-11-03' });
    // A notícia saiu e ninguém travou ainda: fica em "antes", sem os votos de quem já sabe o resultado.
    const depois = [...linhas, esc('eleicao_eua', 'republicanos', 300, '2026-11-03'), esc('eleicao_eua', 'republicanos', 300, '2026-11-04')];
    const [d] = montarPainel(jogo, depois, { ...base, hoje: '2026-11-04', relogios }).antes;
    expect(d).toMatchObject({ no: 'eleicao_eua', total: 100, aguardando: true });
    expect(montarPainel(jogo, depois, { ...base, hoje: '2026-11-04', relogios }).divididas.map((x) => x.no)).not.toContain('eleicao_eua');
    // Relógio conferido ("aconteceu") e sem trava: volta a ser uma decisão comum.
    expect(montarPainel(jogo, linhas, { ...base, relogios: [{ ...relogios[0], status: 'aconteceu' }] }).antes).toEqual([]);
  });

  it('no placar, conta só as escolhas feitas antes de a realidade decidir', () => {
    const travado: Jogo = structuredClone(jogo);
    const no = travado.capitulos[0].nos.find((n) => n.id === 'eleicao_eua')!;
    no.escolhas!.find((e) => e.id === 'democratas')!.real = { data: '2026-11-04', fontes: ['https://a.gov', 'https://b.gov'] };
    const linhas = [esc('eleicao_eua', 'democratas', 40, '2026-11-01'), esc('eleicao_eua', 'dividido', 20, '2026-11-01'), esc('eleicao_eua', 'democratas', 500, '2026-11-05')];
    const [d] = montarPainel(travado, linhas, base).placar;
    expect(d).toMatchObject({ no: 'eleicao_eua', total: 60, data: '2026-11-04' });
    expect(d.opcoes[0]).toMatchObject({ rotulo: 'Os democratas ganham a Câmara e o Senado', pct: 67, real: true });
  });

  it('mostra os finais pelo título, e o cruzamento só com os dois grupos no mínimo', () => {
    const linhas = [fim('a_ligacao', 60), fim('o_racha', 40)];
    const [f] = montarPainel(jogo, linhas, base).finais;
    expect(f.itens).toEqual([
      { rotulo: 'Valdemar liga para Alcolumbre', n: 60, pct: 60 },
      { rotulo: 'O PL chega dividido a fevereiro', n: 40, pct: 40 },
    ]);
    const cruzadas = [[
      { escolha_a: 'preventiva', escolha_b: 'democratas', n: 33 }, { escolha_a: 'preventiva', escolha_b: 'dividido', n: 17 },
      { escolha_a: 'espera', escolha_b: 'democratas', n: 35 }, { escolha_a: 'pgr', escolha_b: 'republicanos', n: 15 },
    ]];
    expect(montarPainel(jogo, [], { ...base, cruzadas }).cruzados[0].linhas.map((l) => l.pct)).toEqual([66, 70]);
    expect(montarPainel(jogo, [], { ...base, cruzadas: [cruzadas[0].slice(0, 3)] }).cruzados).toEqual([]);
  });

  it('dá a porcentagem de cada escolha para o fim de capítulo, com a data do relógio', () => {
    const linhas = [esc('pedido', 'preventiva', 36), esc('pedido', 'espera', 24), esc('eleicao_eua', 'democratas', 68), esc('eleicao_eua', 'dividido', 32), esc('o_exilio', 'asilo', 10)];
    const relogios = [{ data: '2026-11-03', afeta: ['cap01/eleicao_eua'], status: 'pendente' }];
    const { porDecisao } = montarPainel(jogo, linhas, { ...base, relogios });
    expect(porDecisao['cap01/pedido'].pct['Moraes manda prender Flávio']).toBe(60);
    expect(porDecisao['cap01/eleicao_eua']).toMatchObject({ total: 100, decide: '2026-11-03' });
    // Abaixo do mínimo, nada: o fim de capítulo não mostra número.
    expect(porDecisao['cap01/o_exilio']).toBeUndefined();
  });
});
