"""
游戏业务逻辑服务
"""
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..models.game import Game
from ..schemas.game import GameCreate, GameUpdate, GameResponse


class GameService:
    """游戏业务服务类"""

    def save_game_record(self, db: Session, game_data: GameCreate) -> Game:
        """保存游戏记录到数据库"""
        try:
            game = Game(**game_data.model_dump())
            db.add(game)
            db.commit()
            db.refresh(game)
            return game
        except Exception as e:
            db.rollback()
            raise

    def get_game_history(self, db: Session, skip: int = 0, limit: int = 20) -> List[Game]:
        """获取游戏历史记录"""
        return db.query(Game)\
            .order_by(desc(Game.created_at))\
            .offset(skip)\
            .limit(limit)\
            .all()

    def get_top_scores(self, db: Session, limit: int = 10) -> List[Game]:
        """获取排行榜前 N 名"""
        return db.query(Game)\
            .order_by(desc(Game.score), desc(Game.created_at))\
            .limit(limit)\
            .all()

    def get_game_by_id(self, db: Session, game_id: int) -> Optional[Game]:
        """根据ID获取游戏记录"""
        return db.query(Game).filter(Game.id == game_id).first()

    def calculate_play_time(self, start_time: datetime, end_time: datetime) -> int:
        """计算游戏时长（秒）"""
        delta = end_time - start_time
        return int(delta.total_seconds())

    def is_high_score(self, db: Session, score: int) -> bool:
        """判断是否为高分（进入前10）"""
        top_scores = self.get_top_scores(db, limit=10)
        if len(top_scores) < 10:
            # 如果记录不足10条，只要分数比最低的高（或者没有记录）
            return len(top_scores) == 0 or score > top_scores[-1].score
        return score > top_scores[-1].score

    def update_game_record(self, db: Session, game_id: int, game_data: GameUpdate) -> Optional[Game]:
        """更新游戏记录"""
        try:
            game = self.get_game_by_id(db, game_id)
            if not game:
                return None

            update_data = game_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(game, field, value)

            db.commit()
            db.refresh(game)
            return game
        except Exception as e:
            db.rollback()
            raise

    def delete_game_record(self, db: Session, game_id: int) -> bool:
        """删除游戏记录"""
        try:
            game = self.get_game_by_id(db, game_id)
            if not game:
                return False

            db.delete(game)
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            raise

    def get_player_stats(self, db: Session, player_name: str) -> dict:
        """获取玩家统计信息"""
        games = db.query(Game).filter(Game.player_name == player_name).all()

        if not games:
            return {
                "total_games": 0,
                "highest_score": 0,
                "total_play_time": 0,
                "average_level": 0,
                "highest_level": 0
            }

        return {
            "total_games": len(games),
            "highest_score": max(g.score for g in games),
            "total_play_time": sum(g.play_time for g in games),
            "average_level": sum(g.level for g in games) // len(games),
            "highest_level": max(g.level for g in games)
        }


game_service = GameService()
