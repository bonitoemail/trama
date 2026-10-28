"""Publica imagens escolhidas no jogo: PNG de testes/ -> WebP leve em public/imagens/.

  python estilo/publicar.py cap01 abertura=cap01-abertura-33 pedido=cap01-pedido-11 ...

Cada par é <id do nó>=<nome do arquivo em testes/, sem .png>. A escolha fica
registrada em estilo/escolhas.json (prompt e seed reconstruíveis pelo nome).
"""

import json
import sys
from pathlib import Path

from PIL import Image

AQUI = Path(__file__).resolve().parent
PUBLIC = AQUI.parent / "public" / "imagens"
REGISTRO = AQUI / "escolhas.json"


def main():
    cap, pares = sys.argv[1], sys.argv[2:]
    destino = PUBLIC / cap
    destino.mkdir(parents=True, exist_ok=True)
    registro = json.loads(REGISTRO.read_text(encoding="utf-8")) if REGISTRO.exists() else {}
    for par in pares:
        no, origem = par.split("=", 1)
        img = Image.open(AQUI / "testes" / f"{origem}.png").convert("RGB")
        saida = destino / f"{no}.webp"
        img.save(saida, "WEBP", quality=82, method=6)
        registro[f"{cap}/{no}"] = origem
        print(f"{cap}/{no} <- {origem} ({saida.stat().st_size // 1024} KB)")
    REGISTRO.write_text(json.dumps(registro, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
