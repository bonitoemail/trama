# Leitor de direita

- Etapa: Revisão
- Rodado em: 2026-10-29 (noite); a primeira rodada foi em 2026-10-29 01:21 UTC
- Modelo: `claude-opus-5-5`, como subagente do Claude Code
- Produziu: a resposta está no fim deste arquivo

O texto abaixo é o prompt exato que o agente recebeu. O único ajuste foi trocar o caminho da pasta no computador pelo caminho dentro do repositório.

````text
Você vai revisar a neutralidade de um jogo narrativo brasileiro, "Trama", lendo como um jogador DE DIREITA (eleitor do PL ou de Tarcísio, crítico do STF e do governo Lula, mas não extremista e não conspiracionista). Responda em português.

O jogo: ficção interativa sobre o Brasil de out/2026 a 2030. Parte de fatos reais (Lula reeleito em 25/10/2026; Flávio Bolsonaro, derrotado, sai do país para Miami com passaporte apreendido pelo STF; divulga uma carta se dizendo presidente e depois recua). O jogador lê cenas curtas e escolhe entre 2–3 opções. O objetivo declarado é ser apartidário e "abrir os olhos de qualquer lado".

Leia, no repositório a raiz do repositório:
- content/jogo.yaml (apresentação, método, prólogo de fatos, epílogo com textos condicionais)
- content/capitulos/cap01-a-carta.yaml e content/capitulos/cap02-o-espolio.yaml (cada nó tem `texto`, os cartões; `fatos` e `lados`, que o jogador vê em "Fatos e fontes"; e `escolhas` com `rotulo`; textos podem ter condições `se: {tem: marca}`)
- DESIGN.md seções 8, 8.1 e 8.2 (as regras de equilíbrio que o próprio projeto se impôs)
Não leia roteiro/painel/01-neutralidade.md nem 00-agregado.md (é uma revisão anterior; quero uma leitura independente).

Também considere a tela inicial: o título "TRAMA" em fonte Unbounded com uma faixa de luz verde e amarela passando pelas letras em loop, fundo escuro.

Tarefa — leia como esse jogador leria, do começo ao fim, percorrendo vários caminhos (não só o primeiro). Inclua os caminhos raros, que são sequências próprias: a prisão de Flávio e a votação no Senado, Flávio de volta ao Brasil, a frente de Tereza Cristina e o indulto a Jair. Entregue:
1. Veredito em 2–3 frases: o jogo te pareceu justo, pendendo contra você, ou a seu favor?
2. Lista dos momentos em que você se sentiu tratado de forma injusta ou estereotipado (ou em que o outro lado foi poupado): arquivo, id do nó (ou campo), trecho curto citado, por que incomoda, e gravidade (alta/média/baixa).
3. Lista dos momentos em que o jogo te pareceu favorecer o seu lado (para calibrar).
4. O que falta: custos, motivos ou personagens do outro lado que um leitor como você esperaria ver e não vê; e atores ou desfechos do seu próprio lado que você esperaria encontrar como escolha e não estão lá.
5. Até 5 propostas concretas de correção, cada uma com o nó e o texto sugerido, respeitando as regras de DESIGN 8.1 (sem crime atribuído a pessoa real, boato só como boato, investigado não é culpado, linguagem simples de 8.2).
Seja específico e honesto; não invente trechos — cite só o que está nos arquivos. Não altere nenhum arquivo. Até ~900 palavras.
````

## Resposta do agente

Rodada de 29/10/2026, noite, com os trilhos novos (a anterior está no histórico do git). A resposta saiu na conversa; está aqui como veio. O que foi aplicado está em `pesquisa/RODADAS.md`.

**Leitura de um eleitor de direita (PL/Tarcísio, crítico do STF e do governo, não extremista)**

## 1. Veredito
O jogo é mais justo do que eu esperava. Ele põe na mesa os fatos que a minha base usa: a nota da PF dizendo que Flávio não é foragido, a prorrogação pedida pela campanha de Lula, as recusas da Interpol, o arquivamento proposto por Dodge e o incômodo do próprio governo com Moraes. Ainda assim, pende um pouco contra mim. A direita aparece quase sempre como a família amarga em Miami ou como voto à venda. O narrador faz ironia com Flávio que não faz com ninguém do outro lado. E não existe nenhum caminho em que a Justiça dê razão a ele.

