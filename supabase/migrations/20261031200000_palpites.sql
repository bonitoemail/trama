-- Palpites (notas/palpites.md): o jogador crava o que acha que vai acontecer numa decisão que a
-- realidade ainda vai decidir, e recebe um código para ver o resultado, sem login.
-- Guarda só o palpite, a hora (do servidor: é o que prova que veio antes), o id anônimo do aparelho
-- (para "um por aparelho") e a origem do link. Nada de nome, e-mail ou IP.
-- Como as outras tabelas, RLS ligado e sem política: só o servidor do site, pelas funções abaixo.

create table public.palpites (
  codigo text primary key check (codigo ~ '^[a-z0-9]{8}$'),
  aparelho uuid not null,
  capitulo text not null,
  no text not null,
  escolha text not null,
  origem text not null default 'direto',
  criado_em timestamptz not null default now(),
  -- Um palpite por aparelho por decisão; depois de cravado, não muda.
  unique (aparelho, capitulo, no)
);

create index palpites_cena on public.palpites (capitulo, no) include (escolha, criado_em);

alter table public.palpites enable row level security;
revoke all on public.palpites from anon, authenticated;

-- Crava um palpite. Se o aparelho já cravou nesta decisão, devolve o palpite que já existe (o mesmo
-- código): cravar de novo não muda nada. A validação contra o conteúdo e a data fica na rota.
create function public.cravar(
  p_codigo text,
  p_aparelho uuid,
  p_capitulo text,
  p_no text,
  p_escolha text,
  p_origem text default 'direto'
) returns table (codigo text, escolha text, criado_em timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Um aparelho não tem mais palpites que decisões abertas; dezenas é robô.
  if (select count(*) from public.palpites p where p.aparelho = p_aparelho) >= 30 then
    return;
  end if;

  insert into public.palpites (codigo, aparelho, capitulo, no, escolha, origem)
  values (p_codigo, p_aparelho, p_capitulo, p_no, p_escolha, coalesce(nullif(p_origem, ''), 'direto'))
  on conflict (aparelho, capitulo, no) do nothing;

  return query
    select p.codigo, p.escolha, p.criado_em from public.palpites p
    where p.aparelho = p_aparelho and p.capitulo = p_capitulo and p.no = p_no;
end;
$$;

-- O recibo: o palpite pelo código, sem o aparelho.
create function public.palpite(p_codigo text)
returns table (capitulo text, no text, escolha text, criado_em timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select p.capitulo, p.no, p.escolha, p.criado_em from public.palpites p where p.codigo = p_codigo;
$$;

-- O placar: quantos cravaram cada opção, por dia de Brasília (o placar conta só os de antes da notícia).
create function public.palpites_contagem()
returns table (capitulo text, no text, escolha text, dia date, n bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select p.capitulo, p.no, p.escolha, (p.criado_em at time zone 'America/Sao_Paulo')::date, count(*)
  from public.palpites p
  group by 1, 2, 3, 4;
$$;

revoke execute on function public.cravar, public.palpite, public.palpites_contagem from public, anon, authenticated;
grant execute on function public.cravar, public.palpite, public.palpites_contagem to service_role;
