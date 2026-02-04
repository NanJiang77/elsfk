/**
 * 游戏引擎 - 核心游戏逻辑
 */

import type {
  PieceType,
  Piece,
  GameStatus,
  ScoreInfo,
  GameStats,
  RotationState,
} from '@/types/game';
import { DEFAULT_GAME_CONFIG, calculateDropInterval } from '@/utils/constants';
import { PieceManager } from './PieceManager';
import { CollisionDetector } from './CollisionDetector';
import { LineClearManager } from './LineClearManager';

export class GameEngine {
  private board: number[][];
  private currentPiece: Piece | null = null;
  private nextPieceType: PieceType | null = null;
  private status: GameStatus = 'idle';
  private scoreInfo: ScoreInfo = {
    score: 0,
    level: 1,
    lines: 0,
    highScore: 0,
  };
  private stats: GameStats = {
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
  };

  private gameLoopId: number | null = null;
  private lastTime = 0;
  private dropTimer = 0;
  private playTimerId: number | null = null;
  private playStartTime = 0;
  private pausedTime = 0;
  private pauseStartTime = 0;
  private stateChangeCallback?: () => void;

  private readonly pieceManager = new PieceManager();
  private readonly collisionDetector: CollisionDetector;
  private readonly lineClearManager: LineClearManager;

  constructor(
    private config = DEFAULT_GAME_CONFIG,
    onStateChanged?: () => void
  ) {
    this.board = this.createEmptyBoard();
    this.collisionDetector = new CollisionDetector(config);
    this.lineClearManager = new LineClearManager(config);
    this.stateChangeCallback = onStateChanged;
    this.loadHighScore();
  }

  /**
   * 通知状态变更
   */
  private notifyStateChange(): void {
    if (this.stateChangeCallback) {
      this.stateChangeCallback();
    }
  }

  /**
   * 创建空游戏板
   */
  private createEmptyBoard(): number[][] {
    return Array.from({ length: this.config.rows }, () =>
      Array(this.config.cols).fill(0)
    );
  }

  /**
   * 开始游戏
   */
  start(): void {
    this.board = this.createEmptyBoard();
    this.scoreInfo = { score: 0, level: 1, lines: 0, highScore: this.scoreInfo.highScore };
    this.stats = {
      playTime: 0,
      totalPieces: 0,
      piecesPerType: { I: 0, O: 0, T: 0, S: 0, Z: 0, J: 0, L: 0 },
    };
    this.pieceManager.reset();
    this.nextPieceType = this.pieceManager.getNextPieceType();
    this.spawnPiece();
    this.status = 'playing';
    this.lastTime = performance.now();
    this.playStartTime = Date.now();
    this.startPlayTimer();
    this.startGameLoop();
  }

  /**
   * 生成新方块
   */
  private spawnPiece(): void {
    const pieceType = this.nextPieceType || this.pieceManager.getNextPieceType();
    this.nextPieceType = this.pieceManager.getNextPieceType();

    const shape = this.pieceManager.getPieceShape(pieceType, 0);
    const firstRow = shape[0];
    const rowLength = firstRow ? firstRow.length : 0;
    const startX = Math.floor((this.config.cols - rowLength) / 2);

    this.currentPiece = {
      type: pieceType,
      shape,
      color: pieceType,
      x: startX,
      y: 0,
      rotation: 0,
    };

    // 统计方块
    this.stats.totalPieces++;
    this.stats.piecesPerType[pieceType]++;

    // 检查生成位置是否碰撞（游戏结束）
    if (
      this.collisionDetector.checkCollision(
        this.board,
        this.currentPiece.shape,
        this.currentPiece.x,
        this.currentPiece.y
      )
    ) {
      this.gameOver();
    }
  }

  /**
   * 游戏主循环
   */
  private startGameLoop(): void {
    if (this.gameLoopId !== null) {
      cancelAnimationFrame(this.gameLoopId);
    }

    const loop = (currentTime: number) => {
      if (this.status !== 'playing') {
        return;
      }

      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;

      this.dropTimer += deltaTime;

      const dropInterval = calculateDropInterval(this.scoreInfo.level);
      if (this.dropTimer >= dropInterval) {
        this.moveDown(false); // 自动下落不触发通知,由checkLines中的notifyStateChange处理
        this.dropTimer = 0;
      }

      this.gameLoopId = requestAnimationFrame(loop);
    };

    this.gameLoopId = requestAnimationFrame(loop);
  }

  /**
   * 移动方块 - 左
   */
  moveLeft(): void {
    if (!this.currentPiece || this.status !== 'playing') return;

    const newX = this.currentPiece.x - 1;
    if (
      !this.collisionDetector.checkCollision(
        this.board,
        this.currentPiece.shape,
        newX,
        this.currentPiece.y
      )
    ) {
      this.currentPiece.x = newX;
      this.notifyStateChange();
    }
  }

  /**
   * 移动方块 - 右
   */
  moveRight(): void {
    if (!this.currentPiece || this.status !== 'playing') return;

    const newX = this.currentPiece.x + 1;
    if (
      !this.collisionDetector.checkCollision(
        this.board,
        this.currentPiece.shape,
        newX,
        this.currentPiece.y
      )
    ) {
      this.currentPiece.x = newX;
      this.notifyStateChange();
    }
  }

  /**
   * 移动方块 - 下
   */
  moveDown(notify = true): boolean {
    if (!this.currentPiece || this.status !== 'playing') return false;

    const newY = this.currentPiece.y + 1;
    if (
      !this.collisionDetector.checkCollision(
        this.board,
        this.currentPiece.shape,
        this.currentPiece.x,
        newY
      )
    ) {
      this.currentPiece.y = newY;
      if (notify) this.notifyStateChange();
      return true;
    } else {
      this.lockPiece();
      return false;
    }
  }

