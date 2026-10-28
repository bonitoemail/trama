"""Cenas do capítulo 1 (O voo), uma por nó. Chave = id do nó no YAML."""

from prompts import ICONES  # noqa: F401  (disponível para cenas com ícone)

CENAS = {
    "abertura": ("mundo",
        "Composition: very wide shot, low horizon, huge empty sky. A small private jet as a "
        "simple dark elongated shape parked on a flat runway, a short stair against its "
        "open door, its shadow a long flat block on the ground. Descending the stair, a "
        "small man in a dark suit, behind him a woman and two small children, all as "
        "simple dark silhouettes. A plain dark car waits nearby. One palm tree as a simple "
        "silhouette on the left. Morning. Accent: a round sun low on the right."),
    "pedido": ("supremo",
        "Composition: symbolic moment, wide frontal shot. A long row of slender pale "
        "columns under a long flat roof, mostly in shadow. In the center, one long empty "
        "dark desk with a single closed folder on it. A single block of light falls on the "
        "desk from above. No one at the desk. Accent: the block of light on the folder."),
    "eleicao_eua": ("mundo",
        "Composition: wide shot of a dim rented apartment at night, flat dark shapes. Two "
        "small men in dark clothes sit on a low sofa seen from behind, facing a television "
        "on a low cabinet. A tall window shows a flat night sky and a row of simple palm "
        "silhouettes. The room is muted dark olive and umber. Accent: the glowing "
        "rectangle of the television screen."),
    "proximo_passo": ("direita",
        "Composition: wide frontal shot of an almost empty apartment. One small man in a "
        "dark suit stands at a very tall window, seen from behind, looking out at a flat "
        "pale sea and a flat sky. Beside him, a small table with a phone lying on it. Long "
        "flat shadow of the window frame on the floor. Accent: the small glowing phone "
        "screen on the table."),
    "itamaraty": ("planalto",
        "Composition: wide frontal shot, low horizon, large empty sky. A long low modernist "
        "palace with a flat horizontal roof and a regular row of tall slender pointed "
        "arches along its whole facade, standing above a flat calm reflecting pool that "
        "mirrors the arches. Two small figures in dark suits walk on a thin bridge over "
        "the water. Accent: a round sun low on the left."),
    "aeroporto": ("direita",
        "Composition: very wide shot at night, low horizon. An airplane as a simple dark "
        "elongated shape on a flat tarmac, a stair against its open door. One small figure "
        "in a dark suit stands at the top of the stair. On the ground, a small row of dark "
        "figures waits at a distance. Flat dark sky with a few tiny dots of light. Accent: "
        "the open lit doorway of the airplane."),
    "pl": ("congresso",
        "Composition: wide frontal shot of a long meeting room. A very long table runs "
        "toward the back, with dark chairs on both sides and small seated figures in dark "
        "suits, all turned toward the head of the table, where one chair is empty. A tall "
        "window on the right. Flat muted walls. Accent: the block of light from the window "
        "falling on the empty chair."),
}
