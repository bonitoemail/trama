---
name: atualizar-jogo
description: Atualiza o Trama com a realidade. Use quando o usuário disser "atualize o jogo", "atualizar o jogo", "o que mudou?", "rodada de atualização" ou mandar uma notícia nova para entrar no jogo. Busca online o que aconteceu desde a última rodada, confirma os fatos, mede o impacto em cada nó, propõe as mudanças, aplica texto, travas e imagens, ajusta o futuro e verifica tudo.
---

# Atualizar o jogo

O Trama começa sempre no acontecimento seguinte ao último fato real. Esta skill mantém isso verdadeiro sem quebrar o roteiro, o equilíbrio ou as imagens. Siga as etapas na ordem e mantenha o usuário no painel de tarefas (`update_plan`).

A skill tem dois modos:
- **Com o usuário** (padrão): ele está na conversa; siga as etapas e pergunte o que precisa de aprovação (Etapa 4).
- **Autônomo**: a rodada foi disparada por uma tarefa agendada, ou o pedido diz "modo autônomo". Ninguém está olhando. **A skill atualiza o jogo de verdade** (texto, travas, nós novos, imagens, commit), com as salvaguardas da seção "Modo autônomo" abaixo. Ela vale por cima das etapas onde as duas divergem.

---

## Modo autônomo

**Antes de começar**
- Anote a data e a hora de agora (`date`). A janela de busca vai da última rodada em `RODADAS.md` até agora.
- `git status` precisa estar limpo. Se houver mudança não commitada, **não mexa em nada**: o usuário está no meio de um trabalho. Faça só as etapas 0 a 3 e escreva o relatório (abaixo) explicando por quê.

**O que aplicar sozinho**
- Tudo o que é automático na Etapa 4: prólogo, trava com fato confirmado, correção factual, relógios, registro.
- Mudança de rótulo e reescrita de cena quando um fato confirmado exigir.
- **Galho novo e opção nova travada**, se a pergunta for real e levar semanas para se resolver, com cena própria nos dois lados e marca usada em alguma condição.
- **Imagens**: gerar, escolher pelo checklist do guia e publicar (Etapa 6), sem esperar escolha do usuário.

**O que nunca fazer sozinho** (vai para "Precisa de você" no relatório)
- Remover ou renomear nó, ou subir a `versao` (apaga as partidas salvas dos jogadores).
- Aplicar a regra de recuo (o capítulo 1 inteiro ficou para trás), criar um cisma ou apagar um final que já existe.
- Mexer no visual, na tela inicial ou no código do jogo (`src/`), salvo correção de um erro que impeça o build por causa do conteúdo.
- Escrever fato que só tem uma fonte, ou boato fora da voz de um personagem (ver "Regra das fontes").
- Push, deploy, publicar em qualquer lugar fora do repositório. O `main` publica o site sozinho na Vercel a cada push: só o usuário decide quando.

**O que aplicar sozinho, além disso** (as regras estão em "Travar, abrir ramos e trilhos" e em "O capítulo seguinte")
- Travar a escolha que a realidade decidiu, e ajustar as cenas do caminho real que passaram a contradizer o fato.
- Somar a escolha provável que falta num nó, quando um fato mostrar que ela falta.
- Abrir um trilho novo, se o fato abrir uma história que leva semanas e couber nas regras.
- Escrever o capítulo seguinte como `rascunho: true`, quando `npm run estado` disser "ESCREVER O PRÓXIMO CAPÍTULO" (seção "O capítulo seguinte").
- Melhorar esta skill com o que a rodada ensinou (Etapa 10), sem tirar nenhuma salvaguarda.

**O que nunca fazer sozinho, além disso**
- Fazer capítulos diferentes conforme o final (um cisma): precisa do usuário.
- Cortar uma escolha que ninguém desmentiu só porque ficou improvável.

**Revisão de equilíbrio obrigatória**
Depois de escrever e antes de commitar, rode as revisões da Etapa 8 ("Revisões no fim"): a de cobertura e os dois leitores, com os prompts publicados, pela skill `painel`. Corrija o que os dois leitores apontarem e o que for gravidade alta em qualquer um, e o que a cobertura apontar como alta. O que for divergência de gosto vai para o relatório.

