# Agregador das seis lentes

- Etapa: Painel
- Rodado em: 2026-10-28 21:34 UTC
- Modelo: `claude-opus-5-5`, como subagente do Claude Code
- Produziu: `roteiro/painel/00-agregado.md`

O texto abaixo é o prompt exato que o agente recebeu. O único ajuste foi trocar o caminho da pasta no computador pelo caminho dentro do repositório.

````text
Você é o AGREGADOR de um painel de previsão feito para um jogo narrativo de ficção especulativa sobre a política brasileira até 2030 ("Trama"). Hoje é 28/10/2026. Escreva em português.

O JOGO (para você entender o que está desenhando): o jogador é o "destino" e escolhe entre 2–3 opções por nó; cada capítulo é uma pequena árvore que converge em 1–3 finais e passa "marcas" (memória invisível) para os capítulos seguintes. Há três grandes "cismas" em que a história se separa de verdade. Decisões com escolhas reais travam quando a realidade decide. O objetivo do jogo é "abrir os olhos de qualquer lado": interesse acima de discurso, toda vitória com custo escondido, equilíbrio entre campos. Leia DESIGN.md (seções 2–8) para a estrutura, pesquisa/00-sintese.md para a espinha da trama ("O Acordo" de bastidor do Senado), content/capitulos/cap01-a-carta.yaml (capítulo 1 já escrito, e as marcas que ele cria) e roteiro/cap02-o-espolio.md (esqueleto do capítulo 2).

O PAINEL: seis agentes, cada um com uma lente, responderam às mesmas 19 perguntas de roteiro/painel/perguntas.md. Os arquivos estão em roteiro/painel/: instituicoes.md, economia-ortodoxa.md, economia-heterodoxa.md, juridico.md, internacional.md, eleitoral.md. Leia todos por inteiro.

TAREFA — escreva roteiro/painel/00-agregado.md com:

1. ## Aviso — uma frase: são agentes simulando lentes analíticas, não especialistas reais; os números servem ao desenho do jogo, não são previsão publicável.
2. ## Tabela de previsões — para cada pergunta (1–17): o número de cada painelista, a mediana e a amplitude (maior − menor). Para perguntas com distribuição, use a opção principal e a mediana dela.
3. ## Consenso e divergência — classifique cada pergunta em: CONSENSO (amplitude pequena e probabilidade longe de 50%), INCERTEZA COMPARTILHADA (todos perto de 50%), DIVERGÊNCIA (lentes discordam de verdade). Para as divergências, explique o PORQUÊ de cada lente — é isso que vira conteúdo do jogo.
4. ## Achados que só um ou dois painelistas viram — liste e julgue cada um (relevante para o jogo? em que ato?). Inclua pelo menos: a Mesa de fev/2029 (Alcolumbre e Motta não podem se reeleger na mesma legislatura — o Acordo tem prazo); o parole de Flávio vencendo em 27/10/2027; a troca no BC em dez/2028; Alckmin assumindo e podendo concorrer em 2030; a vaga de Gilmar em 30/12/2030; a eleição argentina de 2027; a PEC contra decisões monocráticas; o suplente de Flávio (Paulo Marinho); a Itália/Pizzolato. Marque o que precisa ser conferido (vários painelistas marcaram dados como [conferir]/[MEMÓRIA]).
5. ## Regra de desenho — como usar o painel no jogo: CONSENSO → galho principal (mais texto, mais cenas); INCERTEZA COMPARTILHADA e DIVERGÊNCIA → as decisões mais difíceis do jogador; galhos de baixa probabilidade → existem, mas raros e marcados como apostas.
6. ## Estrutura proposta dos atos (2026–2030) — capítulos com período, pergunta central e frente dominante, do Ato I (já em curso: cap. 1 "A carta", cap. 2 "O espólio") até o epílogo "O Brasil em 2031". Defina os TRÊS CISMAS concretamente (quando, qual decisão, quais histórias se separam), escolhendo-os entre as perguntas de divergência/incerteza. Mostre os ECOS LONGOS: que marca do cap. 1 ou 2 paga em qual capítulo futuro.
7. ## Finais — uma matriz pequena: "o Brasil em 2031" (4–6 estados) × fatores que levam a cada um. Garanta caminhos de vitória e de ruína para cada campo.
8. ## Previsão do Trama por nó — proposta de como guardar, em cada nó, a probabilidade agregada do painel (para depois comparar painel × jogadores × realidade). Sugira o formato no YAML (ex.: `previsao: { painel: 0.62, data: 2026-10-28 }` na escolha).
9. ## O que conferir antes de escrever — lista de dados duvidosos.

Seja concreto e equilibrado. Não invente dados além do que os painelistas e a pesquisa trouxeram. Ao terminar, responda só com um resumo de 12 linhas (os três cismas, os consensos mais fortes, as divergências mais úteis) e o caminho do arquivo.
````
