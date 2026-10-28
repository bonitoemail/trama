# Briefings dos agentes de busca

Use estes três briefings na Etapa 1. Troque os campos entre `<>`:
- `<DESDE>` e `<HOJE>`: a janela, que vai da data da última rodada em `pesquisa/RODADAS.md` até agora.
- `<NN>`: o próximo número livre em `pesquisa/`.
- `<RELOGIOS>`: os itens de `npm run estado` (vencidos, próximos 30 dias, sem data).
- `<NOS>`: os nós de decisão abertos do capítulo atual, com as opções.

Todo briefing termina com as mesmas regras e o mesmo formato, para as rodadas ficarem comparáveis.

---

## Comum a todos (cole no fim de cada briefing)

```
Contexto: você pesquisa para "Trama", jogo narrativo de ficção especulativa sobre a política brasileira até 2030.
Hoje é <HOJE>. Seu conhecimento interno é anterior: PESQUISE na web (WebSearch mode "extended"; WebFetch para ler).
Escreva em português.

Já apurado (não repita, só atualize se mudou): leia C:\Users\USER\trama\pesquisa\00-sintese.md e o fim de
C:\Users\USER\trama\pesquisa\RODADAS.md.

Os nós de decisão abertos no jogo são:
<NOS>
Para cada um, diga se a realidade já decidiu (por qual fato, com link) ou se segue aberto (e o que vigiar).

Regras:
- [FATO] só com duas fontes independentes de veículos estabelecidos, ou documento oficial. Blog ou rede social sozinho não basta.
- Para texto de pessoa real (carta, nota, post), confira a expressão exata, e de preferência a íntegra.
- Marque [FATO] (data, link), [ANÁLISE] (quem, veículo, data, link, paráfrase; citação literal de no máximo 15 palavras), [BOATO], [CONTRADIÇÃO] (as duas versões).
- Investigado não é culpado; pedido não é decisão. Seja equilibrado entre campos.
- Nunca invente fato, fonte ou citação. Se não achou, diga.

Formato do arquivo:
## Linha do tempo <DESDE> → <HOJE>
## Por ator
## O que decide (ou quase) nós do jogo
## Galhos novos que a realidade abriu (descrição, plausibilidade alta/média/baixa, quem sustenta)
## Contradições e o que conferir
## Fontes

Ao terminar, responda só com um resumo de 10 linhas e o caminho do arquivo.
```

---

## 1. Brasil

```
SEU TEMA: o que aconteceu no Brasil entre <DESDE> e <HOJE>.
1. Justiça: STF (Moraes e demais relatores), PGR, TSE, PF. Decisões, pareceres, pedidos novos sobre Flávio e família; caso Master; inquéritos.
2. Congresso: Senado (Alcolumbre, Marinho, mesas de 2027, faltas de Flávio), Câmara (Motta), PECs, sabatinas, indicação ao STF.
3. Governo: Lula, Planalto, ministros (Fazenda), Itamaraty; montagem do ministério; reação a fatos da oposição.
4. Direita: Flávio (o que disse, onde está, status nos EUA), Michelle, Eduardo, Jair, Tarcísio, PL, Valdemar.
5. Ruas e redes: atos convocados e realizados, com estimativa de público e fonte.
Escreva C:\Users\USER\trama\pesquisa\<NN>-brasil.md.
```

## 2. Mundo

```
SEU TEMA: a frente externa entre <DESDE> e <HOJE>.
1. EUA: Casa Branca, Departamento de Estado, Congresso (incluindo resultados eleitorais, se houve eleição), caso Beattie/Pita, status migratório de Flávio, tarifas e sanções contra o Brasil.
2. Argentina: governo Milei, Justiça (investigação da saída de Flávio), oposição, Caputo.
3. China e região: posições sobre o Brasil, comércio, OEA, governos latino-americanos.
Escreva C:\Users\USER\trama\pesquisa\<NN>-mundo.md.
```

## 3. Relógios e economia

```
SEU TEMA: os relógios do jogo e a economia.
Relógios a checar (vencidos ou dos próximos 30 dias):
<RELOGIOS>
1. Para cada relógio vencido: o que aconteceu (fato, data, fonte). Para os próximos: o que se espera e quem diz.
2. Mercado e economia no período: Ibovespa, dólar, DI, Copom, fiscal (projeto do ajuste, IFI, Tesouro), com fonte.
3. Datas a confirmar para relógios futuros (eleição argentina de 2027, municipais de 2028, fim do mandato do presidente do BC, prazo de desincompatibilização de 2030, 1º turno de 2030).
Escreva C:\Users\USER\trama\pesquisa\<NN>-relogios-economia.md.
```
