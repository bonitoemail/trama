import { beforeEach, describe, expect, it, vi } from 'vitest';

// As rotas falam com o Supabase só por rpc(); aqui ele é trocado por um espião que responde ok.
const rpc = vi.fn();
vi.mock('@/lib/supabase', () => ({ rpc: (...a: unknown[]) => rpc(...a) }));

const { POST: evento } = await import('./evento/route');
const { GET: raridade } = await import('./raridade/route');
const { POST: palpite } = await import('./palpite/route');
const { carregarJogo } = await import('@/engine/load');

const jogo = carregarJogo();
const partida = '3f2b6c1e-8a4d-4f7e-9b1c-2d5e6f7a8b9c';
const post = (corpo: unknown) => new Request('http://x/api/evento', { method: 'POST', body: JSON.stringify(corpo) });

beforeEach(() => {
  rpc.mockReset();
  rpc.mockResolvedValue(new Response(JSON.stringify([{ mais_comuns: 81, mais_raros: 17, total: 290 }]), { status: 200 }));
});

describe('/api/evento', () => {
  it('grava evento que bate com o conteúdo e responde 204 sempre', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const r = await evento(post({ partida, versao: jogo.versao, tipo: 'escolha', capitulo: 'cap01', no: 'pedido', escolha: 'preventiva' }));
    expect(r.status).toBe(204);
    expect(rpc).toHaveBeenCalledWith('registrar', expect.objectContaining({ p_tipo: 'escolha', p_no: 'pedido', p_escolha: 'preventiva', p_origem: 'direto' }));
    vi.unstubAllEnvs();
  });

  it('descarta em silêncio o que não bate, e não grava nada no dev', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    for (const corpo of [null, 'lixo', { partida: 'x', versao: jogo.versao, tipo: 'inicio' }, { partida, versao: 'velha', tipo: 'inicio' }, { partida, versao: jogo.versao, tipo: 'escolha', capitulo: 'cap01', no: 'pedido', escolha: 'inventada' }]) {
      expect((await evento(post(corpo))).status).toBe(204);
    }
    expect(rpc).not.toHaveBeenCalled();
    vi.stubEnv('NODE_ENV', 'development');
    await evento(post({ partida, versao: jogo.versao, tipo: 'inicio' }));
    expect(rpc).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
  });
});

describe('/api/raridade', () => {
  const pedir = (c: string) => raridade(new Request(`http://x/api/raridade?cap=cap01&c=${c}`));

  it('devolve as porcentagens de um caminho canônico, com cache de CDN', async () => {
    const r = await pedir('pedido.bloqueia_sem_prender,itamaraty.cobra,pl.obstrui');
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ maisComuns: 81, maisRaros: 17, total: 290 });
    expect(r.headers.get('cache-control')).toContain('s-maxage');
    expect(rpc).toHaveBeenCalledWith('caminho_raridade', { p_capitulo: 'cap01', p_caminho: [
      { no: 'pedido', escolha: 'bloqueia_sem_prender' }, { no: 'itamaraty', escolha: 'cobra' }, { no: 'pl', escolha: 'obstrui' },
    ] });
  });

  it('recusa cena repetida, fora de ordem ou inventada, sem chamar o banco', async () => {
    for (const c of ['pedido.preventiva,pedido.preventiva', 'itamaraty.cobra,pedido.preventiva', 'pedido.inventada', '']) {
      expect((await pedir(c)).status).toBe(204);
    }
    expect(rpc).not.toHaveBeenCalled();
  });

  it('com poucos caminhos fechados, responde sem número', async () => {
    rpc.mockResolvedValue(new Response(JSON.stringify([{ mais_comuns: 50, mais_raros: 40, total: 12 }]), { status: 200 }));
    expect((await pedir('pedido.preventiva')).status).toBe(204);
  });
});

describe('/api/palpite', () => {
  const aparelho = '3f2b6c1e-8a4d-4f7e-9b1c-2d5e6f7a8b9c';
  const cravar = (corpo: unknown) => palpite(new Request('http://x/api/palpite', { method: 'POST', body: JSON.stringify(corpo) }));

  it('crava em decisão aberta e devolve o código do recibo', async () => {
    vi.useFakeTimers({ now: new Date('2026-11-01T15:00:00Z'), toFake: ['Date'] });
    rpc.mockResolvedValue(new Response(JSON.stringify([{ codigo: 'abcd1234', escolha: 'democratas', criado_em: '2026-11-01T15:00:00Z' }]), { status: 200 }));
    const r = await cravar({ aparelho, capitulo: 'cap01', no: 'eleicao_eua', escolha: 'democratas', origem: 'Instagram' });
    expect(r.status).toBe(200);
    expect(await r.json()).toMatchObject({ codigo: 'abcd1234' });
    expect(rpc).toHaveBeenCalledWith('cravar', expect.objectContaining({ p_aparelho: aparelho, p_no: 'eleicao_eua', p_escolha: 'democratas', p_origem: 'instagram' }));
    expect(rpc.mock.calls[0][1].p_codigo).toMatch(/^[a-z0-9]{8}$/);
    vi.useRealTimers();
  });

  it('recusa depois de fechar, opção inventada e aparelho fora do formato, sem chamar o banco', async () => {
    vi.useFakeTimers({ now: new Date('2026-11-03T15:00:00Z'), toFake: ['Date'] });
    expect((await cravar({ aparelho, capitulo: 'cap01', no: 'eleicao_eua', escolha: 'democratas' })).status).toBe(400);
    vi.setSystemTime(new Date('2026-11-01T15:00:00Z'));
    expect((await cravar({ aparelho, capitulo: 'cap01', no: 'eleicao_eua', escolha: 'inventada' })).status).toBe(400);
    expect((await cravar({ aparelho: 'x', capitulo: 'cap01', no: 'eleicao_eua', escolha: 'democratas' })).status).toBe(400);
    expect(rpc).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
