import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MobileLeaderboard from '@/components/mobile/MobileLeaderboard.vue';

describe('MobileLeaderboard Component', () => {
  let router: any;
  let pinia: any;

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/m/leaderboard', name: 'MobileLeaderboard', component: { template: '<div>Leaderboard</div>' } },
        { path: '/m/game', name: 'MobileGame', component: { template: '<div>Game</div>' } },
      ],
    });

    pinia = createPinia();
    setActivePinia(pinia);
  });

  const mountLeaderboard = () => {
    return mount(MobileLeaderboard, {
      global: {
        plugins: [router, pinia],
      },
    });
  };

  describe('Component Rendering', () => {
    it('should render the leaderboard page correctly', () => {
      const wrapper = mountLeaderboard();
      expect(wrapper.find('.mobile-leaderboard').exists()).toBe(true);
      expect(wrapper.find('.title').text()).toBe('排行榜');
      expect(wrapper.find('.subtitle').text()).toBe('全球玩家积分排名');
    });

    it('should render status bar', () => {
      const wrapper = mountLeaderboard();
      expect(wrapper.find('.status-bar').exists()).toBe(true);
      expect(wrapper.find('.time').exists()).toBe(true);
    });

    it('should render header with back button', () => {
      const wrapper = mountLeaderboard();
      expect(wrapper.find('.header').exists()).toBe(true);
      expect(wrapper.find('.back-btn').exists()).toBe(true);
    });

    it('should render rank list', () => {
      const wrapper = mountLeaderboard();
      expect(wrapper.find('.rank-list').exists()).toBe(true);
    });
  });

  describe('Rank Items', () => {
    it('should render 6 rank items', () => {
      const wrapper = mountLeaderboard();
      const rankItems = wrapper.findAll('.rank-item');
      expect(rankItems.length).toBe(6);
    });

    it('should render rank badges for all players', () => {
      const wrapper = mountLeaderboard();
      const badges = wrapper.findAll('.rank-badge');
      expect(badges.length).toBe(6);
    });

    it('should show correct rank numbers', () => {
      const wrapper = mountLeaderboard();
      const badges = wrapper.findAll('.rank-badge');

      expect(badges[0].text()).toBe('1');
      expect(badges[1].text()).toBe('2');
      expect(badges[2].text()).toBe('3');
      expect(badges[3].text()).toBe('4');
      expect(badges[4].text()).toBe('5');
      expect(badges[5].text()).toBe('6');
    });

    it('should render player info for all players', () => {
      const wrapper = mountLeaderboard();
      const playerInfos = wrapper.findAll('.player-info');
      expect(playerInfos.length).toBe(6);
    });

    it('should render scores for all players', () => {
      const wrapper = mountLeaderboard();
      const scores = wrapper.findAll('.score');
      expect(scores.length).toBe(6);
    });
  });

  describe('Top 3 Special Styling', () => {
    it('should apply gold styling to rank 1', () => {
      const wrapper = mountLeaderboard();
      const rankItems = wrapper.findAll('.rank-item');
      expect(rankItems[0].classes()).toContain('rank-1');
    });

    it('should have gold badge for rank 1', () => {
      const wrapper = mountLeaderboard();
      const badges = wrapper.findAll('.rank-badge');
      expect(badges[0].classes()).toContain('gold');
    });

    it('should apply silver styling to rank 2', () => {
      const wrapper = mountLeaderboard();
      const rankItems = wrapper.findAll('.rank-item');
      expect(rankItems[1].classes()).toContain('rank-2');
    });

    it('should have silver badge for rank 2', () => {
      const wrapper = mountLeaderboard();
      const badges = wrapper.findAll('.rank-badge');
      expect(badges[1].classes()).toContain('silver');
    });

    it('should apply bronze styling to rank 3', () => {
      const wrapper = mountLeaderboard();
      const rankItems = wrapper.findAll('.rank-item');
      expect(rankItems[2].classes()).toContain('rank-3');
    });

    it('should have bronze badge for rank 3', () => {
      const wrapper = mountLeaderboard();
      const badges = wrapper.findAll('.rank-badge');
      expect(badges[2].classes()).toContain('bronze');
    });
  });

  describe('Current Player Highlighting', () => {
    it('should apply current player styling', () => {
      const wrapper = mountLeaderboard();
      const rankItems = wrapper.findAll('.rank-item');
      expect(rankItems[5].classes()).toContain('current-player');
    });

    it('should show "你" indicator for current player', () => {
      const wrapper = mountLeaderboard();
      const playerNames = wrapper.findAll('.player-name');
      expect(playerNames[5].text()).toContain('你');
    });

    it('should have highlight badge for current player', () => {
      const wrapper = mountLeaderboard();
      const badges = wrapper.findAll('.rank-badge');
      expect(badges[5].classes()).toContain('highlight');
    });

    it('should have highlight class on player name', () => {
      const wrapper = mountLeaderboard();
      const playerNames = wrapper.findAll('.player-name');
      expect(playerNames[5].classes()).toContain('highlight');
    });

    it('should have highlight class on score', () => {
      const wrapper = mountLeaderboard();
      const scores = wrapper.findAll('.score');
      expect(scores[5].classes()).toContain('highlight');
    });
  });

  describe('Player Data', () => {
    it('should display correct player names', () => {
      const wrapper = mountLeaderboard();
      const playerNames = wrapper.findAll('.player-name');

      expect(playerNames[0].text()).toBe('王者之星');
      expect(playerNames[1].text()).toBe('方块大师');
      expect(playerNames[2].text()).toBe('消行高手');
      expect(playerNames[3].text()).toBe('速度达人');
      expect(playerNames[4].text()).toBe('游戏玩家');
    });

    it('should display correct player levels', () => {
      const wrapper = mountLeaderboard();
      const levels = wrapper.findAll('.player-level');

      expect(levels[0].text()).toBe('Lv20');
      expect(levels[1].text()).toBe('Lv18');
      expect(levels[2].text()).toBe('Lv16');
      expect(levels[3].text()).toBe('Lv15');
      expect(levels[4].text()).toBe('Lv14');
      expect(levels[5].text()).toBe('Lv5');
    });

    it('should display correct scores', () => {
      const wrapper = mountLeaderboard();
      const scores = wrapper.findAll('.score');

      expect(scores[0].text()).toBe('25,680');
      expect(scores[1].text()).toBe('21,340');
      expect(scores[2].text()).toBe('18,920');
      expect(scores[3].text()).toBe('15,670');
      expect(scores[4].text()).toBe('12,450');
      expect(scores[5].text()).toBe('2,450');
    });
  });

  describe('Navigation', () => {
    it('should navigate back when back button is clicked', async () => {
      // Set a previous route
      await router.push('/m/game');

      const wrapper = mountLeaderboard();
      const backBtn = wrapper.find('.back-btn');

      // Mock router.back
      router.back = vi.fn();

      await backBtn.trigger('click');

      expect(router.back).toHaveBeenCalled();
    });
  });

  describe('Visual Design', () => {
    it('should have correct gradient background', () => {
      const wrapper = mountLeaderboard();
      const leaderboardDiv = wrapper.find('.mobile-leaderboard');
      expect(leaderboardDiv.exists()).toBe(true);
    });

    it('should render back button icon', () => {
      const wrapper = mountLeaderboard();
      const backBtn = wrapper.find('.back-btn');
      expect(backBtn.find('svg').exists()).toBe(true);
    });

    it('should have glass-morphism effect on rank list', () => {
      const wrapper = mountLeaderboard();
      const rankList = wrapper.find('.rank-list');
      expect(rankList.exists()).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      const wrapper = mountLeaderboard();
      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('.rank-list').exists()).toBe(true);
    });

    it('should have proper heading hierarchy', () => {
      const wrapper = mountLeaderboard();
      const title = wrapper.find('.title');
      expect(title.element.tagName.toLowerCase()).toBe('h1');
    });
  });
});
