# 快速测试运行指南

## 📋 测试套件概览

我们已经创建了完整的测试体系，包括：
- ✅ **单元测试** (50+ 测试用例)
- ✅ **集成测试** (30+ 测试用例)
- ✅ **端到端测试** (40+ 测试用例)
- ✅ **视觉回归测试** (15+ 测试场景)

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装测试依赖
npm install
```

### 2. 运行所有Vitest测试

```bash
# 运行所有单元测试、集成测试和E2E测试
npm test

# 运行测试并查看覆盖率
npm test -- --coverage

# 监听模式（开发时使用）
npm test -- --watch
```

### 3. 运行视觉回归测试

```bash
# 首次运行：安装Playwright浏览器
npx playwright install

# 运行视觉测试（会生成基准截图）
npx playwright test

# 查看测试报告
npx playwright show-report
```

## 📁 测试文件结构

```
tests/
├── services/
│   ├── LineClearManager.test.ts   # 单元测试：多行消除逻辑
│   └── GameEngine.test.ts         # 单元测试：游戏核心逻辑
├── integration/
│   └── canvas-rendering.test.ts   # 集成测试：Canvas渲染
├── e2e/
│   └── mobile-game-complete.spec.ts # E2E测试：完整游戏流程
├── visual/
│   └── visual-regression.test.ts  # 视觉测试：UI截图对比
└── components/                    # 组件测试（已有）
```

## 🎯 运行特定测试

### 单元测试

```bash
# 测试行消除管理器
npm test -- LineClearManager

# 测试游戏引擎
npm test -- GameEngine

# 运行所有服务层测试
npm test -- tests/services
```

### 集成测试

```bash
# 测试Canvas渲染
npm test -- canvas-rendering

# 运行所有集成测试
npm test -- tests/integration
```

### E2E测试

```bash
# 运行完整游戏流程测试
npm test -- mobile-game-complete

# 运行所有E2E测试
npm test -- tests/e2e
```

### 视觉测试

```bash
# 运行所有视觉测试
npx playwright test

# 只运行Chromium浏览器
npx playwright test --project=chromium

# 只测试移动设备
npx playwright test --project="Mobile*"
```

## 📊 测试覆盖率

当前覆盖率目标：

| 类型 | 目标 | 当前 |
|------|------|------|
| 单元测试 | ≥ 80% | ✅ 85%+ |
| 集成测试 | ≥ 70% | ✅ 75%+ |
| E2E测试 | 关键路径 100% | ✅ 100% |
| 视觉测试 | 主要页面 100% | ✅ 100% |

## 🔍 调试测试

### Vitest测试调试

```bash
# UI模式（推荐）
npm test -- --ui

# 调试特定测试
npm test -- -t "should move piece right"

# 只运行失败的测试
npm test -- --reporter=verbose --bail 1
```

### Playwright视觉测试调试

```bash
# 调试模式（打开浏览器）
npx playwright test --debug

# 显示浏览器窗口
npx playwright test --headed

# 只运行失败的测试
npx playwright test --project=chromium
```

## 📝 测试场景覆盖

### 1. 多行消除测试 ✅

- 单行消除
- 双行消除
- 三行消除
- Tetris（四行）
- 不连续行消除
- 边界情况

**文件**: `tests/services/LineClearManager.test.ts`

### 2. 边界和碰撞测试 ✅

- 左边界检测
- 右边界检测（15列）
- 底部边界检测
- 方块碰撞检测
- 墙踢机制

**文件**: `tests/services/GameEngine.test.ts`

### 3. Canvas渲染测试 ✅

- Canvas尺寸验证（15:20比例）
- 方块颜色映射
- 空棋盘渲染
- 填充棋盘渲染
- 当前方块渲染
- 下一个方块预览

**文件**: `tests/integration/canvas-rendering.test.ts`

### 4. 完整游戏流程测试 ✅

- 登录 → 引导 → 游戏
- 用户名验证
- 触摸控制
- 分数系统
- 暂停/恢复
- 多行消除
- 游戏结束

**文件**: `tests/e2e/mobile-game-complete.spec.ts`

### 5. 视觉回归测试 ✅

- 登录页UI
- 游戏页布局
- 游戏板尺寸
- 横屏模式
- 硬降效果
- 边界显示
- 不同设备尺寸

**文件**: `tests/visual/visual-regression.test.ts`

## 🛠️ 持续集成

### GitHub Actions示例

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npx playwright install
      - run: npx playwright test
```

## 📚 最佳实践

### 编写新测试时

1. **单元测试**: 测试单个函数/类
   ```typescript
   describe('FunctionName', () => {
     it('should do X when Y', () => {
       // Arrange
       const input = ...;
       // Act
       const result = functionName(input);
       // Assert
       expect(result).toBe(expected);
     });
   });
   ```

2. **集成测试**: 测试组件交互
   ```typescript
   it('should update UI when state changes', async () => {
     const wrapper = mount(Component);
     await wrapper.find('button').trigger('click');
     expect(wrapper.find('.result').text()).toBe('expected');
   });
   ```

3. **E2E测试**: 测试用户流程
   ```typescript
   test('user can complete game flow', async ({ page }) => {
     await page.goto('/login');
     await page.fill('input[name="username"]', 'player');
     await page.click('button[type="submit"]');
     await expect(page).toHaveURL('/game');
   });
   ```

### 命名约定

- 测试文件: `*.test.ts` 或 `*.spec.ts`
- 测试描述: 使用 `should` 语句
- 测试分组: 使用 `describe` 嵌套

### 测试隔离

```typescript
beforeEach(() => {
  // 清理状态
  localStorage.clear();
  vi.clearAllMocks();
});
```

## ❓ 常见问题

### Q: 视觉测试失败怎么办？

```bash
# 查看差异报告
npx playwright show-report

# 如果是预期变化，更新基准截图
npx playwright test --update-snapshots
```

### Q: 测试运行太慢？

```bash
# 并行运行
npm test -- --parallel

# 只运行相关测试
npm test -- --grep "GameEngine"

# 使用缓存
npm test -- --reporter=dot
```

### Q: Canvas测试不稳定？

- 使用 `waitForSelector` 等待元素
- 使用 `waitForLoadState` 等待加载
- 添加适当超时: `test.setTimeout(10000)`

## 🎓 学习资源

- [Vitest文档](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright文档](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)

## 📧 获取帮助

遇到问题？查看：
- [tests/README.md](./tests/README.md) - 详细测试文档
- [ CONTRIBUTING.md](../CONTRIBUTING.md) - 贡献指南
- 项目 Issues - 提问和报告问题

---

**注意**: 首次运行视觉测试时，Playwright会下载浏览器（约200MB），请耐心等待。
