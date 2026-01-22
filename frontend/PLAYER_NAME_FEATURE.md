# 用户名功能说明

## 功能概述

实现了完整的用户名管理系统，支持用户名输入、持久化存储和排行榜显示。

## 核心功能

### 1. 用户名输入对话框
- **首次访问**：用户首次打开页面时，点击"开始游戏"会弹出对话框要求输入用户名
- **验证规则**：
  - 最小长度：2个字符
  - 最大长度：20个字符
  - 自动trim空格
  - 支持中英文、数字等字符

### 2. 持久化存储
- **存储方式**：使用浏览器 `localStorage`
- **存储键名**：`tetris_player_name`
- **生命周期**：永久保存（除非用户清除浏览器数据）
- **跨会话**：关闭浏览器后重新打开，用户名依然存在

### 3. 智能识别
- **已登录用户**：如果localStorage中已有用户名，直接开始游戏，无需再次输入
- **游戏内重新开始**：同一会话内重新开始游戏，不需要再次输入用户名
- **排行榜显示**：游戏记录自动关联当前用户名

### 4. 用户名显示
- **游戏界面**：右侧信息面板显示当前玩家名称
- **排行榜**：显示所有玩家的名称、分数、等级等信息

## 技术实现

### 文件结构
```
frontend/src/
├── components/
│   ├── PlayerNameDialog.vue       # 用户名输入对话框组件
│   └── InfoPanel.vue               # 更新显示玩家名称
├── composables/
│   └── usePlayerName.ts            # 用户名管理composable
├── views/
│   └── GamePage.vue                # 集成用户名功能
└── test-player-name.html           # 功能测试页面
```

### 核心代码

#### 1. usePlayerName Composable
```typescript
// 自动加载用户名
const { playerName, isNameLoaded, savePlayerName } = usePlayerName();

// 保存用户名到localStorage
savePlayerName('玩家名字');

// 读取用户名
console.log(playerName.value); // '玩家名字'
```

#### 2. GamePage 集成
```typescript
// 开始游戏时检查用户名
const handleStartGame = () => {
  if (!playerName.value) {
    showNameDialog.value = true; // 显示输入对话框
    return;
  }
  startGame();
};

// 用户名确认后自动开始游戏
const handleNameConfirm = (name: string) => {
  showNameDialog.value = false;
  savePlayerName(name);
  startGame();
};
```

## 使用流程

### 首次使用
1. 用户访问游戏页面
2. 点击"开始游戏"按钮
3. 弹出用户名输入对话框
4. 输入用户名（2-20个字符）
5. 点击"开始游戏"或按Enter键
6. 用户名保存到localStorage
7. 游戏开始

### 后续使用
1. 用户访问游戏页面
2. 系统自动从localStorage读取用户名
3. 点击"开始游戏"直接进入游戏
4. 无需再次输入用户名

### 跨会话使用
1. 用户关闭浏览器
2. 重新打开浏览器访问游戏页面
3. 系统自动加载之前的用户名
4. 直接开始游戏

## 测试方法

### 方法1：使用测试页面
```bash
# 在浏览器中打开
open frontend/test-player-name.html
```

测试功能：
- 保存用户名
- 读取用户名
- 清除用户名
- 测试持久化（刷新页面后验证）

### 方法2：实际游戏测试
1. 打开游戏页面 `http://localhost:5173`
2. 点击"开始游戏"
3. 输入用户名（如："测试玩家123"）
4. 玩一局游戏
5. 查看排行榜，确认用户名正确显示
6. 刷新页面
7. 再次点击"开始游戏"，应该直接进入游戏（无需输入用户名）
8. 关闭浏览器，重新打开，验证用户名依然存在

### 方法3：浏览器开发者工具
1. 按F12打开开发者工具
2. 切换到"Application"或"存储"标签
3. 查看"Local Storage"
4. 找到 `tetris_player_name` 键
5. 查看对应的值（用户名）

## 排行榜集成

### 游戏记录保存
游戏结束时，自动使用当前用户名保存记录：
```typescript
await gameApi.saveGame({
  player_name: playerName.value,  // 使用当前用户名
  score: scoreInfo.value.score,
  level: scoreInfo.value.level,
  lines: scoreInfo.value.lines,
  play_time: stats.value.playTime,
});
```

### 排行榜显示
排行榜页面显示所有玩家的记录：
```vue
<el-table-column prop="player_name" label="玩家" width="150" />
<el-table-column prop="score" label="分数" width="120" align="center" sortable />
```

## 数据隐私

### 存储位置
- **客户端存储**：浏览器 localStorage
- **服务器存储**：后端数据库（游戏记录）

### 隐私说明
- 用户名仅用于游戏记录和排行榜展示
- 不收集任何个人信息
- 用户可以随时清除浏览器数据
- 不同浏览器/设备之间的用户名不互通

## 扩展性

### 未来可扩展功能
1. **用户头像**：允许用户上传或选择头像
2. **用户统计**：显示个人统计数据（总游戏次数、平均分等）
3. **用户设置**：允许修改用户名
4. **多设备同步**：使用账号系统实现跨设备同步
5. **好友系统**：添加好友并查看好友排行

## 故障排除

### 问题1：用户名没有保存
**可能原因**：
- 浏览器禁用了localStorage
- 隐身模式可能限制localStorage

**解决方法**：
- 检查浏览器设置，允许localStorage
- 退出隐身模式

### 问题2：每次都要求输入用户名
**可能原因**：
- localStorage被清除
- 使用了不同的浏览器或设备

**解决方法**：
- 正常现象，重新输入用户名即可
- 每个浏览器/设备的localStorage是独立的

### 问题3：排行榜显示错误用户名
**可能原因**：
- 游戏记录保存时使用了错误的用户名

**解决方法**：
- 清除localStorage：`localStorage.removeItem('tetris_player_name')`
- 重新开始游戏并输入正确的用户名

## 总结

✅ **已完成功能**：
- 用户名输入对话框
- localStorage持久化存储
- 智能识别已登录用户
- 游戏界面显示玩家名称
- 排行榜显示玩家名称
- 自动关联游戏记录

✅ **用户体验**：
- 首次使用需要输入用户名
- 后续使用自动识别
- 跨会话保持登录状态
- 无需重复输入

✅ **技术特点**：
- 使用composable实现逻辑复用
- localStorage实现持久化
- 自动加载和保存
- 友好的UI提示

用户名功能已完全集成到游戏系统中，提供了良好的用户体验和数据持久化能力！
