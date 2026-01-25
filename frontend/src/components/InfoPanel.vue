<template>
  <div class="info-panel">
    <!-- 玩家信息 -->
    <div class="panel-section">
      <h3 class="section-title">玩家</h3>
      <div class="player-name-display">{{ playerName }}</div>
    </div>

    <!-- 下一方块预览 -->
    <div class="panel-section">
      <h3 class="section-title">下一方块</h3>
      <div class="next-piece-preview">
        <canvas ref="previewCanvas" width="140" height="140"></canvas>
      </div>
    </div>

    <!-- 分数信息 -->
    <div class="panel-section">
      <h3 class="section-title">分数</h3>
      <div class="score-display">{{ score }}</div>
    </div>

    <!-- 最高分 -->
    <div class="panel-section">
      <h3 class="section-title">最高分</h3>
      <div class="score-display">{{ highScore }}</div>
    </div>

    <!-- 等级 -->
    <div class="panel-section">
      <h3 class="section-title">等级</h3>
      <div class="level-display">{{ level }}</div>
    </div>

    <!-- 消除行数 -->
    <div class="panel-section">
      <h3 class="section-title">消除行数</h3>
      <div class="lines-display">{{ lines }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import { PIECE_COLORS, PIECE_SHAPES } from '@/utils/constants';

const gameStore = useGameStore();

const playerName = computed(() => gameStore.playerName);
const score = computed(() => gameStore.scoreInfo.score);
const highScore = computed(() => gameStore.scoreInfo.highScore);
const level = computed(() => gameStore.scoreInfo.level);
const lines = computed(() => gameStore.scoreInfo.lines);

const previewCanvas = ref<HTMLCanvasElement>();
const previewCtx = ref<CanvasRenderingContext2D | null>(null);

// 绘制下一方块预览
const drawNextPiece = () => {
  if (!previewCtx.value || !gameStore.nextPieceType) return;

  const canvas = previewCanvas.value;
  if (!canvas) return;

  const ctx = previewCtx.value!;
  const { blockSize } = { blockSize: 30 };

  // 清空画布
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const pieceType = gameStore.nextPieceType;
  const shapes = PIECE_SHAPES[pieceType];
  if (!shapes || !shapes[0]) return;

  const shape = shapes[0];
  const color = PIECE_COLORS[pieceType];

  // 居中计算
  const firstRow = shape[0];
  if (!firstRow) return;

  const pieceWidth = firstRow.length * blockSize;
  const pieceHeight = shape.length * blockSize;
  const offsetX = (canvas.width - pieceWidth) / 2;
  const offsetY = (canvas.height - pieceHeight) / 2;

  // 绘制方块
  shape.forEach((row, dy) => {
    if (!row) return;
    row.forEach((cell, dx) => {
      if (cell !== 0) {
        const x = offsetX + dx * blockSize;
        const y = offsetY + dy * blockSize;

        ctx.fillStyle = color;
        ctx.fillRect(x + 1, y + 1, blockSize - 2, blockSize - 2);
      }
    });
  });
};

onMounted(() => {
  if (previewCanvas.value) {
    previewCtx.value = previewCanvas.value.getContext('2d');
    drawNextPiece();
  }
});

// 监听下一方块变化
watch(() => gameStore.nextPieceType, () => {
  drawNextPiece();
});
</script>

<style scoped>
.info-panel {
  width: 240px;
  background: var(--tech-panel);
  backdrop-filter: blur(16px);
  border-radius: 6px;
  padding: 20px;
  border: 1px solid var(--tech-border);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .info-panel {
    width: 100%;
    max-width: 240px;
  }
}

.panel-section {
  margin-bottom: 20px;
}

.panel-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--tech-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.next-piece-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(56, 139, 200, 0.05);
  border-radius: 4px;
  padding: 16px;
  border: 1px solid var(--tech-border);
}

.player-name-display {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--tech-accent);
  text-align: center;
  padding: 12px;
  background: rgba(56, 139, 200, 0.05);
  border-radius: 4px;
  word-break: break-word;
  border: 1px solid var(--tech-border);
  margin-bottom: 16px;
}

.score-display {
  font-family: 'JetBrains Mono', monospace;
  font-size: 28px;
  font-weight: 600;
  color: var(--tech-accent);
  text-align: center;
}

.level-display {
  font-family: 'JetBrains Mono', monospace;
  font-size: 36px;
  font-weight: 600;
  color: var(--tech-accent-2);
  text-align: center;
}

.lines-display {
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: var(--tech-accent-3);
  text-align: center;
}
</style>
