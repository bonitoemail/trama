"""Cenas do capítulo 2 (O espólio), uma por nó. Chave = id do nó no YAML.
Pessoas reais aparecem só como silhuetas pequenas, sem tentativa de semelhança (GUIA.md, seção 7)."""

from prompts import ICONES

CENAS = {
    "abertura": ("planalto",
        "Composition: very wide frontal shot at dawn, low horizon, large empty sky. A vast flat "
        "empty lawn with two long rows of identical flat rectangular buildings on both sides, "
        "leading toward two thin tall towers far away in the center. One tiny dark figure walks "
        "alone on the lawn. Accent: a round sun rising behind the towers."),
    "a_cadeira": ("planalto",
        "Composition: wide frontal shot of a large bright modernist office with tall windows "
        "and thin white columns outside. A long empty desk with a single high-backed dark chair "
        "turned toward the window. On the desk, one closed folder. Nobody in the room. Accent: "
        "the closed folder on the desk, lit."),
    "o_recado": ("congresso",
        "Composition: wide shot of a long pale corridor with a low ceiling. A tight cluster of "
        "small dark figures holds microphones toward one small man in a dark suit. The rest of "
        "the corridor is empty. Accent: a single lit doorway at the end of the corridor."),
    "a_espera": ("supremo",
        "Composition: symbolic moment, wide frontal shot of a solemn semicircular court room "
        "with a row of eleven tall dark chairs behind a long curved bench. Ten chairs are in "
        "shadow; one chair in the middle is empty and lit. No people. Accent: the single empty "
        "lit chair."),
    "a_sabatina": ("congresso",
        "Composition: wide frontal shot of a committee room: a long curved raised table with "
        "many small seated figures in dark suits, facing one small figure seated alone at a "
        "small table in the center of the floor. Accent: the small lamp on the lone table."),
    "a_segunda_derrota": ("congresso",
        "Composition: wide frontal shot of a large legislative chamber in semicircle, rows of "
        "small seated dark figures, all facing a huge flat electronic panel on the front wall "
        "showing only blocks of light, no letters or numbers. Accent: the large glowing panel."),
    "a_herdeira": ("direita",
        "Composition: wide frontal shot of an apartment at dusk. One small woman in a dark dress "
        "with long hair stands at a very tall window, seen from behind, looking at a flat city "
        "of low modernist buildings. Long flat shadow on the floor. Accent: a round sun setting "
        "over the city."),
    "a_estreia": ("congresso",
        "Composition: wide shot of a long meeting room. One small woman in a dark dress stands at "
        "the head of a long table, speaking; small seated figures in dark suits on both sides "
        "turn toward her. A tall window on the right. Accent: the block of light from the window "
        "falling on her."),
    "o_vazio": ("direita",
        "Composition: wide frontal shot of a large empty conference room at night with rows of "
        "empty dark chairs. A huge window behind shows a dense flat city skyline of tall "
        "buildings, all dark. Accent: one single lit window in the skyline."),
    "a_conta": ("congresso",
        "Composition: wide frontal shot of a raised presiding table in a legislative chamber, "
        "three small seated figures behind it, the chamber below empty. On the wall above, one "
        "large wall calendar with blank squares. Accent: a single square of the calendar, lit."),
    "o_suplente": ("congresso",
        "Composition: wide frontal shot of a legislative chamber. One small man in a dark suit "
        "speaks at a central tribune; small seated figures in rows below; a raised presiding "
        "table behind him. Accent: the small lamp on the tribune."),
    "miami": ("mundo",
        "Composition: very wide shot, low horizon, huge empty sky. A long low pale clubhouse with "
        "a flat roof by a flat green golf course, rows of tall palm silhouettes, a line of small "
        "dark cars parked in front, tiny figures. Accent: a round sun low on the right."),
    "a_conversa": ("mundo",
        "Composition: wide frontal shot of a large pale salon with tall windows showing palm "
        "silhouettes. Two small figures in dark suits sit in two armchairs facing each other, "
        "far from the camera, a small table between them. Accent: the warm lamp on the small "
        "table."),
    "a_mesa": ("congresso",
        "Composition: wide frontal shot at dusk, low horizon, large empty sky. " + ICONES["congresso"]
        + " Flat empty plain around it, no people. Accent: a round sun in the sky."),
    "natal_do_acordo": ("planalto",
        "Composition: wide frontal shot of a long dinner table at night inside a modernist house "
        "with a huge window to a flat dark garden. Small seated figures in dark suits on both "
        "sides of the table, all leaning toward each other. Accent: a single warm pendant lamp "
        "hanging over the middle of the table."),
    "guerra_de_fevereiro": ("congresso",
        "Composition: wide shot of a long dark corridor at night. Many small dark figures stand "
        "apart from each other along the walls, each one alone, each holding a phone to the ear. "
        "Accent: the small glowing screen of one phone in the center."),
    "heranca_em_disputa": ("direita",
        "Composition: wide frontal shot of a very large empty hall. Two separate groups of small "
        "dark figures stand on opposite sides of the hall, facing each other across an empty "
        "floor. Accent: a single block of light on the empty floor between them."),
}
