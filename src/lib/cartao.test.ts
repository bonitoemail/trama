import { describe, expect, it } from 'vitest';
import { fraseDoNumero } from './cartao';

describe('fraseDoNumero', () => {
  it('na metade de cima, o caminho é raro', () => {
    expect(fraseDoNumero({ maisComuns: 87, maisRaros: 12, total: 290 })).toEqual({
      numero: '87%',
      frase: 'dos jogadores fizeram escolhas mais comuns que as minhas.',
    });
  });
  it('na metade de baixo, a frase vira e não sai um número fraco', () => {
    const f = fraseDoNumero({ maisComuns: 27, maisRaros: 72, total: 290 });
    expect(f.numero).toBe('72%');
    expect(f.frase).toContain('Meu Brasil é o da maioria');
  });
});
