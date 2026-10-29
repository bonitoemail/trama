"""Carrega o FLUX.1-schnell (pesos abertos, licença Apache 2.0) quantizado em NF4.

Em bf16 o transformer de 12B ocupa ~24 GB e não cabe numa placa de 16 GB; em NF4 ele cai
para ~6,5 GB e o T5 para ~3 GB, e tudo roda na GPU. Roda no computador, sem serviço pago.

Requer: torch com CUDA, diffusers, transformers, bitsandbytes, accelerate. O download dos
pesos pode pedir login no Hugging Face (variável HF_TOKEN ou `huggingface-cli login`).
"""

import torch

REPO = "black-forest-labs/FLUX.1-schnell"


def carrega_pipe():
    """O pipeline inteiro na VRAM: transformer e T5 em NF4, o resto em bf16."""
    from diffusers import BitsAndBytesConfig as DiffusersBnb
    from diffusers import FluxPipeline, FluxTransformer2DModel
    from transformers import BitsAndBytesConfig as TransformersBnb
    from transformers import T5EncoderModel

    nf4_d = DiffusersBnb(load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_compute_dtype=torch.bfloat16)
    nf4_t = TransformersBnb(load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_compute_dtype=torch.bfloat16)

    transformer = FluxTransformer2DModel.from_pretrained(
        REPO, subfolder="transformer", quantization_config=nf4_d, dtype=torch.bfloat16
    )
    text_encoder_2 = T5EncoderModel.from_pretrained(
        REPO, subfolder="text_encoder_2", quantization_config=nf4_t, dtype=torch.bfloat16
    )
    pipe = FluxPipeline.from_pretrained(
        REPO, transformer=transformer, text_encoder_2=text_encoder_2, dtype=torch.bfloat16
    )
    pipe.to("cuda")
    pipe.set_progress_bar_config(disable=True)
    return pipe
