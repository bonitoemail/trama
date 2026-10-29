# Os prompts dos agentes

Aqui está o texto exato que cada agente de IA recebeu para pesquisar, prever e revisar o Trama. Ao lado de cada prompt fica o arquivo que ele produziu, para quem quiser conferir as duas pontas. Para repetir qualquer etapa por conta própria, veja [COMO-REPETIR.md](COMO-REPETIR.md).

Todos rodaram como subagentes do Claude Code, com o modelo `claude-opus-5-5`, entre 28 e 29 de outubro de 2026. Os textos foram recuperados do histórico da sessão em que rodaram. O único ajuste foi trocar o caminho da pasta no computador pelo caminho dentro do repositório.

## O que isto prova e o que não prova

- **Prova** que o método está escrito: as perguntas, as lentes, as regras ("não invente fato", "investigado não é culpado", "boato só como boato") e o formato pedido estão aqui, iguais para todos.
- **Permite repetir**: qualquer pessoa pode rodar o mesmo prompt numa IA e comparar com o resultado publicado. O texto não sai idêntico, porque a IA varia a cada vez, mas as previsões e os achados devem ficar parecidos. Se ficarem muito diferentes, é sinal de problema, e vale apontar.
- **Não prova** que o resultado publicado saiu deste prompt sem nenhuma mão no meio. Isso só uma execução registrada por terceiros provaria. Os arquivos de resultado também podem ter sido corrigidos depois; o histórico do git mostra cada mudança.
- **As cenas não saem direto daqui.** O texto do jogo é escrito a partir da pesquisa e do painel, e passa pelas revisões abaixo. O que vem dos agentes é a base de fatos, as previsões e as críticas de equilíbrio.

## As etapas

### 1. Pesquisa: a base de fatos

| Prompt | Rodado em (UTC) | Produziu |
|---|---|---|
| [Governo Lula e Congresso](pesquisa/01-governo-congresso.md) | 28/10/2026 18:46 | [`pesquisa/01-governo-congresso.md`](../../pesquisa/01-governo-congresso.md) |
| [Economia em 2027](pesquisa/02-economia.md) | 28/10/2026 18:46 | [`pesquisa/02-economia.md`](../../pesquisa/02-economia.md) |
| [Direita e o caso Flávio](pesquisa/03-direita-oposicao.md) | 28/10/2026 18:47 | [`pesquisa/03-direita-oposicao.md`](../../pesquisa/03-direita-oposicao.md) |
| [STF e relação com os EUA](pesquisa/04-stf-poderes-eua.md) | 28/10/2026 18:47 | [`pesquisa/04-stf-poderes-eua.md`](../../pesquisa/04-stf-poderes-eua.md) |
| [EUA e Trump](pesquisa/05-eua-trump.md) | 28/10/2026 18:54 | [`pesquisa/05-eua-trump.md`](../../pesquisa/05-eua-trump.md) |
| [Reações à carta no Brasil](pesquisa/06-reacoes-carta.md) | 28/10/2026 20:53 | [`pesquisa/06-reacoes-carta.md`](../../pesquisa/06-reacoes-carta.md) |
| [Mundo, EUA e Argentina](pesquisa/07-mundo-reacoes.md) | 28/10/2026 20:53 | [`pesquisa/07-mundo-reacoes.md`](../../pesquisa/07-mundo-reacoes.md) |
| [Analistas e economia](pesquisa/08-analistas-economia.md) | 28/10/2026 20:53 | [`pesquisa/08-analistas-economia.md`](../../pesquisa/08-analistas-economia.md) |
| [Capítulo 2: STF e Senado](pesquisa/09-cap02-stf-senado.md) | 28/10/2026 22:18 | [`pesquisa/09-cap02-stf-senado.md`](../../pesquisa/09-cap02-stf-senado.md) |
| [Capítulo 2: direita e Miami](pesquisa/10-cap02-direita-miami.md) | 28/10/2026 22:18 | [`pesquisa/10-cap02-direita-miami.md`](../../pesquisa/10-cap02-direita-miami.md) |

