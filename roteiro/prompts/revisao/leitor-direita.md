# Leitor de direita

- Etapa: Revisão
- Rodado em: 2026-10-29 (noite, com o capítulo 3); a primeira rodada foi em 2026-10-29 01:21 UTC
- Modelo: `claude-opus-5-5`, como subagente do Claude Code
- Produziu: a resposta está no fim deste arquivo

O texto abaixo é o prompt exato que o agente recebeu. O único ajuste foi trocar o caminho da pasta no computador pelo caminho dentro do repositório.

````text
Você vai revisar a neutralidade de um jogo narrativo brasileiro, "Trama", lendo como um jogador DE DIREITA (eleitor do PL ou de Tarcísio, crítico do STF e do governo Lula, mas não extremista e não conspiracionista). Responda em português.

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

## 1. Veredito
É mais justo do que eu esperava: mostra os custos do governo, põe na tela o "lambe as botas" de Lula, cita o inquérito das fake news e deixa a direita vencer o Senado. Mas pende levemente contra mim, não pelos fatos e sim pelo enquadramento: o narrador repete "fuga", "a família" em Miami vira um coro de ressentimento em quase toda cena, e as saídas legítimas da direita (Justiça, revisão de penas) nunca viram escolha.

## 2. Onde me senti tratado de forma injusta
| Arquivo / nó | Trecho | Por que incomoda | Grav. |
|---|---|---|---|
| cap01 `a_rota`, `o_voo_fretado`; epílogo `chanceler_interpelado` | "Na Argentina, a fuga virou escândalo"; "A fuga deixa de ser um caso só do Brasil"; "teve de explicar a fuga" | O próprio prólogo diz "Ele não é foragido" (nota da PF). O narrador assume a palavra de um lado. | Alta |
| cap01 `abertura` | "Fala em fraude, sem provas" | A checagem fica no cartão, mas o gancho real (prorrogação até as 19h a pedido da campanha de Lula; a cobrança de Valdemar sobre gastos) fica escondido em `fatos`. A regra 8.1 nº 10 pede o fato e a checagem juntos. | Média |
| cap01 `foragido` | "A primeira versão da carta dizia que não havia ordem de prisão contra ele. A ordem saiu dias depois." | Frase-golpe na voz do narrador (8.1 nº 5). | Média |
| cap01 `o_exilio` | "Ele não foi reconhecido por nenhum." | Mesmo tom de "pegadinha". | Baixa |
| cap01 `pl` | "O PL abraça a carta e parte para o confronto" | A única saída combativa vem amarrada à carta; não existe oposição dura sem endossar a tese de fraude. | Média |
| cap02 `o_racha`, `a_frente_desfeita`, `a_herdeira`, `a_mesa`, `heranca_em_disputa` | "a família chama os dissidentes de traidores"; "a família lembra que nunca quis a frente" | "Em Miami" vira refrão de ressentimento. A militância do PT também reclama, mas não com essa frequência. | Média |
| cap02 `a_briga` | "Michelle responde com um versículo." | A fé vira efeito de cena. | Baixa/média |
| cap02 `a_herdeira` (fatos) | "Jair Bolsonaro foi condenado pelo Supremo a 27 anos e 3 meses por tentativa de golpe" | Para Flávio há "Flávio nega irregularidades"; para Jair, nenhuma linha com a posição dele. | Média |
| cap02 `a_anistia_na_rua` (lados) | "é perdoar crimes contra a democracia que o Supremo já julgou" | O lado contrário tem argumento jurídico; o meu, só "pacificação". Falta o argumento central: penas desproporcionais para quem não planejou nada. | Média/alta |
| cap01 `a_votacao_da_prisao` | "Para o PL, é a primeira chance de mostrar que o Senado protege os seus." | Reduz a defesa do art. 53 a corporativismo. | Baixa |

## 3. Onde o jogo me favoreceu (para calibrar)
- `itamaraty`: "lambe as botas" de Lula e ministros culpando Moraes em reserva.
- `pedido`: o inquérito das fake news e o arquivamento pedido por Raquel Dodge.
- `foragido`: as recusas anteriores da Interpol (Oswaldo Eustáquio) por caráter político.
- `o_orcamento`: os R$ 36 bi da IFI e "parte dele cai sobre quem apoiou Lula".
- Vitórias do meu lado: Tereza Cristina ou Marinho vencem Alcolumbre, sem custo real para a base vencedora; `o_senado_da_oposicao`, "a chave da gaveta agora é da oposição".
- `a_paz_de_natal`: "a família queria revisão, não favor".
- Capa: o verde e amarelo do título soa a "nossas cores" (a revisão anterior já notou).

## 4. O que falta
- **Custos do outro lado:** Moraes nunca erra nem paga; quando o Senado derruba a prisão, o custo cai nos senadores, não nele. Não existe "Moraes revoga a prisão" em `a_custodia` (só mantém ou troca por tornozeleira). Nenhum desgaste do governo fora do fiscal.
- **Escolhas do meu lado:** caminho jurídico da oposição (os gastos do governo perto da votação, cobrados por Valdemar, nunca viram escolha, por exemplo levar ao TSE); redução das penas do 8 de janeiro votada no Congresso (a anistia é sempre empurrada para 2027); Flávio reconhecer o resultado e se moderar; governadores de direita além de Tarcísio; impeachment de ministro do STF como escolha concreta.

## 5. Propostas
1. **Trocar "fuga" na voz do narrador.** `a_rota`: "Na Argentina, a saída de Flávio virou escândalo." `o_voo_fretado`: "O caso deixa de ser só do Brasil." Epílogo `chanceler_interpelado`: "teve de explicar a passagem de Flávio ao Congresso."
2. **cap01 `abertura`, novo cartão com gancho e checagem:** "A carta cita a votação prorrogada até as 19h, a pedido da campanha de Lula. Depois das 17h votaram 34 mil pessoas. A diferença foi de 4,4 milhões."
3. **Custo para Moraes.** Epílogo `prisao_derrubada`: "Para Moraes, foi a primeira vez que o Senado desfez uma ordem dele num caso político; para o PT, a prova de que o Senado protege os seus." Em `a_custodia`, nova escolha "Moraes revoga a prisão", com marca e eco no epílogo.
4. **Caminho jurídico da direita.** Em `pl`, trocar `obstrui` por "O PL leva os gastos do governo ao TSE", com consequência dupla ("A ação quase não tem chance de mudar o resultado, mas mantém o tema vivo; para o governo, é a prova de que a direita não aceita a derrota"). Separar "abraça a carta" do confronto institucional.
5. **Anistia em par.** `a_anistia_na_rua` (lados): "Para quem foi à rua, a anistia é pacificação, e muitas penas do 8 de janeiro foram maiores que o que cada um fez. Para quem se opõe, é perdoar crimes contra a democracia que o Supremo já julgou." Em `a_herdeira` (fatos): "Bolsonaro nega ter tentado um golpe", só com duas fontes conferidas.

Não alterei nenhum arquivo.
