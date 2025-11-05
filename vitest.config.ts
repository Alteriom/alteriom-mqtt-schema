import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        'scripts/',
        '*.config.*',
        'src/schema_data.ts', // Auto-generated
        'src/generated/', // Generated types
      ],
      thresholds: {
        lines: 85,
        functions: 65,
        branches: 75,
        statements: 85,
      },
    },
  },
});