import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const asArray = (cfg) => (Array.isArray(cfg) ? cfg : [cfg]);

const eslintConfig = [
  ...asArray(nextCoreWebVitals),
  ...asArray(nextTypescript),
  {
    rules: {
      // We intentionally hydrate client-side localStorage stores inside an
      // effect (setState(read()) after mount) to avoid an SSR/client markup
      // mismatch — reading storage during render isn't possible on the server.
      // This rule flags that necessary idiom as a false positive, so disable it.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      'tsconfig.tsbuildinfo',
      'playwright-report/**',
      'test-results/**',
    ],
  },
];

export default eslintConfig;
