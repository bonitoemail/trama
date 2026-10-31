-- Auditoria de 31/10 (A1): o limite de eventos por partida cai de 300 para 120. Uma partida dos três
-- capítulos, contando escolhas, decisões vistas, toques curtos, capítulos e compartilhamentos, fica
-- abaixo de 70. Não para um robô que inventa partidas, mas corta o que cada uma pode inflar.
create or replace function public.registrar(
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

  -- Uma partida inteira (3 capítulos, com decisões vistas e toques curtos) fica abaixo de 70 eventos.
  if (select count(*) from public.eventos where partida = p_partida) >= 120 then
    return;
  end if;

  insert into public.eventos (partida, tipo, capitulo, no, escolha, versao)
  values (p_partida, p_tipo, p_capitulo, p_no, p_escolha, p_versao)
  on conflict (partida, tipo, capitulo, no) do nothing;
end;
$$;
