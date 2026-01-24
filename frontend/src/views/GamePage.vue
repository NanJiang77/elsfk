<template>
  <div class="game-page">
    <div class="game-container">
      <!-- 左侧：操作说明面板 -->
      <ControlsPanel />

      <!-- 中间：游戏区域 -->
      <div class="game-area">
        <GameCanvas
          ref="gameCanvasRef"
        />

        <!-- 游戏覆盖层 -->
        <div v-if="!isPlaying" class="game-overlay">
          <div v-if="isGameOver" class="overlay-content">
            <h2 class="overlay-title">游戏结束</h2>
            <p class="overlay-score">最终分数: {{ score }}</p>
            <button @click="handleRestartGame" class="btn-primary">重新开始</button>
          </div>

          <div v-else-if="isPaused" class="overlay-content">
            <h2 class="overlay-title">已暂停</h2>
            <button @click="resumeGame" class="btn-primary">继续游戏</button>
          </div>

          <div v-else class="overlay-content">
            <h2 class="overlay-title">俄罗斯方块</h2>
            <button @click="handleStartGame" class="btn-primary">开始游戏</button>
          </div>
        </div>
      </div>

      <!-- 右侧：信息面板 -->
      <InfoPanel />
    </div>

    <!-- 用户名输入对话框 -->
    <PlayerNameDialog
      v-model:visible="showNameDialog"
      @confirm="handleNameConfirm"
    />
  </div>
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
  min-height: calc(100vh - 120px);
  display: flex;
  justify-content: center;
}

.game-container {
  display: flex;
  gap: 24px;
  max-width: 1400px;
  width: fit-content;
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
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.overlay-content {
  text-align: center;
  color: white;
  padding: 48px 32px;
}

.overlay-title {
  font-size: 32px;
  margin-bottom: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.overlay-score {
  font-size: 20px;
  margin-bottom: 32px;
  color: #cbd5e1;
  font-weight: 500;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  border: none;
  padding: 12px 32px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
}

.btn-primary:active {
  transform: translateY(0);
}
</style>
