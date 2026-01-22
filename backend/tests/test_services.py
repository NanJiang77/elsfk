"""
服务层业务逻辑测试
"""
import pytest
from datetime import datetime, timedelta

from app.models.game import Game
from app.schemas.game import GameCreate
from app.services.game_service import game_service


class TestGameService:
    """游戏服务测试类"""

    def test_save_game_record(self, db_session):
        """测试保存游戏记录"""
        game_data = GameCreate(
            player_name="测试玩家",
            score=1000,
            level=5,
            lines=20,
            play_time=120
        )

        game = game_service.save_game_record(db_session, game_data)

        assert game.id is not None
        assert game.player_name == "测试玩家"
        assert game.score == 1000
        assert game.level == 5

    def test_get_game_history(self, db_session):
        """测试获取历史记录"""
        # 创建3条记录
        for i in range(3):
            game_data = GameCreate(
                player_name=f"玩家{i}",
                score=1000 * (i + 1),
                level=1,
                lines=0,
                play_time=60
            )
            game_service.save_game_record(db_session, game_data)

        # 获取历史记录
        games = game_service.get_game_history(db_session, skip=0, limit=10)

        assert len(games) == 3
        assert games[0].score == 3000  # 应该按创建时间倒序
        assert games[2].score == 1000

    def test_get_game_history_pagination(self, db_session):
        """测试分页功能"""
        # 创建5条记录
        for i in range(5):
            game_data = GameCreate(
                player_name=f"玩家{i}",
                score=100 * (i + 1),
                level=1,
                lines=0,
                play_time=60
            )
            game_service.save_game_record(db_session, game_data)

        # 测试分页
        games = game_service.get_game_history(db_session, skip=2, limit=2)

        assert len(games) == 2

    def test_get_top_scores(self, db_session):
        """测试获取排行榜"""
        # 创建记录
        scores_data = [
            GameCreate(player_name="玩家A", score=5000, level=10, lines=100, play_time=300),
            GameCreate(player_name="玩家B", score=7000, level=12, lines=150, play_time=400),
            GameCreate(player_name="玩家C", score=3000, level=8, lines=80, play_time=250),
        ]

        for game_data in scores_data:
            game_service.save_game_record(db_session, game_data)

        # 获取排行榜
        top_scores = game_service.get_top_scores(db_session, limit=10)

        assert len(top_scores) == 3
        # 验证按分数降序排列
        assert top_scores[0].score == 7000
        assert top_scores[1].score == 5000
        assert top_scores[2].score == 3000

    def test_get_top_scores_limit(self, db_session):
        """测试排行榜数量限制"""
        # 创建5条记录
        for i in range(5):
            game_data = GameCreate(
                player_name=f"玩家{i}",
                score=1000 * (i + 1),
                level=1,
                lines=0,
                play_time=60
            )
            game_service.save_game_record(db_session, game_data)

        # 只获取前3名
        top_scores = game_service.get_top_scores(db_session, limit=3)

        assert len(top_scores) == 3

    def test_get_game_by_id_found(self, db_session):
        """测试根据ID获取游戏 - 找到"""
        game_data = GameCreate(
            player_name="测试玩家",
            score=1000,
            level=5,
            lines=20,
            play_time=120
        )
        game = game_service.save_game_record(db_session, game_data)

        found_game = game_service.get_game_by_id(db_session, game.id)

        assert found_game is not None
        assert found_game.id == game.id
        assert found_game.player_name == "测试玩家"

    def test_get_game_by_id_not_found(self, db_session):
        """测试根据ID获取游戏 - 未找到"""
        found_game = game_service.get_game_by_id(db_session, 99999)

        assert found_game is None

    def test_calculate_play_time(self):
        """测试游戏时长计算"""
        start = datetime(2026, 1, 20, 10, 0, 0)
        end = datetime(2026, 1, 20, 10, 5, 30)  # 5分30秒

        play_time = game_service.calculate_play_time(start, end)

        assert play_time == 330  # 330秒

    def test_calculate_play_time_zero(self):
        """测试零时长"""
        start = datetime(2026, 1, 20, 10, 0, 0)
        end = datetime(2026, 1, 20, 10, 0, 0)  # 完全相同时间

        play_time = game_service.calculate_play_time(start, end)

        assert play_time == 0

    def test_is_high_score_true(self, db_session):
        """测试高分判断 - 是高分"""
        # 创建一些记录
        for score in [1000, 2000, 3000]:
            game_data = GameCreate(
                player_name="玩家",
                score=score,
                level=1,
                lines=0,
                play_time=60
            )
            game_service.save_game_record(db_session, game_data)

        # 测试5000分是否为高分
        assert game_service.is_high_score(db_session, 5000) is True

    def test_is_high_score_false(self, db_session):
        """测试高分判断 - 不是高分"""
        # 创建一些记录
        for score in [6000, 7000, 8000]:
            game_data = GameCreate(
                player_name="玩家",
                score=score,
                level=1,
                lines=0,
                play_time=60
            )
            game_service.save_game_record(db_session, game_data)

        # 测试5000分是否为高分
        assert game_service.is_high_score(db_session, 5000) is False

    def test_is_high_score_empty_db(self, db_session):
        """测试空数据库的高分判断"""
        # 空数据库时，任何分数都是高分
        assert game_service.is_high_score(db_session, 100) is True
        assert game_service.is_high_score(db_session, 9999) is True

    def test_update_game_record(self, db_session):
        """测试更新游戏记录"""
        game_data = GameCreate(
            player_name="测试玩家",
            score=1000,
            level=5,
            lines=20,
            play_time=120
        )
        game = game_service.save_game_record(db_session, game_data)

        # 更新记录
        from app.schemas.game import GameUpdate
        update_data = GameUpdate(score=2000, level=10)
        updated_game = game_service.update_game_record(db_session, game.id, update_data)

        assert updated_game is not None
        assert updated_game.score == 2000
        assert updated_game.level == 10
        assert updated_game.player_name == "测试玩家"  # 未更新

    def test_update_game_record_not_found(self, db_session):
        """测试更新不存在的记录"""
        from app.schemas.game import GameUpdate
        update_data = GameUpdate(score=2000)

        result = game_service.update_game_record(db_session, 99999, update_data)
        assert result is None

    def test_delete_game_record(self, db_session):
        """测试删除游戏记录"""
        game_data = GameCreate(
            player_name="测试玩家",
            score=1000,
            level=5,
            lines=20,
            play_time=120
        )
        game = game_service.save_game_record(db_session, game_data)

        # 删除记录
        success = game_service.delete_game_record(db_session, game.id)
        assert success is True

        # 验证已删除
        found_game = game_service.get_game_by_id(db_session, game.id)
        assert found_game is None

    def test_delete_game_record_not_found(self, db_session):
        """测试删除不存在的记录"""
        success = game_service.delete_game_record(db_session, 99999)
        assert success is False

    def test_get_player_stats(self, db_session):
        """测试获取玩家统计"""
        # 创建多个记录
        games_data = [
            GameCreate(player_name="玩家A", score=1000, level=5, lines=10, play_time=100),
            GameCreate(player_name="玩家A", score=2000, level=10, lines=20, play_time=200),
            GameCreate(player_name="玩家A", score=1500, level=7, lines=15, play_time=150),
            GameCreate(player_name="玩家B", score=3000, level=12, lines=30, play_time=300),
        ]

        for game_data in games_data:
            game_service.save_game_record(db_session, game_data)

        # 获取玩家A的统计
        stats = game_service.get_player_stats(db_session, "玩家A")

        assert stats["total_games"] == 3
        assert stats["highest_score"] == 2000
        assert stats["total_play_time"] == 450
        assert stats["highest_level"] == 10
        assert stats["average_level"] == 7  # (5+10+7)//3

    def test_get_player_stats_no_games(self, db_session):
        """测试获取不存在玩家的统计"""
        stats = game_service.get_player_stats(db_session, "不存在的玩家")

        assert stats["total_games"] == 0
        assert stats["highest_score"] == 0
        assert stats["total_play_time"] == 0
