# 俄罗斯方块游戏 - 部署文档

## 目录
1. [本地部署](#一本地部署)
2. [Docker容器部署](#二docker容器部署)
3. [生产环境部署](#三生产环境部署)
4. [运维指南](#四运维指南)

---

## 一、本地部署

### 1.1 环境要求

#### 后端环境
- **Python**: 3.10 或更高版本
- **pip**: 包管理工具
- **SQLite3**: 数据库(Python内置)

#### 前端环境
- **Node.js**: 18.0 或更高版本
- **npm**: 包管理工具

### 1.2 后端部署

#### 步骤1: 克隆代码
```bash
git clone <repository-url>
cd elsfk/backend
```

#### 步骤2: 创建虚拟环境(推荐)
```bash
# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

#### 步骤3: 安装依赖
```bash
pip install -r requirements.txt
```

#### 步骤4: 配置环境变量

创建 `.env` 文件:
```env
# 应用配置
APP_NAME=Tetris Game
DEBUG=True

# 数据库配置
DATABASE_URL=sqlite:///./data.db

# CORS配置
ALLOWED_ORIGINS=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"]

# 游戏配置
LINES_PER_LEVEL=20
INITIAL_SPEED=1000
```

#### 步骤5: 初始化数据库
```bash
python -c "from app.database.init_db import init_database; init_database()"
```

#### 步骤6: 启动后端服务

**开发模式** (支持热重载):
```bash
uvicorn app.main:app --reload --port 8000
```

**生产模式**:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### 步骤7: 验证后端服务
```bash
curl http://localhost:8000/api/health
```

预期返回:
```json
{"status":"healthy","service":"tetris-game"}
```

### 1.3 前端部署

#### 步骤1: 进入前端目录
```bash
cd elsfk/frontend
```

#### 步骤2: 安装依赖
```bash
npm install
```

#### 步骤3: 配置环境变量

创建 `.env.production` 文件:
```env
# API服务地址
VITE_API_BASE_URL=http://localhost:8000
```

#### 步骤4: 启动开发服务
```bash
npm run dev
```

服务将在 `http://localhost:5173` 启动

#### 步骤5: 构建生产版本
```bash
npm run build
```

构建产物在 `dist/` 目录

#### 步骤6: 启动生产服务(可选)
```bash
npm run preview
```

服务将在 `http://localhost:4173` 启动

### 1.4 验证部署

#### 1. 访问游戏页面
打开浏览器访问: `http://localhost:5173`

#### 2. 测试游戏功能
- 点击"开始游戏"
- 使用方向键控制方块
- 测试暂停/继续

#### 3. 测试排行榜
- 点击导航栏"排行榜"
- 查看排行榜数据
- 测试实时更新

#### 4. 检查浏览器控制台
- 确认无错误信息
- 确认WebSocket连接成功

---

## 二、Docker容器部署

### 2.1 准备Docker环境

安装Docker:
- **macOS**: 下载并安装 Docker Desktop
- **Linux**: `curl -fsSL https://get.docker.com | sh`
- **Windows**: 下载并安装 Docker Desktop

### 2.2 后端Docker部署

#### 步骤1: 创建后端Dockerfile

创建 `backend/Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 安装Python依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 创建数据目录
RUN mkdir -p /app/data

# 暴露端口
EXPOSE 8000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

# 启动命令
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 步骤2: 创建.dockerignore

创建 `backend/.dockerignore`:
```
__pycache__
*.py[cod]
*$py.class
*.pyc
.venv/
venv/
.env
*.db
*.log
.pytest_cache/
.coverage
.tox/
dist/
```

#### 步骤3: 构建后端镜像
```bash
cd backend
docker build -t tetris-backend:latest .
```

#### 步骤4: 运行后端容器
```bash
docker run -d \
  --name tetris-backend \
  -p 8000:8000 \
  -v $(pwd)/data:/app/data \
  --env-file .env \
  tetris-backend:latest
```

#### 步骤5: 查看后端日志
```bash
docker logs -f tetris-backend
```

### 2.3 前端Docker部署

#### 步骤1: 创建前端Dockerfile

创建 `frontend/Dockerfile`:
```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 步骤2: 创建nginx配置

创建 `frontend/nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### 步骤3: 创建.dockerignore

创建 `frontend/.dockerignore`:
```
node_modules
npm-debug.log
dist
.env
.env.local
.DS_Store
.vscode
```

#### 步骤4: 构建前端镜像
```bash
cd frontend
docker build -t tetris-frontend:latest .
```

#### 步骤5: 运行前端容器
```bash
docker run -d \
  --name tetris-frontend \
  -p 80:80 \
  tetris-frontend:latest
```

### 2.4 使用Docker Compose一键部署

#### 步骤1: 创建docker-compose.yml

在项目根目录创建 `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: tetris-backend
    ports:
      - "8000:8000"
    volumes:
      - backend-data:/app/data
    environment:
      - DATABASE_URL=sqlite:///./data.db
      - DEBUG=False
      - ALLOWED_ORIGINS=["http://localhost", "http://localhost:5173", "http://0.0.0.0:8080"]
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./frontend
    container_name: tetris-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  backend-data:
```

#### 步骤2: 一键启动所有服务
```bash
docker-compose up -d
```

#### 步骤3: 查看服务状态
```bash
docker-compose ps
```

#### 步骤4: 停止并删除所有服务
```bash
docker-compose down
```

#### 步骤5: 查看日志
```bash
# 后端日志
docker-compose logs backend

# 前端日志
docker-compose logs frontend

# 所有日志
docker-compose logs -f
```

---

## 三、生产环境部署

### 3.1 服务器要求

#### 最低配置
- **CPU**: 2核心
- **内存**: 4GB RAM
- **磁盘**: 20GB SSD
- **操作系统**: Linux (Ubuntu 20.04+, CentOS 8+)

#### 推荐配置
- **CPU**: 4核心+
- **内存**: 8GB RAM
- **磁盘**: 50GB SSD
- **网络**: 100Mbps+
- **操作系统**: Ubuntu 22.04 LTS

### 3.2 使用Nginx反向代理部署

#### 步骤1: 安装Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y

# 启动并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 步骤2: 配置Nginx

创建配置文件 `/etc/nginx/sites-available/tetris`:
```nginx
upstream backend {
    server 127.0.0.1:8000;
    server 127.0.0.1:8001;
    server 127.0.0.1:8002;
}

server {
    listen 80;
    server_name your-domain.com;

    # 强制HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL证书配置
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;

    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    # 后端API代理
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket代理
    location /ws/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket超时
        proxy_connect_timeout 1h;
        proxy_send_timeout 1h;
        proxy_read_timeout 1h;
        proxy_buffering off;
    }

    # 前端静态文件
    location / {
        root /var/www/tetris/frontend/dist;
        try_files $uri $uri/ /index.html;

        # 缓存配置
        add_header Cache-Control "public, max-age=3600";
        expires 3600s;
    }

    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss;
    gzip_types text/css application/javascript application/json application/xml+rss;
}
```

#### 步骤3: 启用配置
```bash
sudo ln -s /etc/nginx/sites-available/tetris /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3.3 使用Systemd管理服务

#### 后端服务文件

创建 `/etc/systemd/system/tetris-backend.service`:
```ini
[Unit]
Description=Tetris Game Backend
After=network.target

[Service]
Type=notify
User=tetris
Group=tetris
WorkingDirectory=/var/www/tetris/backend
Environment="PATH=/var/www/tetris/backend/venv/bin"
ExecStart=/var/www/tetris/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=tetris-backend

[Install]
WantedBy=multi-user.target
```

#### 前端服务文件(Nginx)

Nginx已自动处理静态文件

#### 启动服务
```bash
# 后端
sudo systemctl start tetris-backend
sudo systemctl enable tetris-backend

# Nginx
sudo systemctl restart nginx
```

#### 查看服务状态
```bash
# 后端状态
sudo systemctl status tetris-backend

# Nginx状态
sudo systemctl status nginx
```

### 3.4 使用Supervisor管理(可选)

#### 步骤1: 安装Supervisor
```bash
sudo apt install supervisor -y
```

#### 步骤2: 配置后端

创建 `/etc/supervisor/conf.d/tetris-backend.conf`:
```ini
[program: tetris-backend]
command=/var/www/tetris/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
directory=/var/www/tetris/backend
user=tetris
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/tetris-backend-err.log
stdout_logfile=/var/log/supervisor/tetris-backend-out.log
environment=PATH="/var/www/tetris/backend/venv/bin"
```

#### 步骤3: 启动Supervisor
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start tetris-backend
```

### 3.5 配置防火墙

#### UFW (Ubuntu)
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8000/tcp
sudo ufw enable
```

#### firewalld (CentOS)
```bash
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=8000/tcp
sudo firewall-cmd --reload
```

---

## 四、运维指南

### 4.1 日志管理

#### 后端日志位置
```bash
# Systemd服务日志
sudo journalctl -u tetris-backend -f

# Supervisor日志
sudo tail -f /var/log/supervisor/tetris-backend-out.log

# 应用日志
tail -f /var/www/tetris/backend/logs/app.log
```

#### 前端日志
```bash
# Nginx访问日志
sudo tail -f /var/log/nginx/access.log

# Nginx错误日志
sudo tail -f /var/log/nginx/error.log
```

### 4.2 数据库备份

#### 自动备份脚本

创建 `/etc/cron.daily/tetris-backup.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/tetris"
DATE=$(date +%Y%m%d_%H%M%S)
DB_FILE="/var/www/tetris/backend/data.db"

mkdir -p $BACKUP_DIR

# 备份数据库
cp $DB_FILE $BACKUP_DIR/data_$DATE.db

# 压缩备份
gzip $BACKUP_DIR/data_$DATE.db

# 删除30天前的备份
find $BACKUP_DIR -name "*.db.gz" -mtime +30 -delete

echo "Backup completed: data_$DATE.db.gz"
```

添加执行权限:
```bash
sudo chmod +x /etc/cron.daily/tetris-backup.sh
```

#### 数据库恢复
```bash
# 停止服务
sudo systemctl stop tetris-backend

# 恢复数据库
cp /var/backups/tetris/data_20260122_100000.db.gz /var/www/tetris/backend/data.db
gunzip /var/www/tetris/backend/data.db

# 重启服务
sudo systemctl start tetris-backend
```

### 4.3 监控和告警

#### 使用Prometheus + Grafana

##### 安装Node Exporter
```bash
npm install -g prom-node-api-client
```

##### 创建监控脚本 `monitor.js`
```javascript
const promClient = require('prom-client');
const express = require('express');

const app = express();

// 暴露metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.metrics());
  res.end();
});

app.listen(9090, () => {
  console.log('Metrics server running on port 9090');
});
```

##### 在package.json添加
```json
{
  "scripts": {
    "monitor": "node monitor.js"
  }
}
```

#### 告警规则

**CPU告警**: >80%持续5分钟
**内存告警**: >90%使用率
**磁盘告警**: >85%使用率
**API响应时间**: >1秒

### 4.4 扩容部署

#### 水平扩展
```bash
# 启动多个后端实例
uvicorn app.main:app --port 8001 &
uvicorn app.main:app --port 8002 &
uvicorn app.main:app --port 8003 &
uvicorn app.main:app --port 8004 &

# 使用Nginx负载均衡
```

#### 使用Docker Swarm
```bash
# 初始化Swarm
docker swarm init

# 部署服务栈
docker stack deploy -c docker-stack.yml --replicas 4
```

### 4.5 常见问题排查

#### 问题1: 端口被占用
```bash
# 查看端口占用
sudo lsof -i :8000
sudo lsof -i :80

# 杀死进程
sudo kill -9 <PID>
```

#### 问题2: 数据库锁定
```bash
# 检查SQLite锁文件
ls -la data.db data.db-shm data.db-wal

# 删除锁文件
rm -f data.db-shm data.db-wal
```

#### 问题3: WebSocket连接失败
```bash
# 检查防火墙
sudo ufw status

# 检查Nginx配置
sudo nginx -t
```

#### 问题4: 前端404错误
```bash
# 检查Nginx配置
cat /etc/nginx/sites-available/tetris

# 检查文件权限
ls -la /var/www/tetris/frontend/dist
```

#### 问题5: CORS错误
```bash
# 检查.env配置
cat backend/.env | grep ALLOWED_ORIGINS

# 检查Nginx配置
grep -r "add_header Access-Control" /etc/nginx/
```

### 4.6 性能优化建议

#### 数据库优化
```bash
#  vacuum数据库
sqlite3 data.db "VACUUM;"

# 重建索引
sqlite3 data.db "REINDEX;"
```

#### 静态资源CDN
- 将dist目录上传到CDN
- 配置CNAME指向CDN
- 开启Gzip压缩

#### 缓存策略
```nginx
# 静态文件缓存30天
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}

# API缓存1分钟
location /api/leaderboard {
    proxy_cache_valid 200 1m;
    proxy_pass http://backend;
}
```

---

## 五、部署检查清单

### 部署前
- [ ] 服务器环境准备完成
- [ ] Docker已安装
- [ ] Nginx已安装配置
- [ ] 域名已解析
- [ ] SSL证书已配置
- [ ] 防火墙规则已配置

### 部署中
- [ ] 代码已上传到服务器
- [ ] 环境变量已配置
- [ ] 数据库已初始化
- [ ] 后端服务已启动
- [ ] 前端已构建
- [ ] Nginx已配置并重载

### 部署后
- [ ] 后端健康检查通过
- [ ] 前端页面可访问
- [ ] 游戏功能正常
- [ ] 排行榜显示正常
- [ ] WebSocket连接成功
- [ ] 日志正常输出
- [ ] 监控配置完成

---

## 六、安全建议

### 6.1 基础安全
- ✅ 使用HTTPS (SSL证书)
- ✅ CORS配置正确
- ✅ 输入验证完整
- ⚠️ 添加CSRF保护
- ⚠️ 添加SQL注入防护(ORM已有)

### 6.2 生产环境安全
- ⚠️ 定期更新依赖包
- ⚠️ 定期备份数据库
- ⚠️ 配置fail2ban防暴力破解
- ⚠️ 设置文件权限正确
- ⚠️ 禁止目录列表

### 6.3 API安全
- ⚠️ 添加API认证(JWT)
- ⚠️ 实现请求签名验证
- ⚠️ 添加IP白名单
- ⚠️ 限制请求频率(已实现基础版)

---

## 七、维护命令速查

### 服务管理
```bash
# 查看后端日志
sudo journalctl -u tetris-backend -f

# 重启后端
sudo systemctl restart tetris-backend

# 重启Nginx
sudo systemctl restart nginx

# 查看Docker容器状态
docker ps -a

# 重启Docker容器
docker-compose restart
```

### 数据库操作
```bash
# 备份数据库
cp data.db data.db.backup

# 查看数据库大小
ls -lh data.db

# 清理测试数据
rm data.db
```

### 更新部署
```bash
# 拉取最新代码
git pull

# 后端更新
cd backend
git pull
pip install -r requirements.txt
sudo systemctl restart tetris-backend

# 前端更新
cd frontend
npm run build
sudo systemctl reload nginx
```

---

## 八、故障恢复

### 备份恢复流程
1. 停止服务
2. 恢复数据库备份
3. 恢复代码备份
4. 重启服务
5. 验证功能

### 快速回滚
```bash
# Docker回滚
docker-compose down
docker-compose up -d --force-recreate

# Git回滚
git reset --hard <commit-hash>
docker-compose up -d --build
```

---

**文档版本**: 1.0
**最后更新**: 2026-01-22
**维护者**: Claude (AI Assistant)
