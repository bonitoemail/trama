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
    "foragido": ("direita",
        "Composition: wide frontal shot of a bare room with a plain pale wall. One small man "
        "in a dark suit stands facing a phone mounted on a small tripod, seen from the side. "
        "Nothing else in the room but his long flat shadow on the wall. Accent: the tiny "
        "round recording light on the phone."),
    "o_prazo": ("congresso",
        "Composition: wide frontal shot of a large legislative chamber seen from the back: "
        "a semicircle of empty dark seats in rows facing a long raised table at the front. "
        "High above the table, on a plain wall, one large round clock. No people. Accent: "
        "the round clock face."),
    "noite_democrata": ("mundo",
        "Composition: wide frontal shot at night, low horizon. The United States Capitol as "
        "simple flat shapes: a long low pale building with one large central dome on a drum "
        "of columns. A wide empty lawn in front, a few tiny dark figures on the steps. Flat "
        "dark sky. Accent: the lit central dome."),
    "noite_republicana": ("mundo",
        "Composition: wide shot at night by the sea. A long low pale seaside villa with "
        "arched windows and a row of tall palm silhouettes, a flat dark sea and sky. On a "
        "wide terrace, a crowd of tiny dark figures stands together. Accent: the lit terrace "
        "as one warm block of light."),
    "o_canal": ("direita",
        "Composition: wide frontal shot of a dim apartment at night. One small man in a dark "
        "suit sits alone at a plain desk, seen from behind, facing a phone on a stand. A "
        "tall window behind the desk shows a flat night sky and palm silhouettes. Accent: a "
        "large round ring light beside the phone."),
    "a_ligacao": ("congresso",
        "Composition: wide shot of a dark office at night. A large empty desk. One small man "
        "in a suit stands at a tall window, seen from the side, holding a phone to his ear. "
        "Through the window, a flat low horizon with a few tiny lights far away. Accent: the "
        "small glowing phone at his ear."),
    "a_convocacao": ("congresso",
        "Composition: very wide frontal shot, low horizon, large empty sky. A vast flat "
        "empty lawn with two long rows of identical flat rectangular buildings on both sides, "
        "leading toward two thin tall towers far away in the center. In the foreground, a "
        "small empty stage with a loudspeaker truck and a few tiny dark figures. Accent: a "
        "large blank screen on the stage."),
    "o_parecer": ("supremo",
        "Composition: wide frontal shot of a long dark empty hall with a row of tall pale "
        "rectangular windows on the back wall. In the center, one long dark table with a "
        "single sheet of paper lying on it. One small figure in a dark suit stands far from "
        "the table, seen from behind. Accent: the single sheet of paper, lit."),
    "a_rota": ("mundo",
        "Composition: very wide shot at night, low horizon, huge dark sky. A long low flat "
        "bridge crosses a wide calm river from left to right, its reflection a flat dark "
        "band on the water. Dense jungle as flat dark shapes on both banks. One small dark "
        "car crosses the middle of the bridge. Accent: the two small headlights of the car."),
    "o_voo_fretado": ("mundo",
        "Composition: wide frontal shot of a dark empty aircraft hangar at night, its huge "
        "door open to a flat dark airfield. A small private jet as a simple pale elongated "
        "shape stands inside. One small figure in a dark coat stands near the jet holding a "
        "flashlight. Accent: the cone of light from the flashlight on the floor."),
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
