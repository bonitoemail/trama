-- Auditoria de 31/10 (notas/auditoria-codigo-2026-10-31.md, A3 e A4).
--
-- O cruzamento de /escolhas não cortava pela data da notícia: depois de uma trava, todo jogador
-- novo é forçado à opção real, e o bloco "Uma escolha muda a outra?" tenderia a 100% nos dois grupos.
-- Agora conta só as partidas em que as duas escolhas foram feitas antes de `ate` (dia de Brasília).
drop function public.escolhas_cruzamento(text, text, text, text);

create function public.escolhas_cruzamento(a_capitulo text, a_no text, b_capitulo text, b_no text, ate date default null)
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
    and (ate is null or (
      (a.criado_em at time zone 'America/Sao_Paulo')::date < ate
      and (b.criado_em at time zone 'America/Sao_Paulo')::date < ate
    ))
  group by 1, 2;
$$;

revoke execute on function public.escolhas_cruzamento from public, anon, authenticated;
grant execute on function public.escolhas_cruzamento to service_role;

-- Nenhuma leitura filtra por versão: o índice (versao, capitulo, no) não servia a nenhuma consulta.
-- O novo serve ao cruzamento e à raridade (tipo e capítulo) e ao join por partida.
create index eventos_tipo_cena on public.eventos (tipo, capitulo, no) include (escolha, partida);
drop index public.eventos_cena;
