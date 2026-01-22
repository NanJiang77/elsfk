/**
 * 碰撞检测器
 */

import type { PieceShape } from '@/types/game';
import type { GameConfig } from '@/types/game';

export class CollisionDetector {
  constructor(private config: GameConfig) {}

  /**
   * 检查方块是否与边界或其他方块碰撞
   */
  checkCollision(
    board: number[][],
    shape: PieceShape,
    posX: number,
    posY: number
  ): boolean {
    const { rows, cols } = this.config;

    for (let y = 0; y < shape.length; y++) {
      const row = shape[y];
      if (!row) continue;

      for (let x = 0; x < row.length; x++) {
        if (row[x] !== 0) {
          const newX = posX + x;
          const newY = posY + y;

          // 检查边界
          if (newX < 0 || newX >= cols || newY >= rows) {
            return true;
          }

          // 检查是否与已有方块碰撞
          if (newY >= 0 && board[newY]?.[newX] !== 0) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * 检查游戏是否结束
   */
  isGameOver(board: number[][]): boolean {
    // 检查顶行是否有方块
    const topRow = board[0];
    if (!topRow) return false;
    return topRow.some((cell) => cell !== 0);
  }
}
