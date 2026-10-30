-- A tela /jogadores virou /escolhas ("jogadores" parecia lista de nomes): as funções acompanham.
alter function public.jogadores_contagem() rename to escolhas_contagem;
alter function public.jogadores_cruzamento(text, text, text, text) rename to escolhas_cruzamento;
