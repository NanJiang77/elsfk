/**
 * 游戏常量定义
 */

import type { PieceType, PieceShape, GameConfig } from '@/types/game';

/** 方块颜色配置 */
export const PIECE_COLORS: Record<PieceType, string> = {
  I: '#00f0f0', // 青色
  O: '#f0f000', // 黄色
  T: '#a000f0', // 紫色
  S: '#00f000', // 绿色
  Z: '#f00000', // 红色
  J: '#0000f0', // 蓝色
  L: '#f0a000', // 橙色
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
  cols: 10,
  rows: 20,
  blockSize: 40,
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
