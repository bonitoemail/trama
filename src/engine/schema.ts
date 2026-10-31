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

/**
 * Fontes de um fato: links. Vale documento oficial (gov.br, jus.br, leg.br...) ou pelo menos duas
 * fontes independentes, de linhas editoriais diferentes. O validador confere (validate.ts).
 */
export const FontesSchema = z.array(z.url()).min(1);

/** A realidade decidiu este nó: a escolha fica travada como o que aconteceu (DESIGN 6.1). */
export const RealSchema = z.strictObject({
  // ISO, como os relógios: /escolhas corta os votos por esta data (src/lib/escolhas.ts), e a tela escreve "3 de novembro".
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'data no formato AAAA-MM-DD'),
  fontes: FontesSchema,
});

/** Fato real citado numa cena ("Fatos e fontes"): o texto, as fontes e, se preciso, uma condição. */
export const FatoDeCenaSchema = z.strictObject({
  texto: z.string(),
  fontes: FontesSchema,
  se: CondicaoSchema.optional(),
});

export const EscolhaSchema = z.strictObject({
  id: z.string(),
  rotulo: z.string(),
  /** Só aparece se a condição valer. */
  se: CondicaoSchema.optional(),
  real: RealSchema.optional(),
  marca: z.array(z.string()).optional(),
  /** Próximo nó do capítulo. Sem isso, a escolha encerra o capítulo. */
  vai_para: z.string().optional(),
});

export const NoSchema = z.strictObject({
  id: z.string(),
  /**
   * Nome curto da cena, para listas fora da partida (tela /escolhas): a decisão ("O pedido de prisão")
   * ou o final ("Valdemar liga para Alcolumbre"). Sem ele, a lista usa o `lugar`.
   */
  titulo: z.string().optional(),
  /** Quem está em cena, ou onde (ex.: "Miami, 28 de outubro"). */
  lugar: z.string().optional(),
  /** Caminho em public/ (ex.: "imagens/cap01/abertura.webp"). */
  imagem: z.string().optional(),
  /** Cada parágrafo vira um cartão (formato stories): curto, uma ideia por cartão. */
  texto: TextoSchema,
  /** "Fatos e fontes", parte 1: o que aconteceu de verdade, cada fato com suas fontes. */
  fatos: z.array(FatoDeCenaSchema).min(1).optional(),
  /** "Fatos e fontes", parte 2: como cada lado vê. Posições e motivos, não fatos. */
  lados: TextoSchema.optional(),
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
  /**
   * Datas do período (AAAA-MM-DD), para a skill saber quando a realidade alcança o capítulo
   * (`npm run estado`, "Horizonte"). O texto que o jogador vê continua sendo `periodo`.
   */
  de: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'data no formato AAAA-MM-DD'),
  ate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'data no formato AAAA-MM-DD'),
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
  /** Manchete curta (uma linha) para a lista de fatos; o texto abre ao tocar. */
  titulo: z.string().optional(),
  texto: z.string(),
  fontes: FontesSchema,
  /** Fica no Agora da capa mesmo com fatos mais novos (que entram só na lista). No máximo um. */
  fixado: z.boolean().optional(),
});

/** Tela inicial: o que é o jogo e como funciona, em poucos passos. */
export const ApresentacaoSchema = z.strictObject({
  /** Linha curta sob o título. */
  ficha: z.string().optional(),
  /** Frase de abertura, opcional. "{partidas}" vira o número de histórias possíveis (ex.: "61 mil"). */
  texto: z.string().optional(),
  passos: z.array(z.strictObject({ titulo: z.string(), texto: z.string() })).min(1),
});

const Bloco = z.strictObject({
  titulo: z.string(),
  texto: z.string(),
  /** Frase em destaque, mostrada como citação no lugar do título (tela "O que é o Trama"). */
  destaque: z.string().optional(),
});

/** Tela de explicação (ex.: "Como fazemos as previsões", "O que é o Trama"). */
export const ExplicacaoSchema = z.strictObject({
  titulo: z.string(),
  texto: z.string(),
  etapas: z.array(Bloco).min(1),
  /** As lentes do painel (só na tela do método). */
  lentes: z.array(z.strictObject({ nome: z.string(), texto: z.string() })).min(1).optional(),
  nota: z.string().optional(),
  /** Onde conferir: o repositório público, com o código, as cenas e as instruções dos agentes. */
  codigo: z
    .strictObject({
      titulo: z.string(),
      texto: z.string(),
      links: z.array(z.strictObject({ rotulo: z.string(), url: z.url() })).min(1),
    })
    .optional(),
});

