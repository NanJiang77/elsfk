"""
API速率限制中间件
"""
from fastapi import Request
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from ..utils.logger import logger

# 创建速率限制器
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200/minute"],  # 默认限制:每分钟200次请求
    storage_uri="memory://",  # 使用内存存储(生产环境建议用Redis)
)


def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """自定义速率限制错误处理器"""
    logger.warning(f"速率限制触发: {request.client.host if request.client else 'unknown'}")
    return JSONResponse(
        status_code=429,
        content={
            "error": "速率限制",
            "message": "请求过于频繁,请稍后重试",
            "retry_after": getattr(exc, 'retry_after', 60)
        }
    )


# 设置自定义错误处理器
_rate_limit_exceeded_handler = custom_rate_limit_handler
