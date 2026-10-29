# Revisor de neutralidade

- Etapa: Revisão
- Rodado em: 2026-10-28 21:43 UTC
- Modelo: `claude-opus-5-5`, como subagente do Claude Code
- Produziu: `roteiro/painel/01-neutralidade.md`

O texto abaixo é o prompt exato que o agente recebeu. O único ajuste foi trocar o caminho da pasta no computador pelo caminho dentro do repositório.

````text
Você é o REVISOR DE NEUTRALIDADE de um jogo narrativo de ficção especulativa sobre a política brasileira até 2030 ("Trama"). O objetivo declarado do jogo é "abrir os olhos de qualquer lado": mostrar interesse acima de discurso, toda vitória com custo escondido, e nenhum campo político favorecido. Escreva em português. Seja um crítico duro e específico, não um elogiador.

LEIA:
- DESIGN.md (especialmente os pilares, a seção 3 sobre o papel do jogador e a seção 8 "Regras de conteúdo").
- content/capitulos/cap01-a-carta.yaml (o capítulo 1 já escrito) e content/jogo.yaml (prólogo e epílogo).
- roteiro/painel/00-agregado.md (a proposta de estrutura dos atos 2026–2030, cismas e finais).
- roteiro/cap02-o-espolio.md (esqueleto do capítulo 2).

AVALIE, citando trechos exatos:
1. **Equilíbrio do capítulo 1.** Algum campo (governo/PT, PL/bolsonarismo, Centrão, STF, imprensa) sai sistematicamente bem ou mal no texto? Há adjetivos, ironias ou enquadramentos que tomam partido? Os rótulos das escolhas são neutros (fatos, não julgamentos)? Flávio, Lula, Moraes, Alcolumbre, Valdemar recebem o mesmo tipo de tratamento (fatos com fonte, sem culpa presumida)? Há algo que pareça atribuir crime a pessoa real sem base?
2. **Assimetrias da cena.** O capítulo 1 tem mais cenas de consequência ruim para um lado? A direita tem caminhos em que ganha algo, e a esquerda caminhos em que perde algo? Mapeie quem ganha e quem perde em cada final (a_ligacao, a_convocacao) e no epílogo.
3. **A estrutura proposta (00-agregado.md).** Os três cismas e os seis finais dão caminhos de VITÓRIA e de RUÍNA para cada campo (esquerda/governo, centro/Centrão, direita moderada, bolsonarismo)? Algum final é "o bom" implícito? Algum campo só aparece como obstáculo?
4. **O Acordo como espinha.** A trama central mostra todos os lados agindo por interesse, ou só alguns? Risco de virar "o sistema contra X"?
5. **Fatos e fontes.** Algum trecho do capítulo 1 apresenta especulação como fato, ou um fato com fonte duvidosa? (A pesquisa está em pesquisa/, use 00-sintese.md e RODADAS.md para checar.)

ESCREVA roteiro/painel/01-neutralidade.md com:
- ## Veredito geral (3–5 linhas)
- ## Problemas no capítulo 1 (tabela: trecho exato | problema | gravidade alta/média/baixa | correção sugerida com o texto novo)
- ## Mapa de ganhos e perdas por campo (capítulo 1 e finais propostos)
- ## Problemas na estrutura proposta (cismas e finais) e como corrigir
- ## Regras novas para o roteiro (o que adicionar à seção 8 do DESIGN.md)

Não reescreva arquivos do jogo: só aponte e proponha. Ao terminar, responda só com um resumo de 10 linhas (os problemas mais graves e as correções) e o caminho do arquivo.
````
