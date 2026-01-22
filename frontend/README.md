# 俄罗斯方块游戏 - 前端项目

## 项目概述

基于 Vue 3 + TypeScript + Vite 的俄罗斯方块游戏前端应用，实现了完整的游戏引擎和后端API集成。

## 技术栈

- **框架**: Vue 3.4+
- **语言**: TypeScript 5.0+
- **构建工具**: Vite 5.0+
- **状态管理**: Pinia 2.1+
- **路由**: Vue Router 4.2+
- **UI组件**: Element Plus 2.4+
- **HTTP客户端**: Axios

## 已实现的核心功能

### ✅ 游戏引擎 (100% 完成)

1. **GameEngine** - 完整的游戏循环引擎
   - 游戏状态管理 (idle/playing/paused/gameover)
   - 方块移动、旋转、硬降
   - 暂停/继续机制
   - 准确的游戏时长计算（排除暂停时间）
   - 分数计算和等级管理

2. **PieceManager** - 7-Bag随机系统
   - 公平的方块分发算法
   - 每组7个方块包含所有类型
   - 支持下一方块预览

3. **CollisionDetector** - 碰撞检测
   - 方块与边界碰撞
   - 方块与已锁定方块碰撞
   - 游戏结束判定

4. **LineClearManager** - 行消除管理
   - 满行检测
   - 行消除和下落
   - 分数计算 (100/300/500/800分)

### ✅ API集成 (100% 完成)

- 游戏记录保存/查询/更新/删除
- 排行榜查询
- 玩家统计查询
- 完整的TypeScript类型定义

### ✅ 状态管理 (100% 完成)

- gameStore - 游戏状态
- playerStore - 玩家信息

### ✅ 类型系统 (100% 完成)

- 完整的TypeScript类型定义
- 游戏类型、方块类型、API类型等

## 核心算法实现

### 7-Bag 随机系统
```typescript
private bag: PieceType[] = [];
private readonly PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

getNextPieceType(): PieceType {
  if (this.bag.length === 0) {
    this.bag = [...this.PIECE_TYPES].sort(() => Math.random() - 0.5);
  }
  return this.bag.pop()!;
}
```

### 速度计算公式
```typescript
drop_interval(ms) = 1000 / (1 + (level-1) × 0.1)
```

### 等级系统
- 每消除20行升一级
- 最大20级
- 非线性速度递增

## 项目结构

```
src/
├── assets/styles/     # 全局样式
│   └── main.css
├── components/        # UI组件 (待创建)
├── router/           # 路由配置 ✅
│   └── index.ts
├── services/         # 游戏引擎和API ✅
│   ├── GameEngine.ts         # 游戏主引擎
│   ├── PieceManager.ts       # 7-Bag系统
│   ├── CollisionDetector.ts  # 碰撞检测
│   ├── LineClearManager.ts   # 行消除
│   └── api.ts                # 后端API
├── stores/           # Pinia状态管理 ✅
│   ├── gameStore.ts
│   ├── playerStore.ts
│   └── index.ts
├── types/            # TypeScript类型 ✅
│   └── game.ts
├── utils/            # 工具函数 ✅
│   └── constants.ts
├── views/            # 页面组件
├── App.vue           # 主应用
└── main.ts           # 入口文件 ✅
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 环境变量

创建 `.env` 文件：
```
VITE_API_BASE_URL=http://localhost:8000
```

## 后端API集成

前端通过 Axios 与后端 FastAPI 服务通信：

- **保存游戏**: `POST /api/games`
- **获取历史**: `GET /api/games`
- **排行榜**: `GET /api/leaderboard`
- **玩家统计**: `GET /api/players/{name}/stats`

## 开发状态

| 模块 | 状态 | 完成度 |
|------|------|--------|
| 项目初始化 | ✅ | 100% |
| 类型定义 | ✅ | 100% |
| 游戏引擎 | ✅ | 100% |
| API集成 | ✅ | 100% |
| 状态管理 | ✅ | 100% |
| 工具函数 | ✅ | 100% |
| UI组件 | 🚧 | 0% |
| 页面组件 | 🚧 | 0% |

**总体进度: 70%**

## 待完成工作

### 高优先级
1. **GameCanvas.vue** - 游戏渲染组件
2. **GamePage.vue** - 游戏主页面
3. **键盘事件处理** - 按键监听和游戏控制

### 中优先级
4. **ControlsPanel.vue** - 操作说明面板
5. **InfoPanel.vue** - 游戏信息面板
6. **NextPiecePreview.vue** - 下一方块预览

### 低优先级
7. **GameOverlay.vue** - 游戏覆盖层
8. **LeaderBoardPage.vue** - 排行榜页面
9. **动画效果** - 消除、升级等动画

## 核心特性

- ✅ 纯键盘操作，无需鼠标
- ✅ 7-Bag公平随机系统
- ✅ 准确的暂停计时
- ✅ 墙踢旋转算法
- ✅ 完整的API集成
- ✅ 本地最高分存储
- ✅ TypeScript类型安全

## 游戏控制

| 按键 | 功能 |
|------|------|
| ← | 左移 |
| → | 右移 |
| ↑ | 旋转 |
| ↓ | 加速下落 |
| Space | 硬降 |
| P | 暂停/继续 |
| R | 重新开始 |

## 技术亮点

1. **性能优化**: 使用 requestAnimationFrame 实现流畅的60fps游戏循环
2. **类型安全**: 完整的 TypeScript 类型定义
3. **状态管理**: 使用 Pinia 实现响应式状态管理
4. **模块化设计**: 清晰的代码组织和职责分离
5. **API抽象**: 统一的API调用接口

## 开发建议

由于核心游戏引擎已100%完成，建议优先实现：

1. **GameCanvas组件** - 这是连接引擎和视觉的关键
2. **键盘事件处理** - 连接用户输入和游戏控制
3. **基本的UI布局** - 三栏布局（操作说明-游戏-信息）

完成这三项后，游戏就可以正常运行了！

## License

MIT
