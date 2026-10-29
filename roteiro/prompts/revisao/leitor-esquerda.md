# Leitor de esquerda

- Etapa: Revisão
- Rodado em: 2026-10-29 (noite); a primeira rodada foi em 2026-10-29 01:21 UTC
- Modelo: `claude-opus-5-5`, como subagente do Claude Code
- Produziu: a resposta está no fim deste arquivo

O texto abaixo é o prompt exato que o agente recebeu. O único ajuste foi trocar o caminho da pasta no computador pelo caminho dentro do repositório.

````text
Você vai revisar a neutralidade de um jogo narrativo brasileiro, "Trama", lendo como um jogador DE ESQUERDA (eleitor do PT ou do campo progressista, crítico do bolsonarismo e do Centrão, mas não militante cego e capaz de reconhecer erros do governo). Responda em português.

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

**1. Veredito**

Achei o jogo mais justo do que eu esperava. Nos fatos ele não pende contra mim: a fraude vem sempre marcada como "sem provas" e acompanhada da checagem, e a condenação de Jair e a de Eduardo estão lá com fonte. Onde ele pesa contra o meu lado é no papel que dá à esquerda. O PT aparece quase só pedindo punição ou cargo, e a política, a rua e o futuro ficam com a direita.

**2. Onde me senti tratado de forma injusta**

- **O PT só pune ou pede cargo** (padrão em vários arquivos), gravidade **alta**. Em `cap01/pedido` o PT pede a prisão e o bloqueio. Em `cap02/a_cadeira` e `o_lado_de_lula`, "O PT cobra que a vaga… fique com Gleisi Hoffmann". No epílogo: "O PT achou pouco", "O PT chama de leniência", "o PT esperou com ele, sem paciência". Cada frase tem fonte ou faz sentido sozinha. Somadas, dizem que a esquerda quer vingança e emprego.
- **`cap02/natal_do_acordo`**, gravidade **média**: "engaveta o que a base dele pedia contra a família Bolsonaro". A frase transforma o pedido de que a lei valha para todos numa perseguição pessoal, que é justamente a narrativa do outro lado.
- **`cap02/o_orcamento`, em `lados`**, gravidade **média**: "No PT, mexer nesses programas é tabu". Quem defende o ajuste ganha "o caminho é…", e o PT ganha "tabu", palavra de dogma. Os rótulos também pesam: "Durigan corta gastos" contra "Lula segura os programas e adia". O corte fica com o técnico e o adiamento com Lula.
- **`cap01/o_parecer`**, gravidade **média**: "quem tem coragem de contrariar o Supremo". O narrador chama de coragem um dos lados. "Muita gente lê isso como um recuo" também é leitura dita na voz do narrador.
- **`cap01/pedido`, em `fatos`**, gravidade **média**: o arquivamento de Raquel Dodge em 2019 entra como fato com fonte. É o argumento dos críticos do STF, fora deste caso. A defesa de Moraes fica só em `lados`, sem fonte. O fato escolhido arma um lado.
- **`cap02/abertura`**, gravidade **média**: "A direita tem votos… O que não tem é alguém que fale por ela." O capítulo 2 inteiro gira em torno da herança da direita. A esquerda é cenário.
- **`cap02/o_voo_de_volta`, caminho dos deportados**, gravidade **baixa**: "A oposição acusa Lula de ter trocado os dois por uma taxa menor." A acusação fica no cartão e a resposta do governo só em `lados`.
- **Tela inicial**, gravidade **baixa a média**: a luz verde e amarela passando pelo TRAMA, sobre fundo escuro, eu leio como estética do bolsonarismo antes de ler uma linha.

**3. Onde o jogo favorece o meu lado (para calibrar)**

- No prólogo e em `cap01/abertura`, a fraude vem "sem provas", e os 34 mil votos depois das 17h aparecem ao lado da diferença de 4,4 milhões. A regra 10 de DESIGN 8.1 está bem aplicada.
- Em `cap01/o_exilio`, nenhum governo reconheceu Flávio, "inclusive governos de direita".
- Em `noite_democrata`, a reportagem da Reuters sobre funcionários de Trump. Em `a_rota`, Bullrich e a investigação argentina.
- Em `a_herdeira`, a condenação de Jair a 27 anos aparece em frase plana.
- Em `a_paz_de_natal`: "Para a oposição, o perdão é a prova de que havia o que perdoar". Para mim é um presente, e um leitor de direita vai reclamar com razão.
- Há caminhos de ruína para a família em vários galhos: prisão, Interpol, deportação, cassação.

**4. O que falta**

- **Custos do outro lado:**
  - O Centrão nunca paga nada. As emendas de R$ 44,8 bi aparecem como fato, mas sem custo político para ninguém.
  - Tarcísio quase não tem custo além do dinheiro federal.
  - A narrativa de fraude não custa nada à própria direita: falta a escolha "a narrativa pega / não pega" que DESIGN 8 prevê.
  - O papel de Eduardo no pedido de sanções aparece numa linha só (`noite_republicana`).
- **Atores e desfechos do meu lado:**
  - A rua de esquerda. A direita tem dois atos, `a_convocacao` e `a_anistia_na_rua`. Centrais, MST e movimentos nunca reagem.
  - O PSOL só aparece em `fatos`. Haddad e a bancada do PT nunca agem por conta própria.
  - A agenda do governo além do ajuste fiscal.
  - Um caminho em que a esquerda ganha o Senado ou uma pauta sem depender de Alcolumbre.
  - No caminho do indulto, a escolha de o PT romper com Lula. A militância só "vai para as redes".

**5. Propostas de correção**

1. **`cap02/o_orcamento`, em `lados`**, troque a segunda frase por: "Para quem defende o ajuste, o caminho é rever benefícios fiscais de empresas e programas que se sobrepõem, como o Bolsa Família e o abono. No PT, esses programas sustentam o voto que fez a virada, e a saída preferida é cobrar mais de quem ganha mais. Para os críticos, isso adia a conta."
2. **`cap02/natal_do_acordo`**, segundo cartão: "Lula ganha um Senado calmo e engaveta o que a base dele pedia: que Flávio respondesse à Justiça como qualquer um."
3. **`cap01/o_parecer`**: no segundo cartão, "Moraes não manda prender. A oposição chama de recuo; o governo, de prudência." No terceiro, "Em Brasília, a pergunta passa a ser quem se dispõe a contrariar o Supremo, e o que ganha com isso."
4. **`cap02/a_anistia_na_rua`**: transformar o final em decisão, espelhando o pedido de Nikolas. Escolhas:
   - "Centrais e movimentos marcam outro ato contra a anistia". Custo: duas ruas, e o Centrão cobra mais caro.
   - "Lula pede que a base não vá às ruas". Custo: a militância se sente calada.

   Os dois atos ficam como simulação, com comentário YAML.
5. **`cap02/o_voo_de_volta`, cartão dos deportados**: "Em Miami, os apoiadores chamam de traição de Trump. A oposição acusa Lula de ter trocado os dois por uma taxa menor; o governo diz que não pediu a deportação e que agora o caso é da Justiça."

Nenhum arquivo foi alterado. Li os três arquivos de conteúdo e as seções 8, 8.1 e 8.2 do `DESIGN.md`, inteiros. Não abri `roteiro/painel/01-neutralidade.md` nem `00-agregado.md`.
