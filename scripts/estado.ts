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
const hoje = process.argv[2] ?? new Date().toISOString().slice(0, 10);
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
