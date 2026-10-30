-- Eventos novos da tela de decisão (registro.ts, registrarNaTela):
-- decisao_vista: as opções apareceram (último cartão da cena). Separa quem sai lendo de quem sai diante dos botões.
-- toque_curto: tocou rápido sem segurar; o botão passa a avisar que é preciso segurar (BotaoEscolha.tsx).
alter table public.eventos drop constraint eventos_tipo_check;
alter table public.eventos add constraint eventos_tipo_check
  check (tipo in ('decisao_vista', 'toque_curto', 'escolha', 'fim_capitulo', 'inicio_capitulo', 'fim_jogo'));
