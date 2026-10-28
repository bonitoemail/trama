import { z } from 'zod';

/**
 * Formato do conteúdo (YAML). Tudo que o roteiro pode expressar está aqui.
 * Marcas são strings: só existe "tem" ou "não tem".
 */

export type Condicao =
  | { tem: string }
  | { nao_tem: string }
  | { todas: Condicao[] }
  | { qualquer: Condicao[] };

export const CondicaoSchema: z.ZodType<Condicao> = z.lazy(() =>
  z.union([
    z.strictObject({ tem: z.string() }),
    z.strictObject({ nao_tem: z.string() }),
    z.strictObject({ todas: z.array(CondicaoSchema).min(1) }),
    z.strictObject({ qualquer: z.array(CondicaoSchema).min(1) }),
  ]),
);

/** Um parágrafo pode aparecer só quando uma condição vale (com alternativa opcional). */
const TrechoCondicionalSchema = z.strictObject({
  se: CondicaoSchema,
  texto: z.string(),
  senao: z.string().optional(),
});

export const TextoSchema = z.union([
  z.string(),
  z.array(z.union([z.string(), TrechoCondicionalSchema])).min(1),
]);

export const EscolhaSchema = z.strictObject({
  id: z.string(),
  rotulo: z.string(),
  /** Só aparece se a condição valer. */
  se: CondicaoSchema.optional(),
  marca: z.array(z.string()).optional(),
  /** Próximo nó do capítulo. Sem isso, a escolha encerra o capítulo. */
  vai_para: z.string().optional(),
});

export const NoSchema = z.strictObject({
  id: z.string(),
  /** Quem está em cena, ou onde (ex.: "Miami, 28 de outubro"). */
  lugar: z.string().optional(),
  texto: TextoSchema,
  escolhas: z.array(EscolhaSchema).optional(),
  /** Nó só de texto: segue direto para outro nó. */
  segue: z.string().optional(),
});

export const SaidaSchema = z.strictObject({
  /** Id de capítulo, ou "FIM". */
  para: z.string(),
  quando: CondicaoSchema.optional(),
});

export const CapituloSchema = z.strictObject({
  id: z.string(),
  numero: z.number().int(),
  titulo: z.string(),
  periodo: z.string(),
  rascunho: z.boolean().optional(),
  inicio: z.string(),
  nos: z.array(NoSchema).min(1),
  /** Avaliadas em ordem; a primeira que valer decide. */
  saidas: z.array(SaidaSchema).min(1),
});

export const FinalSchema = z.strictObject({
  id: z.string(),
  titulo: z.string(),
  texto: TextoSchema,
});

export const FatoSchema = z.strictObject({
  data: z.string(),
  texto: z.string(),
  fonte: z.string().optional(),
});

export const JogoSchema = z.strictObject({
  versao: z.string(),
  titulo: z.string(),
  aviso: z.string(),
  prologo: z.array(FatoSchema).min(1),
  primeiro_capitulo: z.string(),
  capitulos: z.array(CapituloSchema).min(1),
  /** Texto do fim de jogo; cada parágrafo pode depender das marcas. */
  epilogo: FinalSchema,
});

export type Texto = z.infer<typeof TextoSchema>;
export type Escolha = z.infer<typeof EscolhaSchema>;
export type No = z.infer<typeof NoSchema>;
export type Saida = z.infer<typeof SaidaSchema>;
export type Capitulo = z.infer<typeof CapituloSchema>;
export type Jogo = z.infer<typeof JogoSchema>;
