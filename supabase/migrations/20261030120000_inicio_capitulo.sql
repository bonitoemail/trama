-- Evento novo: a partida tocou em "Próximo capítulo" (registro.ts, eventosDaMudanca).
-- Separa quem parou na tela de fim de capítulo de quem parou na abertura do capítulo seguinte.
alter table public.eventos drop constraint eventos_tipo_check;
alter table public.eventos add constraint eventos_tipo_check
  check (tipo in ('escolha', 'fim_capitulo', 'inicio_capitulo', 'fim_jogo'));
