# 俄罗斯方块游戏测试套件

## 概述

这是一个全面的测试套件，用于确保俄罗斯方块游戏的质量和稳定性。测试覆盖了从单元测试到端到端测试的各个层面。

## 测试结构

```
tests/
├── services/                      # 服务层单元测试
│   ├── LineClearManager.test.ts   # 行消除管理器测试
│   └── GameEngine.test.ts         # 游戏引擎测试
├── integration/                   # 集成测试
│   └── canvas-rendering.test.ts   # Canvas渲染集成测试
├── e2e/                          # 端到端测试
│   └── mobile-game-complete.spec.ts # 完整游戏流程测试
├── visual/                       # 视觉回归测试
│   └── visual-regression.test.ts  # UI截图对比测试
├── components/                   # 组件测试
│   ├── MobileGame.spec.ts        # 游戏组件测试
│   ├── MobileLogin.spec.ts       # 登录组件测试
│   ├── MobileGuide.spec.ts       # 引导页组件测试
│   └── MobileLeaderboard.spec.ts # 排行榜组件测试
└── device.test.ts                # 设备检测工具测试
```

## 测试类型

### 1. 单元测试 (Unit Tests)

**位置**: `tests/services/`

**覆盖内容**:
- **LineClearManager.test.ts**: 测试多行消除逻辑
  - 单行消除
  - 多行消除（2行、3行、4行）
  - 不连续行消除
  - 边界情况（顶部行、底部行）
  - 分数计算
  - 15列配置支持

- **GameEngine.test.ts**: 测试游戏核心逻辑
  - 游戏初始化
  - 方块移动（左、右、下）
  - 边界检测和碰撞检测
  - 方块旋转和墙踢
  - 硬降功能
  - 方块锁定类型验证
  - 行消除检测
  - 分数计算
  - 等级系统
  - 游戏结束检测
  - 暂停/恢复功能
  - 15列配置测试

**运行命令**:
```bash
npm test -- tests/services
```

### 2. 集成测试 (Integration Tests)

**位置**: `tests/integration/`

**覆盖内容**:
- **canvas-rendering.test.ts**: 测试Canvas渲染逻辑
  - Canvas尺寸与游戏配置一致性
  - 空棋盘渲染
  - 带方块棋盘渲染
  - 当前方块渲染
  - 不同类型方块颜色映射
  - 下一个方块预览
  - Canvas缩放和布局
  - 边界验证
  - 与游戏状态集成
  - 错误处理

**运行命令**:
```bash
npm test -- tests/integration
```

### 3. 端到端测试 (E2E Tests)

**位置**: `tests/e2e/`

**覆盖内容**:
- **mobile-game-complete.spec.ts**: 测试完整用户流程
  - 登录 → 引导 → 游戏流程
  - 用户名验证和本地存储
  - 移动端控制按钮
  - 分数显示更新
  - 暂停/恢复/重新开始/退出
  - 多行消除场景
  - 边界检测
  - 游戏状态持久化
  - 响应式布局
  - 导航流程
  - 错误场景
  - 触摸事件处理

**运行命令**:
```bash
npm test -- tests/e2e
```

### 4. 视觉回归测试 (Visual Regression Tests)

**位置**: `tests/visual/`

**覆盖内容**:
- **visual-regression.test.ts**: UI截图对比测试
  - 登录页面渲染
  - 游戏页面布局
  - 游戏板尺寸验证（15:20比例）
  - 方块显示
  - 横屏模式
  - 硬降视觉效果
  - 边界情况显示
  - 填充棋盘
  - 行消除动画
  - UI颜色和样式
  - 触摸交互
  - 不同设备尺寸

**运行命令**:
```bash
# 首次运行（生成基准截图）
npx playwright test

# 后续运行（对比差异）
npx playwright test

# 更新基准截图
npx playwright test --update-snapshots

# 查看报告
npx playwright show-report
```

## 为什么之前的问题没被测试覆盖？

### 问题1: 方块移出游戏区域（列数不匹配）

**原因**: 缺少Canvas渲染配置一致性测试

**解决方案**: ✅ 已添加 `canvas-rendering.test.ts`，验证Canvas尺寸与游戏配置（15列）一致

### 问题2: 多行消除只消除一行

**原因**: 缺少LineClearManager的多行消除测试

**解决方案**: ✅ 已添加 `LineClearManager.test.ts`，完整测试2、3、4行消除场景

### 问题3: 硬降后方块消失（类型错误）

**原因**: 缺少方块锁定类型的验证测试

**解决方案**: ✅ 已添加 `GameEngine.test.ts`，测试所有7种方块类型的锁定

### 问题4: 底部行不可见

**原因**: 缺少Canvas高度计算测试

**解决方案**: ✅ 已添加 `canvas-rendering.test.ts`，验证Canvas宽高比

### 问题5: 移动端深紫色背景

**原因**: 缺少端到端测试验证实际显示效果

**解决方案**: ✅ 已添加 `mobile-game-complete.spec.ts` 和 `visual-regression.test.ts`

## 运行所有测试

### 运行Vitest测试（单元、集成、E2E）

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- LineClearManager

# 查看覆盖率
npm test -- --coverage
```

### 运行Playwright测试（视觉回归）

```bash
# 安装Playwright浏览器
npx playwright install

# 运行视觉测试
npx playwright test

# 仅运行Chromium
npx playwright test --project=chromium

# 调试模式
npx playwright test --debug
```

## 测试覆盖率目标

- **单元测试覆盖率**: ≥ 80%
- **关键路径覆盖率**: 100%
- **边界情况覆盖**: ≥ 90%

## 持续集成

测试应该在以下时机运行：
1. 每次代码提交前
2. Pull Request 创建时
3. 合并到主分支前

## 最佳实践

### 编写新测试时

1. **单元测试**: 测试单个函数/类的行为
2. **集成测试**: 测试多个组件协同工作
3. **E2E测试**: 测试用户完整使用流程
4. **视觉测试**: 验证UI渲染正确性

### 测试命名

```typescript
describe('Component/Feature Name', () => {
  describe('Specific Functionality', () => {
    it('should do X when Y', () => {
      // 测试代码
    });
  });
});
```

### 测试隔离

- 每个测试应该独立运行
- 使用 `beforeEach` 清理状态
- 避免测试间依赖

## 常见问题

### Q: 视觉测试失败怎么办？

A:
1. 检查是否是预期变化
2. 如果是预期变化，运行 `npx playwright test --update-snapshots`
3. 如果不是预期变化，修复代码

### Q: 测试运行太慢？

A:
1. 使用 `--parallel` 参数并行运行
2. 只运行相关的测试文件
3. 使用 `test.only` 专注单个测试

### Q: Canvas测试不稳定？

A: Canvas测试依赖浏览器环境，确保：
1. 使用 `waitForSelector` 等待元素
2. 使用 `waitForLoadState` 等待加载完成
3. 添加适当的超时时间

## 贡献指南

添加新功能时，请同时添加：

1. ✅ 单元测试（测试核心逻辑）
2. ✅ 集成测试（测试组件交互）
3. ✅ E2E测试（测试用户流程）
4. ✅ 视觉测试（如果涉及UI变化）

## 相关文档

- [Vitest文档](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright文档](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
