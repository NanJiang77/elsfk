"""
游戏记录和排行榜API路由
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database.base import get_db
from ..models.game import Game
from ..schemas.game import GameCreate, GameUpdate, GameResponse, LeaderBoardEntry
from ..services.game_service import game_service
from ..utils.logger import logger
from . import websocket

router = APIRouter(prefix="/api", tags=["games"])


@router.post("/games", response_model=GameResponse, status_code=201)
async def save_game(
    game: GameCreate,
    db: Session = Depends(get_db)
):
    """
    保存游戏记录

    - **player_name**: 玩家名称 (1-50字符)
    - **score**: 分数 (≥0)
    - **level**: 等级 (1-20)
    - **lines**: 消除行数 (≥0)
    - **play_time**: 游戏时长(秒) (≥0)
    """
    try:
        saved_game = game_service.save_game_record(db, game)

        # 触发WebSocket实时通知(非阻塞)
        try:
            await websocket.notify_leaderboard_update({
                "id": saved_game.id,
                "player_name": saved_game.player_name,
                "score": saved_game.score,
                "level": saved_game.level,
                "lines": saved_game.lines,
                "created_at": saved_game.created_at.isoformat()
            })
        except Exception as ws_error:
            # WebSocket失败不应影响游戏保存
            logger.warning(f"WebSocket通知失败: {ws_error}")

        return saved_game
    except Exception as e:
        logger.error(f"保存游戏记录失败: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"保存失败: {str(e)}")


@router.get("/games", response_model=list[GameResponse])
async def get_games(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    获取游戏历史记录

    - **skip**: 跳过记录数 (默认0)
    - **limit**: 返回记录数 (默认20，最大100)
    """
    if skip < 0:
        raise HTTPException(status_code=400, detail="skip不能为负数")

    if limit < 1 or limit > 100:
        raise HTTPException(status_code=400, detail="limit必须在1-100之间")

    try:
        games = game_service.get_game_history(db, skip=skip, limit=limit)
        return games
    except Exception as e:
        logger.error(f"获取游戏历史失败: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"查询失败: {str(e)}")


@router.get("/leaderboard", response_model=list[LeaderBoardEntry])
async def get_leaderboard(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    获取排行榜 Top N

    - **limit**: 返回记录数 (默认10，最大50)
    - 按分数降序排列
    """
    if limit < 1 or limit > 50:
        raise HTTPException(status_code=400, detail="limit必须在1-50之间")

    try:
        top_scores = game_service.get_top_scores(db, limit=limit)
        return top_scores
    except Exception as e:
        logger.error(f"获取排行榜失败: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"查询失败: {str(e)}")


@router.get("/games/{game_id}", response_model=GameResponse)
async def get_game(
    game_id: int,
    db: Session = Depends(get_db)
):
    """根据ID获取游戏记录"""
    game = game_service.get_game_by_id(db, game_id)
    if not game:
        raise HTTPException(status_code=404, detail="游戏记录不存在")
    return game


@router.put("/games/{game_id}", response_model=GameResponse)
async def update_game(
    game_id: int,
    game_data: GameUpdate,
    db: Session = Depends(get_db)
):
    """更新游戏记录"""
    try:
        updated_game = game_service.update_game_record(db, game_id, game_data)
        if not updated_game:
            raise HTTPException(status_code=404, detail="游戏记录不存在")
        return updated_game
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"更新游戏记录失败: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"更新失败: {str(e)}")


@router.delete("/games/{game_id}", status_code=204)
async def delete_game(
    game_id: int,
    db: Session = Depends(get_db)
):
    """删除游戏记录"""
    try:
        success = game_service.delete_game_record(db, game_id)
        if not success:
            raise HTTPException(status_code=404, detail="游戏记录不存在")
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"删除游戏记录失败: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"删除失败: {str(e)}")


@router.get("/players/{player_name}/stats")
async def get_player_statistics(
    player_name: str,
    db: Session = Depends(get_db)
):
    """获取玩家统计信息"""
    try:
        stats = game_service.get_player_stats(db, player_name)
        return stats
    except Exception as e:
        logger.error(f"获取玩家统计失败: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"查询失败: {str(e)}")


@router.get("/health")
async def health_check():
    """健康检查接口"""
    return {"status": "healthy", "service": "tetris-game"}
