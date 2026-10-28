"""Blocos de prompt do Trama: a fonte de verdade do estilo (ver GUIA.md).

Montagem: MESTRE + ACENTO + FRENTES[frente] + cena (+ ICONES[...] quando houver).
O T5 do FLUX lê no máximo 512 tokens; o que passar é cortado sem aviso.
"""

# Base estética de toda imagem (calibrada nas referências em referencias/).
MESTRE = (
    "Storybook illustration in the style of Jon Klassen: flat textured gouache on "
    "warm paper with visible grain, simple geometric shapes, frontal horizontal "
    "composition with a large empty area above, small figures as solid dark "
    "silhouettes in suits or robes, tiny flat faces holding only two small black "
    "dots as eyes, shadows as long flat blocks of darker tone, no gradients, no "
    "photorealism, at most five colors, quiet and tense political mood."
)

# A assinatura visual: tudo apagado, um único elemento laranja forte.
# Toda cena termina com "Accent: <o elemento>." — sem isso o modelo põe sol até em interior.
ACENTO = (
    "Everything is muted and desaturated; the ground and sky stay muted. Only the "
    "single accent element named at the end is vivid amber-orange."
)

# Cada frente puxa a temperatura da mesma família terrosa. Nunca cores de partido.
FRENTES = {
    "planalto": "Palette: pale warm cream, light ochre, soft grey-brown, dark umber.",
    "congresso": "Palette: muted khaki-brown sky, warm sand ground, pale cream concrete, dark umber.",
    "supremo": "Palette: near-black background, deep umber floor, pale stone cream, dark silhouettes.",
    "direita": "Palette: dusty slate grey, bone white, muted plum-brown, dark umber.",
    "mundo": "Palette: pale washed sage and cream, dusty olive, dark umber.",
}

# Lugares-ícone descritos forma por forma, só com o que existe.
ICONES = {
    "congresso": (
        "Oscar Niemeyer's National Congress of Brazil as simple flat shapes of pale "
        "cream concrete: in the exact center, two identical very thin tall rectangular "
        "towers side by side, joined by a thin horizontal bridge at half height. To "
        "the left of the towers, one low shallow smooth dome shaped like an "
        "upside-down bowl. To the right, one wide shallow bowl opening upward like a "
        "saucer. Both sit on one long low flat horizontal platform. Smooth plain tops."
    ),
}
