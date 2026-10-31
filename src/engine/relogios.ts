import type { Jogo } from './schema';

/** Um relógio de pesquisa/relogios.yaml: data e evento que a realidade vai decidir. */
export interface Relogio {
  id?: string;
  data?: string;
  evento?: string;
  afeta?: string[];
  status?: string;
}

/** Uma decisão do jogo que a realidade ainda vai decidir, com a data do relógio mais próximo. */
export interface AConfirmar {
  capitulo: string;
  numero: number;
  no: string;
  titulo: string;
  data: string;
  opcoes: string[];
  /**
   * Os desfechos possíveis, um por rótulo (as variantes por marca viram um), com o id da primeira:
   * são os que se pode cravar como palpite. Inclui os que só alguns jogadores veem no jogo, porque a
   * realidade pode escolher qualquer um (revisão dos palpites, 31/10).
   */
  escolhas: { id: string; rotulo: string }[];
}

/**
 * "A confirmar" da tela /acertos: decisões ainda não travadas que um relógio pendente com data
 * vai decidir. Uma linha por decisão, pela data mais próxima, da mais cedo para a mais tarde.
 * O relógio que vira "aconteceu" (ou a escolha travada) tira a decisão daqui.
 */
export function aConfirmar(jogo: Jogo, relogios: Relogio[]): AConfirmar[] {
  const quando = new Map<string, string>();
  for (const r of relogios) {
    if (!r.data || (r.status && r.status !== 'pendente')) continue;
    for (const ref of r.afeta ?? []) {
      const k = ref.split(':')[0];
      if (!quando.has(k) || r.data < quando.get(k)!) quando.set(k, r.data);
    }
  }
  return jogo.capitulos
    .flatMap((cap) =>
      cap.nos
        .filter((n) => n.escolhas?.length && !n.escolhas.some((e) => e.real) && quando.has(`${cap.id}/${n.id}`))
        .map((n) => ({
          capitulo: cap.id,
          numero: cap.numero,
          no: n.id,
          titulo: n.titulo ?? n.lugar ?? n.id,
          data: quando.get(`${cap.id}/${n.id}`)!,
          opcoes: [...new Set(n.escolhas!.map((e) => e.rotulo))],
          escolhas: [...new Map(n.escolhas!.map((e) => [e.rotulo, { id: e.id, rotulo: e.rotulo }])).values()].map((e) => ({
            ...e,
            id: n.escolhas!.find((x) => x.rotulo === e.rotulo)!.id,
          })),
        })),
    )
    .sort((x, y) => x.data.localeCompare(y.data) || x.numero - y.numero);
}
