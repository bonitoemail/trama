# Trama — guia do projeto

História ramificada sobre o futuro político do Brasil (out/2026 → 2030). O jogador é o "destino": lê e escolhe entre 2–3 opções, sem recursos nem indicadores. Começa sempre no acontecimento seguinte ao último fato real. Design completo em `DESIGN.md`.

## Atualizar o jogo com a realidade
Quando o usuário disser **"atualize o jogo"** (ou mandar uma notícia nova), use a skill **`atualizar-jogo`** (`.claude/skills/atualizar-jogo/`). Ela define o fluxo: estado → busca → confirmação → impacto → proposta → texto e travas → imagens → futuro → verificação → registro. Comece sempre por `npm run estado`.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript 5 (estrito) · Zod 4 · YAML · Vitest 5. CSS puro em `src/app/globals.css`. Imagens geradas no FLUX.1-schnell local (RTX 4080) via o Python do `C:/Users/USER/openmontage/.venv`.

## Onde fica cada coisa
- `content/jogo.yaml`: versão, aviso, **prólogo (fatos reais com fonte)**, primeiro capítulo e epílogo.
- `content/capitulos/*.yaml`: um arquivo por capítulo. **Escrever cena = escrever dado.** Paráfrase de pessoa real leva comentário com o link.
- `src/engine/`: `schema.ts` (formato, Zod), `engine.ts` (motor puro, travas `real`), `validate.ts` (explora todas as combinações), `historia.ts` (linha do tempo e contagem de caminhos), `load.ts`.
- `src/components/`: `Jogo.tsx` (telas e tipos de cena: abertura, decisão, consequência, final), `BotaoEscolha.tsx` (segurar para decidir), `LinhaDoTempo.tsx` (fim de capítulo).
- `pesquisa/`: rodadas de pesquisa (`00-sintese.md`, `01`…), `RODADAS.md` (histórico) e `relogios.yaml` (datas e eventos ligados aos nós).
- `roteiro/`: esqueletos de capítulos futuros e `painel/` (painel de previsão com 6 lentes, `00-agregado.md` com cismas e finais, `01-neutralidade.md`).
- `estilo/`: `GUIA.md` (estilo das ilustrações), `prompts.py`, `cenas_cap*.py`, `gerar_teste.py`, `publicar.py`, `galeria.py`, `escolhas.json` (qual geração está em cada nó), `referencias/`. Saídas de teste em `estilo/testes/` (fora do git).
- `public/imagens/<cap>/<no>.webp`: imagens publicadas.

## Conceitos do conteúdo
- **Nó**: `texto` + `escolhas`, ou `segue` (nó só de texto), ou nenhum dos dois (fim do capítulo). `imagem` opcional.
- **Escolha**: `rotulo`, `marca`, `vai_para`, `se`, e `real: { data, fonte }` quando a realidade decidiu (as outras ficam travadas).
- **Marca**: string, só "tem/não tem". Memória invisível da história. Toda marca precisa ser usada em alguma condição.
- **Texto condicional**: lista de parágrafos; item `{se, texto, senao?}`.
- **Tipo de cena** (inferido): primeira do capítulo = abertura; com escolha = decisão; sem escolha e `segue` = consequência (despacho com eco da escolha); sem escolha e sem `segue` = final.

## Comandos
```bash
npm run dev        # localhost:3000
npm run estado     # relógios, travas, imagens e validador (início de toda atualização)
npm run validate   # valida o conteúdo
npm test           # testes do motor + conteúdo real
npm run build      # falha se o conteúdo tiver erro
```

## Regras
- **Equilíbrio (DESIGN.md 8 e 8.1)**: motivo e interesse para todos os lados, nenhuma escolha sem custo, regra do par, narrador sem piada, boato só como boato, mesma regra de nome, sem crime atribuído a pessoa real.
- Fato real novo → prólogo ou trava, com data e fonte (duas fontes independentes, ou documento oficial).
- Suba `versao` em `content/jogo.yaml` quando um nó for removido ou renomeado (descarta partidas salvas antigas).
- Ao mudar conteúdo: `npm run validate` sem erros; ao mudar imagens: `npm run estado` sem imagens órfãs.
- Testar no navegador pode usar a aba e a partida do usuário.

## Ainda não existe
Backend (Supabase), porcentagens da comunidade, página pública, antimanipulação, retratos de personagens reais.
