# Capítulo 2 — planilha de equilíbrio (DESIGN.md 8.1, regra 16)

Quem ganha e quem perde em cada escolha e final. Campos: **Gov** (Planalto/PT), **Centrão**, **Dir. mod.** (Tarcísio, Kassab), **Bolso.** (família, PL de Flávio), **STF**, **Alcol.** (presidência do Senado).

## Escolhas

| Nó / escolha | Ganha | Perde | Custo escondido para quem escolheu |
|---|---|---|---|
| a_cadeira / `pacheco` | Alcol., STF, Centrão | Bolso. (vê Moraes fortalecido); base do Gov (vaga "entregue") | o ministro deve a cadeira ao Senado tanto quanto a Lula |
| a_cadeira / `campo` | base do Gov | Alcol. (perde a moeda do TCU) | o Senado cobra; risco da segunda derrota |
| a_cadeira / `segura` | Gov evita derrota | Alcol. (contava com Pacheco); STF fica com 10 | em fevereiro o PL tem 29 senadores para negociar a vaga |
| a_sabatina / `aprovado` | Gov, Alcol., STF | Bolso. | um ministro com credor no Senado (epílogo) |
| a_sabatina / `rejeitado` | quem ficou fora do Acordo; Bolso. | Gov (segunda derrota), STF (ministros que torciam) | o mesmo nome só no ano seguinte; a próxima indicação custa mais |
| a_herdeira / `michelle` | Michelle, PL pragmático | Flávio (fica de fora do discurso); Kassab | dois centros de comando (Miami e Brasília) |
| a_herdeira / `porta_voz` | a família | Michelle (sem cargo próprio) | ninguém sabe onde termina a família e começa ela; habilita o racha |
| a_herdeira / `ninguem` | Kassab, Tarcísio (tempo) | PL (guerra pequena) | sem dono, a direita vira "soma de votos à venda"; o Gov perde a desculpa |
| a_conta / `acelera` | PT (a lei vale para todos) | Bolso.; o PL fica ressentido com Alcol. | Alcol. precisa de cada voto que perdeu ali |
| a_conta / `deixa_correr` | PL (gesto de Alcol.) | PT (sem cassação) | o gesto é cobrado em fevereiro |
| a_conta / `licenca` | Flávio, a família | o Senado (perde o controle do calendário) | só disponível sem preventiva |
| a_conta / `bloqueia` | PT; a Justiça mostra ação | Flávio | vira prova de perseguição em Miami |
| a_conta / `nao_bloqueia` | Flávio | PT ("leniência") | — reconhecimento tardio, segundo a família |
| miami / `encontra` | canal Brasil–EUA | base do Gov ("sorriu para quem chamou a eleição de fraudada"); oposição ("pediu favor") | a tarifa não muda; Pequim guarda a foto |
| miami / `so_cupula` | Gov evita a foto | Gov perde a viagem | Pequim anota |
| miami / `nao_vai` | base do Gov ("dignidade") | Gov ("isolamento"); cadeira vazia ao lado da China | — |
| a_mesa / `fecha` | PL pragmático, Alcol., Gov, STF | Flávio, Marinho, as bases do PT e do bolsonarismo | o Acordo vale só até fev/2029 |
| a_mesa / `marinho` | base do PL | PL que queria cargos; Gov (primeira votação de 2027 vale tudo) | se Marinho perde, o PL perde junto |
| a_mesa / `racha` | Alcol. (escolhe com qual metade negociar), Kassab | a direita (maior bancada, menor unidade); Gov perde a desculpa | só disponível sem dono ou com Michelle porta-voz |

## Finais

| Final | Ganha | Perde | Quem some |
|---|---|---|---|
| natal_do_acordo | PL pragmático, Alcol., Gov (governabilidade), STF (gaveta) | Flávio, Marinho; as **duas** bases (PT e bolsonarismo) "perdem a mesma noite" | ninguém: todos pagam e recebem em cena |
| guerra_de_fevereiro | base do PL | PL dos cargos; Gov (Senado instável) | — |
| heranca_em_disputa | Alcol., Kassab, Tarcísio | a direita; Gov (sem desculpa) | — |

## Checagem
- **Gov** perde em 9 entradas e ganha em 6; tem decisões próprias com custo (a_cadeira, miami).
- **Bolsonarismo** perde em 7 e ganha em 6; tem agência própria (a licença, a escolha da herdeira, a mesa).
- **Centrão** ganha muito, e perde no `campo` e no `racha` (Kassab ganha, Alcol. fica refém); ponto a vigiar nos capítulos seguintes (rotas de ruína do Centrão, agregado).
- **STF** perde no `segura` e no `rejeitado`; ganha no `pacheco` e no Acordo.
- **Nenhum final bom implícito:** o Acordo nomeia o custo de cada parte e a perda das duas bases.
- **Ponto aberto:** a imprensa ainda não é ator no capítulo 2 (o nó "O editorial" fica para o Ato II, ver agregado).
