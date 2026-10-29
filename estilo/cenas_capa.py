"""Capa da tela inicial: o Brasil inteiro, não um personagem. Faixa larga (desktop) que o
celular recorta no centro; o assunto principal fica no meio do quadro."""

from prompts import ICONES

TAMANHO = (1536, 640)

CENAS = {
    "pais": ("congresso",
        "Composition: very wide panoramic shot, low horizon, large empty sky, the main subject "
        "in the center. Far away in the center, "
        + ICONES["congresso"] +
        " On the left, a steep hillside covered with small stacked box houses with tiny "
        "windows. On the right, a wide flat field with a few palm trees and low hills. In the "
        "foreground, a long flat road where many tiny ordinary people walk in different "
        "directions: workers, a woman holding a child, an old man, a street vendor with a cart. "
        "Accent: a round sun low behind the towers."),
    "esplanada": ("congresso",
        "Composition: very wide panoramic frontal shot at dusk, low horizon, large empty sky, "
        "the main subject in the center. "
        + ICONES["congresso"] +
        " In front of it, a vast flat lawn crossed by a large crowd of tiny ordinary people "
        "seen from behind, some standing, some walking, a few with umbrellas, a street vendor "
        "with a cart, a cyclist. No signs, no banners. Accent: a round sun low behind the towers."),
    "estrada": ("planalto",
        "Composition: very wide panoramic shot, low horizon, large empty sky, the main subject "
        "in the center. A long straight road crosses a dry savanna with twisted small trees and "
        "splits into three roads toward the horizon. Tiny and far on the horizon, two thin tall "
        "towers side by side. In the foreground, at a simple bus stop, a few tiny ordinary "
        "people wait: a worker, a woman with a child, an old man, a student. Accent: a round sun "
        "low on the horizon where the roads meet."),
}
