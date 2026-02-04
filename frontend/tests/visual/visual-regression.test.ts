/**
 * 视觉回归测试
 *
 * 这个文件包含用于检测UI渲染问题的视觉回归测试。
 * 运行这些测试需要：
 * 1. 安装 Playwright: npm install -D @playwright/test
 * 2. 运行测试: npx playwright test
 */

import { test, expect } from '@playwright/test';

describe('Mobile Game Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 设置移动设备视口
    await page.setViewportSize({ width: 375, height: 812 });

    // 导航到登录页
    await page.goto('http://localhost:5173/m/login');
  });

  test('should render login page correctly', async ({ page }) => {
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');

    // 截图并验证
    await expect(page).toHaveScreenshot('mobile-login.png');

    // 验证关键元素可见
    await expect(page.locator('.logo-icon')).toBeVisible();
    await expect(page.locator('.title')).toContainText('俄罗斯方块');
    await expect(page.locator('.start-button')).toBeVisible();
  });

  test('should render game page with correct board dimensions', async ({ page }) => {
    // 先登录
    await page.fill('input[type="text"]', 'TestPlayer');
    await page.click('.start-button');

    // 等待引导页加载
    await page.waitForLoadState('networkidle');
    await page.waitForURL('**/m/guide');

    // 点击开始游戏
    await page.click('.start-button');

    // 等待游戏页加载
    await page.waitForURL('**/m/game');
    await page.waitForLoadState('networkidle');

    // 截图游戏界面
    await expect(page).toHaveScreenshot('mobile-game-board.png', {
      maxDiffPixels: 100, // 允许小的差异
    });

    // 验证游戏板存在
    await expect(page.locator('.game-board')).toBeVisible();

    // 验证控制按钮存在
    await expect(page.locator('.left-btn')).toBeVisible();
    await expect(page.locator('.right-btn')).toBeVisible();
    await expect(page.locator('.rotate-btn')).toBeVisible();
    await expect(page.locator('.hard-drop-btn')).toBeVisible();

    // 验证信息栏
    await expect(page.locator('.score')).toBeVisible();
    await expect(page.locator('.level')).toBeVisible();
    await expect(page.locator('.lines')).toBeVisible();
  });

  test('should display all pieces correctly', async ({ page }) => {
    // 快速进入游戏
    await page.fill('input[type="text"]', 'TestPlayer');
    await page.click('.start-button');
    await page.waitForURL('**/m/guide');
    await page.click('.start-button');
    await page.waitForURL('**/m/game');
    await page.waitForLoadState('networkidle');

    // 等待canvas渲染
    await page.waitForSelector('canvas', { timeout: 5000 });

    // 截图游戏区域
    const canvas = page.locator('.game-board canvas');
    await expect(canvas).toBeVisible();

    // 验证canvas尺寸合理
    const box = await canvas.boundingBox();
    expect(box).toBeDefined();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);

    // 验证canvas宽高比符合15:20的游戏区域
    const ratio = box!.width / box!.height;
    expect(ratio).toBeCloseTo(0.75, 1); // 15/20 = 0.75
  });

  test('should render correctly in landscape mode', async ({ page }) => {
    // 切换到横屏
    await page.setViewportSize({ width: 812, height: 375 });

    await page.waitForLoadState('networkidle');

    // 截图横屏模式
    await expect(page).toHaveScreenshot('mobile-login-landscape.png');
  });

  test('should handle hard drop visual correctly', async ({ page }) => {
    // 进入游戏
    await page.fill('input[type="text"]', 'VisualTestPlayer');
    await page.click('.start-button');
    await page.waitForURL('**/m/guide');
    await page.click('.start-button');
    await page.waitForURL('**/m/game');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('canvas');

    // 截图初始状态
    await expect(page).toHaveScreenshot('game-before-hard-drop.png');

    // 点击硬降按钮
    await page.click('.hard-drop-btn');

    // 等待方块落地
    await page.waitForTimeout(500);

    // 截图硬降后状态
    await expect(page).toHaveScreenshot('game-after-hard-drop.png');
  });

  test('should show piece at boundaries correctly', async ({ page }) => {
    // 进入游戏
    await page.fill('input[type="text"]', 'BoundaryTest');
    await page.click('.start-button');
    await page.waitForURL('**/m/guide');
    await page.click('.start-button');
    await page.waitForURL('**/m/game');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('canvas');

    // 连续点击右移直到边界
    for (let i = 0; i < 10; i++) {
      await page.click('.right-btn');
      await page.waitForTimeout(50);
    }

    // 截图边界状态
    await expect(page).toHaveScreenshot('game-at-right-boundary.png');
  });

  test('should render filled board correctly', async ({ page }) => {
    // 进入游戏
    await page.fill('input[type="text"]', 'FillTest');
    await page.click('.start-button');
    await page.waitForURL('**/m/guide');
    await page.click('.start-button');
    await page.waitForURL('**/m/game');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('canvas');

    // 执行多次硬降来填充游戏板
    for (let i = 0; i < 10; i++) {
      await page.click('.hard-drop-btn');
      await page.waitForTimeout(300);

      // 偶尔移动一下以创建不同的填充模式
      if (i % 2 === 0) {
        await page.click('.left-btn');
        await page.waitForTimeout(50);
      } else {
        await page.click('.right-btn');
        await page.waitForTimeout(50);
      }
    }

    // 截图填充状态
    await expect(page).toHaveScreenshot('game-with-filled-board.png');
  });

  test('should display line clear animation', async ({ page }) => {
    // 进入游戏
    await page.fill('input[type="text"]', 'LineClearTest');
    await page.click('.start-button');
    await page.waitForURL('**/m/guide');
    await page.click('.start-button');
    await page.waitForURL('**/m/game');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('canvas');

    // 执行硬降以填充底部
    await page.click('.hard-drop-btn');
    await page.waitForTimeout(300);

    // 截图可能的消除状态
    await expect(page).toHaveScreenshot('game-during-line-clear.png');
  });

  test('should render all UI elements with correct colors', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // 检查背景渐变
    const loginDiv = page.locator('.mobile-login');
    await expect(loginDiv).toHaveCSS('background', /linear-gradient/);

    // 检查按钮样式
    const startButton = page.locator('.start-button');
    await expect(startButton).toHaveCSS('background', /linear-gradient.*00D9FF/);

    // 检查输入框样式
    const inputField = page.locator('.input-field');
    await expect(inputField).toBeVisible();
  });

  test('should handle touch interactions correctly', async ({ page }) => {
    // 进入游戏
    await page.fill('input[type="text"]', 'TouchTest');
    await page.click('.start-button');
    await page.waitForURL('**/m/guide');
    await page.click('.start-button');
    await page.waitForURL('**/m/game');
    await page.waitForLoadState('networkidle');

    // 模拟触摸事件
    const leftButton = page.locator('.left-btn');
    await leftButton.dispatchEvent('touchstart');
    await leftButton.dispatchEvent('touchend');

    await page.waitForTimeout(100);

    // 验证按钮仍然可点击
    await expect(leftButton).toBeVisible();
  });

  test('should render guide page correctly', async ({ page }) => {
    // 进入引导页
    await page.fill('input[type="text"]', 'GuideTest');
    await page.click('.start-button');
    await page.waitForURL('**/m/guide');
    await page.waitForLoadState('networkidle');

    // 截图引导页
    await expect(page).toHaveScreenshot('mobile-guide.png');

    // 验证引导页内容
    await expect(page.locator('.title')).toContainText('游戏说明');
    await expect(page.locator('.start-button')).toBeVisible();
  });

  test('should handle different screen sizes', async ({ page }) => {
    // 测试不同的设备尺寸
    const devices = [
      { width: 320, height: 568 },  // iPhone SE
      { width: 375, height: 812 },  // iPhone X
      { width: 414, height: 896 },  // iPhone Max
    ];

    for (const device of devices) {
      await page.setViewportSize(device);
      await page.waitForLoadState('networkidle');

      // 每个尺寸都应该正常渲染
      await expect(page.locator('.mobile-login')).toBeVisible();

      // 验证登录表单可见
      await expect(page.locator('.logo-section')).toBeVisible();
      await expect(page.locator('.login-card')).toBeVisible();
    }
  });
});

describe('Desktop Visual Regression Tests', () => {
  test('should render desktop game page correctly', async ({ page }) => {
    // 设置桌面视口
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:5173/');

    // 等待页面加载
    await page.waitForLoadState('networkidle');

    // 截图桌面版本
    await expect(page).toHaveScreenshot('desktop-game.png');

    // 验证桌面元素
    await expect(page.locator('.app-header')).toBeVisible();
    await expect(page.locator('.app-footer')).toBeVisible();
  });
});

/**
 * 使用说明:
 *
 * 1. 首次运行测试时，Playwright 会生成基准截图
 * 2. 后续运行会与基准截图对比
 * 3. 如果UI有预期变化，更新基准截图:
 *    npx playwright test --update-snapshots
 *
 * 4. 查看截图差异报告:
 *    npx playwright show-report
 *
 * 5. 只运行视觉测试:
 *    npx playwright test --project=chromium visual-regression.test.ts
 */
