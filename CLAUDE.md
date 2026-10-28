# Trama — guia do projeto

História ramificada sobre o futuro político do Brasil (out/2026 → 2030). O jogador é o "destino": lê e escolhe entre 2–3 opções, sem recursos nem indicadores. Design completo em `DESIGN.md`.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript 5 (estrito) · Zod 4 · YAML · Vitest 5. CSS puro em `src/app/globals.css`, sem Tailwind.

## Onde fica cada coisa
- `content/jogo.yaml`: versão, aviso, **prólogo (fatos reais com fonte)**, primeiro capítulo e epílogo.
- `content/capitulos/*.yaml`: um arquivo por capítulo. **Escrever cena = escrever dado.**
- `src/engine/schema.ts`: formato do conteúdo (Zod). Se o YAML não bate, o carregamento falha com o caminho do erro.
- `src/engine/engine.ts`: motor puro (`novoJogo`, `escolher`, `continuar`, `vale`, `paragrafos`). Sem função de voltar, de propósito.
- `src/engine/validate.ts`: checa referências e marcas e explora todas as combinações (capítulo, nó, marcas) atrás de becos sem saída, capítulos sem saída e nós inalcançáveis.
- `src/engine/layout.ts`: posições do fluxograma (de cima para baixo, pensado para celular).
- `src/components/Jogo.tsx`: telas (abertura → prólogo → cenas → fim de capítulo → epílogo).
- `src/components/Fluxograma.tsx`: SVG do capítulo (percorrido / visto em outra partida / cadeado).
- `src/lib/storage.ts`: partida e nós vistos no localStorage (sempre em try/catch).

## Conceitos do conteúdo
- **Nó**: `texto` + `escolhas` (ou `segue` para nó só de texto; sem nenhum dos dois = fim do capítulo).
- **Escolha**: `rotulo`, `marca` (lista), `vai_para` (omitido = encerra o capítulo), `se` (só aparece se valer).
- **Marca**: string, só "tem/não tem". Memória invisível da história.
- **Condição**: `{tem}`, `{nao_tem}`, `{todas: [...]}`, `{qualquer: [...]}`.
- **Texto condicional**: lista de parágrafos; item `{se, texto, senao?}`.
- **Saídas**: avaliadas em ordem, a primeira que vale decide; `FIM` vai ao epílogo.

## Comandos
```bash
npm run dev        # localhost:3000
npm run validate   # valida o conteúdo em content/
npm test           # testes do motor + conteúdo real
npm run build      # falha se o conteúdo tiver erro
```

## Regras
- Ao mudar o conteúdo: `npm run validate` precisa passar sem erros.
- Fato real novo → entra no `prologo` com data e fonte; capítulos que ele "resolveu" saem ou mudam; sobe `versao`.
- Regras de conteúdo (seção 8 do DESIGN.md): sem explicação étnica/religiosa para o poder, sem crimes reais atribuídos a pessoas reais, opções sempre em linguagem neutra, caminhos de vitória e ruína para todos os campos.
- Capítulos 1–2 atuais são **rascunho de teste** (`rascunho: true`), feitos só para exercitar o motor.

## Ainda não existe
Backend (Supabase), porcentagens da comunidade, página pública, antimanipulação, ilustrações.