**Verificação e commit**
- Rode a Etapa 8 inteira. O navegador é opcional: se não estiver disponível, jogue os caminhos que passam pelos nós alterados com `npm run jogar -- <semente> <cap>` e confira os textos.
- Tudo passou → **um commit só** em `main`, mensagem `Rodada AAAA-MM-DD: <resumo>`, com o corpo listando fatos, travas, nós novos e imagens, e a linha `Co-Authored-By` do projeto. Assim, desfazer a rodada é um `git revert`.
- Algo falhou e você não conseguiu corrigir → `git stash` não serve (ninguém vai ver). Crie a branch `rodada/AAAA-MM-DD`, faça o commit nela, volte para `main` limpo e explique no relatório.

**Relatório**
Escreva `pesquisa/rodada-AAAA-MM-DD.md` (entra no mesmo commit) com estas seções, nesta ordem:
1. **Resumo** em 3 a 5 linhas.
2. **Fatos confirmados** (com os links das duas fontes ou do documento oficial) e **boatos descartados**.
3. **O que mudou no jogo**: travas, textos, nós novos, imagens (reaproveitadas, refeitas, novas), com arquivo e id.
4. **Revisão de equilíbrio**: o que os dois leitores apontaram e o que foi corrigido.
5. **Precisa de você**: o que ficou de fora pelas regras acima, com a proposta pronta para aplicar.
6. **Verificação**: os comandos e o resultado.
Termine a execução com o mesmo resumo das 3 a 5 linhas e o caminho do relatório.

Arquivos que esta skill usa:
- `pesquisa/relogios.yaml`: datas e eventos a vigiar, ligados aos nós que afetam.
- `pesquisa/RODADAS.md`: histórico de rodadas e fatos novos (a data da última rodada está aqui).
- `content/jogo.yaml` (prólogo, epílogo, versão) e `content/capitulos/*.yaml`.
- `roteiro/proximos.md` (mapa dos próximos capítulos, com a numeração atual), `roteiro/cap*` (esqueleto e planilha de cada capítulo) e `roteiro/painel/00-agregado.md` (estrutura 2027–2030, ecos, finais).
- `DESIGN.md` 6.1 (travar o caminho real) e 8 / 8.1 (regras de conteúdo e de equilíbrio).
- `estilo/GUIA.md`, `estilo/prompts.py`, `estilo/cenas_cap*.py`, `estilo/escolhas.json`.

## Regra das fontes (vale em toda rodada, nos dois modos)
A fonte é o que sustenta a neutralidade do jogo: é a primeira coisa que um crítico de qualquer lado vai atacar. Por isso:
- **Todo fato tem `fontes:` (lista), nunca um link só.** Vale **um documento oficial** (domínio `.gov.br`, `.jus.br`, `.leg.br`, `.mp.br`, `.gov`: TSE, STF, Agência Senado, Câmara, Diário Oficial, Departamento de Estado) **ou pelo menos duas fontes de veículos diferentes**. Veículos do mesmo grupo contam como um (g1 e O Globo; Folha e UOL).
- **Linhas editoriais diferentes.** Sempre que der, uma fonte mais lida à direita (ex.: Gazeta do Povo, O Antagonista, Revista Oeste, CNN Brasil, Jovem Pan) e uma mais lida à esquerda ou ao centro (ex.: Folha, Estadão, O Globo/g1, Poder360, UOL, Metrópoles, Agência Brasil, BBC Brasil, CartaCapital, Brasil de Fato). Esses rótulos são só critério de escolha: **nunca** aparecem no conteúdo.
- **Wikipédia não é fonte.** Resultado de eleição vem do TSE.
- **Cada link foi aberto e diz o que o fato afirma.** Nunca escreva URL de cabeça.
- **Fato e leitura separados.** Nas cenas, "Fatos e fontes" tem duas partes: `fatos:` (`{ texto, fontes, se? }`, o que aconteceu e pode ser conferido, inclusive declarações atribuídas) e `lados:` (posições e motivos de cada lado, sem fonte, com a regra do par). Nunca ponha leitura em `fatos` nem fato sem fonte em `lados`.
- **Sem segunda fonte:** reescreva para só o que as fontes confirmam, ou mova para `lados` se for leitura, ou deixe fora e registre no relatório. Nunca rebaixe a regra.
- O validador cobra (`src/engine/fontes.ts`): fato do prólogo, fato de cena ou trava `real` com uma fonte só, ou com Wikipédia, é **erro** e o build falha.

