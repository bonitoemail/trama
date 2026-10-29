-- Registro anônimo das partidas: quem começou, o que escolheu, até onde foi.
-- Sem login, sem IP, sem nome: a partida é um id aleatório gerado no navegador.
-- Nada aqui é lido ou gravado pela chave pública: só o servidor do site, pela função registrar().

create table public.partidas (
  id uuid primary key,
  versao text not null,
  origem text not null default 'direto',
  criada_em timestamptz not null default now()
);

create table public.eventos (
  id bigint generated always as identity primary key,
  partida uuid not null references public.partidas (id) on delete cascade,
  tipo text not null check (tipo in ('escolha', 'fim_capitulo', 'fim_jogo')),
  capitulo text not null default '',
  no text not null default '',
  escolha text not null default '',
  versao text not null,
  criado_em timestamptz not null default now(),
  -- A mesma partida não vota duas vezes na mesma cena.
  unique (partida, tipo, capitulo, no)
);

create index eventos_cena on public.eventos (versao, capitulo, no);

-- RLS ligado e sem política: a API pública não enxerga as tabelas.
alter table public.partidas enable row level security;
alter table public.eventos enable row level security;
revoke all on public.partidas, public.eventos from anon, authenticated;

-- Grava um evento. 'inicio' só cria a partida; os outros criam a partida se ela ainda não
-- existir (partida começada antes do registro) e gravam o evento. Duplicado é ignorado.
create function public.registrar(
  p_partida uuid,
  p_tipo text,
  p_versao text,
  p_origem text default 'direto',
  p_capitulo text default '',
  p_no text default '',
  p_escolha text default ''
) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.partidas (id, versao, origem)
  values (p_partida, p_versao, coalesce(nullif(p_origem, ''), 'direto'))
  on conflict (id) do nothing;

  if p_tipo = 'inicio' then
    return;
  end if;

  -- Uma partida tem no máximo algumas dezenas de cenas; mais que isso é robô.
  if (select count(*) from public.eventos where partida = p_partida) >= 300 then
    return;
  end if;

  insert into public.eventos (partida, tipo, capitulo, no, escolha, versao)
  values (p_partida, p_tipo, p_capitulo, p_no, p_escolha, p_versao)
  on conflict (partida, tipo, capitulo, no) do nothing;
end;
$$;

revoke execute on function public.registrar from public, anon, authenticated;
grant execute on function public.registrar to service_role;

-- Consultas prontas, num schema fora da API.
create schema painel;
revoke all on schema painel from public, anon, authenticated;

-- Começaram, terminaram o jogo, por versão.
create view painel.resumo as
select
  p.versao,
  count(*) as partidas,
  count(*) filter (where exists (
    select 1 from public.eventos e where e.partida = p.id and e.tipo = 'fim_jogo'
  )) as chegaram_ao_fim,
  min(p.criada_em) as primeira,
  max(p.criada_em) as ultima
from public.partidas p
group by p.versao
order by ultima desc;

-- Quantas partidas entraram em cada capítulo e quantas o fecharam.
create view painel.capitulos as
select
  versao,
  capitulo,
  count(distinct partida) as entraram,
  count(distinct partida) filter (where tipo = 'fim_capitulo') as fecharam
from public.eventos
where capitulo <> ''
group by versao, capitulo
order by versao, capitulo;

-- Em cada decisão, quantos foram para cada lado.
create view painel.escolhas as
select
  versao,
  capitulo,
  no,
  escolha,
  count(*) as votos,
  round(100.0 * count(*) / sum(count(*)) over (partition by versao, capitulo, no), 1) as pct
from public.eventos
where tipo = 'escolha'
group by versao, capitulo, no, escolha
order by versao, capitulo, no, votos desc;

-- Onde param: a última decisão das partidas paradas há mais de meia hora sem chegar ao fim.
create view painel.paradas as
with ultima as (
  select distinct on (e.partida) e.partida, e.versao, e.capitulo, e.no, e.criado_em
  from public.eventos e
  order by e.partida, e.criado_em desc
)
select u.versao, u.capitulo, u.no as ultima_decisao, count(*) as partidas
from ultima u
where u.criado_em < now() - interval '30 minutes'
  and not exists (select 1 from public.eventos f where f.partida = u.partida and f.tipo = 'fim_jogo')
group by u.versao, u.capitulo, u.no
order by partidas desc;

-- Caminhos completos de cada capítulo (só partidas que fecharam o capítulo), do mais comum ao mais raro.
create view painel.caminhos as
with por_partida as (
  select
    e.versao,
    e.capitulo,
    e.partida,
    string_agg(e.no || ':' || e.escolha, ' > ' order by e.criado_em) filter (where e.tipo = 'escolha') as caminho
  from public.eventos e
  where e.capitulo <> ''
  group by e.versao, e.capitulo, e.partida
  having bool_or(e.tipo = 'fim_capitulo')
)
select versao, capitulo, caminho, count(*) as partidas
from por_partida
group by versao, capitulo, caminho
order by versao, capitulo, partidas desc;

-- De onde vieram as partidas e quantas terminaram.
create view painel.origens as
select
  p.origem,
  count(*) as partidas,
  count(*) filter (where exists (
    select 1 from public.eventos e where e.partida = p.id and e.tipo = 'fim_jogo'
  )) as chegaram_ao_fim
from public.partidas p
group by p.origem
order by partidas desc;
