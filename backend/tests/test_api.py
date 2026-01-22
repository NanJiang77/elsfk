"""
API接口测试
"""
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.models.game import Game
from app.schemas.game import GameCreate
from app.services.game_service import game_service


def test_root_endpoint():
    """测试根路径"""
    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["version"] == "1.0.0"


def test_health_check():
    """测试健康检查接口"""
    with TestClient(app) as client:
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


def test_save_game(db_session: Session, sample_game_data):
    """测试保存游戏记录"""
    game_create = GameCreate(**sample_game_data)
    game = game_service.save_game_record(db_session, game_create)

    assert game.id is not None
    assert game.player_name == sample_game_data["player_name"]
    assert game.score == sample_game_data["score"]
    assert game.level == sample_game_data["level"]
    assert game.lines == sample_game_data["lines"]
    assert game.play_time == sample_game_data["play_time"]
    assert game.created_at is not None


def test_save_game_via_api(client, sample_game_data):
    """测试通过API保存游戏记录"""
    response = client.post("/api/games", json=sample_game_data)

    assert response.status_code == 201
    data = response.json()
    assert data["player_name"] == sample_game_data["player_name"]
    assert data["score"] == sample_game_data["score"]
    assert "id" in data
    assert "created_at" in data


def test_save_game_invalid_data(client):
    """测试保存无效数据"""
    # 缺少必填字段
    invalid_data = {"player_name": "测试"}  # 缺少其他字段
    response = client.post("/api/games", json=invalid_data)

    assert response.status_code == 422  # 验证错误


def test_get_games_empty(client):
    """测试获取空的游戏列表"""
    response = client.get("/api/games")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


def test_get_games_with_data(db_session: Session, client, multiple_game_records):
    """测试获取游戏记录列表"""
    # 先插入数据
    for game_data in multiple_game_records:
        game_create = GameCreate(**game_data)
        game_service.save_game_record(db_session, game_create)

    response = client.get("/api/games")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 3
    # 按创建时间倒序，最后插入的7000应该在最前面
    assert data[0]["score"] == 7000
    assert data[1]["score"] == 3000
    assert data[2]["score"] == 5000


def test_get_games_pagination(db_session: Session, client, multiple_game_records):
    """测试分页功能"""
    # 插入数据
    for game_data in multiple_game_records:
        game_create = GameCreate(**game_data)
        game_service.save_game_record(db_session, game_create)


    # 测试分页
    response = client.get("/api/games?skip=1&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_leaderboard(db_session: Session, client, multiple_game_records):
    """测试排行榜接口"""
    # 插入数据
    for game_data in multiple_game_records:
        game_create = GameCreate(**game_data)
        game_service.save_game_record(db_session, game_create)

    response = client.get("/api/leaderboard?limit=10")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 3
    # 验证按分数降序排列
    assert data[0]["score"] == 7000
    assert data[1]["score"] == 5000
    assert data[2]["score"] == 3000


def test_leaderboard_limit(db_session: Session, client, multiple_game_records):
    """测试排行榜limit参数"""
    # 插入数据
    for game_data in multiple_game_records:
        game_create = GameCreate(**game_data)
        game_service.save_game_record(db_session, game_create)

    response = client.get("/api/leaderboard?limit=2")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_leaderboard_limit_max(client, multiple_game_records):
    """测试排行榜limit最大值限制"""
    response = client.get("/api/leaderboard?limit=100")  # 超过最大值

    assert response.status_code == 400  # 参数验证失败


def test_get_game_by_id_found(db_session: Session, client, sample_game_data):
    """测试根据ID获取游戏记录 - 找到记录"""
    # 先创建记录
    game_create = GameCreate(**sample_game_data)
    game = game_service.save_game_record(db_session, game_create)

    response = client.get(f"/api/games/{game.id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == game.id
    assert data["player_name"] == sample_game_data["player_name"]


def test_get_game_by_id_not_found(client):
    """测试根据ID获取游戏记录 - 记录不存在"""
    response = client.get("/api/games/99999")

    assert response.status_code == 404
    data = response.json()
    assert "detail" in data


def test_calculate_play_time():
    """测试游戏时长计算"""
    from datetime import datetime, timedelta

    start_time = datetime(2026, 1, 20, 10, 0, 0)
    end_time = datetime(2026, 1, 20, 10, 2, 30)  # 2分30秒

    play_time = game_service.calculate_play_time(start_time, end_time)
    assert play_time == 150  # 150秒


def test_is_high_score(db_session: Session, multiple_game_records):
    """测试高分判断"""
    # 先插入3条记录
    for game_data in multiple_game_records:
        game_create = GameCreate(**game_data)
        game_service.save_game_record(db_session, game_create)

    # 测试高分数
    assert game_service.is_high_score(db_session, 8000) is True   # 比第3名高
    assert game_service.is_high_score(db_session, 2000) is False  # 比第3名低


def test_is_high_score_empty(db_session: Session):
    """测试空数据库的高分判断"""
    # 数据库为空时，任何分数都是高分
    assert game_service.is_high_score(db_session, 100) is True


def test_game_validation_score_too_low(client):
    """测试分数验证 - 分数过低"""
    invalid_data = {
        "player_name": "测试玩家",
        "score": -1,  # 无效：分数不能为负
        "level": 1,
        "lines": 0,
        "play_time": 0
    }
    response = client.post("/api/games", json=invalid_data)

    assert response.status_code == 422


def test_game_validation_invalid_level(client):
    """测试等级验证 - 等级超出范围"""
    invalid_data = {
        "player_name": "测试玩家",
        "score": 1000,
        "level": 25,  # 无效：等级最大20
        "lines": 0,
        "play_time": 0
    }
    response = client.post("/api/games", json=invalid_data)

    assert response.status_code == 422


def test_game_validation_player_name_too_long(client):
    """测试玩家名称验证 - 名称过长"""
    invalid_data = {
        "player_name": "a" * 51,  # 51个字符，超过限制
        "score": 1000,
        "level": 1,
        "lines": 0,
        "play_time": 0
    }
    response = client.post("/api/games", json=invalid_data)

    assert response.status_code == 422
