# Trama

Uma simulação do Brasil de outubro de 2026 até a eleição de 2030. Você lê cenas curtas, como stories, e decide o que acontece depois: quem ganha, quem perde e quem paga a conta. A história começa sempre no último fato real e é atualizada quando a realidade anda.

**Jogar:** [tramabr.app](https://tramabr.app)

Este repositório é público para que qualquer pessoa confira de onde vem cada fato, cada previsão e cada imagem. O código é a prova do método.

## O que dá para conferir aqui

| O quê | Onde |
|---|---|
| As cenas, as escolhas e os fatos de cada cena, com as fontes | [`content/`](content/) |
| A regra das fontes (documento oficial, ou duas fontes de veículos diferentes; Wikipédia não conta), que o próprio código cobra | [`src/engine/fontes.ts`](src/engine/fontes.ts) |
| A pesquisa que deu base às cenas, com os links | [`pesquisa/`](pesquisa/) |
| O histórico de cada rodada de atualização: fatos novos, o que mudou no jogo, o que ficou de fora | [`pesquisa/RODADAS.md`](pesquisa/RODADAS.md) |
| O texto exato de cada agente de IA (pesquisa, as seis lentes do painel, o agregador, as revisões) e como repetir | [`roteiro/prompts/`](roteiro/prompts/README.md) |
| As respostas das seis lentes e o agregado | [`roteiro/painel/`](roteiro/painel/) |
| Como as cenas são escritas (cartões curtos, sem jargão, fato separado de simulação) | [`roteiro/prompts/escrita.md`](roteiro/prompts/escrita.md) |
| Como as imagens são feitas (modelo aberto, rodando no computador, com prompt e seed de cada uma) | [`roteiro/prompts/imagens.md`](roteiro/prompts/imagens.md) |
| As regras de equilíbrio entre os lados | [`DESIGN.md`](DESIGN.md), seções 8 e 8.1 |

## Como o jogo é feito

1. **Pesquisa.** Fatos com data e fonte. Boato fica marcado como boato.
2. **Seis lentes.** Seis analistas simulados por IA (instituições, duas linhas de economia, jurídico, internacional, eleitoral) respondem às mesmas perguntas. Onde concordam, nasce o caminho mais provável; onde divergem, uma decisão difícil.
3. **Escrita.** As cenas são escritas a partir da pesquisa e do painel, com ajuda de IA, seguindo o guia de escrita. Escolhas improváveis também entram: o jogador pode ver o que aconteceria.
4. **Revisões.** Uma revisão confere se falta em alguma decisão um desfecho provável ou um ator de peso. Dois leitores simulados, um de direita e um de esquerda, jogam todos os caminhos e apontam onde o próprio lado foi tratado com injustiça.
5. **A realidade confere.** Uma rodada diária busca as notícias, trava a escolha que se confirmou e reescreve o que a realidade desmentiu. Cada rodada vira um commit, então o histórico do git mostra o que mudou e quando.

Os revisores e os leitores também são agentes de IA: servem para pegar o que escapou, não para garantir que nada escapou. Achou um fato errado, uma fonte fraca ou um viés? Abra uma issue.

## Privacidade

As escolhas de quem joga são contadas de forma anônima: um id aleatório por partida, a origem do link (quando há) e as escolhas. Não guardamos nome, conta, e-mail nem endereço IP. Só o servidor do site grava, e ninguém de fora lê as tabelas. As visitas por página são contadas pelo Vercel Web Analytics, também sem cookie e sem guardar IP. Detalhes em [`BACKEND.md`](BACKEND.md) e na migração em [`supabase/migrations/`](supabase/migrations/).

## Rodar localmente

Precisa de Node.js 22 ou mais novo.

```bash
npm install
npm run dev        # o jogo em localhost:3000
npm run validate   # confere o conteúdo: referências, marcas, fontes, formato dos cartões
npm test           # testes do motor e do conteúdo
npm run build      # o build falha se o conteúdo tiver erro
```

Sem as variáveis do Supabase, o jogo funciona igual e só não registra as partidas. Gerar imagens exige uma placa de vídeo com cerca de 16 GB (ver [`roteiro/prompts/imagens.md`](roteiro/prompts/imagens.md)).

## Licença

São duas licenças, cada uma para uma parte:

- **Código** (`src/`, `scripts/`, `supabase/`, os arquivos Python de `estilo/` e as configurações): [MIT](LICENSE). Pode usar, copiar e mudar à vontade, mantendo o aviso de copyright; vem sem garantia.
- **Conteúdo** (cenas em `content/`, pesquisa, prompts, textos, imagens em `public/imagens/` e a documentação): [Creative Commons Atribuição 4.0 Internacional (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.pt-br), texto completo em [`LICENSE-CONTEUDO`](LICENSE-CONTEUDO). Pode copiar, adaptar e usar, inclusive comercialmente, desde que dê o crédito ao Trama, com o link para este repositório, e diga se fez mudanças.

As fontes citadas nos fatos continuam sendo dos veículos e órgãos que as publicaram; o Trama só aponta para elas.

## Stack

Next.js (App Router), React, TypeScript, Zod e YAML para o conteúdo, Vitest, Supabase para o registro anônimo, Vercel para publicar. As imagens saem do FLUX.1-schnell, de pesos abertos.
