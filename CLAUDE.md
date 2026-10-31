# Trama — guia do projeto

História ramificada sobre o futuro político do Brasil (out/2026 → 2030). O jogador é o "destino": lê e escolhe entre 2 e 4 opções, sem recursos nem indicadores. Começa sempre no acontecimento seguinte ao último fato real. Design completo em `DESIGN.md`.

## Atualizar o jogo com a realidade
Quando o usuário disser **"atualize o jogo"** (ou mandar uma notícia nova), use a skill **`atualizar-jogo`** (`.claude/skills/atualizar-jogo/`). Ela define o fluxo: estado → busca → confirmação → impacto → proposta → texto e travas → imagens → futuro → verificação (com as revisões de cobertura e dos leitores) → registro → melhorar a própria skill, e as regras para travar o que aconteceu, somar escolhas que faltam, abrir trilhos e escrever o capítulo seguinte. Comece sempre por `npm run estado`: a seção "Horizonte" avisa quando escrever o próximo capítulo (30 dias antes de a realidade chegar ao último escrito; mapa em `roteiro/proximos.md`).

## Stack
Next.js 16 (App Router) · React 19 · TypeScript 5 (estrito) · Zod 4 · YAML · Vitest 5. CSS puro: `src/app/globals.css` (jogo) e `src/app/capa.css` (capa e telas de explicação, tudo dentro de `.capa`). Imagens geradas no FLUX.1-schnell local (RTX 4080, carregador em `estilo/flux.py`) via o Python do `C:/Users/USER/openmontage/.venv`; como funciona e como repetir em `roteiro/prompts/imagens.md`.

