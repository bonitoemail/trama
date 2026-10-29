---
name: painel
description: Roda uma rodada do painel de previsão do Trama (as seis lentes e o agregador) ou uma revisão de equilíbrio (neutralidade, leitores de direita e de esquerda), sempre com os prompts publicados em roteiro/prompts/. Use quando o usuário pedir "rodar o painel", "nova rodada do painel", "mini-rodada" de algumas perguntas, "revisão de neutralidade" ou "leitores de direita e esquerda", ou quando a skill atualizar-jogo propuser uma mini-rodada.
---

# Painel e revisões

O Trama promete que qualquer pessoa pode conferir os prompts dos agentes e repetir o que eles fizeram (`roteiro/prompts/README.md`). Esta skill mantém essa promessa: **o agente recebe exatamente o texto que está no repositório, nada escrito na hora.**

## A regra

1. O prompt de cada agente é o bloco ` ````text ` do arquivo em `roteiro/prompts/`:
   - painel: `painel/<lente>.md` (seis) e `painel/agregador.md`;
   - revisão: `revisao/neutralidade.md`, `revisao/leitor-direita.md`, `revisao/leitor-esquerda.md`, `revisao/cobertura.md`.
2. Precisa mudar algo (a data de "Hoje é", os arquivos de pesquisa a ler, as perguntas de uma mini-rodada)? **Edite o arquivo primeiro**, mostre a diferença ao usuário e só então rode. Nunca acrescente, corte ou reescreva texto ao passar o prompt para o agente.
3. Passe ao subagente o conteúdo do bloco, sem mudar nada. Os caminhos no prompt são relativos à raiz do repositório; diga ao subagente só isto, numa linha antes do prompt: "Os caminhos abaixo são relativos a <raiz do repositório>."
4. As perguntas comuns das lentes ficam em `roteiro/painel/perguntas.md`. Mudou uma pergunta? Também é edição de arquivo, antes de rodar.

## Rodada do painel

1. Atualize nos sete prompts a data de "Hoje é" e a lista de arquivos de `pesquisa/` que cada lente lê, se a base mudou. Mini-rodada: crie `roteiro/painel/perguntas-<AAAA-MM-DD>.md` só com as perguntas afetadas e aponte os prompts para ele.
2. Rode as seis lentes em paralelo (subagentes), cada uma com o seu prompt. Elas escrevem em `roteiro/painel/<lente>.md`; o arquivo anterior fica no histórico do git.
3. Depois das seis, rode o agregador com `painel/agregador.md`.
4. Atualize no topo de cada prompt usado a linha "Rodado em" (data e hora UTC) e o modelo.
5. Registre a rodada em `pesquisa/RODADAS.md`: data, o que mudou nos prompts, o que mudou nas previsões.

## Revisão de equilíbrio

1. Revisor de neutralidade: `revisao/neutralidade.md`; escreve `roteiro/painel/01-neutralidade.md`.
2. Leitores: `revisao/leitor-direita.md` e `revisao/leitor-esquerda.md`, em paralelo, sem lerem a revisão anterior. Eles respondem na conversa: cole cada resposta, como veio, na seção "Resposta do agente" do arquivo do prompt, trocando a anterior (a antiga fica no git).
3. Cobertura das escolhas: `revisao/cobertura.md`, um subagente por capítulo, no fim de cada lote de cenas novas e quando a pesquisa mudar. Troque só os campos `<CAP>` e `<PESQUISA>`. Resposta na conversa; resumo em `pesquisa/RODADAS.md`.
4. Atualize "Rodado em" e registre em `pesquisa/RODADAS.md`.

## Depois

- As cenas não mudam sozinhas: proponha ao usuário o que muda no jogo a partir do resultado, com as regras de equilíbrio do `DESIGN.md` (8 e 8.1).
- Commit só quando o usuário pedir. Prompt e resultado vão juntos no mesmo commit, para o histórico mostrar qual texto gerou qual resposta.
