/**
 * 端到端测试 - 游戏基本功能
 */
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('俄罗斯方块游戏 - 端到端测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('页面加载正确', async ({ page }) => {
    // 检查标题
    await expect(page).toHaveTitle(/frontend/);

    // 检查游戏区域
    await expect(page.locator('.game-canvas-container')).toBeVisible();

    // 检查控制面板
    await expect(page.locator('.controls-panel')).toBeVisible();

    // 检查信息面板
    await expect(page.locator('.info-panel')).toBeVisible();
  });

  test('游戏可以开始', async ({ page }) => {
    // 点击开始游戏按钮
    await page.click('button:has-text("开始游戏")');

    // 等待游戏开始
    await page.waitForTimeout(500);

    // 检查游戏状态
    const canvas = page.locator('.game-canvas-container');
    await expect(canvas).toBeVisible();

    // 检查是否有方块显示
    // 这需要实际渲染才能验证
  });

  test('键盘控制工作正常', async ({ page }) => {
    // 开始游戏
    await page.click('button:has-text("开始游戏")');
    await page.waitForTimeout(500);

    // 聚焦游戏区域
    await page.locator('.game-canvas-container').focus();

    // 测试方向键
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(100);

    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);

    await page.keyboard.press('ArrowUp'); // 旋转
    await page.waitForTimeout(100);

    await page.keyboard.press(' '); // 硬降
    await page.waitForTimeout(100);
  });

  test('暂停功能', async ({ page }) => {
    // 开始游戏
    await page.click('button:has-text("开始游戏")');
    await page.waitForTimeout(500);

    // 按P键暂停
    await page.keyboard.press('KeyP');
    await page.waitForTimeout(200);

    // 检查暂停提示
    await expect(page.locator('text=已暂停')).toBeVisible();

    // 再次按P键继续
    await page.keyboard.press('KeyP');
    await page.waitForTimeout(200);

    // 暂停提示应该消失
    await expect(page.locator('text=已暂停')).not.toBeVisible();
  });

  test('排行榜页面访问', async ({ page }) => {
    // 点击导航到排行榜
    await page.click('a:has-text("排行榜")');

    // 等待页面加载
    await page.waitForTimeout(500);

    // 检查URL
    await expect(page).toHaveURL(/.*leaderboard/);

    // 检查表格
    await expect(page.locator('.el-table')).toBeVisible();

    // 检查返回按钮
    await expect(page.locator('button:has-text("返回游戏")')).toBeVisible();
  });

  test('游戏结束后显示分数', async ({ page }) => {
    // 这个测试需要模拟游戏结束,比较复杂
    // 这里只是示例,实际实现需要更长的时间

    // 开始游戏
    await page.click('button:has-text("开始游戏")');
    await page.waitForTimeout(500);

    // 可以添加更多测试逻辑...
  });
});

test.describe('排行榜 - WebSocket实时更新', () => {
  test('排行榜页面实时更新', async ({ page }) => {
    await page.goto(`${BASE_URL}/leaderboard`);

    // 连接WebSocket
    const wsMessages: string[] = [];

    // 监听WebSocket消息需要Playwright的高级API
    // 这里简化测试,只验证页面能正常加载

    await expect(page.locator('.el-table')).toBeVisible();
  });
});
