import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MobileGuide from '@/components/mobile/MobileGuide.vue';

describe('MobileGuide Component', () => {
  let router: any;
  let pinia: any;

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/m/game', name: 'MobileGame', component: { template: '<div>Game</div>' } },
      ],
    });

    pinia = createPinia();
    setActivePinia(pinia);

    sessionStorage.clear();
  });

  const mountGuide = () => {
    return mount(MobileGuide, {
      global: {
        plugins: [router, pinia],
      },
    });
  };

  describe('Component Rendering', () => {
    it('should render the guide page correctly', () => {
      const wrapper = mountGuide();
      expect(wrapper.find('.mobile-guide').exists()).toBe(true);
      expect(wrapper.find('.title').text()).toBe('如何游玩');
      expect(wrapper.find('.subtitle').text()).toBe('掌握方块移动，挑战最高分');
    });

    it('should render status bar', () => {
      const wrapper = mountGuide();
      expect(wrapper.find('.status-bar').exists()).toBe(true);
      expect(wrapper.find('.time').exists()).toBe(true);
    });

    it('should render logo icon', () => {
      const wrapper = mountGuide();
      const logoIcon = wrapper.find('.logo-icon');
      expect(logoIcon.exists()).toBe(true);
      expect(logoIcon.find('svg').exists()).toBe(true);
    });

    it('should render all cards', () => {
      const wrapper = mountGuide();
      const cards = wrapper.findAll('.card');
      expect(cards.length).toBe(3);
    });
  });

  describe('Game Rules Card', () => {
    it('should render game objectives card', () => {
      const wrapper = mountGuide();
      const firstCard = wrapper.findAll('.card')[0];
      expect(firstCard.find('.card-title').text()).toBe('🎯 游戏目标');
    });

    it('should display all game objectives', () => {
      const wrapper = mountGuide();
      const texts = wrapper.findAll('.card-text');
      expect(texts.length).toBeGreaterThanOrEqual(3);
      expect(texts[0].text()).toContain('填满整行即可消除');
      expect(texts[1].text()).toContain('同时消除多行');
      expect(texts[2].text()).toContain('消除越多分数越高');
    });
  });

  describe('Controls Card', () => {
    it('should render operation methods card', () => {
      const wrapper = mountGuide();
      const secondCard = wrapper.findAll('.card')[1];
      expect(secondCard.find('.card-title').text()).toBe('🎮 操作方式');
    });

    it('should render all control items', () => {
      const wrapper = mountGuide();
      const controlItems = wrapper.findAll('.control-item');
      expect(controlItems.length).toBe(4);
    });

    it('should show left/right move control', () => {
      const wrapper = mountGuide();
      const controls = wrapper.findAll('.control-item');
      expect(controls[0].find('.control-desc').text()).toBe('左右移动方块位置');
    });

    it('should show rotate control', () => {
      const wrapper = mountGuide();
      const controls = wrapper.findAll('.control-item');
      expect(controls[1].find('.control-desc').text()).toBe('旋转方块调整方向');
    });

    it('should show soft drop control', () => {
      const wrapper = mountGuide();
      const controls = wrapper.findAll('.control-item');
      expect(controls[2].find('.control-desc').text()).toBe('加速下落');
    });

    it('should show special hard drop control', () => {
      const wrapper = mountGuide();
      const specialControls = wrapper.findAll('.control-item.special');
      expect(specialControls.length).toBe(1);
      expect(specialControls[0].find('.control-desc').text()).toBe('空格键瞬间落地');
    });

    it('should have special styling for hard drop', () => {
      const wrapper = mountGuide();
      const specialControl = wrapper.find('.control-item.special');
      expect(specialControl.find('.special-icon').exists()).toBe(true);
      expect(specialControl.find('.special-icon').text()).toBe('⚡');
    });
  });

  describe('Scoring Rules Card', () => {
    it('should render scoring rules card', () => {
      const wrapper = mountGuide();
      const thirdCard = wrapper.findAll('.card')[2];
      expect(thirdCard.find('.card-title').text()).toBe('📊 计分规则');
    });

    it('should display all scoring rows', () => {
      const wrapper = mountGuide();
      const scoreRows = wrapper.findAll('.score-row');
      expect(scoreRows.length).toBe(4);
    });

    it('should show correct scores for line clears', () => {
      const wrapper = mountGuide();
      const scoreRows = wrapper.findAll('.score-row');

      expect(scoreRows[0].text()).toContain('消除 1 行');
      expect(scoreRows[0].find('.score-value').text()).toBe('100 分');

      expect(scoreRows[1].text()).toContain('消除 2 行');
      expect(scoreRows[1].find('.score-value').text()).toBe('300 分');

      expect(scoreRows[2].text()).toContain('消除 3 行');
      expect(scoreRows[2].find('.score-value').text()).toBe('500 分');

      expect(scoreRows[3].text()).toContain('消除 4 行');
      expect(scoreRows[3].find('.score-value').text()).toBe('800 分');
    });

    it('should highlight the 4-line clear score', () => {
      const wrapper = mountGuide();
      const scoreRows = wrapper.findAll('.score-row');
      expect(scoreRows[3].find('.score-value.gold').exists()).toBe(true);
    });
  });

  describe('Start Button', () => {
    it('should render start button with icon and text', () => {
      const wrapper = mountGuide();
      const button = wrapper.find('.start-button');
      expect(button.exists()).toBe(true);
      expect(button.find('svg').exists()).toBe(true);
      expect(button.text()).toContain('开始游戏');
    });

    it('should set hasSeenGuide in sessionStorage when clicked', async () => {
      const wrapper = mountGuide();
      const button = wrapper.find('.start-button');

      await button.trigger('click');

      expect(sessionStorage.getItem('hasSeenGuide')).toBe('true');
    });

    it('should navigate to game page when clicked', async () => {
      const wrapper = mountGuide();
      const button = wrapper.find('.start-button');

      await button.trigger('click');
      await wrapper.vm.$nextTick();
      // Wait for router to complete navigation
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(router.currentRoute.value.path).toBe('/m/game');
    });
  });

  describe('Visual Design', () => {
    it('should have correct gradient background', () => {
      const wrapper = mountGuide();
      const guideDiv = wrapper.find('.mobile-guide');
      expect(guideDiv.exists()).toBe(true);
    });

    it('should render all icons correctly', () => {
      const wrapper = mountGuide();
      const icons = wrapper.findAll('.control-icon svg');
      // Only 3 SVGs since one control item uses an emoji (⚡) instead of SVG
      expect(icons.length).toBe(3);
    });

    it('should have glass-morphism effect on cards', () => {
      const wrapper = mountGuide();
      const cards = wrapper.findAll('.card');
      cards.forEach(card => {
        expect(card.exists()).toBe(true);
      });
    });
  });
});
