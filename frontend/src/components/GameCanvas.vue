/**
 * 游戏画布容器 - 整合游戏板和方块渲染
 */
<template>
  <div class="game-canvas-container" ref="containerRef">
    <GameBoard :board="board" class="game-board-layer" />
    <PieceRenderer :piece="piece" :board="board" class="piece-layer" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import GameBoard from './game/GameBoard.vue';
import PieceRenderer from './game/PieceRenderer.vue';
import type { Piece } from '@/types/game';

const props = defineProps<{
  board?: number[][];
  currentPiece?: Piece | null;
}>();

const gameStore = useGameStore();
const containerRef = ref<HTMLDivElement>();

const board = computed(() => props.board || gameStore.board);
const piece = computed(() =>
  props.currentPiece !== undefined ? props.currentPiece : gameStore.currentPiece
);
</script>

<style scoped>
.game-canvas-container {
  position: relative;
  width: 450px;
  height: 600px;
  max-width: 100%;
  aspect-ratio: 3 / 4;
  border: 1px solid var(--tech-border);
  border-radius: 4px;
  display: block;
  outline: none;
  background: var(--tech-bg);
  overflow: hidden;
}

/* 移动端响应式 */
@media (max-width: 480px) {
  .game-canvas-container {
    width: 100%;
    height: auto;
    min-height: 400px;
  }
}

.game-canvas-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(56, 139, 200, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 139, 200, 0.02) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
  z-index: 1;
}

.game-canvas-container::after {
  content: 'TETRIS_SYS';
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--tech-text-muted);
  opacity: 0.5;
  letter-spacing: 0.05em;
  pointer-events: none;
  z-index: 2;
}

.game-canvas-container:focus {
  border-color: var(--tech-accent);
}

.game-board-layer {
  position: absolute;
  top: 0;
  left: 0;
}

.piece-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
</style>
