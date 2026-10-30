# Guia de estilo — ilustrações do Trama

> Vale para toda imagem do jogo. Os blocos de prompt vivem em `prompts.py` (fonte de verdade); este guia explica o porquê e as regras.
> Base: as lições da *Cabeça da Garoupa* (`F:\cabeca-da-garoupa\docs\08-licoes-aprendidas.md`) e os testes de 28/10/2026.

## 1. A ideia

Storybook no espírito de **Jon Klassen**, editorial de meados do século: gouache chapado sobre papel, formas simples, silêncio. Traço quase infantil, assunto adulto. O desenho é sóbrio para que o peso fique no texto.

## 2. Referências aprovadas

Em `referencias/` (escolhidas em 28/10/2026):

| Arquivo | O que ela define |
|---|---|
| `ref-mundo-miami.png` | figura pequena e escura num plano enorme; sombra longa em bloco; sálvia lavada |
| `ref-congresso.png` | ícone em formas creme sobre céu caqui; figuras minúsculas no chão vazio |
| `ref-supremo.png` | momento simbólico: fundo quase preto, colunata em blocos, um único feixe de luz |

O que as três têm em comum é o estilo do Trama:
- composição **frontal e horizontal**, horizonte baixo ou médio, **muito espaço vazio em cima**;
- figuras **pequenas, escuras e legíveis**: silhuetas de terno ou toga;
- sombras e luz como **blocos chapados**;
- **tudo dessaturado, menos um único elemento laranja forte.**

## 3. Regras invioláveis

1. **Um acento por imagem.** Um só elemento em âmbar-laranja vivo: o sol, um feixe de luz, uma janela, um objeto-chave. Ele é nomeado no fim do prompt (`Accent: ...`). Sem isso, o modelo põe sol até em interior.
2. **O resto é apagado.** Céu e chão nunca saturados.
3. **Paleta da frente.** Cada frente puxa a temperatura da mesma família terrosa (seção 4). **Nunca usar cores de partido** como cor dominante (vermelho PT, verde-amarelo, azul tucano).
4. **Rosto Klassen.** Rosto chapado com dois pontinhos pretos, sem boca, nariz ou sobrancelha. Emoção pela postura e pela direção do olhar.
5. **Figuras pequenas.** O plano é o protagonista; a pessoa ocupa pouco espaço. Isso também protege a regra do rosto, porque o FLUX desenha rosto realista quando a figura é grande.
6. **Mesmo tratamento para todos.** Nenhum político sai mais simpático, mais feio ou mais sombrio que outro. A luz dramática pertence à cena, não ao personagem.
7. **No máximo 5 cores por imagem.**

## 4. Paletas por frente

| Frente | Paleta (prompt) | Sensação |
|---|---|---|
| **Planalto** | creme quente, ocre claro, cinza-pardo suave, umbra | claro, institucional, exposto |
| **Congresso** | céu caqui-terroso, chão de areia, concreto creme, umbra | quente, poeirento, de negociação |
| **Supremo** | fundo quase preto, chão umbra, pedra creme, silhuetas | solene, fechado, simbólico |
| **Direita** | cinza-ardósia empoeirado, branco-osso, ameixa-pardo apagado, umbra | frio dentro do quente, de bastidor |
| **Mundo** | sálvia lavada e creme, oliva empoeirado, umbra | distante, estrangeiro |

O **acento laranja é o mesmo em todas as frentes**: é o fio que costura o jogo. A interface pode usar a mesma cor para o "caminho real" no fluxograma.

*Planalto e Direita ainda não foram testadas.*

## 5. Composição

- Formato de produção **16:9 (1344×768)**. A interface recorta para o celular.
- Plano **largo e frontal**. Câmera parada, como página de livro. Nada de ângulos dramáticos.
- Horizonte baixo ou no meio; **a metade de cima respira**.
- Cenas de **bastidor** (jantar, gabinete, ligação) seguem a mesma lógica: uma mesa, duas cadeiras, uma janela como bloco de luz.
- **Momentos simbólicos** (rupturas, decisões irreversíveis, fins de capítulo) ficam na paleta do Supremo: fundo escuro e um bloco de luz.

## 6. Lugares-ícone

O FLUX **não conhece** a arquitetura de Brasília pelo nome: inventa pirâmides, cúpulas de igreja e cruzes.