## Como o jogo está montado (leia antes de mexer)

- **Capítulo** = uma **espinha** (as cenas que quase todo mundo vê) e **trilhos** (sequências próprias, de 3 a 5 cenas, que nascem de uma escolha e não voltam à espinha, ou só voltam no fim do capítulo, com outro final). Exemplos no cap. 2: "A volta" (Flávio no Brasil), "A campanha" (a frente de Tereza Cristina), "O indulto". No cap. 1: "A caçada" (a prisão, a votação no Senado, a Interpol).
- **Escolhas**: de 2 a 4 por nó. Escolhas com `se` aparecem só para quem tem as marcas; uma escolha pode ter versões com `se` opostos que levam a lugares diferentes (ex.: `o_orcamento` leva a Miami ou ao voo de volta, conforme `flavio_voltou`).
- **Capítulo** tem `periodo` (o texto que o jogador vê) e `de`/`ate` (as datas que o `npm run estado` usa para o horizonte).
- **Marcas** só se somam, nunca saem. Por isso a marca que decide um caminho nasce na escolha que decide, não antes (ex.: `flavio_preventiva` nasce na votação do Senado, não na ordem de Moraes). O validador explora só as marcas que mudam o caminho (`marcasDeFluxo`): marca usada só em texto não multiplica estados.
- **O validador avisa** quando um nó de decisão sobra com uma escolha só em algum caminho (sem contar travas reais), e quando um cartão, uma cena ou um rótulo sai do formato (`src/engine/formato.ts`). Aviso não quebra o build, mas toda rodada termina sem avisos novos.
- **Critério das escolhas** (vale em todo nó novo ou mexido): **somar** o desfecho provável que falta (quase sempre o meio-termo ou o adiamento) e **nunca cortar** o improvável que o jogador quer ver, desde que nenhum fato o desminta e o texto não venda simulação como fato. Um nó sem o desfecho provável é o erro mais comum (foi o da `a_herdeira`, sem Tarcísio).

---

## Etapa 0 — Retrato do estado

```bash
npm run estado
```
Leia o relatório: **horizonte** (em que capítulo a realidade está e se é hora de escrever o próximo), relógios vencidos, próximos 30 dias, itens sem data, travas, imagens, validador. Leia o fim de `pesquisa/RODADAS.md` para saber a data e o conteúdo da última rodada. A janela de busca vai **da última rodada até agora**.

Se o usuário trouxe uma notícia específica, ela é o primeiro item a confirmar, mas a rodada continua completa.

## Etapa 1 — Busca

Rode **três agentes em paralelo** (`Agent`, `general-purpose`, em segundo plano), com os briefings de `references/briefings.md`:
1. **Brasil** (Justiça, Congresso, governo, direita, ruas);
2. **Mundo** (EUA, Argentina, China, região);
3. **Relógios e economia** (cada relógio vencido ou dos próximos 30 dias, mercado, números a conferir).

Cada agente escreve `pesquisa/NN-<tema>.md` (próximo número livre) e devolve um resumo. Se o horizonte pedir o capítulo seguinte, rode também o briefing 4 (capítulo seguinte), no mesmo lote. Para uma notícia isolada e pequena, basta a busca direta (`WebSearch` em modo `extended`), sem agentes.

## Etapa 2 — Confirmação

