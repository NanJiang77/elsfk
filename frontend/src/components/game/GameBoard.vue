/**
 * 游戏板渲染组件 - 负责绘制网格和已锁定方块
 */
<template>
  <canvas ref="canvasRef" :width="width" :height="height" class="game-board"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { PropType } from 'vue';
import { DEFAULT_GAME_CONFIG } from '@/utils/constants';

const props = defineProps({
  board: {
    type: Array as PropType<number[][]>,
    required: true
  }
});

const canvasRef = ref<HTMLCanvasElement>();
const ctx = ref<CanvasRenderingContext2D | null>(null);

const width = DEFAULT_GAME_CONFIG.cols * DEFAULT_GAME_CONFIG.blockSize;
const height = DEFAULT_GAME_CONFIG.rows * DEFAULT_GAME_CONFIG.blockSize;

const drawGrid = () => {
  if (!ctx.value) return;

  const { blockSize, cols, rows } = DEFAULT_GAME_CONFIG;

  ctx.value.strokeStyle = '#2d2d44';
  ctx.value.lineWidth = 1;

  // 垂直线
  for (let x = 0; x <= cols; x++) {
    ctx.value.beginPath();
    ctx.value.moveTo(x * blockSize, 0);
    ctx.value.lineTo(x * blockSize, height);
    ctx.value.stroke();
  }

  // 水平线
  for (let y = 0; y <= rows; y++) {
    ctx.value.beginPath();
    ctx.value.moveTo(0, y * blockSize);
    ctx.value.lineTo(width, y * blockSize);
    ctx.value.stroke();
  }
};

const drawBoard = (board: number[][]) => {
  if (!ctx.value) return;

  const { blockSize } = DEFAULT_GAME_CONFIG;

  for (let y = 0; y < board.length; y++) {
    const row = board[y];
    if (!row) continue;

    for (let x = 0; x < row.length; x++) {
      if (row[x] !== 0) {
        drawBlock(x, y, '#00f0f0'); // 简化：所有锁定方块用同一颜色
      }
    }
  }
};

const drawBlock = (x: number, y: number, color: string) => {
  if (!ctx.value) return;

  const { blockSize } = DEFAULT_GAME_CONFIG;
  const px = x * blockSize;
  const py = y * blockSize;

  ctx.value.fillStyle = color;
  ctx.value.fillRect(px + 1, py + 1, blockSize - 2, blockSize - 2);

  // 添加渐变效果
  const gradient = ctx.value.createLinearGradient(px, py, px + blockSize, py + blockSize);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
  ctx.value.fillStyle = gradient;
  ctx.value.fillRect(px + 1, py + 1, blockSize - 2, blockSize - 2);
};

const render = () => {
  if (!ctx.value) return;

  // 清空画布
  ctx.value.fillStyle = '#1a1a2e';
  ctx.value.fillRect(0, 0, width, height);

  // 绘制网格线
  drawGrid();

  // 绘制已锁定的方块
  drawBoard(props.board);
};

onMounted(() => {
  const canvas = canvasRef.value;
  if (canvas) {
    ctx.value = canvas.getContext('2d');
    render();
  }
});

watch(() => props.board, () => {
  render();
}, { deep: true });

defineExpose({
  render
});
</script>

<style scoped>
.game-board {
  display: block;
}
</style>
