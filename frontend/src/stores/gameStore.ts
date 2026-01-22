/**
 * 游戏状态管理 - Pinia Store
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { GameStatus, ScoreInfo, GameStats, Piece, PieceType } from '@/types/game';
import { GameEngine } from '@/services/GameEngine';
import { DEFAULT_GAME_CONFIG } from '@/utils/constants';
import { gameApi } from '@/services/api';
import { ElMessage } from 'element-plus';

export const useGameStore = defineStore('game', () => {
  const engine = ref<GameEngine | null>(null);

  // 状态
  const board = ref<number[][]>([]);
  const currentPiece = ref<Piece | null>(null);
  const nextPieceType = ref<PieceType | null>(null);
  const status = ref<GameStatus>('idle');
  const scoreInfo = ref<ScoreInfo>({
    score: 0,
    level: 1,
    lines: 0,
    highScore: 0,
  });
  const stats = ref<GameStats>({
    playTime: 0,
    totalPieces: 0,
    piecesPerType: {
      I: 0,
      O: 0,
      T: 0,
      S: 0,
      Z: 0,
      J: 0,
      L: 0,
    },
  });

  // 玩家名称
  const playerName = ref<string>('玩家');

  // 初始化游戏引擎
  const initEngine = () => {
    if (!engine.value) {
      engine.value = new GameEngine(DEFAULT_GAME_CONFIG, updateState);
    }
  };

  // 开始游戏
  const startGame = () => {
    initEngine();
    engine.value!.start();
    updateState();
  };

  // 暂停游戏
  const pauseGame = () => {
    if (engine.value) {
      engine.value.pause();
      updateState();
    }
  };

  // 继续游戏
  const resumeGame = () => {
    if (engine.value) {
      engine.value.resume();
      updateState();
    }
  };

  // 移动控制
  const moveLeft = () => {
    if (engine.value) {
      engine.value.moveLeft();
      updateState();
    }
  };

  const moveRight = () => {
    if (engine.value) {
      engine.value.moveRight();
      updateState();
    }
  };

  const moveDown = () => {
    if (engine.value) {
      engine.value.moveDown();
      updateState();
    }
  };

  const hardDrop = () => {
    if (engine.value) {
      engine.value.hardDrop();
      updateState();
    }
  };

  const rotate = () => {
    if (engine.value) {
      engine.value.rotate();
      updateState();
    }
  };

  // 保存游戏记录到服务器
  const saveGameRecord = async () => {
    if (!engine.value || scoreInfo.value.score === 0) {
      return;
    }

    try {
      await gameApi.saveGame({
        player_name: playerName.value,
        score: scoreInfo.value.score,
        level: scoreInfo.value.level,
        lines: scoreInfo.value.lines,
        play_time: stats.value.playTime,
      });
      ElMessage.success('游戏记录已保存');
    } catch (error) {
      console.error('保存游戏记录失败:', error);
      ElMessage.error('保存游戏记录失败');
    }
  };

  // 设置玩家名称
  const setPlayerName = (name: string) => {
    playerName.value = name;
  };

  // 更新状态
  const updateState = () => {
    if (!engine.value) return;

    const newBoard = engine.value.getBoard();
    // 需要深拷贝以避免响应性问题
    board.value = newBoard.map(row => [...row]);
    currentPiece.value = engine.value.getCurrentPiece();
    nextPieceType.value = engine.value.getNextPieceType();
    status.value = engine.value.getStatus();
    scoreInfo.value = { ...engine.value.getScoreInfo() };
    stats.value = { ...engine.value.getStats() };
  };

  // 计算属性
  const isPlaying = computed(() => status.value === 'playing');
  const isPaused = computed(() => status.value === 'paused');
  const isGameOver = computed(() => status.value === 'gameover');
  const isIdle = computed(() => status.value === 'idle');

  return {
    // 状态
    board,
    currentPiece,
    nextPieceType,
    status,
    scoreInfo,
    stats,
    playerName,

    // 计算属性
    isPlaying,
    isPaused,
    isGameOver,
    isIdle,

    // 方法
    initEngine,
    startGame,
    pauseGame,
    resumeGame,
    moveLeft,
    moveRight,
    moveDown,
    hardDrop,
    rotate,
    updateState,
    saveGameRecord,
    setPlayerName,
  };
});
