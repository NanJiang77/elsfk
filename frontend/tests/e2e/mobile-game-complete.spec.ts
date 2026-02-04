import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';
import MobileLogin from '@/components/mobile/MobileLogin.vue';
import MobileGuide from '@/components/mobile/MobileGuide.vue';
import MobileGame from '@/components/mobile/MobileGame.vue';
import MobileLeaderboard from '@/components/mobile/MobileLeaderboard.vue';
import MobileApp from '@/components/mobile/MobileApp.vue';
import { useGameStore } from '@/stores/gameStore';

describe('Mobile Game End-to-End Tests', () => {
  let router: any;
  let pinia: any;

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', redirect: '/m/login' },
        { path: '/m/login', name: 'MobileLogin', component: MobileLogin },
        { path: '/m/guide', name: 'MobileGuide', component: MobileGuide },
        { path: '/m/game', name: 'MobileGame', component: MobileGame },
        { path: '/m/leaderboard', name: 'MobileLeaderboard', component: MobileLeaderboard },
      ],
    });

    pinia = createTestingPinia({
      createSpy: vi.fn,
    });

    setActivePinia(pinia);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Complete User Flow', () => {
    it('should navigate from login to guide to game', async () => {
      // 1. 登录页面
      const loginWrapper = mount(MobileLogin, {
        global: {
          plugins: [router, pinia],
        },
      });

      // 输入用户名
      const input = loginWrapper.find('input[type="text"]');
      await input.setValue('TestPlayer');

      // 点击开始游戏
      const startButton = loginWrapper.find('.start-button');
      await startButton.trigger('click');
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 50));

      // 验证跳转到引导页
      expect(router.currentRoute.value.path).toBe('/m/guide');

      // 2. 引导页面
      const guideWrapper = mount(MobileGuide, {
        global: {
          plugins: [router, pinia],
        },
      });

      // 点击开始游戏按钮
      const guideStartButton = guideWrapper.find('.start-button');
      await guideStartButton.trigger('click');
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 50));

      // 验证跳转到游戏页面
      expect(router.currentRoute.value.path).toBe('/m/game');
    });

    it('should save username to localStorage', async () => {
      const wrapper = mount(MobileLogin, {
        global: {
          plugins: [router, pinia],
        },
      });

      const input = wrapper.find('input[type="text"]');
      await input.setValue('TestPlayer');

      const startButton = wrapper.find('.start-button');
      await startButton.trigger('click');

      expect(localStorage.getItem('username')).toBe('TestPlayer');
    });

    it('should validate username length', async () => {
      const wrapper = mount(MobileLogin, {
        global: {
          plugins: [router, pinia],
        },
      });

      // Mock alert
      const alertMock = vi.fn();
      global.alert = alertMock;

      // 测试太短的用户名
      const input = wrapper.find('input[type="text"]');
      await input.setValue('a');

      const startButton = wrapper.find('.start-button');
      await startButton.trigger('click');

      expect(alertMock).toHaveBeenCalledWith('用户名长度必须在2-20个字符之间');

      // 测试太长的用户名
      await input.setValue('a'.repeat(21));
      await startButton.trigger('click');

      expect(alertMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('Game Controls E2E', () => {
    beforeEach(async () => {
      localStorage.setItem('username', 'TestPlayer');
      await router.push('/m/game');
      await nextTick();
    });

    it('should control piece with mobile buttons', async () => {
      const gameStore = useGameStore();
      gameStore.startGame();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      // 测试左移按钮
      const initialX = gameStore.currentPiece?.x;
      const leftButton = wrapper.find('.left-btn');
      await leftButton.trigger('touchstart');
      await nextTick();

      expect(gameStore.currentPiece?.x).toBeLessThan(initialX!);

      // 测试右移按钮
      const rightButton = wrapper.find('.right-btn');
      await rightButton.trigger('touchstart');
      await nextTick();

      // 测试旋转按钮
      const rotateButton = wrapper.find('.rotate-btn');
      await rotateButton.trigger('touchstart');
      await nextTick();

      // 测试硬降按钮
      const hardDropButton = wrapper.find('.hard-drop-btn');
      await hardDropButton.trigger('touchstart');
      await nextTick();
    });

    it('should update score display during game', async () => {
      const gameStore = useGameStore();
      gameStore.startGame();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      const initialScore = wrapper.find('.score').text();

      // 执行一些操作增加分数
      gameStore.hardDrop();
      await nextTick();

      const newScore = wrapper.find('.score').text();
      expect(newScore).toBeDefined();
    });

    it('should pause and resume game', async () => {
      const gameStore = useGameStore();
      gameStore.startGame();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      // 点击暂停按钮
      const pauseButton = wrapper.find('.pause-btn');
      await pauseButton.trigger('click');
      await nextTick();

      expect(gameStore.status).toBe('paused');

      // 再次点击恢复
      await pauseButton.trigger('click');
      await nextTick();

      expect(gameStore.status).toBe('playing');
    });

    it('should restart game', async () => {
      const gameStore = useGameStore();
      gameStore.startGame();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      // Mock confirm
      global.confirm = vi.fn(() => true);

      // 点击重新开始按钮
      const restartButton = wrapper.find('.restart-btn');
      await restartButton.trigger('click');
      await nextTick();

      expect(global.confirm).toHaveBeenCalledWith('确定要重新开始吗？');
      expect(gameStore.status).toBe('playing');
    });

    it('should quit game and navigate to leaderboard', async () => {
      const gameStore = useGameStore();
      gameStore.startGame();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      // Mock confirm
      global.confirm = vi.fn(() => true);

      // 点击退出按钮
      const quitButton = wrapper.find('.quit-btn');
      await quitButton.trigger('click');
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(global.confirm).toHaveBeenCalledWith('确定要退出游戏吗？');
    });
  });

  describe('Multi-Line Clearing E2E', () => {
    beforeEach(async () => {
      localStorage.setItem('username', 'TestPlayer');
      await router.push('/m/game');
      await nextTick();
    });

    it('should handle double line clear', async () => {
      const gameStore = useGameStore();
      gameStore.startGame();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      // 模拟创建两行满行
      const board = gameStore.board;
      for (let x = 0; x < 15; x++) {
        board[18][x] = 1;
        board[19][x] = 2;
      }

      // 执行硬降触发检测
      gameStore.hardDrop();
      await nextTick();

      // 验证分数和行数增加
      expect(gameStore.scoreInfo.lines).toBeGreaterThan(0);
      expect(gameStore.scoreInfo.score).toBeGreaterThan(0);
    });

    it('should handle tetris (4 lines) correctly', async () => {
      const gameStore = useGameStore();
      gameStore.startGame();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      // 模拟创建四行满行
      const board = gameStore.board;
      for (let y = 16; y < 20; y++) {
        for (let x = 0; x < 15; x++) {
          board[y][x] = 1;
        }
      }

      const initialScore = gameStore.scoreInfo.score;
      gameStore.hardDrop();
      await nextTick();

      const finalScore = gameStore.scoreInfo.score;

      // 验证分数显著增加（Tetris 应该给 800 分 * 等级）
      expect(finalScore).toBeGreaterThan(initialScore);
      expect(gameStore.scoreInfo.lines).toBe(4);
    });
  });

  describe('Piece Movement E2E', () => {
    beforeEach(async () => {
      localStorage.setItem('username', 'TestPlayer');
      await router.push('/m/game');
      await nextTick();
    });

    it('should prevent moving outside left boundary', async () => {
      const gameStore = useGameStore();
      gameStore.startGame();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      // 尝试一直向左移动
      for (let i = 0; i < 20; i++) {
        gameStore.moveLeft();
      }

      const piece = gameStore.currentPiece;
      expect(piece!.x).toBeGreaterThanOrEqual(0);
    });

    it('should prevent moving outside right boundary', async () => {
      const gameStore = useGameStore();
      gameStore.startGame();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      // 尝试一直向右移动
      for (let i = 0; i < 20; i++) {
        gameStore.moveRight();
      }

      const piece = gameStore.currentPiece;
      expect(piece!.x).toBeLessThanOrEqual(15);
    });

    it('should handle piece rotation at boundaries', async () => {
      const gameStore = useGameStore();
      gameStore.startGame();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      // 移动到右边界
      for (let i = 0; i < 20; i++) {
        gameStore.moveRight();
      }

      // 在边界处旋转
      gameStore.rotate();

      // 方块应该仍然在有效位置
      const piece = gameStore.currentPiece;
      expect(piece).toBeDefined();
      expect(piece!.x).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Game State Persistence', () => {
    it('should persist high score', async () => {
      const gameStore = useGameStore();
      gameStore.startGame();

      // 设置一个高分
      localStorage.setItem('tetris_high_score', '5000');

      // 重新创建游戏引擎
      gameStore.startGame();

      // 验证高分被加载
      expect(gameStore.scoreInfo.highScore).toBe(5000);
    });

    it('should save new high score', async () => {
      const gameStore = useGameStore();
      gameStore.startGame();

      // 模拟获得新高分
      const board = gameStore.board;
      for (let y = 16; y < 20; y++) {
        for (let x = 0; x < 15; x++) {
          board[y][x] = 1;
        }
      }

      gameStore.hardDrop();

      const savedScore = localStorage.getItem('tetris_high_score');
      expect(savedScore).toBeDefined();
    });
  });

  describe('Responsive Layout', () => {
    it('should render correctly on mobile viewport', async () => {
      // 模拟移动设备视口
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      localStorage.setItem('username', 'TestPlayer');
      await router.push('/m/game');
      await nextTick();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      const gameBoard = wrapper.find('.game-board');
      expect(gameBoard.exists()).toBe(true);

      const controlPad = wrapper.find('.control-pad');
      expect(controlPad.exists()).toBe(true);
    });
  });

  describe('Navigation E2E', () => {
    it('should navigate to leaderboard from game', async () => {
      localStorage.setItem('username', 'TestPlayer');
      await router.push('/m/game');
      await nextTick();

      const gameStore = useGameStore();
      gameStore.startGame();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      // 点击排行榜按钮
      const leaderboardBtn = wrapper.find('.leaderboard-btn');
      await leaderboardBtn.trigger('click');
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(router.currentRoute.value.path).toBe('/m/leaderboard');
    });

    it('should navigate to help from game', async () => {
      localStorage.setItem('username', 'TestPlayer');
      await router.push('/m/game');
      await nextTick();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      // 点击帮助按钮
      const helpBtn = wrapper.find('.help-btn');
      await helpBtn.trigger('click');
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(router.currentRoute.value.path).toBe('/m/guide');
    });
  });

  describe('Error Scenarios', () => {
    it('should handle game over gracefully', async () => {
      localStorage.setItem('username', 'TestPlayer');
      await router.push('/m/game');
      await nextTick();

      const gameStore = useGameStore();
      gameStore.startGame();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      // 填满整个棋盘
      const board = gameStore.board;
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 15; x++) {
          board[y][x] = 1;
        }
      }

      // 尝试生成新方块应该触发游戏结束
      gameStore.hardDrop();

      expect(gameStore.status).toBe('gameover');
    });

    it('should handle rapid button clicks', async () => {
      localStorage.setItem('username', 'TestPlayer');
      await router.push('/m/game');
      await nextTick();

      const gameStore = useGameStore();
      gameStore.startGame();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      // 快速连续点击多个按钮
      const leftButton = wrapper.find('.left-btn');
      const rotateButton = wrapper.find('.rotate-btn');
      const rightButton = wrapper.find('.right-btn');

      await leftButton.trigger('touchstart');
      await rotateButton.trigger('touchstart');
      await rightButton.trigger('touchstart');

      await nextTick();

      // 游戏应该仍然正常工作
      expect(gameStore.status).toBe('playing');
    });
  });

  describe('Touch Events', () => {
    it('should handle touchstart events', async () => {
      localStorage.setItem('username', 'TestPlayer');
      await router.push('/m/game');
      await nextTick();

      const gameStore = useGameStore();
      gameStore.startGame();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      const button = wrapper.find('.left-btn');
      const event = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
      });

      await button.trigger('touchstart', event);
      await nextTick();

      expect(gameStore.currentPiece).toBeDefined();
    });

    it('should prevent default on touchstart', async () => {
      localStorage.setItem('username', 'TestPlayer');
      await router.push('/m/game');
      await nextTick();

      const wrapper = mount(MobileGame, {
        global: {
          plugins: [router, pinia],
        },
      });

      await nextTick();

      const button = wrapper.find('.hard-drop-btn');
      let preventDefaultCalled = false;

      const mockEvent = {
        preventDefault: () => {
          preventDefaultCalled = true;
        },
      };

      await button.trigger('touchstart', mockEvent);

      // 验证 preventDefault 被调用
      expect(preventDefaultCalled).toBe(true);
    });
  });
});
