"""
数据库初始化模块
应用启动时自动创建表
"""
from sqlalchemy import create_engine
from .base import Base
from ..models.game import Game


def init_database():
    """初始化数据库表"""
    from ..config import settings

    engine = create_engine(settings.DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    print("✅ 数据库表创建成功")


def drop_database():
    """删除所有表（仅用于测试）"""
    from ..config import settings

    engine = create_engine(settings.DATABASE_URL)
    Base.metadata.drop_all(bind=engine)
    print("⚠️  数据库表已删除")
