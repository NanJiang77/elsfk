"""
API速率限制装饰器
"""
from functools import wraps
from fastapi import Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from ..utils.logger import logger

# 创建速率限制器
limiter = Limiter(key_func=get_remote_address, storage_uri="memory://")


def rate_limit(limit_string: str):
    """
    速率限制装饰器工厂

    Args:
        limit_string: 限制字符串,如 "10/minute" 表示每分钟10次
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # 查找Request参数
            request = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            if not request:
                # 尝试从kwargs中获取
                request = kwargs.get('request')

            if not request:
                # 没有request对象,直接调用
                return await func(*args, **kwargs)

            # 检查速率限制
            key = get_remote_address(request)
            if not limiter.check_limit(key):
                # 限制未触发,正常调用
                return await func(*args, **kwargs)
            else:
                # 限制触发
                logger.warning(f"速率限制触发: {request.client.host if request.client else 'unknown'}")
                raise HTTPException(
                    status_code=429,
                    detail="请求过于频繁,请稍后重试"
                )

        return wrapper
    return decorator


# 导出limiter供直接使用
__all__ = ['limiter', 'rate_limit']
