# Leitor de esquerda

- Etapa: Revisão
- Rodado em: 2026-10-29 01:21 UTC
- Modelo: `claude-opus-5-5`, como subagente do Claude Code
- Produziu: a resposta está no fim deste arquivo

O texto abaixo é o prompt exato que o agente recebeu. O único ajuste foi trocar o caminho da pasta no computador pelo caminho dentro do repositório.

````text
Você vai revisar a neutralidade de um jogo narrativo brasileiro, "Trama", lendo como um jogador DE ESQUERDA (eleitor do PT ou do campo progressista, crítico do bolsonarismo e do Centrão, mas não militante cego e capaz de reconhecer erros do governo). Responda em português.

O jogo: ficção interativa sobre o Brasil de out/2026 a 2030. Parte de fatos reais (Lula reeleito em 25/10/2026; Flávio Bolsonaro, derrotado, sai do país para Miami com passaporte apreendido pelo STF; divulga uma carta se dizendo presidente e depois recua). O jogador lê cenas curtas e escolhe entre 2–3 opções. O objetivo declarado é ser apartidário e "abrir os olhos de qualquer lado".

Leia, no repositório a raiz do repositório:
- content/jogo.yaml (apresentação, método, prólogo de fatos, epílogo com textos condicionais)
- content/capitulos/cap01-a-carta.yaml e content/capitulos/cap02-o-espolio.yaml (cada nó tem `texto`, `detalhe` = "saiba mais", `escolhas` com `rotulo`; textos podem ter condições `se: {tem: marca}`)
- DESIGN.md seções 8, 8.1 e 8.2 (as regras de equilíbrio que o próprio projeto se impôs)
Não leia roteiro/painel/01-neutralidade.md nem 00-agregado.md (é uma revisão anterior; quero uma leitura independente).

Também considere a tela inicial: o título "TRAMA" em fonte Unbounded com uma faixa de luz verde e amarela passando pelas letras em loop, fundo escuro.

Tarefa — leia como esse jogador leria, do começo ao fim, percorrendo vários caminhos (não só o primeiro). Entregue:
1. Veredito em 2–3 frases: o jogo te pareceu justo, pendendo contra você, ou a seu favor?
2. Lista dos momentos em que você se sentiu tratado de forma injusta ou estereotipado (ou em que o outro lado foi poupado): arquivo, id do nó (ou campo), trecho curto citado, por que incomoda, e gravidade (alta/média/baixa).
3. Lista dos momentos em que o jogo te pareceu favorecer o seu lado (para calibrar).
4. O que falta: custos, motivos ou personagens do outro lado que um leitor como você esperaria ver e não vê.
5. Até 5 propostas concretas de correção, cada uma com o nó e o texto sugerido, respeitando as regras de DESIGN 8.1 (sem crime atribuído a pessoa real, boato só como boato, investigado não é culpado, linguagem simples de 8.2).
Seja específico e honesto; não invente trechos — cite só o que está nos arquivos. Não altere nenhum arquivo. Até ~900 palavras.
````

## Resposta do agente

A resposta saiu na conversa, não num arquivo; está aqui como veio. Ela foi aplicada ao conteúdo em dois lotes (ver `pesquisa/RODADAS.md`). Os nomes de campo citados (como `detalhe`) são da época.

**Leitura de neutralidade: um leitor de esquerda em Trama (prólogo, cap. 1, cap. 2, epílogo)**

## 1. Veredito

O jogo é justo no geral e se esforça para isso. Mas, para mim, pende levemente contra o meu lado de um jeito sutil. O motivo do governo e do PT quase sempre aparece como cálculo frio. Já a direita é poupada no contexto: o golpe de 2022, o papel de Eduardo nas sanções e a desobediência à ordem do Supremo somem dos cartões. Nada disso é panfleto, mas o leitor de esquerda percebe o padrão.

## 2. Onde me senti tratado de forma injusta (ou onde o outro lado foi poupado)

