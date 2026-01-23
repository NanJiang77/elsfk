/**
 * 游戏常量定义
 */

import type { PieceType, PieceShape, GameConfig } from '@/types/game';

/** 方块颜色配置 */
export const PIECE_COLORS: Record<PieceType, string> = {
  I: '#06b6d4', // 青色
  O: '#eab308', // 黄色
  T: '#a855f7', // 紫色
  S: '#22c55e', // 绿色
  Z: '#ef4444', // 红色
  J: '#3b82f6', // 蓝色
  L: '#f97316', // 橙色
};

/** 方块旋转形状定义 */
export const PIECE_SHAPES: Record<PieceType, PieceShape[]> = {
  I: [
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]],
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]],
  ],
  O: [
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
  ],
  T: [
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0], [1, 1], [1, 0]],
    [[1, 1, 1], [0, 1, 0]],
    [[0, 1], [1, 1], [0, 1]],
  ],
  S: [
    [[0, 1, 1], [1, 1, 0]],
    [[1, 0], [1, 1], [0, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 0], [1, 1], [0, 1]],
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1], [1, 1], [1, 0]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1], [1, 1], [1, 0]],
  ],
  J: [
    [[1, 0, 0], [1, 1, 1]],
    [[1, 1], [1, 0], [1, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[0, 1], [0, 1], [1, 1]],
  ],
  L: [
    [[0, 0, 1], [1, 1, 1]],
    [[1, 0], [1, 0], [1, 1]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1], [0, 1], [0, 1]],
  ],
};

/** 游戏默认配置 */
export const DEFAULT_GAME_CONFIG: GameConfig = {
  cols: 15,  // 宽度增加50% (10列 → 15列)
  rows: 20,  // 高度不变
  blockSize: 30,  // 单元格大小缩小为30px
  initialSpeed: 1000,
  linesPerLevel: 20,
};

/** 计算下落间隔(ms) - 非线性递减公式 */
export function calculateDropInterval(level: number): number {
  return Math.floor(1000 / (1 + (level - 1) * 0.1));
}

/** 键盘按键映射 */
export const KEY_CODES = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  SPACE: ' ',
  PAUSE: 'KeyP',
  RESET: 'KeyR',
} as const;

/** 本地存储键名 */
export const STORAGE_KEYS = {
  HIGH_SCORE: 'tetris_high_score',
  PLAYER_NAME: 'tetris_player_name',
  GAME_SETTINGS: 'tetris_settings',
} as const;
