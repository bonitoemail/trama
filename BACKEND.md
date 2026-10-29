# Backend: contagem de partidas e caminhos

Etapas 1 a 6 feitas e testadas de ponta a ponta em 29/10/2026; no ar em https://trama-sigma-five.vercel.app. No `npm run dev` nada é gravado, a não ser com `REGISTRO_EM_DEV=1` no `.env.local`.

## O que queremos saber
- Quantas pessoas começaram, quantas terminaram cada capítulo e quantas chegaram ao fim.
- Em que cena as pessoas param.
- Em cada decisão, quantos foram para cada lado (e, depois, mostrar isso no jogo: "38% escolheram isto").
- Quais caminhos completos de cada capítulo são mais comuns.
- De onde veio cada partida (link de Instagram, WhatsApp, imprensa…).
- Tudo separado por `versao` do conteúdo, porque as cenas mudam com a realidade.

## Privacidade
- Sem login, sem nome, sem e-mail, sem IP guardado, sem cookie.
- Cada partida ganha um id aleatório no navegador (já existe a partida salva no `localStorage`; o id vai junto).
- "Começar outra partida" gera id novo. Não ligamos partidas da mesma pessoa.
- Uma linha no `aviso`: "Contamos as escolhas de forma anônima, para mostrar o que a comunidade decidiu."
- Com isso não precisa de banner de consentimento.

## Supabase (projeto `trama`, `hsiwzuqikdcbrjquczwd`, São Paulo)

Duas tabelas:

`partidas`
| coluna | tipo | |
|---|---|---|
| id | uuid | gerado no navegador |
| versao | text | versão do conteúdo ao começar |
| origem | text | do link (`?origem=instagram`), ou `direto` |
| criada_em | timestamptz | |

`eventos`
| coluna | tipo | |
|---|---|---|
| id | bigint | |
| partida | uuid | → partidas |
| tipo | text | `escolha`, `fim_capitulo`, `fim_jogo` |
| capitulo | text | |
| no | text | |
| escolha | text | vazio fora de `escolha` |
| versao | text | |
| criado_em | timestamptz | |

- Única por `(partida, capitulo, no, tipo)`: a mesma partida não vota duas vezes na mesma cena.
- RLS ligado e sem política nenhuma: a chave pública não lê nem grava nada. Só o servidor do site grava, com a chave secreta.
- Consultas prontas (views, fora da API pública): `resumo` (começaram, terminaram cada capítulo, chegaram ao fim), `escolhas_por_no` (contagem e %), `paradas` (última cena das partidas que não terminaram), `caminhos` (sequência de escolhas por capítulo, mais comuns primeiro), `por_origem`.

## No site
- `src/lib/registro.ts`: `registrar(evento)` manda para `/api/evento` com `fetch(..., { keepalive: true })`. Não espera resposta, não mostra erro e nunca trava o jogo. Em `npm run dev` só manda se houver a variável de ambiente.
- `Jogo.tsx`: tudo passa por `atualizar(novo)`, então o registro sai dali, comparando o estado antigo com o novo (escolha feita, capítulo fechado, fim do jogo). `comecar()` cria a partida.
- `src/app/api/evento/route.ts`: confere o evento contra o conteúdo (`carregarJogo`): o capítulo, o nó e a escolha existem e a escolha estava disponível. Evento inventado é descartado. Grava via a API REST do Supabase com `fetch` (sem instalar o `supabase-js`).
- Origem: na primeira visita, `?origem=` (ou `utm_source`) fica guardado e vai com a partida. O endereço é limpo depois, para o link compartilhado não espalhar a origem.
- Variáveis: `SUPABASE_URL` e `SUPABASE_SECRET_KEY` em `.env.local` (você cola a chave; eu não leio) e na Vercel.

## Links de tracking
- Formato: `https://<site>/?origem=<canal>`, por exemplo `instagram-bio`, `whatsapp-grupos`, `imprensa`.
- `npm run link -- instagram-bio` imprime o link pronto, para não errar a grafia.

## Painel
- Primeiro: as views no SQL Editor do Supabase (zero código).
- Depois: uma página `/painel` com senha, se quiser ver no celular.

## Antimanipulação (primeira camada)
- Validação contra o conteúdo, uma escolha por cena por partida, limite de eventos por partida (não passa do número de cenas).
- Regra de limite de requisições por IP no firewall da Vercel (sem guardar o IP).
- O resto (robôs criando partidas em massa) fica para quando as porcentagens forem públicas.

## Publicação
- O tracking só faz sentido com o site no ar. O repositório não tem remoto e não está ligado à Vercel.
- Proposta: criar um projeto na Vercel e publicar pelo CLI (ou subir para o GitHub e ligar o repositório).

## Etapas
1. Tabelas, índices e views no Supabase (uma migração).
2. Rota `/api/evento` com validação e testes.
3. `registro.ts`, origem, ganchos no `Jogo.tsx`.
4. Linha no `aviso` e `npm run link`.
5. Teste local de ponta a ponta (jogar uma partida e ver as views).
6. Publicar na Vercel com as variáveis.

Depois, separado: porcentagens da comunidade no jogo e o `/painel`.
