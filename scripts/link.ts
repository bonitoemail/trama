import { limparOrigem } from '../src/lib/registro';

/**
 * Link de divulgação com a origem marcada: `npm run link -- instagram-bio`.
 * O site guarda a origem na primeira visita e limpa o endereço; o painel conta por origem.
 * Endereço do site em SITE_URL (padrão: localhost).
 */
const pedido = process.argv[2];
const origem = limparOrigem(pedido);
if (!origem) {
  console.error('Uso: npm run link -- <canal>   (letras, números e hífen; ex.: instagram-bio, whatsapp-grupos)');
  process.exit(1);
}
const site = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
console.log(`${site}/?origem=${origem}`);