## Onde fica cada coisa
- `content/jogo.yaml`: versão, aviso, `apresentacao` (linha sob o título e passos de "Como funciona", que aparecem no fim de "O que é o Trama"), `objetivo` (tela "O que é o Trama", em `/o-que-e`), `metodo` (tela "Como fazemos as previsões", com `lentes` e `codigo`, os links do repositório público), **prólogo (fatos reais com fonte; o que tem `fixado: true` é o Agora da capa, os outros vão para a lista; sem fixado, vale o mais novo)**, `calendario` (datas fixas e públicas da régua da capa, AAAA-MM-DD), primeiro capítulo e epílogo. `{partidas}` nos textos vira o número de histórias contado pelo motor; nunca escreva o número à mão.
- `content/acertos.yaml`: "O jogo e a realidade" (tela `/acertos`, link discreto no fim de "Como fazemos" e em `/escolhas`): o que uma cena escreveu antes e a realidade confirmou (`status: confirmou`) ou não (`nao_confirmou`, a cena foi reescrita), com o commit da cena, as fontes do fato e a diferença. Os itens "a confirmar" saem sozinhos dos relógios pendentes com data (`src/engine/relogios.ts`, carregados no build pela página).
- Tela `/escolhas` ("O que os jogadores escolheram"; linha na capa com o número de histórias, link no fim de cada capítulo e em `/acertos`): textos em `escolhas` no `jogo.yaml`; números de `/api/escolhas` (refeita a cada hora), que lê as somas no Supabase e monta os blocos em `src/lib/escolhas.ts` pela mesma regra para todas as decisões (mínimo de 50 escolhas; `porDecisao` dá a porcentagem de cada escolha para a linha do tempo do fim de capítulo, `LinhaDoTempo.tsx`, que nunca aparece durante a decisão; a busca é uma só por visita, em `src/lib/painel.ts`; "Antes da notícia" pelos relógios com data; placar só com escolhas feitas antes da trava; o único bloco escolhido à mão é `CRUZAMENTOS`). Decisões e finais aparecem pelo `titulo` do nó (o validador avisa quando falta).
- `content/capitulos/*.yaml`: um arquivo por capítulo. **Escrever cena = escrever dado.** Paráfrase de pessoa real leva comentário com o link.
- `src/engine/`: `schema.ts` (formato, Zod), `engine.ts` (motor puro, travas `real`), `validate.ts` (explora todas as combinações), `historia.ts` (linha do tempo, caminhos por capítulo e `contarPartidas`, histórias completas), `calendario.ts` (datas do prólogo e a frase "Pela frente" da capa), `formato.ts` (avisos de formato dos cartões, conforme `roteiro/prompts/escrita.md`), `load.ts`.
- `src/lib/telas.ts` e `navegacao.ts`: um endereço por tela (`/`, `/o-que-e` (o antigo `/para-que-serve` redireciona), `/como-fazemos`, `/acertos`, `/escolhas`, `/partida`, todos em `src/app/[[...tela]]/page.tsx`). Voltar (gesto do celular, navegador, botão, Esc) desfaz no histórico; a capa volta na mesma altura; link direto + Voltar vai para a capa.
- `src/components/`: `Jogo.tsx` (telas e tipos de cena: abertura, decisão, consequência, final), `Inicio.tsx` (capa: título, o Agora com a última notícia, a partida, a frase "Pela frente", e atrás de um toque os fatos e as duas telas), `Dica.tsx` (o "?" com balão), `Metodo.tsx` (as duas telas de explicação, cada uma com sua linguagem), `Fatos.tsx` (fatos anteriores, mais novo em cima), `Cartoes.tsx` (stories: a tela inteira é área de toque; metade esquerda volta, direita avança), `BotaoEscolha.tsx` (segurar para decidir), `LinhaDoTempo.tsx` (fim de capítulo), `Compartilhar.tsx` ("Compartilhar meu Brasil" no fim de capítulo: cartão de stories desenhado em `src/lib/cartao.ts`, com a raridade do caminho de `/api/raridade` e a função `caminho_raridade`; link com `?origem=cartao`, evento `compartilhar`).
- Registro anônimo (plano em `BACKEND.md`): `src/lib/registro.ts` (eventos tirados da mudança de estado em `Jogo.tsx`, validação contra o conteúdo, origem do link), `src/app/api/evento/route.ts` (grava via `registrar()` no Supabase com `SUPABASE_URL` e `SUPABASE_SECRET_KEY` do `.env.local`; sem elas, ou no `npm run dev` sem `REGISTRO_EM_DEV=1`, não grava nada), `supabase/migrations/` (tabelas `partidas` e `eventos`, só o servidor escreve; consultas no schema `painel`: `resumo`, `capitulos`, `escolhas`, `paradas`, `caminhos`, `origens`). Projeto Supabase `trama` (`hsiwzuqikdcbrjquczwd`, São Paulo, org Trama, Free). Link de divulgação: `npm run link -- <canal>` (o padrão é o domínio oficial; `SITE_URL` troca).
- Publicação: código público em github.com/bonitoemail/trama (auditável; push com a conta bonitoemail, já configurada neste repositório); Vercel (time Pro do usuário, projeto `trama`) publica sozinha a cada push em `main`, em https://tramabr.app. Variáveis do Supabase também na Vercel.
- `pesquisa/`: rodadas de pesquisa (`00-sintese.md`, `01`…), `RODADAS.md` (histórico) e `relogios.yaml` (datas e eventos ligados aos nós).
- `roteiro/`: `proximos.md` (mapa dos próximos capítulos, numeração atual), esqueleto e planilha de cada capítulo, `prompts/` (texto exato de cada agente, com data e o que produziu; `COMO-REPETIR.md`; `escrita.md`, o guia de escrita das cenas; rodadas novas só pela skill `painel`) e `painel/` (painel de previsão com 6 lentes, `00-agregado.md` com cismas e finais, `01-neutralidade.md`).
- `estilo/`: `GUIA.md` (estilo das ilustrações), `prompts.py`, `cenas_cap*.py`, `cenas_capa.py` (formato largo; capa hoje fora de uso), `sketch-titulo.html` (comparar fontes do título), `sketches-capa/` (rodadas de design da capa; a B3 "menos" é a atual, plano em `b3-plano.md`), `gerar_teste.py`, `publicar.py`, `galeria.py`, `escolhas.json` (qual geração está em cada nó), `referencias/`. Saídas de teste em `estilo/testes/` (fora do git).
- `public/imagens/<cap>/<no>.webp`: imagens publicadas.

## Conceitos do conteúdo
- **Nó**: `titulo` (nome curto, obrigatório na prática em decisões e finais) + `texto` + `escolhas`, ou `segue` (nó só de texto), ou nenhum dos dois (fim do capítulo). `imagem` opcional. "Fatos e fontes" (o antigo "saiba mais"): `fatos` (`{ texto, fontes, se? }`, o que aconteceu de verdade) e `lados` (posições de cada lado, sem fonte, regra do par).
- **Escolha**: `rotulo`, `marca`, `vai_para`, `se`, e `real: { data, fontes }` quando a realidade decidiu (as outras ficam travadas).
- **Marca**: string, só "tem/não tem". Memória invisível da história. Toda marca precisa ser usada em alguma condição.
- **Texto condicional**: lista de parágrafos; item `{se, texto, senao?}`.
- **Tipo de cena** (inferido): primeira do capítulo = abertura; com escolha = decisão; sem escolha e `segue` = consequência (despacho com eco da escolha); sem escolha e sem `segue` = final.

