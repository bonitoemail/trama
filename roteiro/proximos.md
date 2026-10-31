# Próximos capítulos (mapa)

A numeração do jogo e a do esboço do painel (`roteiro/painel/00-agregado.md`, "Estrutura proposta dos atos") se separaram: o cap. 3 do jogo, "A posse", juntou os caps. 3 e 4 do esboço. Este arquivo é a fonte da numeração atual. A skill `atualizar-jogo` lê este mapa quando `npm run estado` avisa "ESCREVER O PRÓXIMO CAPÍTULO", e o atualiza depois de escrever um capítulo (a linha sai de "Pela frente" e vai para "Escritos").

O esboço é guia, não contrato. Antes de escrever, a pesquisa do período decide as perguntas (a regra da skill): o título, o recorte e as datas podem mudar, e dois capítulos do esboço podem virar um.

## Escritos

| Jogo | Esboço | Título | Período (`de` → `ate`) |
|---|---|---|---|
| 1 | 1 | A carta | 2026-10-29 → 2026-11-14 |
| 2 | 2 | O espólio | 2026-11-15 → 2026-12-31 |
| 3 | 3 e 4 | A posse (fim do Ato I) | 2027-01-05 → 2027-02-01 |

## Pela frente

| Jogo | Esboço | Título provisório | Período | Pergunta central (do esboço) | Escrever a partir de |
|---|---|---|---|---|---|
| 4 | 5 | A conta | fev–jun/2027 | O primeiro pacote fiscal (centro da meta, LCI/LCA, precatórios). O choque da paz acontece? (P9, P10) Herda `fazenda_*`, `centrao_*`, `ajuste_*`. | ~2027-01-02 |
| 5 | 6 | O preço | abr–ago/2027 | O que o Acordo entrega à direita, e por qual caneta: anistia "só penal", revisão criminal ou indulto (P5)? A PEC 8 anda (P6)? Herda `indulto_*`, `oposicao_no_senado`, `casos_*`. | — |
| 6 | 7 | Washington | ago–out/2027 | O parole de Flávio vence em 27/10/2027; a Argentina vota no mesmo mês. (P7) | — |
| 7 | 8 | O ano fiscal | nov–dez/2027 | A votação que fecha 2027 → **Cisma I** (capítulos diferentes conforme o final: só com o usuário). | — |
| 8–11 | 9–12 | Ato III (2028) | abr/2028–jan/2029 | A cadeira de Fux, as municipais, novembro (EUA e BC), o fim do prazo de Alcolumbre → **Cisma II**. | — |
| 12–14 | 13–15 | Ato IV (2029) | abr/2029–abr/2030 | A cadeira de Cármen, o ano pré-eleitoral, as alianças → **Cisma III**. | — |
| 15–18 | 16–19 | Ato V (2030) | jul–out/2030 | Convenções, campanha, primeiro e segundo turno. | — |
| — | — | Epílogo: O Brasil em 2031 | nov/2030–05/01/2031 | A vaga de Gilmar e a cadeia de causa e efeito da partida. | — |

"Escrever a partir de" é a data em que `npm run estado` passa a pedir o capítulo (30 dias antes do `de` do último capítulo escrito). Capítulo flutuante "A rua" (protesto, segurança pública): entra no Ato II ou III por marcas, sem lugar fixo.

## Radar

O que aconteceu e ainda não decide nada no jogo, mas pode virar pergunta num capítulo que falta escrever. Cada sinal fica sob o capítulo onde pode pesar, com a data, as fontes, o que confirmaria que ele pesa e em que pode virar. A skill `atualizar-jogo` põe aqui o fato do tipo "futuro" (Etapa 3), tira o que ficou velho ou foi desmentido a cada rodada, e lê o radar do capítulo antes de escrevê-lo: cada sinal vira pergunta ou cai, e sai daqui. `npm run estado` conta os sinais de cada capítulo.

Formato: um item por sinal, começando com `- **título**`, e as linhas "Confirma se" e "Pode virar" logo abaixo.

