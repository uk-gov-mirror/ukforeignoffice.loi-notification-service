import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    coverage: {
      provider: 'v8',
      all: true,
      include: ['**/*.js'],
      thresholds: {
        statements: 57,
        branches: 57,
        lines: 56,
        functions: 35,
      },
    },
  },
})
