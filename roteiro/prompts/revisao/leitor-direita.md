# Leitor de direita

- Etapa: Revisão
- Rodado em: 2026-10-29 01:21 UTC
- Modelo: `claude-opus-5-5`, como subagente do Claude Code
- Produziu: a resposta está no fim deste arquivo

O texto abaixo é o prompt exato que o agente recebeu. O único ajuste foi trocar o caminho da pasta no computador pelo caminho dentro do repositório.

````text
Você vai revisar a neutralidade de um jogo narrativo brasileiro, "Trama", lendo como um jogador DE DIREITA (eleitor do PL ou de Tarcísio, crítico do STF e do governo Lula, mas não extremista e não conspiracionista). Responda em português.

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

# Revisão de neutralidade: leitura de um eleitor de direita (cap01, cap02, prólogo e epílogo)

## 1. Veredito
O jogo é mais justo do que eu esperava. Ele mostra a direita rachada, com Tarcísio, Valdemar e Nikolas agindo com moderação, e o detalhe põe em cena o que a defesa de Flávio alega. Mesmo assim, em alguns pontos o narrador me trata como o lado que reage por reflexo, enquanto o PT fala em princípios. E o Supremo quase nunca aparece com interesse próprio. A inclinação contra mim é leve, mas existe.

## 2. Onde me senti tratado de forma injusta

| Arquivo / nó | Trecho | Por que incomoda | Gravidade |
|---|---|---|---|
| cap02 `a_conta` (último cartão) | "Para a família, qualquer decisão é perseguição, e qualquer demora, conchavo." | O PT ganha um princípio ("a lei vale para todos") e a família ganha um tique. Pelo teste da troca de sinais (8.1.4), a frase não passa. | Alta |
| cap01 `pl`, escolha `obstrui` | "O PL segue a carta, mantém Marinho e parte para o confronto" | O próprio detalhe diz que Marinho foi lançado por Valdemar antes da carta. O rótulo amarra uma disputa normal pelo Senado à tese da fraude. | Alta |
| cap01 `o_exilio`, escolhas | "volta a se dizer presidente…" / "…com lives todas as noites" | As duas saídas de Flávio são caricatas. Falta uma saída sóbria, e isso fere a regra 14 (agência). | Média-alta |
| cap01 `pedido` | "Quem decide é Alexandre de Moraes, o ministro do Supremo que cuida do caso." | O PT tem o interesse declarado ("custa pouco e rende muito"). Moraes não tem motivo nem interesse em cena, o que fere a regra 8.1.1, que cita o STF. | Média |
| cap01 `noite_republicana` | "Ninguém em Washington vai investigar tão cedo a ajuda à família." | Nesse galho a reportagem da Reuters não aparece. O narrador dá a "ajuda" como fato. | Média |
| cap01 `foragido` | "Na carta, Flávio tinha escrito que não havia ordem de prisão contra ele. Agora há." | É uma frase-golpe na voz do narrador (8.1.5). | Média-baixa |
| cap01 `o_exilio` | "Primeiro se disse presidente. Depois, líder do Brasil. Qual das duas vai valer?" e "até os de direita, parabenizaram Lula" | Os fatos procedem, mas o tom acumulado é de deboche. | Baixa-média |
| cap01 `pl` | "Dois dos 'ministros' são deputados do partido, e souberam pela imprensa." | Detalhe inventado, com aspas irônicas. | Baixa |
| cap02 `a_moeda` | "Os aliados de Trump mais barulhentos defendem Flávio" | O adjetivo "barulhentos" é juízo do narrador. | Baixa |
| cap02 `a_estreia` | "Fala de Jair e de fé." | Reduz Michelle à religião. | Baixa |
| cap02 `a_conta`, galho com prisão | "O mesmo valor já foi bloqueado de um advogado investigado no mesmo caso." | Aproxima Flávio do "caso das apostas" sem nunca dizer do que ele é investigado. Os R$ 6 bilhões ficam sem contexto. | Média |

