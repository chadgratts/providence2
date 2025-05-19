import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Test configuration
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})