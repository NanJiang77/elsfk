# 俄罗斯方块游戏后端 API

基于 FastAPI 的俄罗斯方块游戏后端服务，提供游戏记录管理、排行榜等功能。

## 技术栈

- **框架**: FastAPI 0.128+
- **数据库**: SQLite + SQLAlchemy 2.0+
- **数据验证**: Pydantic 2.11+
- **测试**: pytest 7.4+

## 功能特性

- ✅ 游戏记录保存
- ✅ 游戏历史记录查询（支持分页）
- ✅ 排行榜 Top N
- ✅ 根据ID查询游戏记录
- ✅ 更新游戏记录
- ✅ 删除游戏记录
- ✅ 玩家统计信息
- ✅ 高分判断（进入前10）
- ✅ 输入验证（玩家名称、分数、等级等）
- ✅ 完整的异常处理和日志记录

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并根据需要修改：

```bash
cp .env.example .env
```

### 3. 启动服务

```bash
# 开发模式（自动重载）
uvicorn app.main:app --reload

# 生产模式
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

服务将在 http://localhost:8000 启动

### 4. 访问 API 文档

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API 端点

### 游戏记录管理

#### 保存游戏记录
```http
POST /api/games
Content-Type: application/json

{
  "player_name": "玩家1",
  "score": 1000,
  "level": 5,
  "lines": 20,
  "play_time": 120
}
```

#### 获取游戏历史
```http
GET /api/games?skip=0&limit=20
```

#### 获取单条记录
```http
GET /api/games/{game_id}
```

#### 更新游戏记录
```http
PUT /api/games/{game_id}
Content-Type: application/json

{
  "score": 2000,
  "level": 10
}
```

#### 删除游戏记录
```http
DELETE /api/games/{game_id}
```

### 排行榜

#### 获取排行榜 Top N
```http
GET /api/leaderboard?limit=10
```

### 玩家统计

#### 获取玩家统计信息
```http
GET /api/players/{player_name}/stats
```

返回示例：
```json
{
  "total_games": 10,
  "highest_score": 5000,
  "total_play_time": 3600,
  "average_level": 7,
  "highest_level": 15
}
```

## 运行测试

```bash
# 运行所有测试
pytest

# 运行测试并显示详细输出
pytest -v

# 运行测试并显示覆盖率
pytest --cov=app tests/
```

## 项目结构

```
backend/
├── app/
│   ├── api/              # API 路由
│   │   └── games.py      # 游戏相关 API
│   ├── database/         # 数据库配置
│   │   ├── base.py       # SQLAlchemy 基础配置
│   │   └── init_db.py    # 数据库初始化
│   ├── models/           # 数据模型
│   │   └── game.py       # Game ORM 模型
│   ├── schemas/          # Pydantic schemas
│   │   └── game.py       # 请求/响应模型
│   ├── services/         # 业务逻辑
│   │   └── game_service.py
│   ├── utils/            # 工具类
│   │   └── logger.py     # 日志配置
│   ├── config.py         # 配置管理
│   └── main.py           # FastAPI 应用入口
├── tests/                # 测试文件
│   ├── conftest.py       # pytest 配置
│   ├── test_api.py       # API 测试
│   └── test_services.py  # 服务层测试
├── .env                  # 环境变量（不提交）
├── .env.example          # 环境变量示例
├── .gitignore
├── requirements.txt      # Python 依赖
└── README.md
```

## 数据模型

### Game 模型

| 字段 | 类型 | 说明 | 验证规则 |
|------|------|------|----------|
| id | int | 主键 | 自动生成 |
| player_name | str | 玩家名称 | 1-50字符，仅支持中文、英文、数字、下划线、连字符 |
| score | int | 分数 | ≥ 0 |
| level | int | 等级 | 1-20 |
| lines | int | 消除行数 | ≥ 0 |
| play_time | int | 游戏时长(秒) | ≥ 0 |
| created_at | datetime | 创建时间 | 自动生成（UTC） |

## 开发指南

### 添加新的 API 端点

1. 在 `app/schemas/game.py` 添加请求/响应模型
2. 在 `app/services/game_service.py` 添加业务逻辑
3. 在 `app/api/games.py` 添加路由
4. 在 `tests/` 添加对应测试

### 代码规范

- 遵循 PEP 8 规范
- 使用类型注解
- 所有公共方法添加 docstring
- 数据库操作使用事务和异常处理
- API 错误记录日志

## 配置说明

| 环境变量 | 默认值 | 说明 |
|----------|--------|------|
| APP_NAME | Tetris Game | 应用名称 |
| DEBUG | True | 调试模式 |
| DATABASE_URL | sqlite:///./data.db | 数据库连接字符串 |
| ALLOWED_ORIGINS | [...] | CORS 允许的源 |
| LINES_PER_LEVEL | 20 | 每级消除行数 |
| INITIAL_SPEED | 1000 | 初始下落速度(ms) |

## 常见问题

### Q: 如何修改数据库？

A: 修改 `.env` 文件中的 `DATABASE_URL`，支持 SQLite、PostgreSQL、MySQL 等。

### Q: 如何部署？

A: 推荐使用 Docker 或直接使用 uvicorn：

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Q: 测试数据库在哪？

A: 测试使用临时文件数据库，每次测试后自动清理。

## License

MIT
