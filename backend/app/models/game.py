"""
游戏记录数据库模型
"""
from sqlalchemy import Column, Integer, String, DateTime, Index
from datetime import datetime, timezone
from ..database.base import Base


class Game(Base):
    """游戏记录模型"""
    __tablename__ = 'games'

    id = Column(Integer, primary_key=True, index=True)
    player_name = Column(String(50), nullable=False, comment="玩家名称")
    score = Column(Integer, nullable=False, comment="分数")
    level = Column(Integer, nullable=False, comment="等级")
    lines = Column(Integer, nullable=False, comment="消除行数")
    play_time = Column(Integer, nullable=False, comment="游戏时长(秒)")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, comment="创建时间")

    # 复合索引，优化排行榜和玩家统计查询
    __table_args__ = (
        Index('idx_score_created', 'score', 'created_at'),
        Index('idx_player_name', 'player_name'),
    )

    def __repr__(self):
        return f"<Game(id={self.id}, player={self.player_name}, score={self.score})>"
