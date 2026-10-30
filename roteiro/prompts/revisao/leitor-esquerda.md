# Leitor de esquerda

- Etapa: Revisão
- Rodado em: 2026-10-29 (noite, com o capítulo 3); a primeira rodada foi em 2026-10-29 01:21 UTC
- Modelo: `claude-opus-5-5`, como subagente do Claude Code
- Produziu: a resposta está no fim deste arquivo

O texto abaixo é o prompt exato que o agente recebeu. O único ajuste foi trocar o caminho da pasta no computador pelo caminho dentro do repositório.

````text
Você vai revisar a neutralidade de um jogo narrativo brasileiro, "Trama", lendo como um jogador DE ESQUERDA (eleitor do PT ou do campo progressista, crítico do bolsonarismo e do Centrão, mas não militante cego e capaz de reconhecer erros do governo). Responda em português.

O jogo: ficção interativa sobre o Brasil de out/2026 a 2030. Parte de fatos reais (Lula reeleito em 25/10/2026; Flávio Bolsonaro, derrotado, sai do país para Miami com passaporte apreendido pelo STF; divulga uma carta se dizendo presidente e depois recua). O jogador lê cenas curtas e escolhe entre 2–3 opções. O objetivo declarado é ser apartidário e "abrir os olhos de qualquer lado".

Leia, no repositório a raiz do repositório:
- content/jogo.yaml (apresentação, método, prólogo de fatos, epílogo com textos condicionais)
- content/capitulos/cap01-a-carta.yaml, content/capitulos/cap02-o-espolio.yaml e content/capitulos/cap03-a-posse.yaml (cada nó tem `texto`, os cartões; `fatos` e `lados`, que o jogador vê em "Fatos e fontes"; e `escolhas` com `rotulo`; textos podem ter condições `se: {tem: marca}`)
- DESIGN.md seções 8, 8.1 e 8.2 (as regras de equilíbrio que o próprio projeto se impôs)
Não leia roteiro/painel/01-neutralidade.md nem 00-agregado.md (é uma revisão anterior; quero uma leitura independente).

Também considere a tela inicial: o título "TRAMA" em fonte Unbounded com uma faixa de luz verde e amarela passando pelas letras em loop, fundo escuro.

Tarefa — leia como esse jogador leria, do começo ao fim, percorrendo vários caminhos (não só o primeiro). Inclua os caminhos raros, que são sequências próprias: a prisão de Flávio e a votação no Senado, Flávio de volta ao Brasil, a frente de Tereza Cristina, o indulto a Jair e os três finais do capítulo 3 (a eleição do Senado). Entregue:
1. Veredito em 2–3 frases: o jogo te pareceu justo, pendendo contra você, ou a seu favor?
2. Lista dos momentos em que você se sentiu tratado de forma injusta ou estereotipado (ou em que o outro lado foi poupado): arquivo, id do nó (ou campo), trecho curto citado, por que incomoda, e gravidade (alta/média/baixa).
3. Lista dos momentos em que o jogo te pareceu favorecer o seu lado (para calibrar).
4. O que falta: custos, motivos ou personagens do outro lado que um leitor como você esperaria ver e não vê; e atores ou desfechos do seu próprio lado que você esperaria encontrar como escolha e não estão lá.
5. Até 5 propostas concretas de correção, cada uma com o nó e o texto sugerido, respeitando as regras de DESIGN 8.1 (sem crime atribuído a pessoa real, boato só como boato, investigado não é culpado, linguagem simples de 8.2).
Seja específico e honesto; não invente trechos — cite só o que está nos arquivos. Não altere nenhum arquivo. Até ~900 palavras.
````

## Resposta do agente

Rodada de 29/10/2026, noite, com o capítulo 3 (a anterior está no histórico do git). A resposta saiu na conversa; está aqui com a formatação apertada (tabelas e listas), sem mudar o conteúdo. O que foi aplicado está em `pesquisa/RODADAS.md`.

**1. Veredito**

No geral, justo, e em alguns pontos até favorável a mim: a fraude sempre vem com "sem provas", e a checagem dos 34 mil votos contra 4,4 milhões está lá. Mas há três tropeços que pendem contra o meu lado: a frase mais dura de Lula vai para o cartão e a de Flávio sai na versão suavizada; um narrador acusa Lula de engavetar a Justiça; e os finais em que a direita vence cobram pouco da base vencedora.

**2. Onde me senti tratado de forma injusta (ou o outro lado foi poupado)**