Para cada fato candidato:
- **Fato** exige **duas fontes independentes de veículos estabelecidos, de linhas editoriais diferentes**, ou um documento oficial (STF, TSE, Senado, Diário Oficial, nota de governo). Blog, perfil em rede social, agregador ou Wikipédia **não** confirmam. Guarde os links das duas: vão para `fontes:` (ver "Regra das fontes").
- Confira **a expressão exata** (ex.: "líder do Brasil", não "líder da oposição"). Notícia sobre texto de pessoa real só entra depois de ver o texto ou a íntegra.
- Classifique: **[FATO]**, **[ANÁLISE]** (quem, onde), **[BOATO]** (sem confirmação), **[CONTRADIÇÃO]** (fontes divergem: registrar as duas versões).
- Investigado não é culpado. Pedido não é decisão.

## Etapa 3 — Impacto

Monte uma **tabela de impacto**: fato confirmado → o que muda no jogo. Cada fato cai em um ou mais tipos:

| Tipo | Quando | O que fazer |
|---|---|---|
| **Prólogo** | o fato acontece **antes** do início do capítulo 1 | nova entrada em `prologo` com data, `titulo` (manchete curta, uma linha) e `fontes` (oficial ou duas). O Agora da capa é o fato com `fixado: true`, não o mais novo: um fato de menos peso entra só na lista. Passar o `fixado` para o fato novo (só um no prólogo) é decisão do usuário: proponha na Etapa 4, com o porquê |
| **Trava** | o fato decide uma escolha existente | `real: { data, fontes }` na escolha (só uma por nó); relógio vira `aconteceu` |
| **Opção nova travada** | a realidade foi por um caminho que nenhuma opção previa | nova escolha já com `real`, e os nós que vêm depois dela |
| **Texto** | o fato muda o que uma cena afirma | reescrever só o trecho; manter os ids |
| **Galho morto** | o fato torna um galho impossível | não apagar: travar a escolha real; se não houver escolha real ainda, reescrever o rótulo como aposta (ex.: "retoma o título de presidente") |
| **Galho novo** | o fato abre uma pergunta que leva semanas a se resolver | propor nó novo (decisão + consequência própria) |
| **Opção que falta** | o fato mostra um desfecho provável (ou um ator de peso) que o nó não oferece | somar a escolha, com cena ou texto condicional, sem tirar as que já existem (ver "Travar, abrir ramos e trilhos") |
| **Trilho** | o fato abre uma história que leva semanas e muda quem age (ex.: Flávio volta ao Brasil) | trilho novo de 3 a 5 cenas, ou ajuste no trilho que já existe |
| **Futuro** | o fato muda probabilidades ou ecos de 2027–2030 | ajustar `roteiro/cap*` e `roteiro/painel/00-agregado.md`; criar relógio novo se houver data |
| **Imagem** | a cena mudou de lugar, de ação ou de sentido | ver Etapa 6 |

Pergunte sempre, para cada nó que o fato toca: **"a realidade decidiu algum destes? E que outro desfecho plausível ela abriu?"** A segunda pergunta é o que evita nós de opções curtas demais.

Regra de recuo: se o capítulo 1 inteiro ficou para trás no tempo, o que aconteceu vira prólogo e o capítulo é reescrito começando no acontecimento seguinte (foi o que se fez com a carta de 28/10).

## Etapa 4 — Proposta ao usuário

Antes de editar, mostre:
1. os fatos confirmados (com fonte) e os boatos descartados;
2. a tabela de impacto;
3. o que é **automático** e o que **precisa de aprovação**.

**Automático** (aplique logo depois de mostrar): entrada no prólogo, trava de escolha com fato confirmado, correção factual de texto, relógio atualizado, registro em RODADAS.
**Precisa de aprovação**: galho novo, nó removido ou reestruturado, mudança de rótulo de escolha, mudança nos cismas ou finais, imagem nova.

Se o usuário já disse "atualize o jogo" sem pedir revisão, aplique o automático e pergunte só o que precisa de aprovação, numa pergunta (`wrap_up` ou `AskUserQuestion`).

**No modo autônomo** não há proposta: siga "Modo autônomo" (o que aplicar sozinho e o que deixar para o usuário).

