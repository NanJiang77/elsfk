# 🎮 俄罗斯方块游戏 (Tetris Game)

一个完整的、功能丰富的俄罗斯方块游戏，采用现代化的前后端分离架构开发。

![Vue 3](https://img.shields.io/badge/Vue-3.4+-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.128+-009688?style=flat&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.13+-3776AB?style=flat&logo=python&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

## ✨ 特性

### 🎯 核心功能
- ✅ 经典俄罗斯方块游戏玩法
- ✅ 7种标准方块（I, O, T, S, Z, J, L）
- ✅ 7-Bag随机化系统
- ✅ 流畅的Canvas渲染（60fps）
- ✅ 幽灵方块预览
- ✅ 暂停/继续功能
- ✅ 实时排行榜（WebSocket）

### 🎮 游戏特色
- ✅ **智能计分系统**
  - 消除1行: 100分
  - 消除2行: 300分
  - 消除3行: 500分
  - 消除4行: 800分
- ✅ **等级系统**
  - 每消除20行升一级
  - 非线性速度递减
  - 等级越高下落越快
- ✅ **用户名系统**
  - 持久化存储
  - 跨会话保持登录
  - 游戏记录关联用户

### 🕹️ 操作控制
- ✅ **全局快捷键**（不区分大小写）
  - `←` `→` : 左右移动
  - `↑` : 旋转方块
  - `↓` : 加速下落
  - `空格` : 瞬间落地（硬降）
  - `P/p` : 暂停/继续
  - `R/r` : 重新开始

### 🎨 界面设计
- ✅ 现代化UI设计
- ✅ 响应式布局
- ✅ 实时信息面板
- ✅ 下一方块预览
- ✅ 操作说明面板

## 🏗️ 技术架构

### 前端技术栈
- **框架**: Vue 3.4+ (Composition API)
- **语言**: TypeScript 5.0+
- **构建**: Vite 5.0+
- **状态管理**: Pinia 2.1+
- **UI库**: Element Plus 2.4+
- **渲染**: HTML5 Canvas

### 后端技术栈
- **框架**: FastAPI 0.128+
- **语言**: Python 3.13+
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM**: SQLAlchemy 2.0+
- **数据验证**: Pydantic 2.11+
- **实时通信**: WebSocket

### 项目结构
```
elsfk/
├── frontend/           # 前端Vue 3项目
│   ├── src/
│   │   ├── components/    # Vue组件
│   │   ├── views/        # 页面视图
│   │   ├── stores/       # Pinia状态管理
│   │   ├── services/     # API服务
│   │   ├── composables/  # Composable函数
│   │   └── types/        # TypeScript类型定义
│   └── package.json
├── backend/            # 后端FastAPI项目
│   ├── app/
│   │   ├── api/        # API路由
│   │   ├── models/     # 数据模型
│   │   ├── services/   # 业务逻辑
│   │   └── main.py     # 应用入口
│   ├── tests/          # 单元测试
│   └── requirements.txt
└── docs/              # 项目文档
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- Python 3.10+
- npm 或 yarn

### 本地部署

#### 1. 克隆项目
```bash
git clone https://github.com/yourusername/elsfk.git
cd elsfk
```

#### 2. 启动后端
```bash
cd backend

# 创建虚拟环境（可选）
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑.env文件，配置数据库等

# 启动服务
uvicorn app.main:app --reload --port 8000
```

#### 3. 启动前端
```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或构建生产版本
npm run build
npm run preview
```

#### 4. 访问应用
- 前端: http://localhost:5173
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

## 🐳 Docker部署

### 使用Docker Compose（推荐）

```bash
# 一键启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 单独构建镜像

```bash
# 后端
docker build -t tetris-backend:latest ./backend
docker run -d -p 8000:8000 tetris-backend:latest

# 前端
docker build -t tetris-frontend:latest ./frontend
docker run -d -p 80:80 tetris-frontend:latest
```

详细部署文档请查看 [DEPLOYMENT.md](DEPLOYMENT.md)

## 📖 文档

- [需求分析](docs/01-需求分析.md) - 项目需求规格说明
- [页面设计](docs/02-页面设计.md) - UI/UX设计文档
- [架构设计](docs/03-架构设计.md) - 系统架构设计
- [部署文档](DEPLOYMENT.md) - 部署运维指南
- [项目总结](PROJECT_SUMMARY.md) - 项目总结报告
- [测试报告](FINAL_TEST_REPORT_V2.md) - 完整测试报告

## 🧪 测试

### 后端测试
```bash
cd backend
pytest tests/ -v
```

### 前端测试
```bash
cd frontend
npm run test
```

### 测试覆盖率
- 后端单元测试: 37/37 ✅ (100%)
- API集成测试: 6/6 ✅ (100%)
- 功能测试: 9/9 ✅ (100%)

## 🎯 功能演示

### 游戏界面
- 10×20标准方块网格
- 流畅的Canvas渲染
- 下一方块预览
- 实时分数和等级显示

### 排行榜
- Top N玩家排行
- WebSocket实时更新
- 新纪录即时推送
- 玩家统计信息

### 用户系统
- 用户名输入验证（2-20字符）
- localStorage持久化
- 跨会话保持登录
- 游戏记录关联

## 🔧 开发指南

### 项目命令

**前端**:
```bash
npm run dev       # 开发服务器
npm run build     # 生产构建
npm run preview   # 预览构建
npm run lint      # 代码检查
```

**后端**:
```bash
uvicorn app.main:app --reload  # 开发服务器
pytest tests/ -v               # 运行测试
pytest --cov=app              # 测试覆盖率
```

### 代码规范
- TypeScript严格模式
- ESLint代码检查
- Prettier代码格式化
- 遵循Vue 3最佳实践

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- Vue.js 团队
- FastAPI 团队
- Element Plus 团队
- 所有贡献者

## 📮 联系方式

- 项目主页: https://github.com/yourusername/elsfk
- 问题反馈: https://github.com/yourusername/elsfk/issues

---

**开发时间**: 2026-01-20 ~ 2026-01-22
**当前版本**: v2.0
**项目状态**: ✅ 生产就绪

⭐ 如果这个项目对你有帮助，请给个Star！
