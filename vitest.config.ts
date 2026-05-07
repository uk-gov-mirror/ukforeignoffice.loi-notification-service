import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    coverage: {
      provider: 'v8',
      all: true,
      include: ['**/*.js'],
      thresholds: {
        lines: 56,
        functions: 36,
        branches: 52,
        statements: 56,
      },
    },
  },
})
