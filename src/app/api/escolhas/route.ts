import { painelDoServidor } from '@/lib/painelServidor';

/**
 * Números da tela /escolhas, guardados por uma hora (a montagem fica em lib/painelServidor.ts, que a
 * imagem de prévia também usa). Sem Supabase (dev sem .env.local), responde 204 e a tela avisa.
 */
export const revalidate = 3600;

export async function GET() {
  const painel = await painelDoServidor();
  return painel ? Response.json(painel) : new Response(null, { status: 204 });
}
