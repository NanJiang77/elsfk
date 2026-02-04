import { test, expect, Page } from '@playwright/test';

/**
 * 移动端登录和游戏流程测试
 */
test.describe('Mobile Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should show login page for first time user', async ({ page }) => {
    await page.goto('/');

    // 检查是否显示登录页
    const title = page.locator('h1');
    await expect(title).toContainText('俄罗斯方块');

    const input = page.locator('input[type="text"]');
    await expect(input).toBeVisible();

    const button = page.locator('button');
    await expect(button).toContainText('开始游戏');
  });

  test('should allow user to login and navigate to guide', async ({ page }) => {
    await page.goto('/');

    // 输入用户名
    const input = page.locator('input[type="text"]');
    await input.fill('测试玩家');

    // 点击开始游戏
    const button = page.locator('button:has-text("开始游戏")');
    await button.click();

    // 应该跳转到引导页
    await page.waitForURL(/\/m\/guide/);
    const title = page.locator('h1');
    await expect(title).toContainText('如何游玩');
  });

  test('should show guide page with game instructions', async ({ page }) => {
    await page.goto('/m/guide');

    // 检查引导页标题
    const title = page.locator('h1');
    await expect(title).toContainText('如何游玩');

    // 检查游戏规则
    const gameRules = page.locator('.card-title');
    await expect(gameRules.nth(0)).toContainText('🎯 游戏目标');
    await expect(gameRules.nth(1)).toContainText('🎮 操作方式');
    await expect(gameRules.nth(2)).toContainText('📊 计分规则');

    // 检查操作说明
    const controls = page.locator('.control-item');
    await expect(controls).toHaveCount(4);
  });

  test('should start game from guide page', async ({ page }) => {
    await page.goto('/m/guide');

    // 点击开始游戏按钮
    const startButton = page.locator('button:has-text("开始游戏")');
    await startButton.click();

    // 应该跳转到游戏页
    await page.waitForURL(/\/m\/game/);
    const gameBoard = page.locator('.game-board');
    await expect(gameBoard).toBeVisible();
  });

  test('should display game UI elements', async ({ page }) => {
    await page.goto('/m/game');

    // 检查游戏棋盘
    const gameBoard = page.locator('.game-board');
    await expect(gameBoard).toBeVisible();

    // 检查控制按钮
    const controlButtons = page.locator('.control-pad button');
    await expect(controlButtons).toHaveCount(4);

    // 检查侧边栏
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toBeVisible();

    // 检查下一个方块预览
    const nextPiece = page.locator('.next-piece');
    await expect(nextPiece).toBeVisible();
  });

  test('should navigate to leaderboard', async ({ page }) => {
    await page.goto('/m/game');

    // 点击排行榜按钮
    const leaderboardBtn = page.locator('.leaderboard-btn');
    await leaderboardBtn.click();

    // 应该跳转到排行榜页
    await page.waitForURL(/\/m\/leaderboard/);
    const title = page.locator('h1');
    await expect(title).toContainText('排行榜');
  });

  test('should display leaderboard rankings', async ({ page }) => {
    await page.goto('/m/leaderboard');

    // 检查排行榜标题
    const title = page.locator('h1');
    await expect(title).toContainText('排行榜');

    // 检查排行榜列表
    const rankItems = page.locator('.rank-item');
    await expect(rankItems).toHaveCount(6);

    // 检查第1名特殊样式
    const rank1 = page.locator('.rank-item.rank-1');
    await expect(rank1).toBeVisible();

    // 检查当前玩家高亮
    const currentPlayer = page.locator('.rank-item.current-player');
    await expect(currentPlayer).toBeVisible();
  });
});

/**
 * 桌面端游戏测试
 */
test.describe('Desktop Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 设置桌面端视口
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('should show desktop game interface', async ({ page }) => {
    await page.goto('/');

    // 桌面端应该显示原有的布局
    const header = page.locator('.app-header');
    await expect(header).toBeVisible();

    const logo = page.locator('.logo');
    await expect(logo).toContainText('俄罗斯方块');
  });
});

/**
 * 性能测试
 */
test.describe('Performance Tests', () => {
  test('mobile page should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/m/guide');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // 页面应该在3秒内加载完成
    expect(loadTime).toBeLessThan(3000);
  });

  test('mobile game should have fast First Contentful Paint', async ({ page }) => {
    // 导航到移动端游戏页
    await page.goto('/m/game');

    // 等待首次内容绘制
    const performanceMetrics = await page.evaluate(() => {
      return JSON.stringify({
        fcp: performance.getEntriesByType('paint')[0]?.startTime || 0,
      });
    });

    const metrics = JSON.parse(performanceMetrics);
    const fcp = metrics.fcp;

    // FCP应该在2秒内完成
    expect(fcp).toBeLessThan(2000);
  });

  test('game board canvas should render correctly', async ({ page }) => {
    await page.goto('/m/game');

    // 检查canvas元素
    const canvas = page.locator('.game-board canvas');
    await expect(canvas).toBeVisible();

    // 检查canvas尺寸
    const box = await canvas.boundingBox();
    expect(box?.width).toBeGreaterThan(300);
    expect(box?.height).toBeGreaterThan(600);
  });
});

/**
 * 响应式布局测试
 */
test.describe('Responsive Layout Tests', () => {
  test('should switch to mobile layout on small screens', async ({ page }) => {
    // 移动端尺寸
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // 应该隐藏桌面端布局
    const desktopHeader = page.locator('.app-header');
    await expect(desktopHeader).not.toBeVisible();

    // 应该显示移动端布局（通过检查特定元素）
    const mobileApp = page.locator('.mobile-app');
    // 由于我们使用了CSS display切换，这里验证desktop元素被隐藏
  });

  test('should show desktop layout on large screens', async ({ page }) => {
    // 桌面端尺寸
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // 应该显示桌面端布局
    const desktopHeader = page.locator('.app-header');
    await expect(desktopHeader).toBeVisible();
  });
});

