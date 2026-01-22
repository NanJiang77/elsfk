"""
WebSocket实时通信
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import json
import asyncio

from ..utils.logger import logger

router = APIRouter()


class ConnectionManager:
    """WebSocket连接管理器"""

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket连接建立. 当前连接数: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"WebSocket断开. 当前连接数: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        """向所有连接的客户端广播消息"""
        if not self.active_connections:
            return

        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"广播消息失败: {e}")
                disconnected.append(connection)

        # 清理断开的连接
        for connection in disconnected:
            self.disconnect(connection)

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """向特定客户端发送消息"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"发送个人消息失败: {e}")


# 创建全局连接管理器
manager = ConnectionManager()


@router.websocket("/ws/leaderboard")
async def leaderboard_websocket(websocket: WebSocket):
    """
    实时排行榜WebSocket端点

    连接后,当有新的高分记录时,服务器会自动推送更新
    """
    await manager.connect(websocket)

    try:
        # 发送欢迎消息
        await manager.send_personal_message({
            "type": "connected",
            "message": "已连接到实时排行榜"
        }, websocket)

        # 保持连接并处理客户端消息
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)

                # 处理客户端请求
                if message.get("type") == "ping":
                    await manager.send_personal_message({
                        "type": "pong",
                        "timestamp": message.get("timestamp")
                    }, websocket)
            except json.JSONDecodeError:
                logger.warning(f"无效的JSON消息: {data}")

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("WebSocket客户端主动断开")
    except Exception as e:
        logger.error(f"WebSocket错误: {e}", exc_info=True)
        manager.disconnect(websocket)


async def notify_leaderboard_update(game_data: dict):
    """
    通知排行榜更新

    当有新的游戏记录保存时调用此函数
    """
    await manager.broadcast({
        "type": "leaderboard_update",
        "data": game_data
    })
    logger.info(f"广播排行榜更新: {game_data.get('player_name')} - {game_data.get('score')}分")


# 导出管理器和通知函数,供其他模块使用
__all__ = ['manager', 'notify_leaderboard_update']
