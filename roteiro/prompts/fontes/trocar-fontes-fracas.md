# Troca de fontes fracas

- Etapa: Fontes
- Rodado em: 2026-10-29 14:44 UTC
- Modelo: `claude-opus-5-5`, como subagente do Claude Code
- Produziu: listas `fontes:` em content/capitulos/

O texto abaixo é o prompt exato que o agente recebeu. O único ajuste foi trocar o caminho da pasta no computador pelo caminho dentro do repositório.

````text
Tarefa curta de checagem de fontes no jogo Trama (a raiz do repositório), em português do Brasil. Hoje é 29/10/2026.

Contexto: cada fato do conteúdo tem `fontes:` (lista de URLs). A regra, que `npm run validate` cobra, é: um documento oficial (domínios .gov.br, .jus.br, .leg.br, .gov) OU pelo menos duas fontes de veículos diferentes, sempre que possível de linhas editoriais diferentes (uma mais lida à direita, como Gazeta do Povo, O Antagonista, Revista Oeste, CNN Brasil, Jovem Pan, Estadão; e uma mais lida ao centro ou à esquerda, como Folha, O Globo/g1, UOL, Poder360, Metrópoles, Agência Brasil, BBC Brasil, CartaCapital, Brasil de Fato, Valor). Esses rótulos nunca aparecem no conteúdo.

Os 14 fatos abaixo cumprem a regra, mas usam sites pequenos, regionais ou contestados, fáceis de atacar: nilljunior, portalclaudiooliveira, radiopampa, bmcnews, asa.com.br, brasil61, cearaagora, tribunadoplanalto, sitioandino, gazetaweb, jornalgrandebahia, moderndiplomacy e brasilparalelo. Troque cada um desses links por um de veículo grande e reconhecido (ou documento oficial), mantendo a mistura de linhas editoriais. Pode manter os outros links do fato. Para achar os fatos, procure esses domínios em `content/capitulos/cap01-a-carta.yaml` e `content/capitulos/cap02-o-espolio.yaml` (são 5 fatos no cap01 e 9 no cap02). Dicas:
- IFI: o próprio relatório no senado.leg.br vale como oficial.
- Selic: a série do Banco Central (api.bcb.gov.br) já é oficial; o segundo link pode sair ou virar uma notícia grande.
- PL com 29 senadores: a nota do PL e a composição do Senado em 2027 provavelmente estão na Agência Senado ou em veículos grandes.
- Emendas no PLOA 2027: Agência Senado, Agência Câmara ou o próprio PLOA.
- Carta de Flávio citando Marinho: Gazeta do Povo, Jovem Pan e Metrópoles já foram usados no prólogo (`content/jogo.yaml`); confira se dizem isso.
- Bullrich: um veículo argentino grande (Clarín, La Nación, Infobae) no lugar do Sitio Andino.
- Reuters sobre Beattie e Pita: um veículo grande que republicou ou repercutiu a reportagem da Reuters, no lugar do Modern Diplomacy.

Regras:
- Nunca invente nem complete URL de cabeça. Abra cada link novo (WebFetch; se o site bloquear, o navegador interno) e confirme que ele diz o que o fato afirma.
- Mexa só nas listas `fontes:`. Só mude o `texto` de um fato se as fontes novas não sustentarem uma parte dele (aí reescreva para o que elas confirmam e diga no relatório). Não toque em cartões (`texto` do nó), `lados`, escolhas, ids.
- Se não achar substituto melhor para algum, deixe o link antigo e registre.
- No fim rode `npm run validate` (sem erros) e `npm test`.

Relatório curto: para cada um dos 14 fatos, o link que saiu, o que entrou (domínio) ou "mantido, sem substituto", e qualquer texto reescrito.
````