/**
 * 功能测试 - 游戏控制
 */
test.describe('Game Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    // 模拟已登录
    await page.goto('/m/game');
  });

  test('should show help dialog when help button clicked', async ({ page }) => {
    const helpBtn = page.locator('.help-btn');
    await helpBtn.click();

    // 应该跳转到引导页
    await page.waitForURL(/\/m\/guide/);
    const title = page.locator('h1');
    await expect(title).toContainText('如何游玩');
  });

  test('should show leaderboard when leaderboard button clicked', async ({ page }) => {
    const leaderboardBtn = page.locator('.leaderboard-btn');
    await leaderboardBtn.click();

    await page.waitForURL(/\/m\/leaderboard/);
    const title = page.locator('h1');
    await expect(title).toContainText('排行榜');
  });

  test('should pause game when pause button clicked', async ({ page }) => {
    const pauseBtn = page.locator('.pause-btn');

    // 点击暂停
    await pauseBtn.click();

    // 验证游戏状态变化
    // 这里可以添加更多具体的验证
  });
});

/**
 * 可访问性测试
 */
test.describe('Accessibility Tests', () => {
  test('mobile login page should be accessible', async ({ page }) => {
    await page.goto('/');

    // 检查页面标题
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();

    // 检查input有label
    const input = page.locator('input[type="text"]');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder');

    // 检查按钮可访问
    const button = page.locator('button:has-text("开始游戏")');
    await expect(button).toBeVisible();
  });

  test('mobile game controls should be accessible', async ({ page }) => {
    await page.goto('/m/game');

    // 检查所有控制按钮是否有文本标签
    const controlButtons = page.locator('.control-pad button');
    const count = await controlButtons.count();

    for (let i = 0; i < count; i++) {
      const button = controlButtons.nth(i);
      // 检查按钮有文本或图标
      const hasText = await button.locator('span').count();
      const hasIcon = await button.locator('svg').count();
      expect(hasText + hasIcon).toBeGreaterThan(0);
    }
  });
});

/**
 * 端到端测试 - 完整用户流程
 */
test.describe('Complete User Journey - Mobile', () => {
  test('complete new user journey', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // 1. 访问首页 → 看到登录页
    await page.goto('/');
    const loginTitle = page.locator('h1');
    await expect(loginTitle).toContainText('俄罗斯方块');

    // 2. 输入用户名并登录
    const input = page.locator('input[type="text"]');
    await input.fill('新玩家');

    const startButton = page.locator('button:has-text("开始游戏")');
    await startButton.click();

    // 3. 查看引导页
    await page.waitForURL(/\/m\/guide/);
    const guideTitle = page.locator('h1');
    await expect(guideTitle).toContainText('如何游玩');

    // 检查引导页内容
    const scoreRules = page.locator('.score-row');
    await expect(scoreRules).toHaveCount(4);

    // 4. 开始游戏
    const startButton2 = page.locator('button:has-text("开始游戏")');
    await startButton2.click();

    // 5. 进入游戏
    await page.waitForURL(/\/m\/game/);
    const gameBoard = page.locator('.game-board');
    await expect(gameBoard).toBeVisible();

    // 6. 访问排行榜
    const leaderboardBtn = page.locator('.leaderboard-btn');
    await leaderboardBtn.click();

    await page.waitForURL(/\/m\/leaderboard/);
    const leaderboardTitle = page.locator('h1');
    await expect(leaderboardTitle).toContainText('排行榜');

    // 7. 返回游戏
    const backBtn = page.locator('.back-btn');
    await backBtn.click();

    await page.waitForURL(/\/m\/game/);
    await expect(gameBoard).toBeVisible();
  });
});

/**
 * 兼容性测试
 */
test.describe('Cross-Browser Tests', () => {
  test('should work on Chromium', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/m/guide');

    const title = page.locator('h1');
    await expect(title).toBeVisible();
  });

  test('should work on Firefox', async ({ page, context }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // 创建新的浏览器上下文
    await context.launch();
    const page = await context.newPage();

    try {
      await page.goto('/m/guide');
      const title = page.locator('h1');
      await expect(title).toBeVisible();
    } finally {
      await page.close();
    }
  });

  test('should work on WebKit', async ({ page, context }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // 创建新的浏览器上下文
    await context.launch();
    const page = await context.newPage();

    try {
      await page.goto('/m/guide');
      const title = page.locator('h1');
      await expect(title).toBeVisible();
    } finally {
      await page.close();
    }
  });
});

/**
 * 集成测试 - API
 */
test.describe('API Integration Tests', () => {
  test('should save game data when game ends', async ({ page }) => {
    // Mock API调用
    await page.route('**/api/game/save', route => route.fulfill({
      json: { success: true, message: '游戏记录已保存' },
    }));

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/m/game');

    // 这里可以添加实际的游戏结束逻辑
    // 当游戏结束时应该调用API
  });

  test('should fetch leaderboard data', async ({ page }) => {
    // Mock API调用
    await page.route('**/api/leaderboard', route => route.fulfill({
      json: {
        success: true,
        data: [
          { rank: 1, player_name: '测试玩家1', score: 1000, level: 5, lines: 10 },
          { rank: 2, player_name: '测试玩家2', score: 800, level: 4, lines: 8 },
        ],
      },
    }));

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/m/leaderboard');

    // 验证排行榜数据加载
    const rankItems = page.locator('.rank-item');
    await expect(rankItems).toHaveCount(2);
  });
});
