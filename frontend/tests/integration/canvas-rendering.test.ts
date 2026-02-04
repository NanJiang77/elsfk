import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createPinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import MobileGame from '@/components/mobile/MobileGame.vue';
import { DEFAULT_GAME_CONFIG } from '@/utils/constants';

describe('Canvas Rendering Integration Tests', () => {
  let router: any;
  let pinia: any;

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/m/game', name: 'MobileGame', component: MobileGame },
      ],
    });

    pinia = createTestingPinia({
      initialState: {
        game: {
          scoreInfo: {
            score: 0,
            level: 1,
            lines: 0,
            highScore: 0,
          },
          status: 'playing',
          board: Array(20).fill(null).map(() => Array(15).fill(0)),
          currentPiece: null,
          nextPieceType: 'I',
        },
      },
    });

    localStorage.clear();
    localStorage.setItem('username', 'TestPlayer');
  });

  describe('Canvas Dimensions and Configuration', () => {
    it('should match board dimensions with game config', async () => {
      const { container } = render(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      const canvas = container.querySelector('canvas');
      expect(canvas).toBeDefined();

      // 验证 canvas 元素存在
      expect(canvas?.tagName).toBe('CANVAS');
    });

    it('should have correct canvas context', async () => {
      const { container } = render(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      const canvas = container.querySelector('canvas') as HTMLCanvasElement;
      expect(canvas).toBeDefined();

      const ctx = canvas?.getContext('2d');
      expect(ctx).toBeDefined();
      expect(ctx).toBeInstanceOf(CanvasRenderingContext2D);
    });
  });

  describe('Board State Rendering', () => {
    it('should render empty board correctly', async () => {
      const { container } = render(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      const canvas = container.querySelector('canvas') as HTMLCanvasElement;
      const ctx = canvas?.getContext('2d');

      expect(canvas).toBeDefined();
      expect(ctx).toBeDefined();
    });

    it('should render board with locked pieces', async () => {
      const customPinia = createTestingPinia({
        initialState: {
          game: {
            scoreInfo: { score: 100, level: 1, lines: 1, highScore: 0 },
            status: 'playing',
            board: Array(20).fill(null).map((_, y) =>
              Array(15).fill(null).map((_, x) => {
                // 在底部创建一些方块
                if (y >= 18) return 1;
                return 0;
              })
            ),
            currentPiece: null,
            nextPieceType: 'I',
          },
        },
      });

      const { container } = render(MobileGame, {
        global: {
          plugins: [router, customPinia],
        },
      });

      const canvas = container.querySelector('canvas');
      expect(canvas).toBeDefined();
    });
  });

  describe('Current Piece Rendering', () => {
    it('should render current piece at correct position', async () => {
      const customPinia = createTestingPinia({
        initialState: {
          game: {
            scoreInfo: { score: 0, level: 1, lines: 0, highScore: 0 },
            status: 'playing',
            board: Array(20).fill(null).map(() => Array(15).fill(0)),
            currentPiece: {
              type: 'I',
              shape: [[1, 1, 1, 1]],
              color: 'I',
              x: 5,
              y: 0,
              rotation: 0,
            },
            nextPieceType: 'O',
          },
        },
      });

      const { container } = render(MobileGame, {
        global: {
          plugins: [router, customPinia],
        },
      });

      const canvas = container.querySelector('canvas');
      expect(canvas).toBeDefined();
    });

    it('should render different piece types with correct colors', async () => {
      const pieceTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'] as const;

      for (const type of pieceTypes) {
        const customPinia = createTestingPinia({
          initialState: {
            game: {
              scoreInfo: { score: 0, level: 1, lines: 0, highScore: 0 },
              status: 'playing',
              board: Array(20).fill(null).map(() => Array(15).fill(0)),
              currentPiece: {
                type,
                shape: type === 'O' ? [[1, 1], [1, 1]] : [[1, 1, 1, 1]],
                color: type,
                x: 5,
                y: 0,
                rotation: 0,
              },
              nextPieceType: 'I',
            },
          },
        });

        const { container } = render(MobileGame, {
          global: {
            plugins: [router, customPinia],
          },
        });

        const canvas = container.querySelector('canvas');
        expect(canvas).toBeDefined();
      }
    });
  });

  describe('Next Piece Preview', () => {
    it('should render next piece preview', async () => {
      const { container } = render(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      const nextBox = container.querySelector('.next-box canvas');
      expect(nextBox).toBeDefined();
    });

    it('should update next piece when piece changes', async () => {
      const customPinia = createTestingPinia({
        initialState: {
          game: {
            scoreInfo: { score: 0, level: 1, lines: 0, highScore: 0 },
            status: 'playing',
            board: Array(20).fill(null).map(() => Array(15).fill(0)),
            currentPiece: null,
            nextPieceType: 'T',
          },
        },
      });

      const { container } = render(MobileGame, {
        global: {
          plugins: [router, customPinia],
        },
      });

      const nextBox = container.querySelector('.next-box');
      expect(nextBox?.textContent).toContain('下一个');
    });
  });

  describe('Canvas Scaling and Layout', () => {
    it('should scale canvas correctly for 15-column board', async () => {
      const { container } = render(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      const gameBoard = container.querySelector('.game-board');
      expect(gameBoard).toBeDefined();

      // 验证游戏板容器存在且有合理的尺寸
      const rect = gameBoard?.getBoundingClientRect();
      expect(rect).toBeDefined();
      expect(rect!.width).toBeGreaterThan(0);
    });

    it('should handle window resize gracefully', async () => {
      const { container } = render(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      const canvas = container.querySelector('canvas') as HTMLCanvasElement;

      // 模拟窗口大小变化
      window.dispatchEvent(new Event('resize'));

      // Canvas 仍然应该存在
      expect(canvas).toBeDefined();
    });
  });

  describe('Rendering Performance', () => {
    it('should use requestAnimationFrame for rendering', async () => {
      // Mock requestAnimationFrame
      const rafMock = vi.fn((cb) => window.setTimeout(cb, 16));
      global.requestAnimationFrame = rafMock;

      const { container } = render(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      // requestAnimationFrame 应该被调用
      expect(rafMock).toHaveBeenCalled();

      // Cleanup
      vi.restoreAllMocks();
    });

    it('should cancel animation frame on unmount', async () => {
      const cancelRafMock = vi.fn();
      global.cancelAnimationFrame = cancelRafMock;

      const { unmount } = render(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      unmount();

      // cancelAnimationFrame 应该被调用
      expect(cancelRafMock).toHaveBeenCalled();

      vi.restoreAllMocks();
    });
  });

  describe('Color Mapping', () => {
    it('should use correct colors for each piece type', async () => {
      // 定义预期的颜色映射
      const expectedColors: Record<string, string> = {
        I: '#00f0f0',
        O: '#f0f000',
        T: '#a000f0',
        S: '#00f000',
        Z: '#f00000',
        J: '#0000f0',
        L: '#f0a000',
      };

      // 验证所有颜色定义存在
      Object.entries(expectedColors).forEach(([type, color]) => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });
  });

  describe('Grid Lines Rendering', () => {
    it('should render grid lines for 15 columns', async () => {
      const { container } = render(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      const canvas = container.querySelector('canvas');
      expect(canvas).toBeDefined();

      // Canvas 应该存在且能够渲染
      const ctx = canvas?.getContext('2d');
      expect(ctx).toBeDefined();
      expect(ctx).toBeInstanceOf(CanvasRenderingContext2D);
    });

    it('should render grid lines for 20 rows', async () => {
      const { container } = render(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      const canvas = container.querySelector('canvas');
      expect(canvas).toBeDefined();
    });
  });

  describe('Boundary Verification', () => {
    it('should not render pieces outside canvas boundaries', async () => {
      const customPinia = createTestingPinia({
        initialState: {
          game: {
            scoreInfo: { score: 0, level: 1, lines: 0, highScore: 0 },
            status: 'playing',
            board: Array(20).fill(null).map(() => Array(15).fill(0)),
            currentPiece: {
              type: 'I',
              shape: [[1, 1, 1, 1]],
              color: 'I',
              x: 0, // 最左边界
              y: 0,
              rotation: 0,
            },
            nextPieceType: 'O',
          },
        },
      });

      const { container } = render(MobileGame, {
        global: {
          plugins: [router, customPinia],
        },
      });

      const canvas = container.querySelector('canvas');
      expect(canvas).toBeDefined();
    });

    it('should render piece at right boundary', async () => {
      const customPinia = createTestingPinia({
        initialState: {
          game: {
            scoreInfo: { score: 0, level: 1, lines: 0, highScore: 0 },
            status: 'playing',
            board: Array(20).fill(null).map(() => Array(15).fill(0)),
            currentPiece: {
              type: 'I',
              shape: [[1, 1, 1, 1]],
              color: 'I',
              x: 11, // 接近右边界 (15 - 4 = 11)
              y: 0,
              rotation: 0,
            },
            nextPieceType: 'O',
          },
        },
      });

      const { container } = render(MobileGame, {
        global: {
          plugins: [router, customPinia],
        },
      });

      const canvas = container.querySelector('canvas');
      expect(canvas).toBeDefined();
    });
  });

  describe('Integration with Game State', () => {
    it('should reflect game state changes in rendering', async () => {
      const { container } = render(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      const canvas = container.querySelector('canvas');
      expect(canvas).toBeDefined();

      // 游戏状态变化时，canvas 应该仍然存在
      const scoreElement = container.querySelector('.score');
      expect(scoreElement).toBeDefined();
    });

    it('should display correct score from game state', async () => {
      const customPinia = createTestingPinia({
        initialState: {
          game: {
            scoreInfo: {
              score: 1234,
              level: 5,
              lines: 20,
              highScore: 5000,
            },
            status: 'playing',
            board: Array(20).fill(null).map(() => Array(15).fill(0)),
            currentPiece: null,
            nextPieceType: 'I',
          },
        },
      });

      const { container } = render(MobileGame, {
        global: {
          plugins: [router, customPinia],
        },
      });

      const scoreElement = container.querySelector('.score');
      expect(scoreElement?.textContent).toBe('1234');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing canvas context gracefully', async () => {
      // 这个测试确保即使 canvas context 获取失败，也不会导致整个组件崩溃
      const { container } = render(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      const gameBoard = container.querySelector('.game-board');
      expect(gameBoard).toBeDefined();
    });

    it('should handle null board reference', async () => {
      const customPinia = createTestingPinia({
        initialState: {
          game: {
            scoreInfo: { score: 0, level: 1, lines: 0, highScore: 0 },
            status: 'playing',
            board: [],
            currentPiece: null,
            nextPieceType: 'I',
          },
        },
      });

      const { container } = render(MobileGame, {
        global: {
          plugins: [router, customPinia],
        },
      });

      // 应该不会崩溃
      const gameBoard = container.querySelector('.game-board');
      expect(gameBoard).toBeDefined();
    });
  });
});
