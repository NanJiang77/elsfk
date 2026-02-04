import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,jsx,tsx}', 'src/**/*.{test,spec}.{js,mjs,cjs,ts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/e2e/**', '**/dist/**', '**/tests/visual/**', '**/tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,ts,vue}'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts', '**/node_modules/**'],
    },
  },
});
