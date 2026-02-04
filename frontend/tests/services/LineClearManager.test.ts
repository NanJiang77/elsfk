import { describe, it, expect, beforeEach } from 'vitest';
import { LineClearManager } from '@/services/LineClearManager';
import type { GameConfig } from '@/types/game';

describe('LineClearManager', () => {
  let lineClearManager: LineClearManager;
  let config: GameConfig;

  beforeEach(() => {
    config = {
      cols: 10,
      rows: 20,
      blockSize: 30,
      initialSpeed: 1000,
      linesPerLevel: 10,
    };
    lineClearManager = new LineClearManager(config);
  });

  describe('findFullLines', () => {
    it('should find no full lines in empty board', () => {
      const board = Array(20).fill(null).map(() => Array(10).fill(0));
      const fullLines = lineClearManager.findFullLines(board);
      expect(fullLines).toEqual([]);
    });

    it('should find a single full line', () => {
      const board = Array(20).fill(null).map(() => Array(10).fill(0));
      // 填满第10行
      board[10] = Array(10).fill(1);

      const fullLines = lineClearManager.findFullLines(board);
      expect(fullLines).toEqual([10]);
    });

    it('should find multiple full lines', () => {
      const board = Array(20).fill(null).map(() => Array(10).fill(0));
      // 填满第5、10、15行
      board[5] = Array(10).fill(1);
      board[10] = Array(10).fill(2);
      board[15] = Array(10).fill(3);

      const fullLines = lineClearManager.findFullLines(board);
      expect(fullLines).toEqual([5, 10, 15]);
    });

    it('should not identify partially filled lines as full', () => {
      const board = Array(20).fill(null).map(() => Array(10).fill(0));
      // 部分填充第10行
      board[10] = [1, 1, 1, 1, 1, 0, 1, 1, 1, 1];

      const fullLines = lineClearManager.findFullLines(board);
      expect(fullLines).toEqual([]);
    });

    it('should handle consecutive full lines', () => {
      const board = Array(20).fill(null).map(() => Array(10).fill(0));
      // 填满连续的第9、10、11行（这是 Tetris 的情况）
      board[9] = Array(10).fill(1);
      board[10] = Array(10).fill(2);
      board[11] = Array(10).fill(3);

      const fullLines = lineClearManager.findFullLines(board);
      expect(fullLines).toEqual([9, 10, 11]);
    });
  });

  describe('clearLines', () => {
    it('should return unchanged board when no lines to clear', () => {
      const board = Array(20).fill(null).map(() => Array(10).fill(0));
      const result = lineClearManager.clearLines(board, []);

      expect(result).toEqual(board);
    });

    it('should clear a single line and add empty line at top', () => {
      const board = Array(20).fill(null).map((_, y) =>
        Array(10).fill(null).map((_, x) => y * 10 + x)
      );

      // 填满第10行
      board[10] = Array(10).fill(999);

      const fullLines = [10];
      const result = lineClearManager.clearLines(board, fullLines);

      // 验证第10行被移除，顶部添加了新空行
      expect(result[0]).toEqual(Array(10).fill(0));
      expect(result[10]).not.toEqual(Array(10).fill(999));
    });

    it('should clear two consecutive lines correctly', () => {
      const board = Array(20).fill(null).map((_, y) =>
        Array(10).fill(null).map((_, x) => y * 10 + x)
      );

      // 填满第10、11行
      board[10] = Array(10).fill(999);
      board[11] = Array(10).fill(888);

      const fullLines = [10, 11];
      const result = lineClearManager.clearLines(board, fullLines);

      // 验证顶部添加了两行空行
      expect(result[0]).toEqual(Array(10).fill(0));
      expect(result[1]).toEqual(Array(10).fill(0));

      // 验证原来的第10、11行都被消除了
      expect(result[10]).not.toEqual(Array(10).fill(999));
      expect(result[11]).not.toEqual(Array(10).fill(888));

      // 验证总行数仍然是20
      expect(result.length).toBe(20);
    });

    it('should clear four lines (Tetris) correctly', () => {
      const board = Array(20).fill(null).map((_, y) =>
        Array(10).fill(null).map((_, x) => y * 10 + x)
      );

      // 填满第10、11、12、13行（Tetris!）
      board[10] = Array(10).fill(999);
      board[11] = Array(10).fill(888);
      board[12] = Array(10).fill(777);
      board[13] = Array(10).fill(666);

      const fullLines = [10, 11, 12, 13];
      const result = lineClearManager.clearLines(board, fullLines);

      // 验证顶部添加了四行空行
      expect(result[0]).toEqual(Array(10).fill(0));
      expect(result[1]).toEqual(Array(10).fill(0));
      expect(result[2]).toEqual(Array(10).fill(0));
      expect(result[3]).toEqual(Array(10).fill(0));

      // 验证所有四行都被消除了
      expect(result[10]).not.toEqual(Array(10).fill(999));
      expect(result[11]).not.toEqual(Array(10).fill(888));
      expect(result[12]).not.toEqual(Array(10).fill(777));
      expect(result[13]).not.toEqual(Array(10).fill(666));

      // 验证总行数仍然是20
      expect(result.length).toBe(20);
    });

    it('should clear non-consecutive lines correctly', () => {
      const board = Array(20).fill(null).map((_, y) =>
        Array(10).fill(null).map((_, x) => y * 10 + x)
      );

      // 填满第5、10、15行（不连续）
      board[5] = Array(10).fill(999);
      board[10] = Array(10).fill(888);
      board[15] = Array(10).fill(777);

      const fullLines = [5, 10, 15];
      const result = lineClearManager.clearLines(board, fullLines);

      // 验证顶部添加了三行空行
      expect(result[0]).toEqual(Array(10).fill(0));
      expect(result[1]).toEqual(Array(10).fill(0));
      expect(result[2]).toEqual(Array(10).fill(0));

      // 验证所有三行都被消除了
      expect(result[5]).not.toEqual(Array(10).fill(999));
      expect(result[10]).not.toEqual(Array(10).fill(888));
      expect(result[15]).not.toEqual(Array(10).fill(777));

      // 验证总行数仍然是20
      expect(result.length).toBe(20);
    });

    it('should preserve lines above cleared lines', () => {
      const board = Array(20).fill(null).map((_, y) =>
        Array(10).fill(y) // 每行的值等于行号
      );

      // 填满第15行
      board[15] = Array(10).fill(999);

      const fullLines = [15];
      const result = lineClearManager.clearLines(board, fullLines);

      // 验证顶部添加空行
      expect(result[0]).toEqual(Array(10).fill(0));

      // 验证原来的行0-14保留（只是下移了1位，因为顶部添加了空行）
      expect(result[1]).toEqual(Array(10).fill(0));  // 原来的行0
      expect(result[15]).toEqual(Array(10).fill(14)); // 原来的行14
      expect(result[16]).toEqual(Array(10).fill(16)); // 原来的行16
      expect(result[19]).toEqual(Array(10).fill(19)); // 原来的行19
    });

    it('should handle clearing bottom line', () => {
      const board = Array(20).fill(null).map((_, y) =>
        Array(10).fill(null).map((_, x) => y * 10 + x)
      );

      // 填满最后一行（第19行）
      board[19] = Array(10).fill(999);

      const fullLines = [19];
      const result = lineClearManager.clearLines(board, fullLines);

      // 验证底部行被消除，顶部添加空行
      expect(result[0]).toEqual(Array(10).fill(0));
      expect(result[19]).not.toEqual(Array(10).fill(999));
    });

    it('should handle clearing top line', () => {
      const board = Array(20).fill(null).map((_, y) =>
        Array(10).fill(null).map((_, x) => y * 10 + x)
      );

      // 填满第0行
      board[0] = Array(10).fill(999);

      const fullLines = [0];
      const result = lineClearManager.clearLines(board, fullLines);

      // 验证顶部行被消除并替换为空行
      expect(result[0]).toEqual(Array(10).fill(0));
    });
  });

  describe('calculateScore', () => {
    it('should return 0 for 0 lines cleared', () => {
      const score = lineClearManager.calculateScore(0, 1);
      expect(score).toBe(0);
    });

    it('should calculate correct score for 1 line', () => {
      const score = lineClearManager.calculateScore(1, 1);
      expect(score).toBe(100); // 100 * 1
    });

    it('should calculate correct score for 2 lines', () => {
      const score = lineClearManager.calculateScore(2, 1);
      expect(score).toBe(300); // 300 * 1
    });

    it('should calculate correct score for 3 lines', () => {
      const score = lineClearManager.calculateScore(3, 1);
      expect(score).toBe(500); // 500 * 1
    });

    it('should calculate correct score for 4 lines (Tetris)', () => {
      const score = lineClearManager.calculateScore(4, 1);
      expect(score).toBe(800); // 800 * 1
    });

    it('should multiply score by level', () => {
      const score1 = lineClearManager.calculateScore(4, 1);
      const score2 = lineClearManager.calculateScore(4, 2);
      const score3 = lineClearManager.calculateScore(4, 3);

      expect(score2).toBe(2 * score1); // 1600
      expect(score3).toBe(3 * score1); // 2400
    });

    it('should cap at 4 lines for scoring', () => {
      const score4 = lineClearManager.calculateScore(4, 1);
      const score5 = lineClearManager.calculateScore(5, 1);
      const score10 = lineClearManager.calculateScore(10, 1);

      // 超过4行应该按4行计算
      expect(score5).toBe(score4);
      expect(score10).toBe(score4);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complex scenario with multiple clears', () => {
      const board = Array(20).fill(null).map(() => Array(10).fill(0));

      // 模拟一个复杂的棋盘状态
      board[17] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // 满
      board[18] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // 满
      board[19] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 空

      const fullLines = lineClearManager.findFullLines(board);
      expect(fullLines).toEqual([17, 18]);

      const result = lineClearManager.clearLines(board, fullLines);

      // 验证结果
      expect(result.length).toBe(20);
      expect(result[0]).toEqual(Array(10).fill(0));
      expect(result[1]).toEqual(Array(10).fill(0));
    });

    it('should work with 15-column board configuration', () => {
      const config15: GameConfig = {
        cols: 15,
        rows: 20,
        blockSize: 30,
        initialSpeed: 1000,
        linesPerLevel: 10,
      };
      const manager15 = new LineClearManager(config15);

      const board = Array(20).fill(null).map(() => Array(15).fill(0));
      board[10] = Array(15).fill(1);
      board[11] = Array(15).fill(2);

      const fullLines = manager15.findFullLines(board);
      expect(fullLines).toEqual([10, 11]);

      const result = manager15.clearLines(board, fullLines);
      expect(result.length).toBe(20);
      expect(result[0].length).toBe(15);
    });
  });
});
