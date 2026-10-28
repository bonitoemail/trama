---
name: atualizar-jogo
description: Atualiza o Trama com a realidade. Use quando o usuário disser "atualize o jogo", "atualizar o jogo", "o que mudou?", "rodada de atualização" ou mandar uma notícia nova para entrar no jogo. Busca online o que aconteceu desde a última rodada, confirma os fatos, mede o impacto em cada nó, propõe as mudanças, aplica texto, travas e imagens, ajusta o futuro e verifica tudo.
---

# Atualizar o jogo

O Trama começa sempre no acontecimento seguinte ao último fato real. Esta skill mantém isso verdadeiro sem quebrar o roteiro, o equilíbrio ou as imagens. Siga as etapas na ordem e mantenha o usuário no painel de tarefas (`update_plan`).

Arquivos que esta skill usa:
- `pesquisa/relogios.yaml`: datas e eventos a vigiar, ligados aos nós que afetam.
- `pesquisa/RODADAS.md`: histórico de rodadas e fatos novos (a data da última rodada está aqui).
- `content/jogo.yaml` (prólogo, epílogo, versão) e `content/capitulos/*.yaml`.
- `roteiro/` (esqueletos dos capítulos futuros) e `roteiro/painel/00-agregado.md` (estrutura 2027–2030, ecos, finais).
- `DESIGN.md` 6.1 (travar o caminho real) e 8 / 8.1 (regras de conteúdo e de equilíbrio).
- `estilo/GUIA.md`, `estilo/prompts.py`, `estilo/cenas_cap*.py`, `estilo/escolhas.json`.

---

## Etapa 0 — Retrato do estado

```bash
npm run estado
```
Leia o relatório: relógios vencidos, próximos 30 dias, itens sem data, travas, imagens, validador. Leia o fim de `pesquisa/RODADAS.md` para saber a data e o conteúdo da última rodada. A janela de busca vai **da última rodada até agora**.

Se o usuário trouxe uma notícia específica, ela é o primeiro item a confirmar, mas a rodada continua completa.

## Etapa 1 — Busca

Rode **três agentes em paralelo** (`Agent`, `general-purpose`, em segundo plano), com os briefings de `references/briefings.md`:
1. **Brasil** (Justiça, Congresso, governo, direita, ruas);
2. **Mundo** (EUA, Argentina, China, região);
3. **Relógios e economia** (cada relógio vencido ou dos próximos 30 dias, mercado, números a conferir).

Cada agente escreve `pesquisa/NN-<tema>.md` (próximo número livre) e devolve um resumo. Para uma notícia isolada e pequena, basta a busca direta (`WebSearch` em modo `extended`), sem agentes.

## Etapa 2 — Confirmação

Para cada fato candidato:
- **Fato** exige **duas fontes independentes de veículos estabelecidos**, ou um documento oficial (STF, TSE, Senado, Diário Oficial, nota de governo). Blog, perfil em rede social ou agregador sozinho **não** confirma.
- Confira **a expressão exata** (ex.: "líder do Brasil", não "líder da oposição"). Notícia sobre texto de pessoa real só entra depois de ver o texto ou a íntegra.
- Classifique: **[FATO]**, **[ANÁLISE]** (quem, onde), **[BOATO]** (sem confirmação), **[CONTRADIÇÃO]** (fontes divergem: registrar as duas versões).
- Investigado não é culpado. Pedido não é decisão.

## Etapa 3 — Impacto

Monte uma **tabela de impacto**: fato confirmado → o que muda no jogo. Cada fato cai em um ou mais tipos:

