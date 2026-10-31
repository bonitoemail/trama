import { carregarJogo, carregarRelogios } from '@/engine/load';
import type { Jogo } from '@/engine/schema';
import { validarPalpite } from '@/lib/palpites';
import { cravarNoBanco } from '@/lib/palpitesServidor';
import { limparOrigem } from '@/lib/registro';

/**
 * Crava um palpite (notas/palpites.md). Confere contra o conteúdo e a data (só decisão que um relógio
 * vai decidir, até o fim do dia anterior ao da notícia), grava e devolve o código do recibo.
 * 400 quando não vale (fechou, opção inexistente); 429 quando o aparelho passou do teto; 503 quando o banco falhou.
 */

let jogo: Jogo | null = null;

export async function POST(req: Request) {
  jogo ??= carregarJogo();
  const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
  const corpo = await req.json().catch(() => null);
  const p = validarPalpite(jogo, carregarRelogios(), hoje, corpo);
  if (!p) return Response.json({ erro: 'Este palpite não está aberto.' }, { status: 400 });

  const origem = limparOrigem((corpo as { origem?: string }).origem) ?? 'direto';
  const cravado = await cravarNoBanco({ ...p, origem });
  if (cravado === 'limite') return Response.json({ erro: 'Este aparelho já cravou palpites demais.' }, { status: 429 });
  if (!cravado) return Response.json({ erro: 'Não deu para cravar agora. Tente de novo.' }, { status: 503 });
  return Response.json(cravado);
}
