/**
 * 方块管理器 - 实现7-Bag随机系统
 */

import type { PieceType, PieceShape } from '@/types/game';
import { PIECE_SHAPES } from '@/utils/constants';

export class PieceManager {
  private bag: PieceType[] = [];
  private readonly PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

  /**
   * 获取下一个方块类型（7-Bag算法）
   */
  getNextPieceType(): PieceType {
    if (this.bag.length === 0) {
      this.refillBag();
    }
    return this.bag.pop()!;
  }

  /**
   * 获取方块的旋转形状
   */
  getPieceShape(type: PieceType, rotation: number): PieceShape {
    const shapes = PIECE_SHAPES[type];
    if (!shapes) return [[0]];
    const shape = shapes[rotation % 4];
    return shape ?? [[0]];
  }

  /**
   * 重新填充袋子（7个方块各一个，随机打乱）
   */
  private refillBag(): void {
    this.bag = [...this.PIECE_TYPES].sort(() => Math.random() - 0.5);
  }

  /**
   * 重置管理器
   */
  reset(): void {
    this.bag = [];
  }

  /**
   * 预览下一个方块类型（不消耗）
   */
  peekNextPieceType(): PieceType {
    if (this.bag.length === 0) {
      this.refillBag();
    }
    const lastPiece = this.bag[this.bag.length - 1];
    return lastPiece || 'I';
  }
}

export const pieceManager = new PieceManager();
