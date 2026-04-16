import { defineConfig } from 'orval';

export default defineConfig({
    cashback: {
        input: `http://localhost:8000/openapi.json`,
        output: {
            mode: 'tags-split',
            target: 'src/api/generated/cashback.ts',
            schemas: 'src/api/generated/model',
            client: 'react-query',
            httpClient: 'axios',
            override: {
                mutator: {
                    path: 'src/api/interceptor.ts',
                    name: 'customInstance',
                },
            },
        },
    },
});
