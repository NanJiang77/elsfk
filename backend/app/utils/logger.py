"""
日志系统配置
"""
import logging
import os
from datetime import datetime


def setup_logger():
    """配置日志系统"""
    # 创建 logs 目录
    os.makedirs("logs", exist_ok=True)

    # 配置日志格式
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(f"logs/app_{datetime.now().strftime('%Y%m%d')}.log", encoding='utf-8'),
            logging.StreamHandler()
        ]
    )

    return logging.getLogger(__name__)


# 初始化日志
logger = setup_logger()