  /**
   * 硬降（直接落到底部）
   */
  hardDrop(): void {
    if (!this.currentPiece || this.status !== 'playing') return;

    while (this.moveDown()) {
      // 继续下落直到碰撞
    }

    this.dropTimer = 0; // 重置下落计时器
    this.notifyStateChange();
  }

  /**
   * 旋转方块
   */
  rotate(): void {
    if (!this.currentPiece || this.status !== 'playing') return;

    const newRotation = ((this.currentPiece.rotation + 1) % 4) as RotationState;
    const newShape = this.pieceManager.getPieceShape(
      this.currentPiece.type,
      newRotation
    );

    // 尝试旋转，如果碰撞则尝试墙踢
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      if (
        !this.collisionDetector.checkCollision(
          this.board,
          newShape,
          this.currentPiece.x + kick,
          this.currentPiece.y
        )
      ) {
        this.currentPiece.shape = newShape;
        this.currentPiece.rotation = newRotation;
        this.currentPiece.x += kick;
        this.notifyStateChange();
        return;
      }
    }
  }

  /**
   * 锁定方块到游戏板
   */
  private lockPiece(): void {
    if (!this.currentPiece) return;

    const { shape, x, y, type } = this.currentPiece;

    // 将 PieceType 转换为数字
    const typeToNumber: Record<PieceType, number> = {
      'I': 1,
      'O': 2,
      'T': 3,
      'S': 4,
      'Z': 5,
      'J': 6,
      'L': 7,
    };

    const pieceNumber = typeToNumber[type];

    for (let py = 0; py < shape.length; py++) {
      const row = shape[py];
      if (!row) continue;

      for (let px = 0; px < row.length; px++) {
        if (row[px] !== 0) {
          const boardY = y + py;
          const boardX = x + px;
          if (boardY >= 0 && boardY < this.config.rows && boardX >= 0 && boardX < this.config.cols) {
            const boardRow = this.board[boardY];
            if (boardRow) {
              boardRow[boardX] = pieceNumber;
            }
          }
        }
      }
    }

    this.checkLines();
    this.spawnPiece();
  }

  /**
   * 检查并消除满行
   */
  private checkLines(): void {
    const fullLines = this.lineClearManager.findFullLines(this.board);

    if (fullLines.length > 0) {
      this.board = this.lineClearManager.clearLines(this.board, fullLines);

      // 更新分数
      const points = this.lineClearManager.calculateScore(
        fullLines.length,
        this.scoreInfo.level
      );
      this.scoreInfo.score += points;

      // 更新消除行数
      this.scoreInfo.lines += fullLines.length;

      // 检查等级提升
      this.checkLevelUp();
      this.notifyStateChange();
    }
  }

  /**
   * 检查等级提升
   */
  private checkLevelUp(): void {
    const newLevel = Math.floor(this.scoreInfo.lines / this.config.linesPerLevel) + 1;
    if (newLevel > this.scoreInfo.level && newLevel <= 20) {
      this.scoreInfo.level = newLevel;
    }
  }

  /**
   * 暂停游戏
   */
  pause(): void {
    if (this.status === 'playing') {
      this.status = 'paused';
      this.pauseStartTime = Date.now();
      if (this.gameLoopId !== null) {
        cancelAnimationFrame(this.gameLoopId);
        this.gameLoopId = null;
      }
    }
  }

  /**
   * 继续游戏
   */
  resume(): void {
    if (this.status === 'paused') {
      this.status = 'playing';
      this.pausedTime += Date.now() - this.pauseStartTime;
      this.lastTime = performance.now();
      this.startGameLoop();
    }
  }

  /**
   * 游戏结束
   */
  private gameOver(): void {
    this.status = 'gameover';
    if (this.gameLoopId !== null) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
    this.stopPlayTimer();

    // 更新最高分
    if (this.scoreInfo.score > this.scoreInfo.highScore) {
      this.scoreInfo.highScore = this.scoreInfo.score;
      this.saveHighScore();
    }
  }

  /**
   * 游戏计时器
   */
  private startPlayTimer(): void {
    this.playStartTime = Date.now();
    this.pausedTime = 0;

    this.playTimerId = window.setInterval(() => {
      this.stats.playTime = this.calculatePlayTime();
    }, 1000);
  }

  private stopPlayTimer(): void {
    if (this.playTimerId !== null) {
      clearInterval(this.playTimerId);
      this.playTimerId = null;
    }
  }

  /**
   * 计算游戏时长（秒）
   */
  private calculatePlayTime(): number {
    const totalTime = Date.now() - this.playStartTime;
    return Math.floor((totalTime - this.pausedTime) / 1000);
  }

  /**
   * 加载最高分
   */
  private loadHighScore(): void {
    const saved = localStorage.getItem('tetris_high_score');
    if (saved) {
      this.scoreInfo.highScore = parseInt(saved, 10);
    }
  }

  /**
   * 保存最高分
   */
  private saveHighScore(): void {
    localStorage.setItem('tetris_high_score', this.scoreInfo.highScore.toString());
  }

  // Getters
  getBoard(): number[][] {
    return this.board;
  }

  getCurrentPiece(): Piece | null {
    return this.currentPiece;
  }

  getNextPieceType(): PieceType | null {
    return this.nextPieceType;
  }

  getStatus(): GameStatus {
    return this.status;
  }

  getScoreInfo(): ScoreInfo {
    return this.scoreInfo;
  }

  getStats(): GameStats {
    return this.stats;
  }

  getConfig() {
    return this.config;
  }
}