| Arquivo / nó | Trecho | Por que incomoda | Gravidade |
|---|---|---|---|
| cap01 `abertura`, texto | "Dois dias depois, saiu do Brasil e foi para Miami com a família." | O cartão não diz que ele estava proibido pelo STF de sair do país. Isso só aparece no prólogo. Já "não é foragido" aparece três vezes (prólogo, `abertura` detalhe, `pedido` texto). | alta |
| cap01 `abertura`, detalhe | "O ponto mais concreto da acusação de fraude é a prorrogação… decidida pelo ministro Zanin a pedido da campanha de Lula." | "Ponto mais concreto" dá peso à acusação. A checagem fica pela metade: os ~35 mil votos depois das 17h não são comparados com a margem real (51,8%). A regra 10 pede a checagem completa. | alta |
| cap02 `a_herdeira`, detalhe | "Jair Bolsonaro, que cumpre pena em prisão domiciliar." | Não diz pena por quê. A condenação no caso do golpe é fato real e é o pano de fundo da carta. Eduardo também aparece "condenado" sem o motivo (cap01 `foragido`, cap02 `a_moeda`). | alta |
| cap01 `noite_republicana` | "as punições contra autoridades brasileiras podem voltar" | Some quem pediu essas punições nos EUA. A tarifa e as sanções aparecem como coisa só entre Trump e Lula. Isso poupa a família. | média |
| cap02 `heranca_em_disputa` | "E Lula perde uma desculpa. Sem oposição unida, os erros de 2027 vão ser só dele." | É o narrador quem diz isso, como frase de efeito. Pressupõe que Lula usa a oposição como desculpa e que vai errar. Fere a regra 5 (narrador sem piada). | média |
| cap01 `pedido`, detalhe | "Para a esquerda, manter Flávio no noticiário como fugitivo custa pouco e rende muito." | Só o motivo cínico. O motivo de princípio (a lei vale para todos) aparece só no cap02 `a_conta`. Falta o par: o que o PL ganha com o discurso de perseguição. | média |
| Padrão do governo (cap01 `itamaraty` detalhe, `a_convocacao` "alívio discreto", cap02 `o_vazio` "votos à venda") | — | O governo nunca age por convicção democrática, sempre por conta de cálculo. | média |
| `jogo.yaml`, epílogo `stf_aprovado` / `vaga_segurada` | "Um deles sabe exatamente a quem deve a cadeira"; "todo mundo… sabe o câmbio" | Frase de efeito do narrador, contra a regra 5. Também cai sobre um indicado de confiança de Lula, como se fosse a mesma coisa que dever a cadeira a Alcolumbre. | baixa |
| Tela inicial | Faixa de luz verde e amarela passando pelo título | Desde 2018 o verde-amarelo virou código visual do bolsonarismo. Um leitor de esquerda nota antes da primeira linha. | baixa |

## 3. Onde o jogo favorece o meu lado (para calibrar)

- "A carta fala em fraude, sem provas" (`abertura`).
- "Quase todos os governos, até os de direita, parabenizaram Lula" e a comparação que desmonta o Guaidó (`o_exilio`).
- "Na carta, Flávio tinha escrito que não havia ordem de prisão contra ele. Agora há." (`foragido`) tem tom de "pegadinha" contra Flávio.
- A reportagem da Reuters sobre funcionários de Trump fazendo campanha para a família (`noite_democrata`).
- Tarcísio e Valdemar aceitando o resultado, o que isola a carta.
- O ramo da deportação com "Os dois irmãos passam a virada do ano presos" é realização de desejo da esquerda, mesmo marcado como galho improvável.

## 4. O que falta

- **Agência da esquerda além de Lula.** O PT só "pede" coisas; não há Haddad, Gleisi, movimentos sociais nem bancada fazendo escolhas. A regra 14 pede agência de todos os campos.
- **Contexto do bolsonarismo.** Falta o 8 de janeiro, a condenação de Jair e o lobby de Eduardo por tarifas e sanções. Sem isso, a carta parece um episódio solto, não a continuação de um padrão.
- **Custo para Trump e Milei.** Milei só "fica calado". O custo para Trump fora das redes (empresas americanas, Congresso, imprensa) não aparece com força.
- **O eleitor de direita moderado** que se envergonhou da carta. Ele existiria e daria custo à família vindo de dentro.
- **Um motivo de princípio do governo** ao menos uma vez: defender o resultado da eleição como valor, não como tática.

## 5. Propostas de correção

1. **cap01 `abertura`, cartão 1:** "Flávio Bolsonaro perdeu a eleição para Lula por pouco. Dois dias depois, mesmo proibido pelo Supremo de sair do país, foi para Miami com a família." (O "não é foragido" fica no `detalhe`.)

2. **cap01 `abertura`, detalhe 2:** "O fato real que a carta usa é a prorrogação do horário de votação, decidida pelo ministro Zanin a pedido da campanha de Lula. A campanha de Flávio também tinha pedido prorrogações. O TSE registrou cerca de 35 mil votos depois das 17h. A diferença final entre os dois foi de milhões de votos." Antes de usar a última frase, confirmar o número com duas fontes.

3. **cap01 `pedido`, detalhe 1** (regra do par): "…Para a esquerda, a prisão mostraria que a lei vale para todos, e manter Flávio no noticiário como fugitivo também rende votos. Para o PL, cada pedido do PT reforça a história da perseguição."

4. **cap02 `heranca_em_disputa`, último cartão:** "Ganham Alcolumbre e Kassab. Perde a direita, com a maior bancada e a menor união. No governo, aliados de Lula temem outra coisa: sem um adversário claro, cada derrota de 2027 vai ser cobrada só do Planalto." Assim a frase sai da boca do narrador e vai para um personagem.

5. **cap02 `a_herdeira`, detalhe, e cap01 `noite_republicana`:**
   - "Valdemar Costa Neto foi autorizado pela Justiça a visitar Jair Bolsonaro, condenado pelo Supremo no processo da tentativa de golpe e em prisão domiciliar."
   - No cartão 3 de `noite_republicana`: "…e as punições contra autoridades brasileiras, que Eduardo defendeu em Washington em 2025, podem voltar."
   - Os dois são fatos públicos, mas precisam de comentário YAML com link (regra 8).

Bônus (baixa gravidade): no epílogo, trocar "Um deles sabe exatamente a quem deve a cadeira, e os outros também" por "O novo ministro chega com apoio no Senado e com cobranças de quem o apoiou." Isso tira a frase de efeito do narrador.

Não alterei nenhum arquivo.