| Tipo | Quando | O que fazer |
|---|---|---|
| **Prólogo** | o fato acontece **antes** do início do capítulo 1 | nova entrada em `prologo` com data e fonte |
| **Trava** | o fato decide uma escolha existente | `real: { data, fonte }` na escolha (só uma por nó); relógio vira `aconteceu` |
| **Opção nova travada** | a realidade foi por um caminho que nenhuma opção previa | nova escolha já com `real`, e os nós que vêm depois dela |
| **Texto** | o fato muda o que uma cena afirma | reescrever só o trecho; manter os ids |
| **Galho morto** | o fato torna um galho impossível | não apagar: travar a escolha real; se não houver escolha real ainda, reescrever o rótulo como aposta (ex.: "retoma o título de presidente") |
| **Galho novo** | o fato abre uma pergunta que leva semanas a se resolver | propor nó novo (decisão + consequência própria) |
| **Futuro** | o fato muda probabilidades ou ecos de 2027–2030 | ajustar `roteiro/cap*` e `roteiro/painel/00-agregado.md`; criar relógio novo se houver data |
| **Imagem** | a cena mudou de lugar, de ação ou de sentido | ver Etapa 6 |

Regra de recuo: se o capítulo 1 inteiro ficou para trás no tempo, o que aconteceu vira prólogo e o capítulo é reescrito começando no acontecimento seguinte (foi o que se fez com a carta de 28/10).

## Etapa 4 — Proposta ao usuário

Antes de editar, mostre:
1. os fatos confirmados (com fonte) e os boatos descartados;
2. a tabela de impacto;
3. o que é **automático** e o que **precisa de aprovação**.

**Automático** (aplique logo depois de mostrar): entrada no prólogo, trava de escolha com fato confirmado, correção factual de texto, relógio atualizado, registro em RODADAS.
**Precisa de aprovação**: galho novo, nó removido ou reestruturado, mudança de rótulo de escolha, mudança nos cismas ou finais, imagem nova.

Se o usuário já disse "atualize o jogo" sem pedir revisão, aplique o automático e pergunte só o que precisa de aprovação, numa pergunta (`wrap_up` ou `AskUserQuestion`).

## Etapa 5 — Aplicar texto e travas

- Siga **DESIGN.md 8, 8.1 e 8.2** em cada trecho novo (linguagem simples: cartões curtos, sem jargão, técnico no `detalhe`): motivo e interesse para todos, nenhuma escolha sem custo, regra do par, narrador sem piada, boato só como boato, gancho e checagem, mesma regra de nome.
- Toda paráfrase de pessoa ou instituição real ganha comentário YAML com o link.
- Trava: `real: { data: "DD/MM/AAAA", fonte: "<url>" }`. A interface mostra "aconteceu em…" e o fio laranja na linha do tempo.
- **Versão** (`content/jogo.yaml`): suba quando um nó for **removido ou renomeado** ou um capítulo mudar de início (partidas salvas antigas são descartadas). Só texto, trava ou nó novo: não precisa subir.
- Atualize `pesquisa/relogios.yaml`: `status: aconteceu` + `resultado` com fonte; crie relógios novos.

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
5. Mostre ao usuário as escolhas e a galeria (`localhost:8765/galeria.html`, config "galeria").

## Etapa 7 — Ajustar o futuro

- Esqueletos em `roteiro/`: perguntas resolvidas saem, perguntas novas entram, datas mudam.
- `roteiro/painel/00-agregado.md`: se um fato muda muito uma probabilidade (ex.: um consenso do painel foi desmentido), anote em "Ajustes" e, se for grande, proponha ao usuário uma **mini-rodada do painel** só nas perguntas afetadas.
- Ecos longos: se uma marca do cap. 1 perdeu sentido, registre onde ela pagava e o que muda.

## Etapa 8 — Verificar

```bash
npm run validate && npm test && npx tsc --noEmit && npm run build
npm run estado
```
- O validador não pode ter erro; marca nova precisa ser usada (regra 2 de 8.1).
- Jogue no navegador (`localhost:3000`, pode usar a partida do usuário) **o caminho que passa pelos nós alterados**, conferindo texto, imagem, eco e trava.
- Faça o **teste da troca de sinais** nos trechos novos (8.1, regra 4).

## Etapa 9 — Registrar e entregar

- `pesquisa/RODADAS.md`: nova entrada com data, fatos (com fonte), boatos descartados, o que mudou no jogo e o que ficou pendente.
- Resumo ao usuário: o que travou, o que mudou no texto, imagens reaproveitadas, refeitas e descartadas, o que foi ajustado no futuro, e o que ficou para aprovação.
- Ofereça o commit (o usuário costuma aprovar; não faça sem ele pedir).
