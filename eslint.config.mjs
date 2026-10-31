import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// As regras do Next (React, hooks, acessibilidade básica) e as de TypeScript. Roda com `npm run lint`.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // `_` marca o que se desestrutura só para tirar do objeto.
      '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    },
  },
  globalIgnores(['.next/**', 'node_modules/**', 'estilo/**', 'next-env.d.ts']),
]);
