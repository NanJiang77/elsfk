/**
 * 方块渲染组件 - 负责绘制当前方块和幽灵方块
 */
<template>
  <canvas ref="canvasRef" :width="width" :height="height" class="piece-renderer"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { PropType } from 'vue';
import type { Piece } from '@/types/game';
import { PIECE_COLORS, DEFAULT_GAME_CONFIG } from '@/utils/constants';

const props = defineProps({
  piece: {
    type: Object as PropType<Piece | null>,
    default: null
  },
  board: {
    type: Array as PropType<number[][]>,
    required: true
  }
});

const canvasRef = ref<HTMLCanvasElement>();
const ctx = ref<CanvasRenderingContext2D | null>(null);

const width = DEFAULT_GAME_CONFIG.cols * DEFAULT_GAME_CONFIG.blockSize;
const height = DEFAULT_GAME_CONFIG.rows * DEFAULT_GAME_CONFIG.blockSize;

const drawPiece = (piece: Piece, ghost = false) => {
  if (!ctx.value) return;

  const { shape, x: posX, y: posY } = piece;
  const color = PIECE_COLORS[piece.type];

  shape.forEach((row, dy) => {
    if (!row) return;
    row.forEach((cell, dx) => {
      if (cell !== 0) {
        const x = posX + dx;
        const y = posY + dy;
        drawBlock(x, y, color, ghost);
      }
    });
  });
};

const drawGhostPiece = (piece: Piece) => {
  const { shape } = piece;
  let ghostY = piece.y;

  // 计算幽灵方块位置
  while (true) {
    let collision = false;
    for (let dy = 0; dy < shape.length; dy++) {
      const row = shape[dy];
      if (!row) continue;

      for (let dx = 0; dx < row.length; dx++) {
        if (row[dx] !== 0) {
          const x = piece.x + dx;
          const y = ghostY + dy;
          if (
            x < 0 ||
            x >= DEFAULT_GAME_CONFIG.cols ||
            y >= DEFAULT_GAME_CONFIG.rows ||
            (y >= 0 && props.board[y]?.[x] !== 0)
          ) {
            collision = true;
            break;
          }
        }
      }
      if (collision) break;
    }

    if (collision) {
      ghostY--;
      break;
    }
    ghostY++;
  }

  const ghostPiece = { ...piece, y: ghostY };
  drawPiece(ghostPiece, true);
};

const drawBlock = (x: number, y: number, color: string, ghost = false) => {
  if (!ctx.value) return;

  const { blockSize } = DEFAULT_GAME_CONFIG;
  const px = x * blockSize;
  const py = y * blockSize;

  if (ghost) {
    // 幽灵方块：只绘制边框
    ctx.value.strokeStyle = color;
    ctx.value.lineWidth = 2;
    ctx.value.globalAlpha = 0.3;
    ctx.value.strokeRect(px + 1, py + 1, blockSize - 2, blockSize - 2);
    ctx.value.globalAlpha = 1;
  } else {
    // 实心方块
    ctx.value.fillStyle = color;
    ctx.value.fillRect(px + 1, py + 1, blockSize - 2, blockSize - 2);

    // 高光效果
    ctx.value.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.value.fillRect(px + 1, py + 1, blockSize - 2, 4);
    ctx.value.fillRect(px + 1, py + 1, 4, blockSize - 2);
  }
};

const render = () => {
  if (!ctx.value || !props.piece) return;

  // 清空画布
  ctx.value.clearRect(0, 0, width, height);

  // 绘制幽灵方块
  drawGhostPiece(props.piece);

  // 绘制当前方块
  drawPiece(props.piece);
};

onMounted(() => {
  const canvas = canvasRef.value;
  if (canvas) {
    ctx.value = canvas.getContext('2d');
    render();
  }
});

watch([() => props.piece, () => props.board], () => {
  render();
}, { deep: true });

defineExpose({
  render
});
</script>

<style scoped>
.piece-renderer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
</style>