/**
 * "O jogo e a realidade" (content/acertos.yaml, tela /acertos): o que uma cena escreveu antes e a
 * realidade confirmou, ou não, depois. A previsão aponta para o commit público em que entrou no jogo.
 */
export const AcertoSchema = z.strictObject({
  /** Se a realidade confirmou o que a cena escreveu, ou foi por outro caminho (a cena foi reescrita). */
  status: z.enum(['confirmou', 'nao_confirmou']),
  titulo: z.string(),
  previsto: z.strictObject({
    /** Data e hora do commit, no horário de Brasília. */
    data: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, 'data no formato AAAA-MM-DD HH:MM'),
    commit: z.string().regex(/^[0-9a-f]{7,40}$/, 'hash do commit'),
    /** Nó em que a previsão estava ("cap01/o_voo_fretado"). */
    onde: z.string(),
    /** Em que caminho a cena aparece, quando não é a espinha. */
    caminho: z.string().optional(),
    /** O texto como estava naquele commit. */
    texto: z.string(),
  }),
  /** O que a realidade fez, com as fontes. */
  realidade: z.strictObject({
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'data no formato AAAA-MM-DD'),
    texto: z.string(),
    fontes: FontesSchema,
  }),
  /**
   * Se confirmou: o que não bateu (todo item diz onde a cena e a realidade se separam).
   * Não se confirmou: o que mudou no jogo.
   */
  diferenca: z.string(),
});

export const AcertosSchema = z.strictObject({
  titulo: z.string(),
  texto: z.string(),
  nota: z.string(),
  /** Onde ver o que o jogo errou (as cenas reescritas). */
  historico: z.url(),
  /** Base dos links de commit ("https://github.com/<dono>/<repo>/commit/"). */
  commits: z.url(),
  itens: z.array(AcertoSchema),
});

/**
 * Tela /escolhas (sem link na capa): o que os jogadores escolheram, somado. Os números vêm do
 * registro anônimo (src/lib/escolhas.ts); aqui ficam só os textos.
 */
export const PaginaEscolhasSchema = z.strictObject({
  titulo: z.string(),
  texto: z.string(),
  /** Fixo no topo: não é pesquisa de opinião. */
  aviso: z.string(),
  /** "Como contamos": um parágrafo por item. */
  metodo: z.array(z.string()).min(1),
});

/** Data fixa e pública do calendário (eleição, posse), sem previsão: as paradas da régua da capa. */
export const MarcoSchema = z.strictObject({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'data no formato AAAA-MM-DD'),
  nome: z.string(),
});

export const JogoSchema = z.strictObject({
  versao: z.string(),
  titulo: z.string(),
  aviso: z.string(),
  apresentacao: ApresentacaoSchema.optional(),
  /** Tela "O que é o Trama": o objetivo do jogo. "{partidas}" vira o número de histórias. */
  objetivo: ExplicacaoSchema.optional(),
  metodo: ExplicacaoSchema.optional(),
  prologo: z.array(FatoSchema).min(1),
  /** Régua da capa: os marcos depois do último fato real viram as paradas; o último é o fim. */
  calendario: z.array(MarcoSchema).min(1).optional(),
  primeiro_capitulo: z.string(),
  capitulos: z.array(CapituloSchema).min(1),
  /** Texto do fim de jogo; cada parágrafo pode depender das marcas. */
  epilogo: FinalSchema,
  acertos: AcertosSchema.optional(),
  escolhas: PaginaEscolhasSchema.optional(),
});

export type Texto = z.infer<typeof TextoSchema>;
export type Escolha = z.infer<typeof EscolhaSchema>;
export type No = z.infer<typeof NoSchema>;
export type Saida = z.infer<typeof SaidaSchema>;
export type Capitulo = z.infer<typeof CapituloSchema>;
export type Jogo = z.infer<typeof JogoSchema>;
export type Marco = z.infer<typeof MarcoSchema>;
