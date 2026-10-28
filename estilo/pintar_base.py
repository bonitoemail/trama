"""img2img: o FLUX pinta por cima de uma base vetorial (forma certa, textura de gouache).

  C:/Users/USER/openmontage/.venv/Scripts/python.exe estilo/pintar_base.py bases/congresso.png congresso
"""

import sys
from pathlib import Path

GAROUPA_BUILD = Path("C:/Users/USER/openmontage/projects/cabeca-da-garoupa/build")
sys.path.insert(0, str(GAROUPA_BUILD))
from importlib import import_module

import torch
from PIL import Image

flux = import_module("09_flux_nf4")
from prompts import FRENTES, MESTRE  # noqa: E402

AQUI = Path(__file__).resolve().parent
OUT = AQUI / "testes"

CENA = (
    "Keep the exact composition, shapes and positions of the reference image. "
    "Repaint it as hand-painted flat gouache on paper: visible paper grain, soft "
    "brush texture inside each flat shape, slightly irregular edges. Muted colors, "
    "amber accent toned down."
)


def main():
    base_png, frente = sys.argv[1], sys.argv[2]
    base = Image.open(AQUI / base_png).convert("RGB").resize((1344, 768))
    nome = Path(base_png).stem
    prompt = "\n\n".join([MESTRE, FRENTES[frente], CENA])

    from diffusers import FluxImg2ImgPipeline
    pipe = FluxImg2ImgPipeline.from_pipe(flux.carrega_pipe())
    OUT.mkdir(exist_ok=True)
    for forca in (0.55, 0.7, 0.85):
        for s in (11, 22):
            # autocast: o VAE e a base chegam em tipos diferentes no img2img
            with torch.autocast("cuda", dtype=torch.bfloat16):
                img = pipe(
                    prompt=prompt, image=base, strength=forca,
                    num_inference_steps=8, guidance_scale=0.0,
                    width=1344, height=768, max_sequence_length=512,
                    generator=torch.Generator("cuda").manual_seed(s),
                ).images[0]
            img.save(OUT / f"pintado-{nome}-{int(forca * 100)}-{s}.png")
            print("ok", forca, s)


if __name__ == "__main__":
    main()