- **Regra do par invertida (alta).** `cap01` `itamaraty`, cartão: "disse que a família lambe as botas dos Estados Unidos". Já `cap01` `abertura` diz só que a carta "se diz 'líder do Brasil'". O "verdadeiro presidente eleito", a frase mais grave, fica no prólogo e nunca chega a um cartão.
- **Narrador acusando Lula (alta).** `cap02` `natal_do_acordo`, cartão: "Lula ganha um Senado calmo e engaveta o pedido de que Flávio responda à Justiça". É voz de narrador atribuindo obstrução a Lula (8.1.5, espírito da 8.1.6). E é incoerente em vários caminhos: quem decide é o Supremo, e com `flavio_voltou` e preso não há pedido para engavetar.
- **Moldura anti-Supremo na primeira decisão (média).** `cap01` `pedido`: os `fatos` trazem o arquivamento de Raquel Dodge, com fonte; a defesa de Moraes aparece só em `lados`, sem fonte.
- **Mesma regra de nome (baixa/média, 8.1.7).** Rótulos: "Moraes manda prender Flávio" e "A Procuradoria se manifesta contra". O ministro tem nome; o procurador-geral, não.
- **O gancho de Valdemar sem checagem (baixa/média, 8.1.10).** Prólogo e `cap01` `abertura`: "cobrou esclarecimentos sobre os gastos do governo perto da votação", sem checagem nem contexto.
- **Fala confusa no final do indulto (baixa).** `cap02` `a_paz_de_natal`, `lados`: "Para a base de Lula, perdoar é admitir que havia o que perdoar". Não fica claro de que lado é.
- **A vitória da oposição sem custo (média, 8.1.12–13).** `cap03` `o_senado_da_oposicao`: o único custo é "presidir um Senado dividido vai exigir negociar com o mesmo Centrão". A base de quem venceu não paga nada; Lula perde em todos os finais.
- **Centrão poupado (média).** `cap03` `o_ministerio`: União, PP e Republicanos apoiaram Flávio e mantêm ministérios; o custo para eles é uma linha em `lados`. Alcolumbre ganha em quase todos os caminhos.

**3. Onde o jogo pareceu favorecer meu lado (para calibrar)**

- "Sem provas" em todas as menções à fraude; `o_exilio`, "Ele não foi reconhecido por nenhum".
- Tarcísio, Nikolas, Kassab e Bullrich aceitando o resultado.
- A condenação de Eduardo e a Reuters sobre Beattie e Pita.
- Muitos caminhos de ruína para a direita (briga da família, frente desfeita, PL rachado, herança em disputa); com os deportados, Eduardo termina preso.
- Um leitor de direita teria razão em achar que a direita sai mais fragmentada que o governo.

**4. O que falta**

- **O custo que a família causou ao país:** o pedido de Eduardo por punições e a tarifa de 25% só aparecem em `noite_republicana`; exportadores e agro pagando a conta nunca viram cartão.
- **O 8 de janeiro e a condenação de Jair em cartão:** estão só em `fatos` até a cena do indulto; a anistia chega como "pacificação" sem lembrar o que se perdoa.
- **Agência do meu lado:** o PT rompendo com Lula por causa do Centrão; Gleisi e a bancada agindo, não só "cobradas"; um caminho jurídico ativo (denúncia da PGR, PSOL levando a cassação adiante); outros nomes para 2030 (Camilo Santana, Boulos) além de Fonteles e Haddad.
- **Custo para Moraes e para a PGR:** nenhum dos dois paga nada em caminho nenhum. Pesa nos dois sentidos.

**5. Propostas**

1. **`cap01` `abertura`, cartão 2:** "De lá, publicou uma carta em que se dizia 'o verdadeiro presidente eleito'. Fala em fraude, sem provas. Horas depois, trocou por 'líder do Brasil'."
2. **`cap02` `natal_do_acordo`, cartão 2:** "O PL ganha cargos e larga Marinho. Alcolumbre ganha a reeleição e fica devendo a todos. Lula ganha um Senado calmo, e passa a dever a Alcolumbre." Eco em `lados`, atribuído: "Para a base do PT, o Acordo deixou o caso de Flávio fora da conversa de propósito. Para o governo, o caso é da Justiça, não do Senado."
3. **`cap03` `o_senado_da_oposicao`, novo cartão:** "Na primeira semana, a base do PL cobra a anistia. Quem preside tem de dizer se pauta, e o Centrão que deu os votos quer outra coisa."
4. **`cap02` `miami`, `lados`:** "Para os exportadores atingidos, a taxa tem a digital de quem a pediu em Washington, e Eduardo agradeceu a primeira. Para os aliados dele, a culpa é do governo Lula e do Supremo." O fato pode subir para `fatos` com as fontes que estão em comentário em `noite_republicana` (InfoMoney e Gazeta).
5. **`cap03` `o_ministerio`, nova escolha:** "A bancada do PT rompe e vota contra os ministérios do Centrão" (marca `pt_rompe`, vai para `o_foro`, eco no epílogo: "O PT disse não ao Centrão no primeiro mês. Lula ganhou uma base mais fiel e perdeu os votos que faltam."). De quebra: nome do procurador-geral nos rótulos de `pedido` e `o_parecer`, ou tirar o de Moraes.

Não alterei nenhum arquivo. Li `content/jogo.yaml`, os três capítulos e `DESIGN.md`, seções 8 a 8.2.