### 2. Painel: seis lentes e o agregador

As seis lentes recebem as mesmas 19 perguntas, no mesmo formato: [`roteiro/painel/perguntas.md`](../painel/perguntas.md). Cada prompt só muda a lente.

| Prompt | Rodado em (UTC) | Produziu |
|---|---|---|
| [Lente: instituições](painel/instituicoes.md) | 28/10/2026 21:27 | [`roteiro/painel/instituicoes.md`](../painel/instituicoes.md) |
| [Lente: economia ortodoxa](painel/economia-ortodoxa.md) | 28/10/2026 21:27 | [`roteiro/painel/economia-ortodoxa.md`](../painel/economia-ortodoxa.md) |
| [Lente: economia heterodoxa](painel/economia-heterodoxa.md) | 28/10/2026 21:27 | [`roteiro/painel/economia-heterodoxa.md`](../painel/economia-heterodoxa.md) |
| [Lente: jurídico](painel/juridico.md) | 28/10/2026 21:28 | [`roteiro/painel/juridico.md`](../painel/juridico.md) |
| [Lente: internacional](painel/internacional.md) | 28/10/2026 21:28 | [`roteiro/painel/internacional.md`](../painel/internacional.md) |
| [Lente: eleitoral](painel/eleitoral.md) | 28/10/2026 21:28 | [`roteiro/painel/eleitoral.md`](../painel/eleitoral.md) |
| [Agregador das seis lentes](painel/agregador.md) | 28/10/2026 21:34 | [`roteiro/painel/00-agregado.md`](../painel/00-agregado.md) |

### 3. Revisão de equilíbrio

| Prompt | Rodado em (UTC) | Produziu |
|---|---|---|
| [Revisor de neutralidade](revisao/neutralidade.md) | 28/10/2026 21:43 | [`roteiro/painel/01-neutralidade.md`](../painel/01-neutralidade.md) |
| [Leitor de direita](revisao/leitor-direita.md) | 29/10/2026 01:21 | a resposta está no próprio arquivo |
| [Leitor de esquerda](revisao/leitor-esquerda.md) | 29/10/2026 01:21 | a resposta está no próprio arquivo |

Os dois leitores rodaram ao mesmo tempo, com o mesmo prompt, mudando só o lado, e sem ler a revisão anterior.

### 4. Checagem de fontes

| Prompt | Rodado em (UTC) | Mexeu em |
|---|---|---|
| [Fontes do prólogo e do capítulo 1](fontes/prologo-cap01.md) | 29/10/2026 14:08 | listas `fontes:` de `content/jogo.yaml` e `content/capitulos/cap01-a-carta.yaml` |
| [Fontes do capítulo 2](fontes/cap02.md) | 29/10/2026 14:08 | listas `fontes:` de `content/capitulos/cap02-o-espolio.yaml` |
| [Troca de fontes fracas](fontes/trocar-fontes-fracas.md) | 29/10/2026 14:44 | listas `fontes:` dos dois capítulos |

Esses prompts citam exemplos de veículos lidos mais à direita ou mais à esquerda, como critério para misturar linhas editoriais. Esses rótulos são só critério de escolha e nunca aparecem no jogo. A regra que o código cobra está em [`src/engine/fontes.ts`](../../src/engine/fontes.ts).

### 5. Atualização com a realidade

A rodada que confere as notícias e atualiza o jogo segue a skill [`atualizar-jogo`](../../.claude/skills/atualizar-jogo/SKILL.md), com os briefings dos agentes de busca em [`references/briefings.md`](../../.claude/skills/atualizar-jogo/references/briefings.md).

### 6. Imagens

As ilustrações saem de um modelo de pesos abertos (FLUX.1-schnell) rodando no computador, com o prompt, a configuração e a seed de cada imagem no repositório. Como funciona e como gerar de novo: [imagens.md](imagens.md).

## Próximas rodadas

Uma rodada nova do painel roda pela skill [`painel`](../../.claude/skills/painel/SKILL.md), que lê os prompts só desta pasta. Assim o prompt usado é sempre o que está no repositório naquele commit.
