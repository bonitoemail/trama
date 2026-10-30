-- Leitura para a tela /jogadores (src/app/api/jogadores/route.ts). Só somas: nenhuma partida sai daqui.
-- Como registrar(), só o servidor do site chama (chave secreta); a chave pública não executa.

-- Escolhas e fins de capítulo por dia (horário de Brasília), mais o total de partidas.
-- O dia serve para contar só as escolhas feitas antes de a realidade decidir uma cena.
create function public.jogadores_contagem()
returns table (tipo text, capitulo text, no text, escolha text, dia date, n bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select e.tipo, e.capitulo, e.no, e.escolha, (e.criado_em at time zone 'America/Sao_Paulo')::date, count(*)
  from public.eventos e
  where e.tipo in ('escolha', 'fim_capitulo')
  group by 1, 2, 3, 4, 5
  union all
  select 'partidas', '', '', '', null, count(*) from public.partidas;
$$;

-- Duas decisões na mesma partida: quantas partidas fizeram cada par de escolhas.
create function public.jogadores_cruzamento(a_capitulo text, a_no text, b_capitulo text, b_no text)
returns table (escolha_a text, escolha_b text, n bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select a.escolha, b.escolha, count(*)
  from public.eventos a
  join public.eventos b on b.partida = a.partida
  where a.tipo = 'escolha' and a.capitulo = a_capitulo and a.no = a_no
    and b.tipo = 'escolha' and b.capitulo = b_capitulo and b.no = b_no
  group by 1, 2;
$$;

revoke execute on function public.jogadores_contagem, public.jogadores_cruzamento from public, anon, authenticated;
grant execute on function public.jogadores_contagem, public.jogadores_cruzamento to service_role;
