<template>
  <div class="mobile-game">
    <!-- 状态栏 -->
    <div class="status-bar">
      <span class="time">9:41</span>
      <div class="levels">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
          <path d="M1.42 9a16 16 0 0 1 11.14 0"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <line x1="20" y1="5" x2="20" y2="19"></line>
        </svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
          <path d="M12 20a9 9 0 1 0 0-18 9 9 0 0 0 0 18"></path>
          <path d="M12 2v20"></path>
          <path d="m2 12 20 0"></path>
        </svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
          <line x1="22" y1="11" x2="22" y2="11"></line>
        </svg>
      </div>
    </div>

    <!-- 游戏内容 -->
    <div class="game-content">
      <!-- 顶部信息栏 -->
      <div class="info-bar">
        <div class="player-info">
          <div class="avatar">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span class="player-name">{{ playerName }}</span>
        </div>
        <div class="score-info">
          <span class="score">{{ score }}</span>
          <span class="level">Lv{{ level }}</span>
          <span class="lines">{{ lines }}行</span>
        </div>
        <div class="mini-btns">
          <button class="icon-btn help-btn" @click="showHelp">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </button>
          <button class="icon-btn pause-btn" @click="togglePause">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          </button>
          <button class="icon-btn leaderboard-btn" @click="goToLeaderboard">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H9"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H9"></path>
              <path d="M12 15.5a9 9 0 0 0 9-9 9 9 0 0 0-9-9"></path>
              <path d="M12 3v6"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- 游戏主区域 -->
      <div class="game-area">
        <!-- 游戏棋盘 -->
        <div class="game-board" ref="boardRef">
          <canvas ref="canvasRef"></canvas>
        </div>

        <!-- 侧边栏 -->
        <div class="sidebar">
          <!-- 下一个方块 -->
          <div class="next-piece">
            <span class="next-label">下一个</span>
            <div class="next-box" ref="nextBoxRef">
              <canvas ref="nextCanvasRef"></canvas>
            </div>
          </div>

          <!-- 控制按钮 -->
          <button class="control-btn restart-btn" @click="restartGame">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M9 12h11"></path>
            </svg>
          </button>
          <button class="control-btn quit-btn" @click="quitGame">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- 虚拟控制键 -->
      <div class="control-pad">
        <button class="control-btn left-btn" @touchstart.prevent="moveLeft" @touchend.prevent="endMove">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>左移</span>
        </button>
        <button class="control-btn rotate-btn" @touchstart.prevent="rotate" @touchend.prevent="endAction">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 1 1-6.2-8.7"></path>
            <path d="M3 12a9 9 0 0 1 6.2-8.7"></path>
            <path d="M21 3v18"></path>
            <path d="M3 3v18"></path>
          </svg>
          <span>旋转</span>
        </button>
        <button class="control-btn hard-drop-btn" @touchstart.prevent="hardDrop">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14"></path>
            <path d="m19 12-7 7-7-7"></path>
          </svg>
          <span>硬降</span>
        </button>
        <button class="control-btn right-btn" @touchstart.prevent="moveRight" @touchend.prevent="endMove">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
          <span>右移</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';

const router = useRouter();
const gameStore = useGameStore();

// 游戏状态
const playerName = computed(() => localStorage.getItem('username') || '玩家');
const score = computed(() => gameStore.scoreInfo.score);
const level = computed(() => gameStore.scoreInfo.level);
const lines = computed(() => gameStore.scoreInfo.lines);

const canvasRef = ref<HTMLCanvasElement | null>(null);
const nextCanvasRef = ref<HTMLCanvasElement | null>(null);
const boardRef = ref<HTMLDivElement | null>(null);
const nextBoxRef = ref<HTMLDivElement | null>(null);

// Canvas 上下文
let ctx: CanvasRenderingContext2D | null = null;
let nextCtx: CanvasRenderingContext2D | null = null;
let animationFrameId: number | null = null;

// 方块颜色 - 使用数字作为键（board 中存储的是数字 1-7）
const pieceColors: Record<number, string> = {
  1: '#00f0f0', // I - 青色
  2: '#f0f000', // O - 黄色
  3: '#a000f0', // T - 紫色
  4: '#00f000', // S - 绿色
  5: '#f00000', // Z - 红色
  6: '#0000f0', // J - 蓝色
  7: '#f0a000', // L - 橙色
  0: '#1a1a2e', // 空 - 深色
};