### Cap. 4, A conta

- **A semana do segundo turno derrubou a bolsa e subiu o dólar** (26 a 30/10/2026): Ibovespa −18% na semana, a pior desde março de 2020, com circuit breaker em 26/10; dólar a R$ 5,44, maior fechamento de 2026 e maior alta semanal desde 2008. Fontes: [CNN Brasil](https://www.cnnbrasil.com.br/economia/money/mercado/mercado-financeiro-ibovespa-dolar-30-outubro-2026/), [DGABC](https://www.dgabc.com.br/Noticia/4366080/fechamento-do-mercado-financeiro) (pesquisa 17).
  - Confirma se: o dólar segue acima de R$ 5,30 e a curva de juros embute alta da Selic até a posse; o Focus revisa forte.
  - Pode virar: o pacote fiscal deixa de ser escolha de calendário e vira resposta a uma crise; a escolha do ministro da Fazenda (cap. 3) passa a ecoar no câmbio.
- **Flávio fala em disputar a Presidência "antes de 2030"** (30/10/2026, live): sem dizer como. Uma leitura liga a fala às ações no TSE contra a chapa Lula–Alckmin (Reuters); outra, à aposta numa crise econômica e num impeachment (Gazeta do Povo). Fontes: [Poder360](https://www.poder360.com.br/poder-eleicoes-2026/dos-eua-flavio-sugere-disputar-nova-eleicao-presidencial-antes-de-2030/), [Gazeta do Povo](https://www.gazetadopovo.com.br/republica/dos-eua-flavio-preve-crise-economica-de-lula-e-fala-em-possivel-eleicao-antes-de-2030/) (pesquisa 15).
  - Confirma se: a oposição leva a cassação da chapa ao TSE como estratégia, ou o impeachment entra no discurso do PL.
  - Pode virar: o caminho jurídico da oposição, que os leitores da revisão já pediam; uma escolha "a oposição aposta no TSE" ou "no impeachment".

### Cap. 5, O preço

- **Alcolumbre teria oferecido a liberdade de Jair em troca de votos, e o PL recusou em público** (28 a 30/10/2026): indulto humanitário de Lula ou anistia só penal, segundo aliados dele à Folha; senadores do PL e Flávio rejeitaram em público. O bastidor tem uma fonte só (a Folha); a recusa tem duas. Fontes: [Diario de Pernambuco, citando a Folha](https://www.diariodepernambuco.com.br/politica/2026/10/11727835-alcolumbre-articula-possivel-indulto-ou-anistia-para-bolsonaro-em-busca-de-apoio-da-direita.html), [Conexão Política](https://www.conexaopolitica.com.br/legislativo/pl-rejeita-acordo-com-alcolumbre-e-vai-lancar-marinho-a-presidencia-do-senado/), [DCM, citando a Folha](https://www.diariodocentrodomundo.com.br/bolsonaristas-negam-apoiar-alcolumbre-em-troca-de-indulto-ao-ex-presidente) (pesquisa 15).
  - Confirma se: Alcolumbre ou o PT falam do indulto em público, ou o tema volta depois da eleição da Mesa.
  - Pode virar: quem oferece o indulto e quem paga por ele; o trilho "O indulto" do cap. 2 ganha um eco no cap. 5.

### Capítulo flutuante, A rua

- **O primeiro ato depois da carta é contra Flávio** (convocado para 1º/11/2026, São Paulo, pela UNE e movimentos). Fontes: [Metrópoles](https://www.metropoles.com/sao-paulo/estudantes-convocam-ato-contra-flavio-em-sao-paulo-no-domingo-1o-11), [ICL Notícias](https://iclnoticias.com.br/estudantes-ato-paulista-contra-ameacas-flavio/) (pesquisa 15).
  - Confirma se: o público é grande, com estimativa de duas fontes, ou a direita convoca um ato em resposta.
  - Pode virar: "A rua" deixa de imaginar só a direita na rua.
