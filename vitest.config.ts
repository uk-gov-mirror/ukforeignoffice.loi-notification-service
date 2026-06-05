import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    coverage: {
      provider: 'v8',
      all: true,
      include: ['**/*.js'],
      thresholds: {
        statements: 55,
        branches: 57,
        functions: 35,
        lines: 54,
      },
    },
  },
})