// 渲染游戏棋盘
const renderBoard = () => {
  if (!canvasRef.value || !ctx) return;

  const canvas = canvasRef.value;
  const rect = boardRef.value?.getBoundingClientRect();
  if (!rect) return;

  // 设置 canvas 尺寸 - 确保能容纳20行
  const canvasWidth = rect.width - 10;
  const blockSize = canvasWidth / 15; // 游戏区域是15列宽
  const canvasHeight = blockSize * 20; // 20行的准确高度

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // 清空画布
  ctx.fillStyle = '#0A0A14';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 绘制边框（确保能看到游戏区域）
  ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvasWidth, canvasHeight);

  // 绘制固定的方块
  const board = gameStore.board;
  if (board && board.length > 0) {
    for (let y = 0; y < board.length; y++) {
      const row = board[y];
      if (!row) continue;
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell !== 0 && cell !== undefined && cell !== null) {
          const color = pieceColors[cell];
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
          }
        }
      }
    }
  }

  // 绘制当前方块
  const currentPiece = gameStore.currentPiece;
  if (currentPiece && currentPiece.shape) {
    const typeToNumber: Record<string, number> = {
      'I': 1,
      'O': 2,
      'T': 3,
      'S': 4,
      'Z': 5,
      'J': 6,
      'L': 7,
    };
    const pieceNumber = typeToNumber[currentPiece.type];
    const shape = currentPiece.shape;
    const color = pieceColors[pieceNumber];

    for (let y = 0; y < shape.length; y++) {
      const row = shape[y];
      if (!row) continue;
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell !== 0) {
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(
              (currentPiece.x + x) * blockSize,
              (currentPiece.y + y) * blockSize,
              blockSize - 1,
              blockSize - 1
            );
          }
        }
      }
    }
  }

  // 绘制网格线
  ctx.strokeStyle = 'rgba(0, 217, 255, 0.1)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 15; x++) {
    ctx.beginPath();
    ctx.moveTo(x * blockSize, 0);
    ctx.lineTo(x * blockSize, canvasHeight);
    ctx.stroke();
  }
  for (let y = 0; y <= 20; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * blockSize);
    ctx.lineTo(canvasWidth, y * blockSize);
    ctx.stroke();
  }
};

// 渲染下一个方块
const renderNextPiece = () => {
  if (!nextCanvasRef.value || !nextCtx || !gameStore.nextPieceType) return;

  const canvas = nextCanvasRef.value;
  const rect = nextBoxRef.value?.getBoundingClientRect();
  if (!rect) return;

  canvas.width = rect.width - 2;
  canvas.height = rect.height - 2;

  // 清空画布
  nextCtx.fillStyle = '#0A0A14';
  nextCtx.fillRect(0, 0, canvas.width, canvas.height);

  // 将 PieceType 转换为数字
  const typeToNumber: Record<string, number> = {
    'I': 1,
    'O': 2,
    'T': 3,
    'S': 4,
    'Z': 5,
    'J': 6,
    'L': 7,
  };

  const pieceNumber = typeToNumber[gameStore.nextPieceType];
  if (!pieceNumber) return;

  // 获取方块形状
  const shapes: Record<number, number[][]> = {
    1: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], // I
    2: [[1,1], [1,1]], // O
    3: [[0,1,0], [1,1,1], [0,0,0]], // T
    4: [[0,1,1], [1,1,0], [0,0,0]], // S
    5: [[1,1,0], [0,1,1], [0,0,0]], // Z
    6: [[1,0,0], [1,1,1], [0,0,0]], // J
    7: [[0,0,1], [1,1,1], [0,0,0]], // L
  };

  const shape = shapes[pieceNumber];
  if (!shape) return;

  const blockSize = 5;
  const offsetX = (canvas.width - shape[0].length * blockSize) / 2;
  const offsetY = (canvas.height - shape.length * blockSize) / 2;

  for (let y = 0; y < shape.length; y++) {
    const row = shape[y];
    if (!row) continue;
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== 0) {
        const color = pieceColors[pieceNumber];
        if (color) {
          nextCtx.fillStyle = color;
          nextCtx.fillRect(
            offsetX + x * blockSize,
            offsetY + y * blockSize,
            blockSize - 1,
            blockSize - 1
          );
        }
      }
    }
  }
};

