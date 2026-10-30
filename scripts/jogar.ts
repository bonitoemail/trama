/**
 * Joga um caminho do começo ao fim pelo motor e imprime o que o jogador leria.
 * Serve para conferir texto e ecos sem abrir o navegador (skill atualizar-jogo, Etapa 8).
 *
 *   npm run jogar -- 7              # caminho da semente 7, todos os capítulos
 *   npm run jogar -- 7 cap03        # só imprime o cap03 (e o fim do epílogo)
 *   npm run jogar -- 7 cap03 x.json # também salva o estado no início do cap03 (para colar no navegador)
 */
import fs from 'node:fs';
import { carregarJogo } from '../src/engine/load';
import { continuar, escolher, escolhasDisponiveis, no, novoJogo, paragrafos, type Estado } from '../src/engine/engine';

const jogo = carregarJogo();
let semente = Number(process.argv[2] ?? 1);
const filtro = process.argv[3];
const saida = process.argv[4];
const sorteio = () => {
  semente = (semente * 1103515245 + 12345) % 2147483648;
  return semente / 2147483648;
};
const mostra = (cap: string) => !filtro || filtro === cap;

let e: Estado = novoJogo(jogo);
let salvo: Estado | null = null;
while (e.fase !== 'fim_jogo') {
  if (e.fase === 'fim_capitulo') {
    e = continuar(jogo, e);
    if (filtro && e.capitulo === filtro && !salvo) salvo = e;
    continue;
  }
  const n = no(jogo, e.capitulo, e.no);
  const ops = escolhasDisponiveis(n, e.marcas);
  if (mostra(e.capitulo)) {
    console.log(`\n[${e.capitulo}/${n.id}]`);
    for (const p of paragrafos(n.texto, e.marcas)) console.log(` - ${p}`);
  }
  const esc = ops.length ? ops[Math.floor(sorteio() * ops.length)] : null;
  if (esc && mostra(e.capitulo)) console.log(` >> ${esc.rotulo}   (opções: ${ops.map((o) => o.id).join(', ')})`);
  e = escolher(jogo, e, esc ? esc.id : null);
}
console.log(`\n[epílogo: ${jogo.epilogo.titulo}]`);
const fim = paragrafos(jogo.epilogo.texto, e.marcas);
for (const p of filtro ? fim.slice(-6) : fim) console.log(` - ${p}`);
if (saida && salvo) fs.writeFileSync(saida, JSON.stringify(salvo));
