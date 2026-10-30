"""Cenas do capítulo 3 (A posse), uma por nó. Chave = id do nó no YAML.
Pessoas reais aparecem só como silhuetas pequenas, sem tentativa de semelhança (GUIA.md, seção 7)."""

from prompts import ICONES

CENAS = {
    "abertura": ("congresso",
        "Composition: very wide frontal shot in bright morning light, low horizon, large empty sky. "
        + ICONES["congresso"] +
        " A long pale ramp rises toward the platform. On the ramp, one small dark figure walks up "
        "alone; at the top, two small dark figures wait side by side. A thin crowd as tiny dots far "
        "below. Accent: a round sun high on the right."),
    "a_fazenda": ("planalto",
        "Composition: wide frontal shot of a bright modernist office with tall windows. A long "
        "desk with four identical empty chairs on one side, facing a single chair on the other. "
        "On the desk, one closed ledger book. Nobody in the room. Accent: the closed ledger, lit."),
    "o_herdeiro": ("planalto",
        "Composition: very wide shot of a long straight empty highway crossing a flat dry plain "
        "under a huge pale sky. One small dark car drives away toward a distant flat city on the "
        "horizon. Its shadow a short flat block. Accent: the small round sun just above the "
        "distant city."),
    "o_vice_no_cofre": ("planalto",
        "Composition: wide frontal shot of a tall plain room with one large closed vault door in "
        "the back wall, round and heavy. One small figure in a dark suit stands in front of it, "
        "hands behind his back. Long flat shadow on the floor. Accent: the round handle of the "
        "vault door."),
    "a_volta_de_haddad": ("planalto",
        "Composition: wide frontal shot of a long pale corridor with a row of identical doors. "
        "One door near the end stands open, warm light falling out on the floor. One small figure "
        "in a dark suit walks toward it, seen from behind, carrying a thin briefcase. Accent: the "
        "light from the open door."),
    "o_tecnico": ("planalto",
        "Composition: wide frontal shot of a quiet office at night with a large dark window. One "
        "small figure in shirtsleeves sits at a plain desk covered with neat stacks of paper. A "
        "single desk lamp. Accent: the cone of light from the desk lamp."),
    "o_ministerio": ("planalto",
        "Composition: wide frontal shot of a very long table in a pale meeting room, with many "
        "identical high-backed chairs on both sides. About half the chairs are occupied by small "
        "dark seated figures; the rest are empty. At the head of the table, one empty chair. "
        "Accent: a single round glass of water on the table, glowing."),
    "o_foro": ("supremo",
        "Composition: symbolic moment, wide frontal shot. A long row of slender pale columns, "
        "mostly in shadow. In the center, a tall stack of closed file boxes on a cart, half in a "
        "block of light, half in shadow. Nobody in the room. Accent: the trapezoid block of light "
        "on the floor."),
    "a_camara": ("congresso",
        "Composition: wide frontal shot of a large legislative chamber in semicircle, seen from "
        "the back, with hundreds of small dark seated figures in many rows. The rows on the left "
        "and right are separated by an empty aisle. A long raised table at the front. Accent: "
        "one small lamp on the raised table."),
    "o_senado": ("congresso",
        "Composition: wide frontal shot of a round chamber with a low dome ceiling. A small number "
        "of dark seated figures in curved rows. In the center, one plain wooden ballot box on a "
        "small table, a single figure dropping a folded paper into it. Accent: the slot of the "
        "ballot box, lit."),
    "o_ultimo_mandato": ("congresso",
        "Composition: wide frontal shot at dusk, low horizon, large empty sky. "
        + ICONES["congresso"] +
        " Flat empty plain around it. One small figure in a dark suit stands alone on the "
        "platform, looking at the sky. Accent: a large round sun setting behind the towers."),
    "a_vitoria_apertada": ("congresso",
        "Composition: wide frontal shot of a plain corridor with many closed doors. Small dark "
        "figures stand in pairs near some doors, heads close together, whispering. One figure "
        "stands alone in the middle, looking down the corridor. Accent: a single lit doorway at "
        "the end."),
    "o_senado_da_oposicao": ("supremo",
        "Composition: symbolic moment, wide frontal shot of a solemn dark room. A tall wooden "
        "cabinet with one drawer pulled open, papers inside. One small figure in a dark suit "
        "stands beside it, seen from behind. Accent: the light falling into the open drawer."),
}
