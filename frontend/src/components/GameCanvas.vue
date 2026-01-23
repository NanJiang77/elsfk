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
  width: 450px;  /* 15列 × 30px = 450px */
  height: 600px;  /* 20行 × 30px = 600px */
  border: 4px solid #6366f1;
  border-radius: 12px;
  display: block;
  outline: none;
  background: #1a1a2e;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
}

.game-canvas-container:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
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