## 3. Onde o jogo me favorece (para calibrar)
- **cap01 `abertura`, detalhe:** a prorrogação foi pedida pela campanha de Lula e decidida por Zanin. Faltou a comparação dos cerca de 35 mil votos com a margem, que a regra 10 pediria, e essa ausência me beneficia.
- **cap01 `pedido`:** o PT aparece com interesse eleitoral, e a PGR, em reserva, chama a apreensão do passaporte de "precipitada".
- **cap01 `itamaraty`:** cita o "lambe as botas" de Lula, e ministros acham precipitada a decisão do Supremo.
- **cap01 `o_parecer`:** "quem tem coragem de contrariar o Supremo" sugere um tribunal temido.
- **Epílogo:** em `stf_aprovado`, "sabe exatamente a quem deve a cadeira", e em `vaga_segurada`, "todo mundo em Brasília sabe o câmbio". As duas ironias pesam contra o STF e o governo, e também ferem a 8.1.5.
- **cap02 `heranca_em_disputa`:** "os erros de 2027 vão ser só dele".
- **Prólogo:** "Ele não é foragido… sem denúncia". A PF desmente o PT no próprio texto.
- **Tela inicial:** o brilho verde e amarelo sobre "TRAMA" me soa familiar, porque essas cores viraram símbolo do meu campo. Um eleitor de esquerda pode ler a mesma coisa como sinal bolsonarista.

## 4. O que falta
- **A crítica ao Supremo em cartão, com atribuição:** inquéritos abertos de ofício, em que o tribunal é vítima e julgador ao mesmo tempo. Hoje só existe "aliados dizem que é perseguição".
- **Do que Flávio é investigado.** O silêncio sobre isso não protege ninguém e deixa espaço para imaginar o pior.
- **Custos do governo que não dependam da família Bolsonaro:** contas públicas, juros, base no Congresso. Nos dois capítulos, o governo só reage à carta, ao Supremo e ao G20.
- **O STF pagando pelas próprias decisões.** Ele só aparece como alvo de pedidos de impeachment em fevereiro.
- **Uma saída para Flávio de quem age dentro das regras:** voltar e se defender, ou ficar calado com advogados.

## 5. Propostas

**1. cap02 `a_conta`, último cartão.** Trocar por:
"Para o PT, decidir rápido mostra que a lei vale para todos, e demorar seria privilégio. Para o PL, decidir rápido mostra pressa em punir quem nem foi denunciado."

**2. cap01 `pl`, escolha `obstrui`.** Novo rótulo:
"O PL mantém Marinho e parte para o confronto"
E levar para um cartão o fato do detalhe: "Marinho era candidato antes da carta. Valdemar o lançou em outubro."

**3. cap01 `o_exilio`, nova escolha.**
- Rótulo: "Flávio para de falar e deixa o caso com os advogados"
- Marca: `flavio_discreto`
- Para a marca não ficar sem uso, ligar a ela uma linha no epílogo: "Flávio quase não falou em novembro. A família chamou de estratégia; a base, de abandono."

**4. cap01 `pedido`, cartão ou detalhe sobre Moraes.**
"Críticos dizem que o Supremo investiga, julga e é alvo no mesmo caso. Moraes diz que defende a democracia. Decidir rápido reforça a autoridade dele; recuar pode ser lido como fraqueza."
Isso só entra com fonte das duas falas, conforme a 8.1.8.

**5. cap01 `noite_republicana`, segundo cartão.** Trocar por:
"Em Miami, alívio. Uma reportagem sobre funcionários de Trump ajudando a família não vai virar investigação tão cedo."
Pôr no detalhe a Reuters e a resposta do Departamento de Estado, se houver.
Aproveitar para reescrever o `foragido` em frase plana: "A carta dizia que não havia ordem de prisão. Agora há uma."
