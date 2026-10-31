/**
 * Estado do jogo para a skill `atualizar-jogo`: o que a realidade já pode ter decidido,
 * o que vem aí, o que está travado e a saúde das imagens.
 *
 *   npm run estado                 # hoje
 *   npm run estado -- 2026-11-05   # como se fosse outra data
 */
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { carregarJogo } from '../src/engine/load';
import { validar } from '../src/engine/validate';

interface Relogio {
  id: string;
  data?: string;
  evento: string;
  frente: string;
  afeta: string[];
  status: 'pendente' | 'aconteceu' | 'descartado';
  resultado?: string;
  conferir?: string;
}

const RAIZ = path.join(__dirname, '..');
// O dia de Brasília, como no resto do projeto: em UTC, às 21h a data já virava (auditoria de 31/10, A9).
const hoje = process.argv[2] ?? new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
const jogo = carregarJogo();
const relogios: Relogio[] = YAML.parse(fs.readFileSync(path.join(RAIZ, 'pesquisa/relogios.yaml'), 'utf8')).relogios;

const dias = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
const caps = new Map(jogo.capitulos.map((c) => [c.id, c]));

/** "cap01/pedido" → existe? "cap07" sem capítulo escrito → futuro. */
function alvo(ref: string): string {
  const [capId, noId] = ref.split('/');
  const cap = caps.get(capId);
  if (!cap) return `${ref} (futuro)`;
  if (!noId) return ref;
  const nome = noId.split(':')[0];
  return cap.nos.some((n) => n.id === nome) ? ref : `${ref} (NÓ NÃO EXISTE)`;
}

const linhas: string[] = [];
const out = (s = '') => linhas.push(s);

out(`# Estado do Trama — ${hoje}`);
out(`Conteúdo ${jogo.versao} · ${jogo.capitulos.length} capítulo(s) · último fato do prólogo: "${jogo.prologo.at(-1)!.data}"`);

// Horizonte: o jogo precisa estar sempre um capítulo à frente da realidade (skill, "O capítulo seguinte").
const ANTECEDENCIA = 30;
const porData = [...jogo.capitulos].sort((a, b) => a.de.localeCompare(b.de));
const ultimo = porData.at(-1)!;
const atual = porData.find((c) => c.de <= hoje && hoje <= c.ate);
const passados = porData.filter((c) => c.ate < hoje);
out('\n## Horizonte');
out(`- Hoje a realidade está ${atual ? `no ${atual.id} (${atual.de} a ${atual.ate})` : 'entre capítulos'}.`);
out(`- Último capítulo escrito: ${ultimo.id}, "${ultimo.titulo}" (${ultimo.de} a ${ultimo.ate}).`);
const folga = dias(hoje, ultimo.de);
if (folga <= ANTECEDENCIA) {
  out(`- **ESCREVER O PRÓXIMO CAPÍTULO**: a realidade chega ao ${ultimo.id} em ${folga} dia(s) (limite: ${ANTECEDENCIA}). Mapa em roteiro/proximos.md.`);
} else {
  out(`- Folga: ${folga} dias até a realidade chegar ao ${ultimo.id}. O próximo capítulo se escreve quando faltarem ${ANTECEDENCIA}.`);
}
if (passados.length) {
  out(`- A realidade já passou de: ${passados.map((c) => c.id).join(', ')}. Se todo o capítulo 1 ficou para trás, avalie a regra de recuo.`);
}

const pend = relogios.filter((r) => r.status === 'pendente');
const vencidos = pend.filter((r) => r.data && r.data <= hoje);
const proximos = pend.filter((r) => r.data && r.data > hoje && dias(hoje, r.data) <= 30);
const semData = pend.filter((r) => !r.data);

out('\n## Relógios vencidos ainda pendentes (a realidade já pode ter decidido)');
if (!vencidos.length) out('- nenhum');
for (const r of vencidos) out(`- **${r.data} · ${r.id}**: ${r.evento} → ${r.afeta.map(alvo).join(', ') || 'só contexto'} · conferir: ${r.conferir}`);