## Etapa 5 — Aplicar texto e travas

- Siga **DESIGN.md 8, 8.1 e 8.2** e o guia de escrita publicado, [`roteiro/prompts/escrita.md`](../../../roteiro/prompts/escrita.md), em cada trecho novo; `npm run validate` avisa o que sair do formato (linguagem simples: cartões curtos, sem jargão; o técnico vai em "Fatos e fontes": `fatos` com fontes e `lados`): motivo e interesse para todos, nenhuma escolha sem custo, regra do par, narrador sem piada, boato só como boato, gancho e checagem, mesma regra de nome.
- Toda paráfrase de pessoa ou instituição real ganha comentário YAML com o link; se for fato citado na cena, vai também para `fatos:` com as fontes.
- Trava: `real: { data: "AAAA-MM-DD", fontes: ["<url>", "<url>"] }` (oficial ou duas; a data é a do dia da notícia, no horário de Brasília, e o validador recusa outro formato: `/escolhas` corta os votos por ela). A interface mostra "aconteceu em…" e o fio laranja na linha do tempo.
- **Versão** (`content/jogo.yaml`): suba quando um nó for **removido ou renomeado** ou um capítulo mudar de início (partidas salvas antigas são descartadas). Só texto, trava ou nó novo: não precisa subir.
- Atualize `pesquisa/relogios.yaml`: `status: aconteceu` + `resultado` com fonte; crie relógios novos.

## Travar, abrir ramos e trilhos

**Travar o que aconteceu**
1. Uma escolha por nó recebe `real: { data, fontes }`; as outras continuam visíveis e travadas ("isso não aconteceu"). Nunca apague as outras: elas são a história que não aconteceu, e o validador sabe que estão atrás de uma trava.
2. Se a realidade não cabe em nenhuma escolha, crie a **opção nova já travada** e o que vem depois dela (cena de consequência, e trilho se precisar).
3. **Siga o caminho real até o fim do capítulo.** Toda cena dele que agora contradiz um fato vira texto novo (os ids ficam). Se o caminho real entra num trilho, o trilho passa a ser a história real: as simulações dele que a realidade desmentiu saem, as que ela confirmou viram fatos com fonte.
4. Nós que dependiam do travado (escolhas com `se` de uma marca que agora nunca existe no caminho real) continuam escritos para quem joga os outros caminhos.
5. Rótulo da escolha travada: se ele simplifica demais o que aconteceu, ajuste para o que as fontes dizem (a interface mostra "aconteceu em…").

**Somar uma escolha (opção que falta)**
- Se o nó tem 4 escolhas visíveis, não some: ponha o desfecho como texto da cena, ou num nó seguinte.
- A escolha nova precisa de custo para alguém, de leitura em `lados` (regra do par) e de um eco (marca usada em alguma condição; o validador cobra).
- Escolhas com `se` mutuamente exclusivos contam como uma só para o limite.

**Abrir um trilho**
- Nasce de uma escolha que o jogador quer ver ou de uma história real que mudou de rumo. Tem de 3 a 5 cenas e pelo menos uma decisão própria.
- Termina num final próprio (`segue` ausente e sem `escolhas`) ou volta à espinha só num nó perto do fim, e as cenas dali em diante leem as marcas do trilho.
- Antes de escrever, procure o que a pesquisa diz: cada fato do trilho com fonte, o resto marcado como simulação em comentário YAML.
- Cuide do que o trilho pula: se ele salta uma decisão de custo para o próprio governo ou para um lado, faça o trilho passar por ela (como `o_orcamento` no trilho "A volta").
- Imagens: reaproveite gerações que já existem quando a cena for parecida (publique com o nome do nó novo, para o registro ficar completo) e gere as novas (Etapa 6).

## O capítulo seguinte

O jogo precisa estar sempre **um capítulo à frente da realidade**: quem joga hoje tem de chegar a um fim que ainda é futuro. Cada capítulo tem `de` e `ate` (AAAA-MM-DD), e `npm run estado` mostra o horizonte. Quando faltarem 30 dias ou menos para a realidade chegar ao `de` do último capítulo escrito, ele avisa **"ESCREVER O PRÓXIMO CAPÍTULO"**. Esse aviso é a ordem: a rodada escreve o capítulo, nos dois modos.

