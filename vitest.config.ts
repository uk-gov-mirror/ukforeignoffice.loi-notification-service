import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'tests/specs/**/notification.spec.js', 'tests/specs/**/routes.spec.js'],
    coverage: {
      provider: 'v8',
    },
  },
})
