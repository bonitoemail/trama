# Como as cenas são escritas

- Etapa: Escrita
- Vale para: toda cena, escolha e fato do jogo, escrita por pessoa ou por agente de IA (a skill `atualizar-jogo` e qualquer rodada que crie cena nova).
- Conferido por: `npm run validate`, que avisa quando um cartão, uma cena ou um rótulo sai do formato, ou quando aparece um termo da lista de jargão (`src/engine/formato.ts`).

O Trama é para a pessoa comum, no celular, que quer entender a política sem precisar já saber. As regras abaixo são o texto que quem escreve uma cena segue. O equilíbrio entre os lados tem regras próprias, que continuam valendo: [`DESIGN.md`, seções 8 e 8.1](../../DESIGN.md).

````text
Você vai escrever cenas do Trama, uma história ramificada sobre a política brasileira. Quem lê é a pessoa comum, no celular, que não acompanha política de perto. Cada cena é lida como stories: um cartão por vez, um toque para avançar. Siga estas regras.

CARTÕES
1. Cada parágrafo do campo `texto` é um cartão. Um cartão tem uma ideia só e no máximo cerca de 30 palavras.
2. No máximo 4 cartões por cena, contando os que dependem das escolhas anteriores.
3. No máximo um ou dois parágrafos condicionais (`se`) por cena. Se forem mais, eles precisam ser exclusivos entre si (só um aparece de cada vez). Ecos menores vão para `lados`.
4. Frases curtas, na ordem direta. Sujeito, verbo, complemento.

PESSOAS
5. Na primeira vez que alguém aparece numa cena, diga o que ele faz: "Alcolumbre, o presidente do Senado"; "Moraes, o ministro do Supremo que cuida do caso". Depois, só o nome.
6. A mesma regra de nome para todos: se um é chamado pelo sobrenome, todos são.

PALAVRAS
7. Sem jargão no cartão. Troque o termo técnico pelo que ele quer dizer:
   - "decreta a prisão preventiva" → "manda prender";
   - "a CCJ" → "a comissão do Senado";
   - "o rito" → "o caminho" ou "o processo";
   - "decisão monocrática" → "decisão de um ministro sozinho";
   - "difusão vermelha" → "alerta internacional de procurados";
   - "o mandato acaba por decurso" → "o mandato acaba sozinho";
   - "quórum" → "o número mínimo de votos".
8. Números exatos, prazos, artigos de lei e nomes de veículos vão para `fatos`, nunca para o cartão. No cartão, o número só entra se for o assunto ("41 votos").

O QUE É FATO E O QUE É SIMULAÇÃO
9. O cartão pode narrar simulação (o que a história inventa a partir do fato). O que é real e afirmado como real vai em `fatos`, com fonte: documento oficial, ou pelo menos duas fontes de veículos diferentes. Boato só como boato.
10. Em `lados`, cada leitura vem em par: o que um lado vê e o que o outro vê, com motivo e interesse para os dois.

ESCOLHAS
11. O rótulo de uma escolha tem um verbo simples e no máximo cerca de 10 palavras: "Moraes manda prender Flávio", não "Moraes decreta a prisão preventiva de Flávio com base na carta".
12. O rótulo diz o que acontece, não o que você acha disso. Nada de "finalmente", "covardemente", "ousadamente".
13. De 2 a 4 escolhas por cena. Some o desfecho provável que faltar (quase sempre o meio-termo ou o adiamento), sem tirar o improvável que o jogador quer ver.
````

## De onde vieram as regras

Elas nasceram em 28/10/2026, quando o jogo passou de texto corrido para cartões no formato de stories. As primeiras versões das cenas tinham termos que só quem acompanha o Congresso entende ("rito", "CCJ", "monocrática") e parágrafos longos demais para a tela do celular. Os exemplos da regra 7 são trocas que fizemos de verdade.
