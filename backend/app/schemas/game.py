"""
游戏记录相关的Pydantic模式
"""
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional
import re


class GameBase(BaseModel):
    """游戏记录基础字段"""
    player_name: str = Field(..., min_length=1, max_length=50, description="玩家名称")
    score: int = Field(..., ge=0, description="分数")
    level: int = Field(..., ge=1, le=20, description="等级")
    lines: int = Field(..., ge=0, description="消除行数")
    play_time: int = Field(..., ge=0, description="游戏时长(秒)")

    @field_validator('player_name')
    @classmethod
    def validate_player_name(cls, v: str) -> str:
        """验证玩家名称：只允许中英文、数字、下划线、连字符"""
        if not re.match(r'^[\u4e00-\u9fa5a-zA-Z0-9_-]+$', v):
            raise ValueError('玩家名称只能包含中文、英文、数字、下划线和连字符')
        return v.strip()


class GameCreate(GameBase):
    """创建游戏记录的请求模式"""
    pass


class GameUpdate(BaseModel):
    """更新游戏记录的请求模式（可选字段）"""
    player_name: Optional[str] = Field(None, min_length=1, max_length=50)
    score: Optional[int] = Field(None, ge=0)
    level: Optional[int] = Field(None, ge=1, le=20)
    lines: Optional[int] = Field(None, ge=0)
    play_time: Optional[int] = Field(None, ge=0)


class GameResponse(GameBase):
    """游戏记录响应模式"""
    id: int
    created_at: datetime = Field(description="创建时间")

    class Config:
        from_attributes = True  # 从ORM模型自动生成


class LeaderBoardEntry(GameResponse):
    """排行榜条目"""
    pass
