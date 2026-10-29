# Como repetir uma etapa por conta própria

Não precisa de programação nem de conta paga. Qualquer IA com acesso à internet e capaz de ler arquivos serve: Claude, ChatGPT, Gemini.

## Uma lente do painel (o teste mais simples)

1. Abra o prompt da lente em [`painel/`](painel/), por exemplo [`instituicoes.md`](painel/instituicoes.md), e copie o texto que está dentro do bloco.
2. Baixe os arquivos que o prompt manda ler: as perguntas em [`roteiro/painel/perguntas.md`](../painel/perguntas.md) e os de [`pesquisa/`](../../pesquisa/) citados no passo 2 do prompt.
3. Numa conversa nova, anexe esses arquivos e cole o prompt. Se a IA não puder gravar arquivo, peça para ela responder na própria conversa.
4. Compare a resposta com a publicada, no mesmo nome, em [`roteiro/painel/`](../painel/). Olhe primeiro as probabilidades de cada pergunta e a seção "Onde eu discordaria dos outros painelistas".

## Uma pesquisa

O prompt de pesquisa manda buscar na internet notícias de uma data. Hoje a busca vai trazer coisas mais novas, então o resultado vai mudar. Para comparar de forma justa, acrescente ao prompt: "Considere só o que foi publicado até [a data do prompt]".

## Uma revisão de equilíbrio

Os leitores de direita e de esquerda leem o conteúdo do jogo, que muda com o tempo. Para ler o jogo como estava no dia da revisão, abra o repositório no commit daquela data (no GitHub: Commits, escolha o dia, depois "Browse files").

## O que esperar

- O texto nunca sai igual, porque a IA varia a cada vez.
- As previsões devem cair perto: uma lente que deu 70% não deveria dar 20% com o mesmo prompt e a mesma base.
- Achou uma diferença grande, um fato sem fonte ou um viés? Abra uma issue no repositório com o que você rodou e o que saiu.