// 主渲染循环
const render = () => {
  renderBoard();
  renderNextPiece();
  animationFrameId = requestAnimationFrame(render);
};

// 游戏控制
const moveLeft = () => gameStore.moveLeft();
const moveRight = () => gameStore.moveRight();
const rotate = () => gameStore.rotate();
const hardDrop = () => gameStore.hardDrop();
const endMove = () => {};
const endAction = () => {};

const togglePause = () => {
  if (gameStore.status === 'playing') {
    gameStore.pauseGame();
  } else {
    gameStore.resumeGame();
  }
};

const restartGame = () => {
  if (confirm('确定要重新开始吗？')) {
    gameStore.startGame();
  }
};

const quitGame = () => {
  if (confirm('确定要退出游戏吗？')) {
    router.push('/m/leaderboard');
  }
};

const showHelp = () => {
  router.push('/m/guide');
};

const goToLeaderboard = () => {
  router.push('/m/leaderboard');
};

// 键盘事件
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowUp':
      rotate();
      break;
    case 'ArrowDown':
      gameStore.moveDown();
      break;
    case ' ':
      e.preventDefault();
      hardDrop();
      break;
    case 'p':
    case 'P':
      togglePause();
      break;
    case 'r':
    case 'R':
      restartGame();
      break;
  }
};

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown);

  // 等待 DOM 更新
  await nextTick();

  // 初始化 canvas
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d');
  }
  if (nextCanvasRef.value) {
    nextCtx = nextCanvasRef.value.getContext('2d');
  }

  // 启动游戏
  gameStore.startGame();

  // 开始渲染循环
  render();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.mobile-game {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%);
}

/* 状态栏 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 21px 24px 19px;
  color: white;
}

.time {
  font-family: 'Inter', sans-serif;
  font-size: 17px;
  font-weight: 600;
}

.levels {
  display: flex;
  gap: 6px;
}

.levels svg {
  stroke: white;
}

/* 游戏内容 */
.game-content {
  padding: 6px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 顶部信息栏 */
.info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 4px 10px;
  gap: 10px;
  height: 26px;
}

.player-info {
  display: flex;
  gap: 4px;
  align-items: center;
}

.avatar {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: linear-gradient(135deg, #00D9FF 0%, #0099FF 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar svg {
  stroke: white;
}

.player-name {
  font-family: 'Outfit', sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: white;
}

.score-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.score {
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #00D9FF;
}

.level, .lines {
  font-family: 'Outfit', sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: #B0B0C0;
}

.mini-btns {
  display: flex;
  gap: 3px;
}

.icon-btn {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(0, 217, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.icon-btn svg {
  stroke: #00D9FF;
}

/* 游戏主区域 */
.game-area {
  display: flex;
  gap: 6px;
}

.game-board {
  width: 350px;
  height: 650px;
  border-radius: 16px;
  background: #0A0A14;
  border: 2px solid rgba(0, 217, 255, 0.4);
  padding: 5px;
  box-shadow: 0 0 25px rgba(0, 217, 255, 0.4);
}

.game-board canvas {
  width: 100%;
  height: 100%;
}

/* 侧边栏 */
.sidebar {
  width: 34px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.next-piece {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 6px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
}

.next-label {
  font-family: 'Outfit', sans-serif;
  font-size: 6px;
  font-weight: 600;
  color: #00D9FF;
}

.next-box {
  width: 26px;
  height: 26px;
  border-radius: 4px;
  background: #0A0A14;
  border: 1px solid rgba(0, 217, 255, 0.2);
}

.next-box canvas {
  width: 100%;
  height: 100%;
}

.control-btn {
  width: 100%;
  height: 40px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(0, 217, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.control-btn svg {
  stroke: #00D9FF;
}

.restart-btn svg {
  stroke: #00D9FF;
}

.quit-btn svg {
  stroke: #FF4757;
}

/* 虚拟控制键 */
.control-pad {
  display: flex;
  gap: 4px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(0, 217, 255, 0.2);
  border-radius: 8px;
  justify-content: space-between;
}

.control-pad button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1.5px solid rgba(0, 217, 255, 0.4);
  cursor: pointer;
  touch-action: manipulation;
}

.control-pad button svg {
  stroke: #00D9FF;
}

.control-pad button span {
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #00D9FF;
}

.control-pad button:active {
  transform: scale(0.95);
  opacity: 0.8;
}
</style>
