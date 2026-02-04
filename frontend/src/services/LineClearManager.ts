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
    if (linesToClear.length === 0) return board;

    // 按从大到小排序，避免splice时索引变化的问题
    const sortedLines = [...linesToClear].sort((a, b) => b - a);

    // 先删除所有要消除的行
    const newBoard = board.map((row) => [...row]);
    sortedLines.forEach((lineIndex) => {
      newBoard.splice(lineIndex, 1);
    });

    // 在顶部一次性添加对应数量的空行
    for (let i = 0; i < linesToClear.length; i++) {
      newBoard.unshift(Array(this.config.cols).fill(0));
    }

    return newBoard;
  }
}