1. **Mapa.** Leia a linha seguinte de `roteiro/proximos.md` (numeração atual, título provisório, pergunta, marcas que ele herda) e o que `roteiro/painel/00-agregado.md` diz do período. Se a linha for um cisma (capítulos diferentes conforme o final), pare: isso é do usuário.
2. **Pesquisa antes do texto.** Rode o briefing 4 de `references/briefings.md`. O mapa foi escrito antes dos fatos; fixar opções antes da pesquisa é o erro que esta skill existe para evitar. Dois capítulos do esboço podem virar um (foi o que aconteceu com "A posse" e "As mesas").
3. **Esqueleto e planilha** em `roteiro/capNN-<titulo>.md`: a pergunta, a espinha, os finais, a planilha de equilíbrio (DESIGN 8.1, regra 16), o que ficou para depois e os candidatos a trava.
4. **O YAML** em `content/capitulos/capNN-<titulo>.yaml`, com `rascunho: true`, `periodo`, `de` e `ate`. Uma espinha curta (de 4 a 6 decisões por caminho, cada uma com custo para alguém), os trilhos que a pesquisa justificar e de 2 a 4 finais. Siga o guia de escrita e o critério das escolhas. Checagens que as revisões já pegaram:
   - **Cada cena acontece na data dela.** O que é decidido ou anunciado antes do período aparece como resultado ("na posse, os ministros assinam"), não como pergunta em aberto.
   - **Todo caminho que chega.** Liste todos os finais do capítulo anterior, inclusive os de trilhos que pulam a espinha (no cap. 2, `a_moeda_de_troca` e `o_domingo_seguinte` não passam por `a_mesa`). Todo grupo de cartões condicionais que lê "como o capítulo anterior terminou" precisa de texto para cada um deles, e nenhum texto pode contradizer o que um final prometeu (`lula_neutro`: "se perder, ninguém culpa o Planalto").
   - **Nenhuma vitória de graça.** A base de quem vence paga alguma coisa no próprio final (a revisão dos dois leitores cobrou isso no Senado da oposição).
   - **Grupos condicionais exclusivos.** Cada grupo de `se` de uma cena lê marcas que se excluem (as saídas de um mesmo nó); no máximo dois grupos por cena.
   - **Nome curto em toda decisão e todo final** (`titulo`: "O pedido de prisão de Flávio", "Alcolumbre vence por poucos votos"). É como a cena aparece na tela `/escolhas`; o validador avisa quando falta. Neutro como o rótulo: diz o que está em jogo, não quem tem razão.
5. **Ligações.**
   - `saidas` do capítulo anterior apontam para o novo (todos os finais; cisma só com o usuário). O novo sai para `FIM`.
   - **Epílogo** (`content/jogo.yaml`): o título passa a ser a data do fim do novo capítulo ("O Brasil em fevereiro de 2027"); frases no futuro que o novo capítulo resolveu passam para o passado ou saem; cada marca nova ganha um eco; a última linha diz qual capítulo e ato terminaram e que **a história vai até a eleição de 2030 e os próximos capítulos saem à medida que a realidade andar**.
   - `pesquisa/relogios.yaml`: os relógios do período passam a apontar para os nós novos (`afeta`); datas novas viram relógios. `calendario` do `jogo.yaml` ganha só datas fixas e públicas.
   - `roteiro/proximos.md`: a linha sai de "Pela frente" e vai para "Escritos", com as datas reais; a próxima linha ganha a data "escrever a partir de".
6. **Revisões, imagens e verificação** (Etapas 6 e 8). Os leitores leem todos os arquivos de `content/capitulos/` sozinhos; a cobertura recebe o capítulo novo em `<CAP>` e a pesquisa nova em `<PESQUISA>`, e roda de novo depois das correções.
7. **Rascunho.** O capítulo sai do rascunho (`rascunho: false`) só com o usuário. No modo autônomo, fica em rascunho e entra em "Precisa de você" no relatório.

