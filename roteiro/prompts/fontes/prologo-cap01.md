# Fontes do prólogo e do capítulo 1

- Etapa: Fontes
- Rodado em: 2026-10-29 14:08 UTC
- Modelo: `claude-opus-5-5`, como subagente do Claude Code
- Produziu: listas `fontes:` em content/jogo.yaml e content/capitulos/cap01-a-carta.yaml

O texto abaixo é o prompt exato que o agente recebeu. O único ajuste foi trocar o caminho da pasta no computador pelo caminho dentro do repositório.

````text
Você vai pôr fontes verificadas no conteúdo do jogo Trama (a raiz do repositório). Escreva tudo em português do Brasil. Leia antes CLAUDE.md (regras de equilíbrio) e src/engine/schema.ts (formato). Hoje é 29/10/2026.

## O jogo e o problema
Trama é uma simulação ramificada sobre a política do Brasil até 2030, apartidária: todo lado tem motivo, interesse e custo. Críticos vão atacar as fontes, então cada fato real precisa de fonte sólida e de mais de um lado. Regra nova, que o validador (`npm run validate`) já cobra:
- Todo fato tem `fontes:` (lista de URLs).
- Vale UM documento oficial (domínios .gov.br, .jus.br, .leg.br, .mp.br, .gov, por ex. TSE, STF, Agência Senado, Câmara, Diário Oficial, Departamento de Estado) OU pelo menos DUAS fontes de veículos diferentes. Veículos do mesmo grupo contam como um (g1 e O Globo = Globo; Folha e UOL = mesmo grupo).
- Wikipédia não conta. Troque por documento oficial (para resultado de eleição, o TSE).
- Sempre que der, as duas fontes devem ser de linhas editoriais diferentes: uma mais lida à direita (ex.: Gazeta do Povo, O Antagonista, Revista Oeste, CNN Brasil, Jovem Pan) e uma mais lida à esquerda ou ao centro (ex.: Folha, Estadão, O Globo/g1, Poder360, UOL, Metrópoles, Agência Brasil, BBC Brasil, CartaCapital, Brasil de Fato). Não escreva esses rótulos em lugar nenhum do conteúdo; é só critério de escolha.

## Sua parte (só estes arquivos; outro agente cuida de cap02, não toque nele)
1. `content/jogo.yaml`, só a lista `prologo:` (7 fatos). Cada um já tem `fontes:` com um link. Deixe cada fato com documento oficial ou ≥2 veículos diferentes. Não mude títulos nem textos, a não ser para corrigir um dado que as fontes contradigam (e diga isso no relatório). Confira os números: 47,0% x 45,2% no 1º turno; Lula 51,8% no 2º; PL com 121 deputados.
2. `content/capitulos/cap01-a-carta.yaml`: cada nó com `detalhe:` (o antigo "saiba mais") deve virar dois campos novos, e o `detalhe` sai:
   - `fatos:` lista de `{ texto, fontes: [urls], se? }`: o que aconteceu de verdade e pode ser conferido, incluindo declarações atribuídas ("Rogério Marinho disse que…": o fato é que ele disse).
   - `lados:` lista de parágrafos (strings ou `{ se, texto, senao? }`): posições, motivos e leituras de cada lado ("Para o PL, cada pedido do PT reforça…"). Não levam fonte. Mantenha a regra do par: se um lado tem motivo ali, o outro também.
   - Um parágrafo que mistura as duas coisas deve ser dividido. Item condicional (`se:`) mantém a condição no item novo. Se um nó não tiver nenhum fato, fica só `lados`, e vice-versa.
   - Não mexa em `texto` (os cartões), `escolhas`, ids, marcas ou imagens.
   - Fontes já citadas em comentários YAML do arquivo e em `pesquisa/*.md` e `pesquisa/RODADAS.md` são o ponto de partida. Comentário cujo link virou `fontes` pode sair; os outros comentários ficam.

## Como verificar (obrigatório)
- Nunca invente nem complete URL de cabeça. Cada link que entrar foi aberto por você (WebFetch) e diz o que o fato afirma.
- Faltou a segunda fonte depois de uma busca razoável (WebSearch, modo standard; extended se precisar): (a) reescreva o fato para só o que as fontes confirmam, ou (b) se for na verdade uma leitura, mova para `lados`, ou (c) tire e registre. Nunca deixe fato com uma fonte só nem rebaixe a regra.
- "Em reserva", "segundo fontes": isso só entra como fato se dois veículos diferentes publicaram, e o texto deve deixar claro que foi dito em reserva.
- Ao terminar: `npm run validate`. Seus arquivos não podem ter nenhum ERRO nem o aviso `"detalhe" antigo`. Erros vindos de cap02 são do outro agente; ignore. Rode também `npm test`.

## Relatório final (curto)
Para o prólogo e para cada nó: quantos fatos, os domínios das fontes de cada um, o que foi para `lados`, o que foi reescrito, cortado ou ficou sem segunda fonte, e qualquer dado corrigido. Por último, uma lista dos veículos usados e quantas vezes, para eu conferir o equilíbrio.
````
