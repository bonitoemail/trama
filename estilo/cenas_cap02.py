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
        "Composition: wide frontal shot of a very large empty plaza at dusk, low horizon. In the "
        "center, one empty low speaker's stand with a single microphone. Far from it and far from "
        "each other, three small figures in dark suits stand apart, each seen from behind and "
        "facing a different direction. Long flat shadows on the ground. Accent: the small round "
        "light on the microphone."),
    "o_governador": ("planalto",
        "Composition: very wide frontal shot, low horizon, huge empty pale sky. A long low "
        "modernist palace as one pale horizontal block with a flat roof and a long even row of "
        "square windows, a flat lawn in front. All windows dark except one. Inside the lit "
        "window, one tiny dark silhouette of a man in a suit. Accent: the single lit window."),
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
    "a_moeda": ("mundo",
        "Composition: wide frontal shot of a dark formal office at night with tall windows and "
        "long curtains. A large empty desk in the center with one single document lying on it. "
        "No people. Through the windows, a flat dark lawn. Accent: the lit document on the "
        "desk."),
    "o_voo_de_volta": ("direita",
        "Composition: very wide shot at night, low horizon. An airplane as a simple dark "
        "elongated shape on a flat tarmac, its door open with a stair. Two small figures in "
        "dark suits walk down the stair. A short row of small dark figures waits at the foot of "
        "the stair. Flat dark sky. Accent: the lit doorway of the airplane."),
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
    "o_orcamento": ("planalto",
        "Composition: wide frontal shot of a plain government office at night with a long low "
        "window. A long wide table covered with tall stacks of paper. One small figure in a dark "
        "suit stands at the end of the table, looking at the stacks; two others wait by the door. "
        "Accent: a single desk lamp glowing over the stacks of paper."),
    "heranca_em_disputa": ("direita",
        "Composition: wide frontal shot of a very large empty hall. Two separate groups of small "
        "dark figures stand on opposite sides of the hall, facing each other across an empty "
        "floor. Accent: a single block of light on the empty floor between them."),
    "a_gaveta": ("supremo",
        "Composition: symbolic moment, wide frontal shot. A long row of slender pale columns, "
        "mostly in shadow. In front, one tall empty high-backed chair stands alone on a dark "
        "floor, with a small closed drawer cabinet beside it. Nobody in the room. Accent: a "
        "single block of light on the empty chair."),
    "a_custodia": ("supremo",
        "Composition: wide frontal shot at night of the plain wall of a large stone building with "
        "one tall doorway. On the sidewalk in front, two small groups of dark figures stand apart, "
        "separated by a short straight line of small figures in caps. Long flat shadows. Accent: "
        "the lit tall doorway."),
    "a_rua": ("direita",
        "Composition: wide frontal shot of a plain office meeting room. A long table seen from the "
        "side, small figures in dark suits standing around it, all turned toward the empty chair "
        "at the head of the table, with a dark jacket hanging on that chair. Accent: a small desk "
        "lamp lit next to the empty chair."),
    "a_anistia_na_rua": ("planalto",
        "Composition: very wide shot, low horizon, huge empty pale sky. A long flat avenue filled with a "
        "dense crowd of tiny dark figures seen from far away, a small flat truck in the middle of the "
        "crowd. Far away on the horizon, two very thin tall pale towers side by side. Nobody holds "
        "anything above the crowd. Accent: a round sun low on the horizon."),
    "a_moeda_de_troca": ("congresso",
        "Composition: wide frontal shot of a large quiet office with a tall window. Two small "
        "figures in dark suits sit on opposite sides of a wide dark desk, facing each other. "
        "Between them on the desk, one closed folder. Accent: the closed folder in a block of "
        "light from the window."),
    "a_contagem": ("planalto",
        "Composition: wide frontal shot of a plain pale office. One small woman with short hair in a "
        "dark jacket sits at a desk, seen from the side, looking at a large sheet of paper pinned on "
        "the wall in front of her, covered with many small rows of plain marks. A telephone on the "
        "desk. Accent: a small desk lamp lit on the desk."),
    "o_lado_de_lula": ("planalto",
        "Composition: very wide frontal shot of a long low modernist palace with thin columns and a "
        "flat roof, raised above a flat lawn, a long ramp leading up to it. All windows dark except "
        "one. Inside the lit window, two tiny dark silhouettes. Accent: the single lit window."),
    "a_frente_desfeita": ("supremo",
        "Composition: symbolic moment, wide frontal shot. A long empty table in a dark room, many "
        "empty chairs pushed back from it, one chair fallen on its side. Nobody in the room. Accent: "
        "a single block of light on the middle of the empty table."),
    "o_indulto": ("planalto",
        "Composition: wide frontal shot of a large pale office with a tall window. In the middle, "
        "a wide desk with a single sheet of paper and a pen on it. One small man in a dark suit "
        "stands beside the desk, seen from behind, looking at the paper. Accent: the single sheet "
        "of paper in a block of light from the window."),
    "a_paz_de_natal": ("planalto",
        "Composition: very wide shot at dusk, low horizon, huge empty pale sky. A long row of plain "
        "pale government buildings seen from far away along a flat empty avenue. No people. "
        "Accent: one single lit window far away."),
    "a_anistia_no_congresso": ("congresso",
        "Composition: wide frontal shot of a large legislative chamber seen from the back: a "
        "semicircle of empty dark seats in rows facing a long raised table at the front. Nobody "
        "in the room. Accent: one small lit microphone on the raised table."),
    "a_briga": ("direita",
        "Composition: wide frontal shot of a plain room split in two by a tall bare wall in the "
        "middle. On the left side, one small man in a dark suit speaks to a phone on a small "
        "tripod. On the right side, two small figures stand turned away, looking at a phone screen. "
        "Accent: the tiny round recording light on the tripod phone."),
    "a_conversa_com_xi": ("mundo",
        "Composition: wide frontal shot of a plain hotel meeting room with a tall window. Two small "
        "men in dark suits sit in two armchairs facing each other, a low table between them with "
        "two cups. Behind each armchair, one small standing aide. Accent: the block of light from "
        "the window on the low table."),
    "o_senado_sem_a_direita": ("congresso",
        "Composition: wide frontal shot of a large legislative chamber seen from the side: the "
        "seats on the left half are full of small dark seated figures, the seats on the right half "
        "are completely empty. Accent: one small lamp lit on the raised table at the front."),
}
