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
