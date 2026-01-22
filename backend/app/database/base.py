"""
数据库基础模块
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from ..config import settings

# 创建基础模型类 (使用 SQLAlchemy 2.0 推荐方式)
Base = declarative_base()

# 创建数据库引擎
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}  # SQLite 特有配置
)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """获取数据库会话"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
