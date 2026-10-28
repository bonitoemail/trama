"""Gera galeria.html com as imagens de testes/ e referencias/ (servir com a config "galeria")."""

import json
from pathlib import Path

AQUI = Path(__file__).resolve().parent
T = AQUI / "testes"

NOS_CAP01 = ["abertura", "pedido", "foragido", "o_prazo", "o_parecer", "itamaraty", "a_rota", "o_voo_fretado", "eleicao_eua", "noite_democrata", "noite_republicana", "o_canal", "pl", "a_ligacao", "a_convocacao"]


def grupos():
    escolhas = json.loads((AQUI / "escolhas.json").read_text(encoding="utf-8")) if (AQUI / "escolhas.json").exists() else {}
    yield "Referências aprovadas", sorted((AQUI / "referencias").glob("*.png")), set()
    for no in NOS_CAP01:
        # Marca qualquer imagem publicada (um nó pode usar a cena gerada com outro nome).
        yield f"Capítulo 1 · {no}", sorted(T.glob(f"cap01-{no}-*.png")), set(escolhas.values())
    yield "Rodada 2 · Miami", sorted(T.glob("v2-miami-*.png")), set()
    yield "Rodada 2 · Congresso", sorted(T.glob("v2-congresso-*.png")), set()
    yield "Rodada 2 · Supremo", sorted(T.glob("v2-supremo-*.png")), set()
    yield "Rodada 1 · Congresso com prompt melhorado", sorted(T.glob("congresso2-*.png")), set()
    yield "Base vetorial pintada por IA", sorted(T.glob("pintado-congresso-tex-*.png")), set()


def main():
    secoes = []
    for titulo, arquivos, escolhidas in grupos():
        figs = "".join(
            f'<figure class="{"escolhida" if f.stem in escolhidas else ""}">'
            f'<a href="{f.relative_to(AQUI).as_posix()}" target="_blank"><img src="{f.relative_to(AQUI).as_posix()}" loading="lazy"></a>'
            f'<figcaption>{f.stem}{" · no jogo" if f.stem in escolhidas else ""}</figcaption></figure>'
            for f in arquivos
        )
        secoes.append(f"<h2>{titulo}</h2><div class='g'>{figs}</div>")
    (AQUI / "galeria.html").write_text(f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Trama · galeria</title><style>
body{{margin:0;background:#141210;color:#efe6d2;font-family:system-ui,sans-serif}}
main{{max-width:1200px;margin:0 auto;padding:24px 16px 48px}}
h1{{font-family:Georgia,serif;font-weight:400;margin:0 0 6px}} p{{color:#a89f8e;margin:0 0 8px;line-height:1.5}}
h2{{font-family:Georgia,serif;font-weight:400;font-size:20px;margin:32px 0 10px}}
.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px}}
figure{{margin:0;border-radius:8px;padding:3px}} img{{width:100%;display:block;border-radius:6px}}
figure.escolhida{{outline:3px solid #f29a2e}}
figcaption{{font-size:12px;color:#8d8473;padding:4px 2px}} .escolhida figcaption{{color:#f29a2e}}
</style></head><body><main>
<h1>Galeria · ilustrações do Trama</h1>
<p>Contorno laranja = a imagem que está no jogo. Para trocar, me diga o nome (ex.: <b>cap01-pl-66</b>).</p>
{"".join(secoes)}
</main></body></html>""", encoding="utf-8")
    print("galeria.html ok")


if __name__ == "__main__":
    main()
