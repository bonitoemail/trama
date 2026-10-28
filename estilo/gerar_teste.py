"""Gera cenas do Trama no FLUX.1-schnell local (NF4), reaproveitando o carregador
da Garoupa. Os blocos de estilo vêm de prompts.py.

  C:/Users/USER/openmontage/.venv/Scripts/python.exe estilo/gerar_teste.py [cena ...]
"""

import sys
from pathlib import Path

GAROUPA_BUILD = Path("C:/Users/USER/openmontage/projects/cabeca-da-garoupa/build")
sys.path.insert(0, str(GAROUPA_BUILD))
from importlib import import_module

from transformers import T5TokenizerFast

from prompts import ACENTO, FRENTES, ICONES, MESTRE

flux = import_module("09_flux_nf4")  # carrega o .env do openmontage (HF_TOKEN)

OUT = Path(__file__).resolve().parent / "testes"
LIMITE = 512

CENAS = {
    "miami": ("mundo",
        "Composition: very wide shot, low horizon, huge empty sky. A small private jet "
        "rendered as a simple dark elongated shape parked on a flat runway, a short "
        "stair against its door, its shadow a long flat block on the ground. At the "
        "foot of the stair, one small man in a dark suit stands alone, looking "
        "sideways. One palm tree as a simple silhouette on the left. Early morning. "
        "Accent: a round sun low on the right."),
    "congresso": ("congresso",
        "Composition: wide frontal shot at dusk, low horizon, large empty sky. "
        + ICONES["congresso"] +
        " Flat empty plain around it. Two small figures in dark suits talk in the "
        "foreground. Accent: a round sun in the sky."),
    "supremo": ("supremo",
        "Composition: symbolic moment, wide frontal shot. A long row of slender pale "
        "columns under a long flat roof, mostly in shadow. A single trapezoid block of "
        "light falls on the floor in the center. One small figure in a dark robe "
        "stands at the edge of the light, another seen from behind in the foreground. "
        "Accent: the trapezoid block of light on the floor."),
}

SEEDS = [11, 22, 33, 44, 55, 66, 77, 88]


def montar(frente: str, cena: str) -> str:
    return "\n\n".join([MESTRE, ACENTO, FRENTES[frente], cena])


def main():
    """Uso: gerar_teste.py [--cenas cenas_cap01] [cena ...]. Sem cenas, gera todas."""
    args = sys.argv[1:]
    cenas, prefixo = CENAS, "v2"
    if args[:1] == ["--cenas"]:
        modulo = args[1]
        cenas, prefixo, args = import_module(modulo).CENAS, modulo.removeprefix("cenas_"), args[2:]
    OUT.mkdir(parents=True, exist_ok=True)
    tok = T5TokenizerFast.from_pretrained(flux.REPO, subfolder="tokenizer_2")
    prompts = {}
    for nome in args or list(cenas):
        p = montar(*cenas[nome])
        n = len(tok(p, truncation=False).input_ids)
        print(f"{nome}: {n} tokens")
        if n > LIMITE:
            raise SystemExit(f"{nome} estoura {LIMITE} tokens")
        prompts[nome] = p

    import torch
    pipe = flux.carrega_pipe()
    for nome, p in prompts.items():
        for s in SEEDS:
            img = pipe(
                prompt=p, num_inference_steps=4, guidance_scale=0.0,
                width=1344, height=768, max_sequence_length=LIMITE,
                generator=torch.Generator("cuda").manual_seed(s),
            ).images[0]
            caminho = OUT / f"{prefixo}-{nome}-{s}.png"
            img.save(caminho)
            print("ok", caminho.name)


if __name__ == "__main__":
    main()
