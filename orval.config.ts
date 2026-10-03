import { defineConfig } from 'orval';

export default defineConfig({
  lemmo: {
    input: {
      target: '../api/infra/gateway/docs/openapi.yaml',
      parserOptions: {
        externalRefs: {
          allow: ['*'],
        },
      },
    },
    output: {
      target: 'src/sdk/live/generated/index.ts',
      client: 'fetch',
      httpClient: 'fetch',
      mode: 'single',
      override: {
        mutator: {
          path: './src/sdk/live/transport.ts',
          name: 'customFetch',
        },
      },
    },
  },
});
