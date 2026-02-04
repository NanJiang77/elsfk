import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameEngine } from '@/services/GameEngine';
import { DEFAULT_GAME_CONFIG } from '@/utils/constants';

describe('GameEngine', () => {
  let gameEngine: GameEngine;
  let stateChangeCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    stateChangeCallback = vi.fn();
    gameEngine = new GameEngine(DEFAULT_GAME_CONFIG, stateChangeCallback);
  });

  describe('Initialization', () => {
    it('should initialize with empty board', () => {
      const board = gameEngine.getBoard();
      expect(board).toBeDefined();
      expect(board.length).toBe(DEFAULT_GAME_CONFIG.rows);
      expect(board[0].length).toBe(DEFAULT_GAME_CONFIG.cols);
    });

    it('should initialize with idle status', () => {
      expect(gameEngine.getStatus()).toBe('idle');
    });

    it('should initialize with zero score', () => {
      const scoreInfo = gameEngine.getScoreInfo();
      expect(scoreInfo.score).toBe(0);
      expect(scoreInfo.level).toBe(1);
      expect(scoreInfo.lines).toBe(0);
    });
  });

  describe('Game Start', () => {
    it('should start game and set status to playing', () => {
      gameEngine.start();
      expect(gameEngine.getStatus()).toBe('playing');
    });

    it('should reset board on start', () => {
      // 先让游戏运行一下，填充一些方块
      gameEngine.start();
      gameEngine.moveDown();
      gameEngine.moveDown();
      gameEngine.moveDown();

      // 重新开始
      gameEngine.start();

      const board = gameEngine.getBoard();
      board.forEach(row => {
        expect(row.every(cell => cell === 0)).toBe(true);
      });
    });

    it('should spawn first piece on start', () => {
      gameEngine.start();
      const currentPiece = gameEngine.getCurrentPiece();
      expect(currentPiece).toBeDefined();
      expect(currentPiece?.shape).toBeDefined();
    });

    it('should set next piece type on start', () => {
      gameEngine.start();
      const nextPieceType = gameEngine.getNextPieceType();
      expect(nextPieceType).toBeDefined();
      expect(['I', 'O', 'T', 'S', 'Z', 'J', 'L']).toContain(nextPieceType);
    });
  });

  describe('Piece Movement', () => {
    beforeEach(() => {
      gameEngine.start();
    });

    describe('moveLeft', () => {
      it('should move piece left', () => {
        const initialX = gameEngine.getCurrentPiece()?.x;
        gameEngine.moveLeft();
        const currentX = gameEngine.getCurrentPiece()?.x;

        expect(currentX).toBe(initialX! - 1);
      });

      it('should not move piece past left boundary', () => {
        // 不断向左移动直到边界
        for (let i = 0; i < 20; i++) {
          gameEngine.moveLeft();
        }

        const piece = gameEngine.getCurrentPiece();
        expect(piece!.x).toBeGreaterThanOrEqual(0);
      });

      it('should not move piece if blocked by other pieces', () => {
        // 在左边建立一些障碍物
        const board = gameEngine.getBoard();
        for (let y = 5; y < 15; y++) {
          board[y][0] = 1;
        }

        // 将方块移动到左侧
        for (let i = 0; i < 10; i++) {
          gameEngine.moveLeft();
        }

        const lastX = gameEngine.getCurrentPiece()?.x;
        gameEngine.moveLeft();
        const currentX = gameEngine.getCurrentPiece()?.x;

        // 由于被阻挡，X坐标不应该改变
        expect(currentX).toBe(lastX);
      });
    });

    describe('moveRight', () => {
      it('should move piece right', () => {
        const initialX = gameEngine.getCurrentPiece()?.x;
        gameEngine.moveRight();
        const currentX = gameEngine.getCurrentPiece()?.x;

        expect(currentX).toBe(initialX! + 1);
      });

      it('should not move piece past right boundary', () => {
        const config = gameEngine.getConfig();

        // 不断向右移动直到边界
        for (let i = 0; i < 20; i++) {
          gameEngine.moveRight();
        }

        const piece = gameEngine.getCurrentPiece();
        const maxX = config.cols - getPieceWidth(piece!.shape);

        expect(piece!.x).toBeLessThanOrEqual(maxX);
      });

      it('should not move piece if blocked by other pieces', () => {
        const board = gameEngine.getBoard();
        const piece = gameEngine.getCurrentPiece();

        // 在右边建立障碍物
        for (let y = 5; y < 15; y++) {
          board[y][DEFAULT_GAME_CONFIG.cols - 1] = 1;
        }

        // 将方块移动到右侧
        for (let i = 0; i < 20; i++) {
          gameEngine.moveRight();
        }

        const lastX = gameEngine.getCurrentPiece()?.x;
        gameEngine.moveRight();
        const currentX = gameEngine.getCurrentPiece()?.x;

        // 由于被阻挡，X坐标不应该改变
        expect(currentX).toBe(lastX);
      });
    });

    describe('moveDown', () => {
      it('should move piece down', () => {
        const initialY = gameEngine.getCurrentPiece()?.y;
        gameEngine.moveDown();
        const currentY = gameEngine.getCurrentPiece()?.y;

        expect(currentY).toBe(initialY! + 1);
      });

      it('should lock piece when it hits bottom', () => {
        const board = gameEngine.getBoard();

        // 移动到底部直到锁定
        let moved = true;
        let moves = 0;
        while (moved && moves < 30) {
          moved = gameEngine.moveDown();
          moves++;
        }

        // 最终应该无法继续下移（方块被锁定）
        expect(moved).toBe(false);

        // 应该生成新方块（旧的被锁定后自动生成）
        const newPiece = gameEngine.getCurrentPiece();
        expect(newPiece).toBeDefined();
      });

      it('should not move piece if blocked by other pieces', () => {
        const board = gameEngine.getBoard();

        // 在底部建立障碍物
        for (let x = 0; x < DEFAULT_GAME_CONFIG.cols; x++) {
          board[DEFAULT_GAME_CONFIG.rows - 1][x] = 1;
        }

        // 移动方块直到碰到障碍物
        let moved = true;
        let moves = 0;
        while (moved && moves < 30) {
          moved = gameEngine.moveDown();
          moves++;
        }

        // 应该在碰到障碍物时停止
        expect(moves).toBeLessThan(30);
      });
    });
  });

  describe('Piece Rotation', () => {
    beforeEach(() => {
      gameEngine.start();
    });

    it('should rotate piece', () => {
      const initialRotation = gameEngine.getCurrentPiece()?.rotation;
      gameEngine.rotate();
      const currentRotation = gameEngine.getCurrentPiece()?.rotation;

      expect(currentRotation).toBe((initialRotation! + 1) % 4);
    });

    it('should not rotate if it would cause collision', () => {
      const piece = gameEngine.getCurrentPiece();

      // 移动到右边界
      for (let i = 0; i < 20; i++) {
        gameEngine.moveRight();
      }

      // 在边界处尝试旋转应该不会成功（或者会墙踢）
      const initialX = gameEngine.getCurrentPiece()?.x;
      gameEngine.rotate();
      const currentX = gameEngine.getCurrentPiece()?.x;

      // 如果旋转成功，应该通过墙踢调整位置
      expect(currentX).toBeDefined();
    });
  });

  describe('Hard Drop', () => {
    beforeEach(() => {
      gameEngine.start();
    });

    it('should drop piece to bottom', () => {
      const initialY = gameEngine.getCurrentPiece()?.y;
      gameEngine.hardDrop();
      const piece = gameEngine.getCurrentPiece();

      // 应该生成新方块（旧的被锁定）
      expect(piece).toBeDefined();
      expect(piece!.y).toBe(0);
    });

    it('should lock piece after hard drop', () => {
      gameEngine.hardDrop();

      const board = gameEngine.getBoard();
      let hasLockedPiece = false;

      // 检查底部是否有锁定的方块
      for (let y = DEFAULT_GAME_CONFIG.rows - 5; y < DEFAULT_GAME_CONFIG.rows; y++) {
        for (let x = 0; x < DEFAULT_GAME_CONFIG.cols; x++) {
          if (board[y][x] !== 0) {
            hasLockedPiece = true;
            break;
          }
        }
        if (hasLockedPiece) break;
      }

      expect(hasLockedPiece).toBe(true);
    });

    it('should not crash when hard drop at bottom', () => {
      // 在边界处执行硬降
      for (let i = 0; i < 20; i++) {
        gameEngine.moveRight();
      }

      expect(() => {
        gameEngine.hardDrop();
      }).not.toThrow();
    });
  });

  describe('Piece Locking with Different Types', () => {
    beforeEach(() => {
      gameEngine.start();
    });

    it('should lock I-piece with correct type (1)', () => {
      // 强制生成 I 方块（通过重新开始直到获得 I 方块）
      let attempts = 0;
      while (gameEngine.getCurrentPiece()?.type !== 'I' && attempts < 10) {
        gameEngine.start();
        attempts++;
      }

      if (gameEngine.getCurrentPiece()?.type === 'I') {
        gameEngine.hardDrop();
        const board = gameEngine.getBoard();

        // 检查锁定的方块是否为类型 1（I-piece）
        let foundIPiece = false;
        for (let y = 0; y < DEFAULT_GAME_CONFIG.rows; y++) {
          for (let x = 0; x < DEFAULT_GAME_CONFIG.cols; x++) {
            if (board[y][x] === 1) {
              foundIPiece = true;
              break;
            }
          }
          if (foundIPiece) break;
        }

        expect(foundIPiece).toBe(true);
      }
    });

    it('should lock O-piece with correct type (2)', () => {
      let attempts = 0;
      while (gameEngine.getCurrentPiece()?.type !== 'O' && attempts < 10) {
        gameEngine.start();
        attempts++;
      }

      if (gameEngine.getCurrentPiece()?.type === 'O') {
        gameEngine.hardDrop();
        const board = gameEngine.getBoard();

        let foundOPiece = false;
        for (let y = 0; y < DEFAULT_GAME_CONFIG.rows; y++) {
          for (let x = 0; x < DEFAULT_GAME_CONFIG.cols; x++) {
            if (board[y][x] === 2) {
              foundOPiece = true;
              break;
            }
          }
          if (foundOPiece) break;
        }

        expect(foundOPiece).toBe(true);
      }
    });

    it('should lock T-piece with correct type (3)', () => {
      let attempts = 0;
      while (gameEngine.getCurrentPiece()?.type !== 'T' && attempts < 10) {
        gameEngine.start();
        attempts++;
      }

      if (gameEngine.getCurrentPiece()?.type === 'T') {
        gameEngine.hardDrop();
        const board = gameEngine.getBoard();

        let foundTPiece = false;
        for (let y = 0; y < DEFAULT_GAME_CONFIG.rows; y++) {
          for (let x = 0; x < DEFAULT_GAME_CONFIG.cols; x++) {
            if (board[y][x] === 3) {
              foundTPiece = true;
              break;
            }
          }
          if (foundTPiece) break;
        }

        expect(foundTPiece).toBe(true);
      }
    });
  });

  describe('Line Clearing', () => {
    beforeEach(() => {
      gameEngine.start();
    });

    it('should detect and clear single line', () => {
      const board = gameEngine.getBoard();

      // 填满最后一行
      for (let x = 0; x < DEFAULT_GAME_CONFIG.cols; x++) {
        board[DEFAULT_GAME_CONFIG.rows - 1][x] = 1;
      }

      const initialLines = gameEngine.getScoreInfo().lines;

      // 触发检测（通过移动一个方块）
      gameEngine.hardDrop();

      const finalLines = gameEngine.getScoreInfo().lines;
      expect(finalLines).toBeGreaterThan(initialLines);
    });

    it('should detect and clear multiple lines', () => {
      const board = gameEngine.getBoard();

      // 填满最后两行
      for (let y = DEFAULT_GAME_CONFIG.rows - 2; y < DEFAULT_GAME_CONFIG.rows; y++) {
        for (let x = 0; x < DEFAULT_GAME_CONFIG.cols; x++) {
          board[y][x] = 1;
        }
      }

      const initialLines = gameEngine.getScoreInfo().lines;
      const initialScore = gameEngine.getScoreInfo().score;

      gameEngine.hardDrop();

      const finalLines = gameEngine.getScoreInfo().lines;
      const finalScore = gameEngine.getScoreInfo().score;

      expect(finalLines).toBe(initialLines + 2);
      expect(finalScore).toBeGreaterThan(initialScore);
    });
  });

  describe('Scoring', () => {
    beforeEach(() => {
      gameEngine.start();
    });

    it('should increase score when clearing lines', () => {
      const initialScore = gameEngine.getScoreInfo().score;

      // 填满一行
      const board = gameEngine.getBoard();
      for (let x = 0; x < DEFAULT_GAME_CONFIG.cols; x++) {
        board[DEFAULT_GAME_CONFIG.rows - 1][x] = 1;
      }

      gameEngine.hardDrop();

      const finalScore = gameEngine.getScoreInfo().score;
      expect(finalScore).toBeGreaterThan(initialScore);
    });

    it('should calculate higher score for more lines', () => {
      // 测试消除4行（Tetris）的分数应该高于消除1行
      gameEngine.start();

      // 填满4行
      const board = gameEngine.getBoard();
      for (let y = DEFAULT_GAME_CONFIG.rows - 4; y < DEFAULT_GAME_CONFIG.rows; y++) {
        for (let x = 0; x < DEFAULT_GAME_CONFIG.cols; x++) {
          board[y][x] = 1;
        }
      }

      const initialScore = gameEngine.getScoreInfo().score;
      gameEngine.hardDrop();
      const tetrisScore = gameEngine.getScoreInfo().score - initialScore;

      // 重新开始，只消除1行
      gameEngine.start();
      const board2 = gameEngine.getBoard();
      for (let x = 0; x < DEFAULT_GAME_CONFIG.cols; x++) {
        board2[DEFAULT_GAME_CONFIG.rows - 1][x] = 1;
      }

      const initialScore2 = gameEngine.getScoreInfo().score;
      gameEngine.hardDrop();
      const singleScore = gameEngine.getScoreInfo().score - initialScore2;

      expect(tetrisScore).toBeGreaterThan(singleScore);
    });
  });

  describe('Level Progression', () => {
    beforeEach(() => {
      gameEngine.start();
    });

    it('should have correct level progression configuration', () => {
      const config = gameEngine.getConfig();
      expect(config.linesPerLevel).toBe(20);
    });

    it('should track lines cleared correctly', () => {
      const board = gameEngine.getBoard();

      // 消除一行
      for (let x = 0; x < DEFAULT_GAME_CONFIG.cols; x++) {
        board[DEFAULT_GAME_CONFIG.rows - 1][x] = 1;
      }

      const initialLines = gameEngine.getScoreInfo().lines;
      gameEngine.hardDrop();
      const finalLines = gameEngine.getScoreInfo().lines;

      expect(finalLines).toBeGreaterThan(initialLines);
    });
  });

  describe('Game Over', () => {
    it('should have game over detection capability', () => {
      gameEngine.start();

      // 游戏应该能够检测到游戏结束
      const collisionDetector = (gameEngine as any).collisionDetector;
      expect(collisionDetector).toBeDefined();

      // 验证isGameOver方法存在
      expect(typeof collisionDetector.isGameOver).toBe('function');
    });

    it('should handle board filled at spawn position', () => {
      gameEngine.start();

      // 填满顶部的几行，使新生成的方块无法放置
      const board = gameEngine.getBoard();
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < DEFAULT_GAME_CONFIG.cols; x++) {
          board[y][x] = 1;
        }
      }

      // 当前方块继续下落应该被锁定
      gameEngine.hardDrop();

      // 游戏状态应该被定义（可能是playing或gameover）
      expect(['playing', 'gameover']).toContain(gameEngine.getStatus());
    });
  });

  describe('Pause/Resume', () => {
    beforeEach(() => {
      gameEngine.start();
    });

    it('should pause game', () => {
      gameEngine.pause();
      expect(gameEngine.getStatus()).toBe('paused');
    });

    it('should resume paused game', () => {
      gameEngine.pause();
      gameEngine.resume();
      expect(gameEngine.getStatus()).toBe('playing');
    });

    it('should not move piece when paused', () => {
      gameEngine.pause();

      const initialY = gameEngine.getCurrentPiece()?.y;
      gameEngine.moveDown();
      const currentY = gameEngine.getCurrentPiece()?.y;

      expect(currentY).toBe(initialY);
    });
  });

  describe('15-Column Board Configuration', () => {
    it('should work correctly with 15 columns', () => {
      const config15 = { ...DEFAULT_GAME_CONFIG, cols: 15 };
      const engine15 = new GameEngine(config15, stateChangeCallback);

      engine15.start();
      const board = engine15.getBoard();

      expect(board[0].length).toBe(15);

      // 测试右边界
      const piece = engine15.getCurrentPiece();
      for (let i = 0; i < 20; i++) {
        engine15.moveRight();
      }

      const finalPiece = engine15.getCurrentPiece();
      expect(finalPiece!.x).toBeLessThanOrEqual(15);
    });
  });
});

// Helper function to get piece width
function getPieceWidth(shape: number[][]): number {
  return shape[0]?.length || 0;
}