## Etapa 6 — Imagens: reaproveitar, descartar ou refazer

Para cada nó tocado, decida:
- **Reaproveitar** se o lugar, a ação e o acento da imagem continuam batendo com o texto. É o padrão: imagem não precisa ser literal, precisa não contradizer.
- **Refazer** se a cena mudou de lugar ou de ação, ou se a imagem agora afirma algo falso (ex.: mostra uma prisão que não aconteceu).
- **Descartar** se o nó saiu: apagar `public/imagens/<cap>/<no>.webp` e a chave em `estilo/escolhas.json`. `npm run estado` aponta imagens órfãs.
- **Nova** para nó novo.

Para gerar (siga `estilo/GUIA.md`):
1. Escreva a cena em `estilo/cenas_<cap>.py` (composição, lugar ou ícone, figuras, luz, `Accent:`).
2. Gere 8 seeds em segundo plano:
   ```bash
   cd estilo && C:/Users/USER/openmontage/.venv/Scripts/python.exe -u gerar_teste.py --cenas cenas_cap01 <no> ...
   ```
3. Monte a folha e escolha pelo checklist do guia (assinatura falsa, rosto detalhado, ícone errado, bandeira, mais de um acento, cor de partido).
4. Publique: `python estilo/publicar.py <cap> <no>=<arquivo>` e regenere a galeria (`python estilo/galeria.py`).
5. Mostre ao usuário as escolhas e a galeria (`localhost:8765/galeria.html`, config "galeria"). No modo autônomo, registre no relatório qual seed foi escolhida e por quê.

**Imagem auditável** (o site promete isso em "Como fazemos", detalhe em `roteiro/prompts/imagens.md`): toda imagem publicada sai só deste caminho, `gerar_teste.py` com o carregador `estilo/flux.py`, os blocos de `prompts.py` e a cena escrita no arquivo `cenas_<cap>.py`, com uma das 8 seeds fixas. Nunca outro modelo, serviço online, prompt digitado na hora, retoque ou edição da imagem depois de gerada. Prompt da cena, WebP e `escolhas.json` entram no mesmo commit, para o histórico mostrar qual prompt gerou qual imagem.

## Etapa 7 — Ajustar o futuro

- Esqueletos em `roteiro/`: perguntas resolvidas saem, perguntas novas entram, datas mudam.
- `roteiro/painel/00-agregado.md`: se um fato muda muito uma probabilidade (ex.: um consenso do painel foi desmentido), anote em "Ajustes" e, se for grande, proponha ao usuário uma **mini-rodada do painel** só nas perguntas afetadas, feita pela skill `painel` (prompts só de `roteiro/prompts/`, nunca escritos na hora).
- Ecos longos: se uma marca do cap. 1 perdeu sentido, registre onde ela pagava e o que muda.

## Etapa 8 — Verificar

```bash
npm run validate && npm test && npx tsc --noEmit && npm run build
npm run estado
```
- O validador não pode ter erro; marca nova precisa ser usada (regra 2 de 8.1).
- Jogue pelo motor vários caminhos que passam pelos nós alterados: `npm run jogar -- <semente> <cap>` imprime o que o jogador leria (cartões, escolha sorteada, fim do epílogo). Troque a semente até cobrir os finais do capítulo anterior que chegam ao nó. Leia procurando contradição com escolhas anteriores e texto que não cabe na data da cena.
- No navegador (`localhost:3000`, pode usar a partida do usuário), confira imagem, cartões e "Fatos e fontes" de pelo menos uma cena nova. Para cair direto num capítulo, `npm run jogar -- <semente> <cap> estado.json` salva o estado no início dele; grave-o em `localStorage` na chave `trama:partida:<versao>` e abra `/partida`. Depois apague a chave.
- Faça o **teste da troca de sinais** nos trechos novos (8.1, regra 4).

