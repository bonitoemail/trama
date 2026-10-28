import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { JogoSchema, type Jogo } from './schema';

/**
 * Lê content/jogo.yaml + content/capitulos/*.yaml e valida o formato.
 * Só roda no servidor / scripts (usa fs).
 */
export function carregarJogo(dir = path.join(process.cwd(), 'content')): Jogo {
  const base = YAML.parse(fs.readFileSync(path.join(dir, 'jogo.yaml'), 'utf8'));
  const capDir = path.join(dir, 'capitulos');
  const capitulos = fs
    .readdirSync(capDir)
    .filter((f) => f.endsWith('.yaml'))
    .sort()
    .map((f) => {
      try {
        return YAML.parse(fs.readFileSync(path.join(capDir, f), 'utf8'));
      } catch (e) {
        throw new Error(`YAML inválido em capitulos/${f}: ${(e as Error).message}`);
      }
    });

  const r = JogoSchema.safeParse({ ...base, capitulos });
  if (!r.success) {
    const msgs = r.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Conteúdo fora do formato:\n${msgs}`);
  }
  return r.data;
}
