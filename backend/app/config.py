"""
配置管理模块
从环境变量加载配置
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """应用配置"""

    # 应用配置
    APP_NAME: str = "Tetris Game"
    DEBUG: bool = True

    # 数据库配置
    DATABASE_URL: str = "sqlite:///./data.db"

    # CORS 配置
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # 游戏配置
    LINES_PER_LEVEL: int = 20
    INITIAL_SPEED: int = 1000

    class Config:
        env_file = ".env"
        case_sensitive = True


# 全局配置实例
settings = Settings()