out('\n## Próximos 30 dias');
if (!proximos.length) out('- nenhum');
for (const r of proximos) out(`- ${r.data} (em ${dias(hoje, r.data!)} dias) · ${r.id}: ${r.evento} → ${r.afeta.map(alvo).join(', ') || 'só contexto'}`);

out('\n## Vigiar (sem data)');
for (const r of semData) out(`- ${r.id}: ${r.evento} → ${r.afeta.map(alvo).join(', ')}`);

// Radar (roteiro/proximos.md): o que ainda não decide nada, guardado sob o capítulo onde pode pesar.
out('\n## Radar (sinais para capítulos que faltam escrever)');
const mapa = fs.readFileSync(path.join(RAIZ, 'roteiro/proximos.md'), 'utf8');
const radar = mapa.split(/^## Radar\s*$/m)[1]?.split(/^## /m)[0] ?? '';
const blocos = radar.split(/^### /m).slice(1);
if (!blocos.length) out('- vazio');
for (const b of blocos) {
  const [titulo, ...resto] = b.split('\n');
  const sinais = resto.filter((l) => l.startsWith('- **')).map((l) => l.match(/^- \*\*(.+?)\*\*/)![1]);
  out(`- ${titulo.trim()}: ${sinais.length} sinal(is)${sinais.length ? ` · ${sinais.join(' · ')}` : ''}`);
}

out('\n## Escolhas travadas pela realidade');
const travadas = jogo.capitulos.flatMap((c) =>
  c.nos.flatMap((n) => (n.escolhas ?? []).filter((e) => e.real).map((e) => `${c.id}/${n.id}:${e.id} (${e.real!.data})`)),
);
out(travadas.length ? travadas.map((t) => `- ${t}`).join('\n') : '- nenhuma');

// Imagens: nó → arquivo publicado → registro de escolha (estilo/escolhas.json)
out('\n## Imagens');
const registro: Record<string, string> = JSON.parse(fs.readFileSync(path.join(RAIZ, 'estilo/escolhas.json'), 'utf8'));
const usadas = new Set<string>();
const problemas: string[] = [];
for (const c of jogo.capitulos) {
  for (const n of c.nos) {
    if (!n.imagem) {
      problemas.push(`${c.id}/${n.id}: sem imagem`);
      continue;
    }
    usadas.add(n.imagem);
    if (!fs.existsSync(path.join(RAIZ, 'public', n.imagem))) problemas.push(`${c.id}/${n.id}: arquivo ${n.imagem} não existe`);
    if (!registro[`${c.id}/${n.id}`]) problemas.push(`${c.id}/${n.id}: sem registro em estilo/escolhas.json (de qual geração veio?)`);
  }
}
const pastaImgs = path.join(RAIZ, 'public/imagens');
for (const capDir of fs.existsSync(pastaImgs) ? fs.readdirSync(pastaImgs) : []) {
  for (const f of fs.readdirSync(path.join(pastaImgs, capDir))) {
    const rel = `imagens/${capDir}/${f}`;
    if (!usadas.has(rel)) problemas.push(`${rel}: publicada mas nenhum nó usa (candidata a descarte)`);
  }
}
for (const chave of Object.keys(registro)) {
  const [capId, noId] = chave.split('/');
  if (!caps.get(capId)?.nos.some((n) => n.id === noId)) problemas.push(`registro ${chave}: nó não existe mais`);
}
out(problemas.length ? problemas.map((p) => `- ${p}`).join('\n') : `- ok (${usadas.size} imagens em uso)`);

const { erros, avisos } = validar(jogo);
out('\n## Validador');
out(erros.length ? erros.map((e) => `- ERRO: ${e}`).join('\n') : '- sem erros');
for (const a of avisos) out(`- aviso: ${a}`);

console.log(linhas.join('\n'));
