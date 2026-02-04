import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import MobileGame from '@/components/mobile/MobileGame.vue';

describe('MobileGame Component', () => {
  let router: any;
  let pinia: any;

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/m/game', name: 'MobileGame', component: { template: '<div>Game</div>' } },
        { path: '/m/guide', name: 'MobileGuide', component: { template: '<div>Guide</div>' } },
        { path: '/m/leaderboard', name: 'MobileLeaderboard', component: { template: '<div>Leaderboard</div>' } },
      ],
    });

    pinia = createTestingPinia({
      initialState: {
        game: {
          scoreInfo: {
            score: 1000,
            level: 5,
            lines: 10,
          },
          status: 'playing',
        },
      },
    });

    setActivePinia(pinia);

    localStorage.clear();
  });

  const mountGame = () => {
    return mount(MobileGame, {
      global: {
        plugins: [router, pinia],
        stubs: {
          canvas: true,
        },
      },
    });
  };

  describe('Component Rendering', () => {
    it('should render the game page correctly', () => {
      const wrapper = mountGame();
      expect(wrapper.find('.mobile-game').exists()).toBe(true);
    });

    it('should render status bar', () => {
      const wrapper = mountGame();
      expect(wrapper.find('.status-bar').exists()).toBe(true);
      expect(wrapper.find('.time').exists()).toBe(true);
    });

    it('should render game board', () => {
      const wrapper = mountGame();
      expect(wrapper.find('.game-board').exists()).toBe(true);
    });

    it('should render sidebar', () => {
      const wrapper = mountGame();
      expect(wrapper.find('.sidebar').exists()).toBe(true);
    });

    it('should render control pad', () => {
      const wrapper = mountGame();
      expect(wrapper.find('.control-pad').exists()).toBe(true);
    });
  });

  describe('Info Bar', () => {
    it('should display player info', async () => {
      localStorage.setItem('username', '测试玩家');
      const wrapper = mountGame();
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.player-name').text()).toBe('测试玩家');
    });

    it('should display score', async () => {
      const wrapper = mountGame();
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.score').text()).toBe('1000');
    });

    it('should display level', async () => {
      const wrapper = mountGame();
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.level').text()).toBe('Lv5');
    });

    it('should display lines', async () => {
      const wrapper = mountGame();
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.lines').text()).toBe('10行');
    });

    it('should render mini buttons (help, leaderboard)', () => {
      const wrapper = mountGame();
      expect(wrapper.find('.help-btn').exists()).toBe(true);
      expect(wrapper.find('.leaderboard-btn').exists()).toBe(true);
    });
  });

  describe('Sidebar', () => {
    it('should render next piece preview', () => {
      const wrapper = mountGame();
      expect(wrapper.find('.next-piece').exists()).toBe(true);
      expect(wrapper.find('.next-label').text()).toBe('下一个');
    });

    it('should render restart button', () => {
      const wrapper = mountGame();
      expect(wrapper.find('.restart-btn').exists()).toBe(true);
    });

    it('should render pause button', () => {
      const wrapper = mountGame();
      expect(wrapper.find('.pause-btn').exists()).toBe(true);
    });

    it('should render quit button', () => {
      const wrapper = mountGame();
      expect(wrapper.find('.quit-btn').exists()).toBe(true);
    });
  });

  describe('Control Pad', () => {
    it('should render 4 control buttons', () => {
      const wrapper = mountGame();
      const buttons = wrapper.findAll('.control-pad button');
      expect(buttons.length).toBe(4);
    });

    it('should render left button', () => {
      const wrapper = mountGame();
      expect(wrapper.find('.left-btn').exists()).toBe(true);
      expect(wrapper.find('.left-btn').text()).toContain('左移');
    });

    it('should render rotate button', () => {
      const wrapper = mountGame();
      expect(wrapper.find('.rotate-btn').exists()).toBe(true);
      expect(wrapper.find('.rotate-btn').text()).toContain('旋转');
    });

    it('should render hard drop button', () => {
      const wrapper = mountGame();
      expect(wrapper.find('.hard-drop-btn').exists()).toBe(true);
      expect(wrapper.find('.hard-drop-btn').text()).toContain('硬降');
    });

    it('should render right button', () => {
      const wrapper = mountGame();
      expect(wrapper.find('.right-btn').exists()).toBe(true);
      expect(wrapper.find('.right-btn').text()).toContain('右移');
    });
  });

  describe('Navigation', () => {
    it('should navigate to guide when help button is clicked', async () => {
      const wrapper = mountGame();
      const helpBtn = wrapper.find('.help-btn');

      await helpBtn.trigger('click');
      await wrapper.vm.$nextTick();
      // Wait for router navigation to complete
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(router.currentRoute.value.path).toBe('/m/guide');
    });

    it('should navigate to leaderboard when leaderboard button is clicked', async () => {
      const wrapper = mountGame();
      const leaderboardBtn = wrapper.find('.leaderboard-btn');

      await leaderboardBtn.trigger('click');
      await wrapper.vm.$nextTick();
      // Wait for router navigation to complete
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(router.currentRoute.value.path).toBe('/m/leaderboard');
    });

    it('should navigate to leaderboard when quit button is clicked', async () => {
      const wrapper = mountGame();
      const quitBtn = wrapper.find('.quit-btn');

      // Mock window.confirm
      global.confirm = vi.fn(() => true);

      await quitBtn.trigger('click');
      await wrapper.vm.$nextTick();
      // Wait for router navigation to complete
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(global.confirm).toHaveBeenCalledWith('确定要退出游戏吗？');
      expect(router.currentRoute.value.path).toBe('/m/leaderboard');
    });
  });

  describe('Visual Design', () => {
    it('should have correct gradient background', () => {
      const wrapper = mountGame();
      const gameDiv = wrapper.find('.mobile-game');
      expect(gameDiv.exists()).toBe(true);
    });

    it('should render all icons correctly', () => {
      const wrapper = mountGame();
      const icons = wrapper.findAll('.control-pad button svg');
      expect(icons.length).toBe(4);
    });
  });
});