**Revisões no fim** (sempre que a rodada mexeu em escolhas, cenas ou trilhos; pela skill `painel`, com os prompts publicados, sem escrever prompt na hora):
1. **Cobertura**: `roteiro/prompts/revisao/cobertura.md`, um subagente por capítulo tocado. Aplique o que for gravidade alta e o que for erro de fluxo (texto que contradiz uma escolha anterior do jogador, nó com uma escolha só).
2. **Leitores de direita e de esquerda**: `roteiro/prompts/revisao/leitor-*.md`, em paralelo. Aplique o que os dois apontarem e o que for gravidade alta em qualquer um. Cole cada resposta na seção "Resposta do agente" do arquivo do prompt.
3. Rode a cobertura de novo depois de aplicar: as correções também criam contradições.

## Etapa 9 — Registrar e entregar

- **Placar da tela `/escolhas`**: anda sozinho com o conteúdo. A escolha travada (`real`) leva a decisão para o placar, contando só os votos de antes da data; o relógio que vira `aconteceu` tira a decisão de "Antes da notícia". Por isso, ao travar, atualize também o `status` do relógio. Relógio com data passada e ainda `pendente` deixa a decisão esperando, com os votos congelados na data: não deixe um relógio vencido sem conferir.
- **O jogo e a realidade** (`content/acertos.yaml`, tela `/acertos`): para cada fato confirmado, pergunte se alguma cena já tinha escrito sobre aquilo **antes** (inclusive em caminhos que não são o real). Ache o commit com `git log --format="%h %ad" --date=format:"%Y-%m-%d %H:%M" -S "<trecho>" -- content/capitulos/` e cite o texto como estava nele (`git show <hash>:<arquivo>`).
  - **Se confirmou** (`status: confirmou`): a cena escreveu e a realidade fez. `diferenca` diz o que não bateu.
  - **Não se confirmou** (`status: nao_confirmou`): a cena escreveu e a realidade foi por outro caminho. Registre **na mesma rodada em que reescrever a cena**, com o commit antigo; `diferenca` diz o que mudou no jogo (e o commit da reescrita). Um mesmo trecho pode render os dois, quando metade bateu e metade não (foi o caso de `o_voo_fretado`, 30/10).
  - **Não entra**: opção de escolha (o jogo oferece várias; "a opção que bateu" não é acerto), texto que já era fato quando foi escrito, e o que só uma fonte diz. Exagerar um acerto custa mais que perder um: na dúvida, não entra.
  - **A confirmar** sai sozinho dos relógios pendentes com data (`aConfirmar`, `src/engine/relogios.ts`): mantenha `afeta` e `status` dos relógios em dia.

- `pesquisa/RODADAS.md`: nova entrada com data, fatos (com as fontes), boatos descartados, o que mudou no jogo e o que ficou pendente.
- Resumo ao usuário: o que travou, o que mudou no texto, imagens reaproveitadas, refeitas e descartadas, o que foi ajustado no futuro, e o que ficou para aprovação.
- Não ofereça o commit: o usuário pede quando quiser juntar as mudanças. No modo autônomo, o commit faz parte da rodada (ver "Modo autônomo"); push nunca.

## Etapa 10 — Melhorar esta skill

A skill precisa ficar melhor a cada rodada, sem esperar alguém pedir. No fim de toda rodada, pergunte: **alguma revisão, teste ou o usuário pegou um erro que uma regra desta skill teria evitado?** Se sim:
- escreva a regra no lugar certo (aqui, em `references/briefings.md`, no guia de escrita `roteiro/prompts/escrita.md` ou no guia de imagens `estilo/GUIA.md`), curta e com o exemplo que a originou;
- se a regra pode virar código (um aviso do validador, uma linha do `npm run estado`), proponha ou faça, com teste;
- registre em `pesquisa/RODADAS.md` o que mudou na skill e por quê.

Limites: nunca tire nem afrouxe uma salvaguarda ("O que nunca fazer sozinho", a regra das fontes, as regras de equilíbrio). No modo autônomo, toda mudança na skill entra em "Precisa de você" no relatório, para o usuário ler.
