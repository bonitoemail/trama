import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 127.0.0.1 tem localStorage separado de localhost: dá para testar sem mexer na partida em andamento.
  allowedDevOrigins: ['127.0.0.1'],
  // A tela /escolhas lê as datas dos relógios em tempo de execução (src/app/api/escolhas/route.ts).
  outputFileTracingIncludes: { '/api/escolhas': ['./pesquisa/relogios.yaml', './content/**/*'] },
  // A tela "Para que serve" virou "O que é o Trama": links antigos continuam chegando.
  async redirects() {
    return [{ source: '/para-que-serve', destination: '/o-que-e', permanent: true }];
  },
};

export default nextConfig;
