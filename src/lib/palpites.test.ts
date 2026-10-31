import { describe, expect, it } from 'vitest';
import { carregarJogo } from '@/engine/load';
import { aConfirmar, type Relogio } from '@/engine/relogios';
import { abertas, calendario, CODIGO, horaDoPalpite, novoCodigo, situacao, validarPalpite } from './palpites';

const jogo = carregarJogo();
const midterms: Relogio = { id: 'midterms-2026', data: '2026-11-03', afeta: ['cap01/eleicao_eua'], status: 'pendente' };
const aparelho = '3f2b6c1e-8a4d-4f7e-9b1c-2d5e6f7a8b9c';
const corpo = { aparelho, capitulo: 'cap01', no: 'eleicao_eua', escolha: 'democratas' };
const CRLF = String.fromCharCode(13, 10);

function travado(id: string) {
  const j = structuredClone(jogo);
  j.capitulos.find((c) => c.id === 'cap01')!.nos.find((n) => n.id === 'eleicao_eua')!.escolhas!.find((e) => e.id === id)!.real = {
    data: '2026-11-03',
    fontes: ['https://apnews.com/a', 'https://www.reuters.com/b'],
  };
  return j;
}

describe('palpites', () => {
  it('abre só até o fim do dia anterior ao da notícia', () => {
    const lista = aConfirmar(jogo, [midterms]);
    expect(abertas(lista, '2026-11-02').map((d) => d.no)).toEqual(['eleicao_eua']);
    expect(abertas(lista, '2026-11-03')).toEqual([]);
  });

  it('aceita só decisão aberta, escolha existente e aparelho no formato', () => {
    expect(validarPalpite(jogo, [midterms], '2026-11-01', corpo)).toEqual({ aparelho, capitulo: 'cap01', no: 'eleicao_eua', escolha: 'democratas' });
    expect(validarPalpite(jogo, [midterms], '2026-11-03', corpo)).toBeNull();
    expect(validarPalpite(jogo, [midterms], '2026-11-01', { ...corpo, escolha: 'inventada' })).toBeNull();
    expect(validarPalpite(jogo, [midterms], '2026-11-01', { ...corpo, aparelho: 'x' })).toBeNull();
    expect(validarPalpite(jogo, [midterms], '2026-11-01', { ...corpo, no: 'pedido' })).toBeNull();
    expect(validarPalpite(travado('democratas'), [midterms], '2026-11-01', corpo)).toBeNull();
  });

  it('o recibo espera, fecha no dia e mostra o resultado depois da trava', () => {
    const p = { capitulo: 'cap01', no: 'eleicao_eua', escolha: 'democratas', criado_em: '2026-10-31T17:12:00Z' };
    expect(situacao(jogo, [midterms], p, '2026-11-01')).toMatchObject({ estado: 'aberto', data: '2026-11-03', minha: 'Os democratas ganham a Câmara e o Senado' });
    expect(situacao(jogo, [midterms], p, '2026-11-04')).toMatchObject({ estado: 'fechado' });
    expect(situacao(travado('democratas'), [], p, '2026-11-04')).toMatchObject({ estado: 'acertou' });
    expect(situacao(travado('republicanos'), [], p, '2026-11-04')).toMatchObject({ estado: 'errou', aconteceu: 'Os republicanos, partido de Trump, mantêm a Câmara' });
  });

  it('código, hora e calendário', () => {
    for (let i = 0; i < 50; i++) expect(novoCodigo()).toMatch(CODIGO);
    expect(horaDoPalpite('2026-10-31T17:12:00Z')).toBe('31 de outubro, às 14h12');
    const s = situacao(jogo, [midterms], { capitulo: 'cap01', no: 'eleicao_eua', escolha: 'democratas', criado_em: '' }, '2026-11-01')!;
    const ics = calendario(s, 'https://tramabr.app/palpite/abcd1234', 'abcd1234');
    expect(ics).toContain('DTSTART;VALUE=DATE:20261103');
    expect(ics).toContain('DTEND;VALUE=DATE:20261104');
    expect(ics.split(CRLF + ' ').join('')).toContain('https://tramabr.app/palpite/abcd1234');
    // Nenhuma linha passa de 75 bytes (a norma do .ics).
    for (const l of ics.split(CRLF)) expect(new TextEncoder().encode(l).length).toBeLessThanOrEqual(75);
  });

  it('oferece cada desfecho uma vez, inclusive os que só alguns jogadores veem', () => {
    const conta: Relogio = { id: 'x', data: '2026-12-10', afeta: ['cap02/a_conta'], status: 'pendente' };
    const d = aConfirmar(jogo, [conta]).find((x) => x.no === 'a_conta')!;
    expect(d.escolhas.length).toBeGreaterThan(1);
    expect(new Set(d.escolhas.map((e) => e.rotulo)).size).toBe(d.escolhas.length);
    expect(validarPalpite(jogo, [conta], '2026-12-01', { aparelho, capitulo: 'cap02', no: 'a_conta', escolha: d.escolhas[0].id })).not.toBeNull();
  });
});
