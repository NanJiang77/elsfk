<template>
  <main class="game-page" role="main" aria-label="游戏区域">
    <div class="game-container">
      <!-- 左侧：操作说明面板 -->
      <aside aria-label="操作说明">
        <ControlsPanel />
      </aside>

      <!-- 中间：游戏区域 -->
      <section class="game-area" aria-label="游戏画布">
        <GameCanvas
          ref="gameCanvasRef"
          tabindex="0"
          aria-label="俄罗斯方块游戏板，使用方向键控制"
        />

        <!-- 游戏覆盖层 -->
        <div v-if="!isPlaying" class="game-overlay" role="dialog" aria-modal="true">
          <div v-if="isGameOver" class="overlay-content">
            <h2 class="overlay-title">游戏结束</h2>
            <p class="overlay-score">最终分数: {{ score }}</p>
            <button @click="handleRestartGame" class="btn-primary" aria-label="重新开始游戏">重新开始</button>
          </div>

          <div v-else-if="isPaused" class="overlay-content">
            <h2 class="overlay-title">已暂停</h2>
            <button @click="resumeGame" class="btn-primary" aria-label="继续游戏">继续游戏</button>
          </div>

          <div v-else class="overlay-content">
            <h2 class="overlay-title">俄罗斯方块</h2>
            <button @click="handleStartGame" class="btn-primary" aria-label="开始新游戏">开始游戏</button>
          </div>
        </div>
      </section>

      <!-- 右侧：信息面板 -->
      <aside aria-label="游戏信息">
        <InfoPanel />
      </aside>
    </div>

    <!-- 用户名输入对话框 -->
    <PlayerNameDialog
      v-model:visible="showNameDialog"
      @confirm="handleNameConfirm"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import { usePlayerName } from '@/composables/usePlayerName';
import ControlsPanel from '@/components/ControlsPanel.vue';
import GameCanvas from '@/components/GameCanvas.vue';
import InfoPanel from '@/components/InfoPanel.vue';
import PlayerNameDialog from '@/components/PlayerNameDialog.vue';

const gameStore = useGameStore();
const gameCanvasRef = ref<InstanceType<typeof GameCanvas>>();

// 用户名管理
const { playerName, isNameLoaded, savePlayerName } = usePlayerName();
const showNameDialog = ref(false);

// 游戏控制方法
const handleStartGame = () => {
  // 检查是否已有用户名
  if (!playerName.value) {
    showNameDialog.value = true;
    return;
  }

  startGame();
};

const handleRestartGame = () => {
  // 重新开始游戏不需要再输入名字
  startGame();
};

const startGame = () => {
  // 确保用户名已设置到store
  if (playerName.value) {
    gameStore.setPlayerName(playerName.value);
  }
  gameStore.initEngine();
  gameStore.startGame();
};

const handleNameConfirm = (name: string) => {
  // 保存用户名到localStorage
  savePlayerName(name);
  showNameDialog.value = false;
  startGame();
};

const pauseGame = () => {
  gameStore.pauseGame();
};

const resumeGame = () => {
  gameStore.resumeGame();
};

// 计算属性
const isPlaying = computed(() => gameStore.isPlaying);
const isPaused = computed(() => gameStore.isPaused);
const isGameOver = computed(() => gameStore.isGameOver);
const score = computed(() => gameStore.scoreInfo.score);

// 键盘事件监听
const handleGlobalKeyDown = (e: KeyboardEvent) => {
  const key = e.key.toLowerCase();

  // P键 - 暂停/继续（全局有效）
  if (key === 'p') {
    e.preventDefault();
    if (isPaused.value) {
      resumeGame();
    } else {
      pauseGame();
    }
    return;
  }

  // R键 - 重新开始（全局有效）
  if (key === 'r') {
    e.preventDefault();
    startGame();
    return;
  }

  // 方向键和空格键 - 只有游戏进行中且未暂停时才处理
  if (!isPlaying.value || isPaused.value) {
    return;
  }

  switch (key) {
    case 'arrowleft':
      e.preventDefault();
      gameStore.moveLeft();
      break;
    case 'arrowright':
      e.preventDefault();
      gameStore.moveRight();
      break;
    case 'arrowup':
      e.preventDefault();
      gameStore.rotate();
      break;
    case 'arrowdown':
      e.preventDefault();
      gameStore.moveDown();
      break;
    case ' ':
      e.preventDefault();
      gameStore.hardDrop();
      break;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeyDown);
  gameStore.initEngine();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown);
});

// 监听游戏结束,自动保存记录
watch(isGameOver, (isOver) => {
  if (isOver && gameStore.scoreInfo.score > 0) {
    gameStore.saveGameRecord();
  }
});
</script>

<style scoped>
.game-page {
  width: 100%;
  min-height: calc(100vh - 116px);
  display: flex;
  justify-content: center;
  position: relative;
}

.game-container {
  display: flex;
  gap: 24px;
  max-width: 1400px;
  width: fit-content;
  position: relative;
}

/* 移动端响应式 - 垂直堆叠 */
@media (max-width: 768px) {
  .game-container {
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
    max-width: 100%;
  }
}

/* 技术边框装饰 */
.game-container::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 1px solid var(--tech-border);
  opacity: 0.5;
  pointer-events: none;
}

.game-container::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  width: 8px;
  height: 8px;
  border-top: 2px solid var(--tech-accent);
  border-left: 2px solid var(--tech-accent);
  pointer-events: none;
}

.game-area {
  position: relative;
  flex-shrink: 0;
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid var(--tech-border);
}

.overlay-content {
  text-align: center;
  padding: 40px 32px;
}

.overlay-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 600;
  color: var(--tech-accent);
  letter-spacing: 0.05em;
}

.overlay-score {
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  margin-bottom: 32px;
  color: var(--tech-text-muted);
  font-weight: 500;
}

.btn-primary {
  font-family: 'JetBrains Mono', monospace;
  background: var(--tech-accent);
  color: var(--tech-bg);
  border: none;
  padding: 12px 32px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.05em;
}

.btn-primary:hover {
  background: var(--tech-accent-2);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(34, 211, 211, 0.3);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--tech-accent-2);
  outline-offset: 2px;
}

.btn-primary:active {
  transform: translateY(0);
}
</style>
