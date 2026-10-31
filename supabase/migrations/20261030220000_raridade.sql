-- Cartão de compartilhar do fim de capítulo (src/app/api/raridade/route.ts): o quanto um caminho é raro.
-- Cada escolha pesa pelo quanto é rara (-ln da fração de quem a fez naquela cena); o caminho soma os pesos.
-- Devolve quantos % dos caminhos que fecharam o capítulo pesam menos (mais comuns) e mais (mais raros).
-- "Quantos fizeram igual" não serve: 57% dos caminhos do cap. 1 são únicos (rodada de 30/10, 19h).
-- Como as outras leituras, só o servidor do site chama; nenhuma partida sai daqui, só a conta.

create function public.caminho_raridade(p_capitulo text, p_caminho jsonb)
returns table (mais_comuns int, mais_raros int, total bigint)
language sql
stable
security definer
set search_path = ''
as $$
  with esc as (
    select partida, no, escolha from public.eventos where tipo = 'escolha' and capitulo = p_capitulo
  ),
  pct as (
    select no, escolha, count(*)::float8 / sum(count(*)) over (partition by no) as p,
           sum(count(*)) over (partition by no) as n_no
    from esc group by 1, 2
  ),
  fim as (
    select distinct partida from public.eventos where tipo = 'fim_capitulo' and capitulo = p_capitulo
  ),
  cam as (
    select e.partida, sum(-ln(p.p)) as peso
    from esc e join fim using (partida) join pct p using (no, escolha)
    group by 1
  ),
  -- Escolha que ninguém registrou ainda conta como uma em (escolhas da cena + 1).
  meu as (
    select coalesce(sum(-ln(coalesce(p.p, 1.0 / (coalesce((select max(q.n_no) from pct q where q.no = c.no), 0) + 1)))), 0) as peso
    from jsonb_to_recordset(p_caminho) as c(no text, escolha text)
    left join pct p on p.no = c.no and p.escolha = c.escolha
  )
  select
    (100 * count(*) filter (where cam.peso < meu.peso - 1e-9) / greatest(count(*), 1))::int,
    (100 * count(*) filter (where cam.peso > meu.peso + 1e-9) / greatest(count(*), 1))::int,
    count(*)
  from cam cross join meu
  group by meu.peso;
$$;

revoke execute on function public.caminho_raridade from public, anon, authenticated;
grant execute on function public.caminho_raridade to service_role;

-- Novo evento: tocou em "Compartilhar meu Brasil" e o cartão saiu (menu do celular ou download).
alter table public.eventos drop constraint eventos_tipo_check;
alter table public.eventos add constraint eventos_tipo_check
  check (tipo in ('decisao_vista', 'toque_curto', 'escolha', 'fim_capitulo', 'inicio_capitulo', 'fim_jogo', 'compartilhar'));
