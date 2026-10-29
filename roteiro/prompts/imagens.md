# Como as imagens são feitas

Toda ilustração do jogo sai de um modelo de imagem de pesos abertos, rodando num computador comum: nenhum serviço pago, nenhum prompt escondido. O prompt de cada imagem, o modelo, as configurações e a seed estão no repositório, e quem tiver uma placa de vídeo parecida consegue gerar a mesma imagem.

## O modelo

- **FLUX.1-schnell**, da Black Forest Labs, com licença Apache 2.0: [huggingface.co/black-forest-labs/FLUX.1-schnell](https://huggingface.co/black-forest-labs/FLUX.1-schnell).
- Quantizado em NF4 para caber numa placa de 16 GB (usamos uma RTX 4080). O carregador está em [`estilo/flux.py`](../../estilo/flux.py).
- Configuração fixa, igual para todas: 4 passos, `guidance_scale` 0, 1344 × 768 pixels, até 512 tokens de prompt. Está em [`estilo/gerar_teste.py`](../../estilo/gerar_teste.py).

## O prompt de cada imagem

O prompt é montado de quatro blocos, sempre na mesma ordem:

1. **Estilo**: o mesmo para todas as imagens (ilustração chapada em guache, figuras pequenas e escuras, rosto só com dois pontinhos). Em [`estilo/prompts.py`](../../estilo/prompts.py), `MESTRE`.
2. **Acento**: tudo apagado, só um elemento em laranja. `ACENTO`, no mesmo arquivo.
3. **Paleta da frente**: Planalto, Congresso, Supremo, direita ou mundo, todas da mesma família de tons de terra e nenhuma com cor de partido. `FRENTES`, no mesmo arquivo.
4. **A cena**: o que aparece naquela imagem, uma por nó do jogo. Em [`estilo/cenas_cap01.py`](../../estilo/cenas_cap01.py) e [`estilo/cenas_cap02.py`](../../estilo/cenas_cap02.py).

O porquê de cada regra (figuras pequenas, mesmo tratamento para todos os políticos, nenhuma cor de partido) está no [guia de estilo](../../estilo/GUIA.md).

## Da geração ao jogo

1. Cada cena é gerada com 8 seeds fixas: 11, 22, 33, 44, 55, 66, 77 e 88.
2. **Uma pessoa escolhe** a melhor das 8, seguindo o guia: a que respeita as regras e lê melhor no celular. A escolha é humana, e é por isso que ela fica registrada.
3. A escolhida vira WebP em `public/imagens/<capítulo>/<nó>.webp` ([`estilo/publicar.py`](../../estilo/publicar.py)), e [`estilo/escolhas.json`](../../estilo/escolhas.json) guarda qual foi: `"cap01/pedido": "cap01-pedido-33"` quer dizer a cena `pedido` de `cenas_cap01.py`, seed 33.

## Como gerar de novo

```bash
pip install torch diffusers transformers bitsandbytes accelerate pillow
python estilo/gerar_teste.py --cenas cenas_cap01 pedido
```

Saem as 8 versões em `estilo/testes/`. Compare a da seed registrada em `escolhas.json` com a publicada em `public/imagens/`.

Testamos em 29/10/2026 com a cena `pedido` do capítulo 1: gerada de novo com este código, cada uma das 8 versões saiu idêntica à original, pixel por pixel. A publicada difere só pela compressão do WebP (em média 1,4 de 255 por pixel). Em outra placa ou com outras versões das bibliotecas, pequenos detalhes podem mudar, mas a composição é a mesma.

## O que isto não garante

- **O prompt pode ter mudado depois da imagem.** Se uma cena foi reescrita depois de publicada, a imagem antiga não sai mais igual. O histórico do git mostra quando cada prompt e cada imagem mudaram.
- **A escolha entre as 8 é de uma pessoa.** As regras dela estão no guia, mas é um julgamento.
- **Ninguém é retratado.** As figuras são silhuetas sem traços de rosto: não há retrato de pessoa real.
