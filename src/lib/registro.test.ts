import { describe, expect, it } from 'vitest';
import { continuar, escolher, novoJogo } from '@/engine/engine';
import { carregarJogo } from '@/engine/load';
import { eventosDaMudanca, limparOrigem, validarEvento } from './registro';

const jogo = carregarJogo();
const cap = jogo.capitulos.find((c) => c.id === jogo.primeiro_capitulo)!;
const inicio = cap.nos.find((n) => n.id === cap.inicio)!;
const partida = '3f2b6c1e-8a4d-4f7e-9b1c-2d5e6f7a8b9c';

describe('registro', () => {
  it('tira da mudança de estado a escolha, o fim de capítulo, a abertura do seguinte e o fim do jogo', () => {
    const s0 = novoJogo(jogo);
    const id = inicio.escolhas?.[0]?.id ?? null;
    const s1 = escolher(jogo, s0, id);
    expect(eventosDaMudanca(s0, s1)).toEqual(
      id ? [{ tipo: 'escolha', capitulo: cap.id, no: inicio.id, escolha: id }] : [],
    );
    const fimCap = { ...s1, fase: 'fim_capitulo' as const, proximo: 'FIM' };
    expect(eventosDaMudanca(s1, fimCap)).toEqual([{ tipo: 'fim_capitulo', capitulo: s1.capitulo, no: s1.no }]);
    expect(eventosDaMudanca(fimCap, continuar(jogo, fimCap))).toEqual([{ tipo: 'fim_jogo' }]);
    // Tocar em "Próximo capítulo" registra a abertura do capítulo seguinte.
    const fim1 = { ...s1, fase: 'fim_capitulo' as const, proximo: 'cap02' };
    const c2 = continuar(jogo, fim1);
    expect(eventosDaMudanca(fim1, c2)).toEqual([{ tipo: 'inicio_capitulo', capitulo: 'cap02', no: c2.no }]);
    // Começar de novo não gera evento de escolha.
    expect(eventosDaMudanca(s1, novoJogo(jogo))).toEqual([]);
  });

  it('aceita só evento que bate com o conteúdo', () => {
    const escolha = cap.nos.flatMap((n) => (n.escolhas ?? []).map((e) => ({ no: n.id, escolha: e.id })))[0];
    const base = { partida, versao: jogo.versao, capitulo: cap.id };
    expect(validarEvento(jogo, { ...base, tipo: 'escolha', ...escolha })).toMatchObject({ ...escolha, origem: 'direto' });
    expect(validarEvento(jogo, { ...base, tipo: 'escolha', no: escolha.no, escolha: 'inventada' })).toBeNull();
    expect(validarEvento(jogo, { ...base, tipo: 'escolha', ...escolha, versao: 'velha' })).toBeNull();
    expect(validarEvento(jogo, { ...base, tipo: 'escolha', ...escolha, partida: 'x' })).toBeNull();
    expect(validarEvento(jogo, { ...base, tipo: 'apagar' })).toBeNull();
    const cap2 = jogo.capitulos.find((c) => c.id === 'cap02')!;
    expect(validarEvento(jogo, { partida, versao: jogo.versao, tipo: 'inicio_capitulo', capitulo: 'cap02', no: cap2.inicio })).toMatchObject({ capitulo: 'cap02' });
    expect(validarEvento(jogo, { partida, versao: jogo.versao, tipo: 'inicio_capitulo', capitulo: 'cap02', no: 'a_mesa' })).toBeNull();
    // Viu as opções e tocou rápido: só em cena de decisão (a abertura do cap01 não tem escolhas).
    for (const tipo of ['decisao_vista', 'toque_curto']) {
      expect(validarEvento(jogo, { ...base, tipo, no: 'pedido' })).toMatchObject({ tipo, no: 'pedido' });
      expect(validarEvento(jogo, { ...base, tipo, no: 'abertura' })).toBeNull();
    }
    expect(validarEvento(jogo, { partida, versao: jogo.versao, tipo: 'inicio', origem: 'Instagram Bio' })).toMatchObject({
      origem: 'instagram-bio',
    });
  });

  it('limpa a origem do link', () => {
    expect(limparOrigem('WhatsApp_grupos')).toBe('whatsapp-grupos');
    expect(limparOrigem('<script>')).toBeNull();
    expect(limparOrigem('')).toBeNull();
  });
});
