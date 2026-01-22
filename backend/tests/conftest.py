"""
测试配置和共享fixtures
"""
import pytest
import tempfile
import os
from typing import Generator, Callable
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.database.base import Base
from app.models.game import Game
from app.config import settings
from app.main import app


@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    """创建测试数据库会话"""
    # 创建临时文件数据库
    fd, path = tempfile.mkstemp(suffix='.db')
    os.close(fd)

    test_engine = create_engine(
        f"sqlite:///{path}",
        connect_args={"check_same_thread": False}
    )

    # 创建所有表
    Base.metadata.create_all(bind=test_engine)

    # 创建会话
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    session = TestingSessionLocal()

    yield session

    # 清理
    session.close()
    Base.metadata.drop_all(bind=test_engine)
    os.unlink(path)


@pytest.fixture
def sample_game_data():
    """示例游戏数据"""
    return {
        "player_name": "测试玩家",
        "score": 1000,
        "level": 5,
        "lines": 20,
        "play_time": 120
    }


@pytest.fixture
def multiple_game_records():
    """多条游戏记录数据"""
    return [
        {"player_name": "玩家1", "score": 5000, "level": 10, "lines": 100, "play_time": 300},
        {"player_name": "玩家2", "score": 3000, "level": 8, "lines": 80, "play_time": 250},
        {"player_name": "玩家3", "score": 7000, "level": 12, "lines": 150, "play_time": 400},
    ]


@pytest.fixture
def client(db_session: Session) -> Generator:
    """创建测试客户端，使用测试数据库会话"""

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    from app.database.base import get_db
    from fastapi.testclient import TestClient

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
