import { carregarJogo } from '../src/engine/load';
import { validar } from '../src/engine/validate';

const jogo = carregarJogo();
const { erros, avisos, estatisticas: s } = validar(jogo);

console.log(`Trama ${jogo.versao}: ${jogo.capitulos.length} capítulos, ${s.nosTotais} nós`);
console.log(`Alcançados: ${s.nosAlcancados}/${s.nosTotais} nós · ${s.estados} estados · ${s.finaisDistintos} finais distintos`);
for (const a of avisos) console.log(`  aviso: ${a}`);
for (const e of erros) console.log(`  ERRO:  ${e}`);
console.log(erros.length ? `\n${erros.length} erro(s).` : '\nConteúdo OK.');
process.exit(erros.length ? 1 : 0);