## Comandos
```bash
npm run dev        # localhost:3000
npm run estado     # horizonte, relógios, travas, imagens e validador (início de toda atualização)
npm run jogar -- 7 cap03   # joga um caminho pelo motor e imprime o que o jogador leria
npm run validate   # valida o conteúdo
npm test           # testes do motor + conteúdo real
npm run build      # falha se o conteúdo tiver erro
npm run link -- instagram-bio   # link de divulgação com a origem (https://tramabr.app/?origem=...)
```

## Regras
- **Equilíbrio (DESIGN.md 8 e 8.1)**: motivo e interesse para todos os lados, nenhuma escolha sem custo, regra do par, narrador sem piada, boato só como boato, mesma regra de nome, sem crime atribuído a pessoa real.
- Fato real novo → prólogo ou trava, com data e `fontes`. **Regra das fontes** (validador cobra em `src/engine/fontes.ts`; detalhe na skill): documento oficial, ou pelo menos duas fontes de veículos diferentes e, sempre que der, de linhas editoriais diferentes. Wikipédia não conta. Cada link aberto e conferido. Nunca escreva rótulo de "direita"/"esquerda" de veículo no conteúdo.
- Suba `versao` em `content/jogo.yaml` quando um nó for removido ou renomeado (descarta partidas salvas antigas).
- Ao mudar conteúdo: `npm run validate` sem erros; ao mudar imagens: `npm run estado` sem imagens órfãs.
- Testar no navegador pode usar a aba e a partida do usuário.

## Visual da tela inicial
Direção "B3 · menos" (`estilo/sketches-capa/b3-*.html`, plano e crítica em `b3-plano.md`), escolhida pelo usuário em 29/10/2026 depois de achar a B2 "too much". Ousadia só no título: TRAMA centralizado em Unbounded (`next/font`, `--titulo`) com a luz verde e amarela passando em loop. A cor da luz foi escolha do usuário mesmo sabendo que os dois leitores da revisão a leram como cor da direita: não troque sem perguntar. O resto quieto: duas famílias (Source Serif 4 para ler, IBM Plex Sans para interface), sem mono, sem caixa-alta fora do título, sem cartões, sem "·" e sem "→" nos botões, uma animação só (a do título). Capa: Agora com a última notícia e o "?", botão claro, a frase "Pela frente" (vem de `calendario`), e em linhas simples os fatos, "O que é o Trama" e "Como fazemos". Celular: uma coluna, fatos fechados. PC: título sobre duas colunas, o agora parado à esquerda, os fatos abertos à direita. "O que é o Trama" é serifa corrida (com "Como funciona" no fim); "Como fazemos" é sans numerada: mantenha as duas diferentes. Antes de mudar a capa, faça sketch e mostre. O jogo (stories) não muda com a capa.

## Onde paramos (fim de 29/10/2026)
Ver `pesquisa/RODADAS.md` (últimas entradas) para o detalhe.
- **Feito:** registro anônimo das partidas (Supabase) e site no ar (Vercel, a cada push em `main`); prompts dos agentes publicados (`roteiro/prompts/`) e imagens reproduzíveis; X de sair; revisão de cobertura das escolhas; quatro trilhos (a caçada, a volta, a campanha, o indulto), a votação da prisão no Senado (Constituição, art. 53) e os ajustes das revisões; segunda rodada dos leitores; guia de escrita e alertas de formato no validador; skill `atualizar-jogo` refeita para travar, abrir ramos e trilhos e escrever o capítulo seguinte sozinha; **capítulo 3, "A posse"** (fecha o Ato I: Fazenda, Centrão, foro de Flávio, Câmara e Senado em 1º/02/2027), com epílogo "O Brasil em fevereiro de 2027" e a frase de que a história vai até 2030.
- **Pendente:** a tarefa das 18h foi religada (commit sem push); as travas de 3/11 (midterms, `cap01/eleicao_eua`) e 4/11 (Copom) vão precisar de rodada; o que os leitores apontaram e ficou de fora (custo para Moraes, o PT rompendo com o Centrão, caminho jurídico da oposição, impeachment como escolha, governadores); refazer a imagem de `cap02/o_senado_sem_a_direita`; retratos.

## Ainda não existe
Porcentagens da comunidade durante a decisão (de propósito: influenciaria a escolha), `/painel` com senha, domínio próprio, antimanipulação além da primeira camada, retratos de personagens reais.