Regra: **descrever forma por forma, só o que existe.** Nunca nomear o que não deve aparecer ("sem cruz" tende a invocar a cruz). Os blocos validados ficam em `ICONES` no `prompts.py`.

| Ícone | Status |
|---|---|
| Congresso Nacional | ✅ bloco validado (acerta a ordem cúpula / torres / cuia na maioria das seeds) |
| Palácio do Planalto | a fazer |
| Palácio da Alvorada | a fazer |
| STF | a fazer (hoje usamos uma colunata genérica, que funciona como símbolo) |
| Esplanada dos Ministérios | a fazer |
| Casa Branca, Capitólio | a fazer |

Se um ícone não sair certo em 8 seeds, a alternativa é a **base vetorial pintada por IA** (`pintar_base.py`, base com textura, força ~0,55).

## 7. Personagens reais

- **Nunca pedir o nome da pessoa ao modelo.** A identidade vem de uma **ficha de traços**: silhueta, cabelo, barba, óculos, peça de roupa característica, postura.
- Ficha por personagem em `estilo/personagens/<nome>.md` (a criar), com os traços em português e o bloco em inglês para o prompt.
- Traços são **neutros e factuais** (cabelo branco, barba curta, óculos redondos), nunca caricatura depreciativa.
- *Retrato de personagem ainda não foi testado no FLUX.* Próximo teste.

## 8. Produção de uma imagem

1. Escrever a cena: composição → lugar ou ícone → figuras → luz → `Accent:`.
2. Montar com `MESTRE + ACENTO + FRENTES[frente] + cena` e **contar tokens** (limite 512; o script recusa se estourar).
3. Gerar **8 seeds** (~1 min com o modelo carregado).
4. Escolher pelo checklist (seção 9).
5. Salvar a escolhida como `content/imagens/<capitulo>/<no>.png` (a criar) e registrar o prompt e a seed.

## 9. Checklist de revisão

- [ ] **Assinatura ou texto falso** em algum canto. É frequente: o nome do artista no prompt provoca "assinaturas".
- [ ] **Rosto com olhos realistas, boca, nariz ou bochecha corada.**
- [ ] **Ícone errado**: forma inventada, prédio que não existe, símbolo religioso.
- [ ] **Mais de um acento**, ou laranja vazando para céu e chão.
- [ ] **Letras, logos, bandeiras ou números** inventados.
- [ ] **Tratamento desigual** entre personagens de lados diferentes.
- [ ] **Cor de partido** dominante.

## 10. Lições dos testes (28/10/2026)

1. **Só texto já entrega o estilo** para cenas genéricas. A base vetorial só é necessária em ícones difíceis.
2. **O acento precisa ser nomeado por cena.** A regra genérica ("um sol ou um bloco de luz") pôs sol dentro do Supremo e vazou laranja para o chão.
3. **Nomear o que não deve aparecer invoca.** Descrever só o que existe.
4. **Base vetorial chapada não ganha textura** no img2img; com grão e borda de pincel, funciona a ~0,55. Acima de ~0,7 o modelo põe rosto em prédio.
5. **Assinaturas falsas** aparecem em ~1 de cada 8 imagens. *Teste futuro:* trocar o nome do artista por uma descrição do estilo e ver se elas somem sem perder a estética.

### Lições do capítulo 3 (29/10/2026)

6. **"Dome" chama o Capitólio americano.** Num plenário com teto em cúpula, uma das 8 seeds desenhou a cúpula de Washington. Em cena do Senado brasileiro, prefira "low curved ceiling" e confira toda seed.
7. **Exteriores largos vazam laranja para o chão.** Com sol como acento, o chão de areia tende a sair laranja forte em quase todas as seeds. Escolha a que vaza menos; se todas vazarem, troque o acento para um objeto pequeno.
8. **Folha de contato.** Para escolher, monte as 8 seeds de uma cena numa folha só (4×2, com o número da seed) e confira o checklist em cada uma.

## Arquivos

- `prompts.py`: blocos de prompt (fonte de verdade).
- `gerar_teste.py`: gera cenas só com texto.
- `pintar_base.py`: pinta uma base vetorial (img2img).
- `bases/`: bases vetoriais.
- `referencias/`: imagens aprovadas.
- `galeria.html`: galeria dos testes (servir com a configuração "galeria" do `.claude/launch.json`).
- `testes/`: saídas dos testes (fora do git).