## 2. Onde me senti tratado com injustiça
- **cap02 `a_paz_de_natal`, lados:** "Para a oposição, o perdão é a prova de que havia o que perdoar." Põe na minha boca a leitura do adversário. Quem é de direita leria o indulto como correção de injustiça ou como favor humilhante, nunca como confissão. **Alta.**
- **cap02 `a_moeda_de_troca`:** "Flávio, preso, não sabe quanto vale." / "Flávio acha que vale mais." É deboche na voz do narrador, o que a regra 5 proíbe. **Média.**
- **Coro de Miami** (cap02 `a_frente_desfeita` "a família diz que avisou"; `a_estreia` "alguém repara no que ficou de fora"; epílogo `michelle_lider` "ela não é da família inteira"; `interpol_aceita` "Miami virou endereço e prisão ao mesmo tempo"): a família vira um refrão de ressentimento e frase de efeito. **Média.**
- **cap01 `a_votacao_da_prisao`, cartão 2:** a tese da ordem ("crime que continua acontecendo") aparece com força, e a defesa fica com um genérico "perseguição". O argumento técnico (a PF disse que não há fuga nem base para prisão, e descumprir uma restrição não é flagrante de crime inafiançável) fica fora do cartão. **Média.**
- **cap02 `a_anistia_na_rua`, cartão 4:** o ato é lido pelo PT ("democracia sob ameaça") e pelo Centrão ("preço"). Quem foi à rua só fala em `lados`. Nos cartões, a multidão de direita não tem voz própria. **Média.**
- **Prólogo (`jogo.yaml`):** os sete fatos tratam todos do passo em falso de Flávio. Valdemar reconhecendo o resultado (26/10) e Nikolas pedindo que a base não fosse às ruas, que mostram uma direita institucional, só aparecem escondidos em "Fatos e fontes". **Média.**
- **cap02 `a_mesa`, lados (`direita_sem_dono`):** "Cada senador tem um preço." Está na voz do narrador e só sobre o PL. **Baixa.**
- **cap02 `a_herdeira`, fatos:** os 27 anos de Jair aparecem sem a crítica conhecida à pena e ao julgamento em Turma, nem como leitura de um lado. **Baixa.**

## 3. Onde o jogo favorece o meu lado (para calibrar)
- Prólogo: "Ele não é foragido… sem denúncia". cap01 `abertura`: a prorrogação "a pedido da campanha de Lula".
- `foragido`: as recusas da Interpol (Allan dos Santos, Eustáquio). `pedido`: o caso Dodge e o inquérito das fake news.
- `itamaraty`: ministros de Lula culpando Moraes. `o_orcamento`: a conta da IFI e "parte dele cai sobre quem apoiou Lula".
- Tarcísio e Nikolas aparecem como adultos na sala. A frente de Tereza Cristina é competitiva. Na `noite_democrata`, a Reuters vem com a ressalva de que "não conseguiu saber" se havia ordem da Casa Branca.
- `o_senado_sem_a_direita`: "junta a direita como nenhum líder conseguiu". A luz verde e amarela do título me pareceu a bandeira, e um leitor de esquerda pode ler como cor nossa.

## 4. O que falta
**Custos e motivos do outro lado:**
- O PT, a esquerda e a imprensa quase não decidem nada. Quem decide é Moraes, Lula ou o Itamaraty.
- Moraes tem motivo ("autoridade"), mas não tem custo concreto em nenhum final: nenhum revés no plenário do STF, nenhuma derrota.
- Não há desgaste do governo fora do orçamento: segurança pública, uma investigação ou CPI incômoda, aliados insatisfeitos.
- O STF como ator interessado aparece só de passagem ("ministros preferem Pacheco").

**Atores e desfechos do meu lado:**
- Não existe caminho em que a investigação contra Flávio seja arquivada ou em que a PGR peça o arquivamento. "Investigado não é culpado" nunca vira escolha.
- Não há caminho jurídico da oposição: habeas corpus no plenário do STF ou um pedido formal ao TSE sobre a prorrogação, sem teoria de fraude.
- O impeachment de ministro do STF só aparece em `lados`, nunca como escolha.
- Marinho e Michelle quase não agem por conta própria. Governadores além de Tarcísio (Zema, Caiado, Ratinho) não existem.

## 5. Propostas de correção
1. **cap02 `a_paz_de_natal`, lados:** "Para o governo, a paz custa caro, mas dá dois anos de Senado. Para a oposição, o perdão de Lula solta Jair sem reconhecer injustiça nenhuma, e a família queria revisão, não favor."
2. **cap02 `a_moeda_de_troca`, cartão 2:** se preso, "Flávio, preso, não participa da conversa."; senão, "Flávio diz que ninguém negocia em nome dele."
3. **cap01 `a_votacao_da_prisao`, cartão 2:** "A ordem diz que a fuga é um crime que continua acontecendo. A defesa lembra que a Polícia Federal disse que ele não é foragido, e que isso não é flagrante." Fica um pouco acima das ~30 palavras do 8.2; se precisar, corte "lembra que".
4. **Prólogo, novo item de 26/10 (antes do passaporte):** título "O PL reconhece o resultado", texto "Valdemar Costa Neto, presidente do PL, reconhece a vitória de Lula e cobra explicações sobre os gastos do governo perto da votação." Fontes: as mesmas da Agência Brasil e de O Antagonista já usadas em cap01 `abertura`.
5. **cap02 `a_anistia_na_rua`, cartão 4:** "Para quem está no carro de som, anistia é pacificação. No PT, o ato prova que a democracia ainda está sob ameaça. No Centrão, que a anistia tem rua, e preço."

Também sugiro um galho novo em `o_parecer` ou `a_custodia`: "A Procuradoria pede para arquivar um dos inquéritos". O custo seria para o PT, o ganho para a defesa, e entraria no epílogo.

Não alterei nenhum arquivo e não abri `01-neutralidade.md` nem `00-agregado.md`.
