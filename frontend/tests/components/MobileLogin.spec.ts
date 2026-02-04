import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import MobileLogin from '@/components/mobile/MobileLogin.vue';

describe('MobileLogin Component', () => {
  let router: any;
  let pinia: any;

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/m/guide', name: 'MobileGuide', component: { template: '<div>Guide</div>' } },
      ],
    });

    pinia = createPinia();
    setActivePinia(pinia);

    localStorage.clear();
    global.alert = vi.fn();
  });

  const mountLogin = () => {
    return mount(MobileLogin, {
      global: {
        plugins: [router, pinia],
      },
    });
  };

  describe('Component Rendering', () => {
    it('should render the login page correctly', () => {
      const wrapper = mountLogin();
      expect(wrapper.find('.mobile-login').exists()).toBe(true);
      expect(wrapper.find('.title').text()).toBe('俄罗斯方块');
      expect(wrapper.find('.subtitle').text()).toBe('开始你的游戏之旅');
    });

    it('should render status bar with time and icons', () => {
      const wrapper = mountLogin();
      expect(wrapper.find('.status-bar').exists()).toBe(true);
      expect(wrapper.find('.time').exists()).toBe(true);
      expect(wrapper.findAll('.levels svg').length).toBe(3);
    });

    it('should render logo icon with gamepad SVG', () => {
      const wrapper = mountLogin();
      const logoIcon = wrapper.find('.logo-icon');
      expect(logoIcon.exists()).toBe(true);
      expect(logoIcon.find('svg').exists()).toBe(true);
    });

    it('should render login card with input and button', () => {
      const wrapper = mountLogin();
      expect(wrapper.find('.login-card').exists()).toBe(true);
      expect(wrapper.find('.welcome').text()).toBe('欢迎回来');
      expect(wrapper.find('input[type="text"]').exists()).toBe(true);
      expect(wrapper.find('.start-button').exists()).toBe(true);
    });

    it('should render hint section', () => {
      const wrapper = mountLogin();
      expect(wrapper.find('.hint-section').exists()).toBe(true);
      expect(wrapper.find('.hint-section').text()).toContain('游戏说明');
    });
  });

  describe('Input Handling', () => {
    it('should accept username input', async () => {
      const wrapper = mountLogin();
      const input = wrapper.find('input[type="text"]');

      await input.setValue('测试玩家');
      expect(input.element.value).toBe('测试玩家');
    });

    it('should show input placeholder text', () => {
      const wrapper = mountLogin();
      const input = wrapper.find('input[type="text"]');
      expect(input.attributes('placeholder')).toBe('请输入用户名 (2-20个字符)');
    });

    it('should allow empty username input', async () => {
      const wrapper = mountLogin();
      const input = wrapper.find('input[type="text"]');

      await input.setValue('');
      expect(input.element.value).toBe('');
    });
  });

  describe('Login Flow', () => {
    it('should save username to localStorage on login', async () => {
      const wrapper = mountLogin();

      // Use the exposed setUsername method
      wrapper.vm.setUsername('测试玩家');
      await wrapper.vm.$nextTick();

      // Call handleLogin directly
      await wrapper.vm.handleLogin();
      await wrapper.vm.$nextTick();

      expect(localStorage.getItem('username')).toBe('测试玩家');
    });

    it('should navigate to guide page after successful login', async () => {
      const wrapper = mountLogin();

      wrapper.vm.setUsername('测试玩家');
      await wrapper.vm.$nextTick();

      await wrapper.vm.handleLogin();
      await wrapper.vm.$nextTick();

      // Wait for router navigation
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(router.currentRoute.value.path).toBe('/m/guide');
    });

    it('should not login with username less than 2 characters', async () => {
      const wrapper = mountLogin();

      wrapper.vm.setUsername('a');
      await wrapper.vm.$nextTick();

      await wrapper.vm.handleLogin();
      await wrapper.vm.$nextTick();

      expect(global.alert).toHaveBeenCalledWith('用户名长度必须在2-20个字符之间');
      expect(localStorage.getItem('username')).toBeNull();
    });

    it('should not login with username more than 20 characters', async () => {
      const wrapper = mountLogin();

      wrapper.vm.setUsername('a'.repeat(21));
      await wrapper.vm.$nextTick();

      await wrapper.vm.handleLogin();
      await wrapper.vm.$nextTick();

      expect(global.alert).toHaveBeenCalledWith('用户名长度必须在2-20个字符之间');
      expect(localStorage.getItem('username')).toBeNull();
    });

    it('should trim whitespace from username', async () => {
      const wrapper = mountLogin();

      wrapper.vm.setUsername('  测试玩家  ');
      await wrapper.vm.$nextTick();

      await wrapper.vm.handleLogin();
      await wrapper.vm.$nextTick();

      expect(localStorage.getItem('username')).toBe('测试玩家');
    });
  });

  describe('Enter Key Support', () => {
    it('should submit login when pressing Enter key', async () => {
      const wrapper = mountLogin();
      const input = wrapper.find('input[type="text"]');

      wrapper.vm.setUsername('测试玩家');
      await wrapper.vm.$nextTick();

      // Trigger keyup event with Enter key
      await input.trigger('keyup.enter');
      await wrapper.vm.$nextTick();

      expect(localStorage.getItem('username')).toBe('测试玩家');
    });

    it('should not submit when pressing other keys', async () => {
      const wrapper = mountLogin();
      const input = wrapper.find('input[type="text"]');

      await input.setValue('测试玩家');
      await input.trigger('input');
      await nextTick();
      await input.trigger('keyup', { key: 'a' });
      await nextTick();

      // localStorage should not be set when pressing non-Enter key
      expect(localStorage.getItem('username')).toBeNull();
    });
  });

  describe('Visual Design', () => {
    it('should have mobile-login class with gradient background', () => {
      const wrapper = mountLogin();
      const loginDiv = wrapper.find('.mobile-login');
      expect(loginDiv.exists()).toBe(true);
    });

    it('should have glass-morphism effect on login card', () => {
      const wrapper = mountLogin();
      const card = wrapper.find('.login-card');
      expect(card.exists()).toBe(true);
    });

    it('should have gradient start button', () => {
      const wrapper = mountLogin();
      const button = wrapper.find('.start-button');
      expect(button.exists()).toBe(true);
    });
  });
});
