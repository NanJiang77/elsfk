import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue相关
          'vue-vendor': ['vue', 'vue-router', 'pinia'],

          // Element Plus UI库
          'element-plus': ['element-plus'],

          // 游戏引擎相关
          'game-engine': [
            './src/services/GameEngine.ts',
            './src/services/PieceManager.ts',
            './src/services/CollisionDetector.ts',
            './src/services/LineClearManager.ts',
          ],

          // 工具和常量
          'utils': [
            './src/utils/constants.ts',
            './src/types/game.ts',
          ],
        }
      }
    },

    // 调整chunk大小警告阈值
    chunkSizeWarningLimit: 600
  },
})
