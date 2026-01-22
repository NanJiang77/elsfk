/**
 * 行消除管理器
 */

import type { GameConfig } from '@/types/game';

export class LineClearManager {
  constructor(private config: GameConfig) {}

  /**
   * 查找满行
   */
  findFullLines(board: number[][]): number[] {
    const fullLines: number[] = [];

    for (let y = 0; y < this.config.rows; y++) {
      const row = board[y];
      if (row && row.every((cell) => cell !== 0)) {
        fullLines.push(y);
      }
    }

    return fullLines;
  }

  /**
   * 计算消除分数
   */
  calculateScore(linesCleared: number, level: number): number {
    const baseScores = [0, 100, 300, 500, 800]; // 0-4行的分数
    const lines = Math.min(linesCleared, 4);
    const score = baseScores[lines];
    return (score ?? 0) * level;
  }

  /**
   * 消除行并下落上方行
   */
  clearLines(board: number[][], linesToClear: number[]): number[][] {
    const newBoard = board.map((row) => [...row]);

    // 从下往上消除，避免索引问题
    linesToClear
      .sort((a, b) => b - a)
      .forEach((lineIndex) => {
        newBoard.splice(lineIndex, 1);
        // 在顶部添加新空行
        newBoard.unshift(Array(this.config.cols).fill(0));
      });

    return newBoard;
  }
}
