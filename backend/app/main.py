"""
FastAPI应用主入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import settings
from .database.init_db import init_database
from .utils.logger import logger
from .api import games, websocket


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时执行
    logger.info("🚀 应用启动中...")
    init_database()
    logger.info("✅ 数据库初始化完成")
    yield
    # 关闭时执行
    logger.info("👋 应用关闭")


# 创建FastAPI应用实例
app = FastAPI(
    title=settings.APP_NAME,
    description="俄罗斯方块游戏后端API",
    version="1.0.0",
    lifespan=lifespan
)


# CORS中间件配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 健康检查
@app.get("/")
async def root():
    """根路径健康检查"""
    return {
        "message": "俄罗斯方块游戏API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }


# 注册路由
app.include_router(games.router)
app.include_router(websocket.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
