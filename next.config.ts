import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 127.0.0.1 tem localStorage separado de localhost: dá para testar sem mexer na partida em andamento.
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
