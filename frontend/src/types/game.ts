/**
 * 游戏类型定义
 */

/** 方块类型 */
export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

/** 方块旋转状态 */
export type RotationState = 0 | 1 | 2 | 3;

/** 游戏状态 */
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

/** 方块形状矩阵 */
export type PieceShape = number[][];

/** 方块定义 */
export interface Piece {
  type: PieceType;
  shape: PieceShape;
  color: string;
  x: number;
  y: number;
  rotation: RotationState;
}

/** 游戏分数信息 */
export interface ScoreInfo {
  score: number;
  level: number;
  lines: number;
  highScore: number;
}

/** 游戏统计信息 */
export interface GameStats {
  playTime: number; // 游戏时长(秒)
  totalPieces: number; // 总方块数
  piecesPerType: Record<PieceType, number>; // 各类型方块数量
}

/** 位置坐标 */
export interface Position {
  x: number;
  y: number;
}

/** 游戏配置 */
export interface GameConfig {
  cols: number;
  rows: number;
  blockSize: number;
  initialSpeed: number;
  linesPerLevel: number;
}

/** API 游戏记录 */
export interface GameRecord {
  id: number;
  player_name: string;
  score: number;
  level: number;
  lines: number;
  play_time: number;
  created_at: string;
}

/** API 排行榜条目 */
export interface LeaderBoardEntry extends GameRecord {}

/** 玩家统计信息 */
export interface PlayerStats {
  total_games: number;
  highest_score: number;
  total_play_time: number;
  average_level: number;
  highest_level: number;
}
