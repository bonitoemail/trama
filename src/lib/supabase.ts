/**
 * Chamada às funções do Supabase pelo servidor do site, com a chave secreta (só servidor).
 * Sem SUPABASE_URL e SUPABASE_SECRET_KEY, devolve null: o site funciona sem registro.
 */
export function rpc(
  funcao: string,
  corpo: Record<string, unknown> = {},
  /** Leitura que pode ser guardada (segundos); sem isso, a chamada nunca usa cache (gravação). */
  guardar?: number,
): Promise<Response | Error> | null {
  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_SECRET_KEY;
  if (!url || !chave) return null;

  // Chave nova (sb_secret_…) vai só em apikey; a antiga (JWT de service_role) vai também como Bearer.
  const headers: Record<string, string> = { 'content-type': 'application/json', apikey: chave };
  if (!chave.startsWith('sb_')) headers.authorization = `Bearer ${chave}`;

  const cache: RequestInit = guardar ? { next: { revalidate: guardar } } : { cache: 'no-store' };
  return fetch(`${url}/rest/v1/rpc/${funcao}`, { method: 'POST', headers, body: JSON.stringify(corpo), ...cache }).catch((e: Error) => e);
}
