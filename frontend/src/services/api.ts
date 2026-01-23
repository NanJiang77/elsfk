/**
 * 后端API服务
 */

import axios from 'axios';
import type { GameRecord, LeaderBoardEntry, PlayerStats } from '@/types/game';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''; // 使用空字符串，通过Vite代理

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器用于调试
api.interceptors.request.use(
  (config) => {
    console.log('[API Request]', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      params: config.params,
    });
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器用于调试
api.interceptors.response.use(
  (response) => {
    console.log('[API Response]', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('[API Response Error]', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      },
    });
    return Promise.reject(error);
  }
);

/** 游戏API */
export const gameApi = {
  /** 保存游戏记录 */
  async saveGame(data: {
    player_name: string;
    score: number;
    level: number;
    lines: number;
    play_time: number;
  }): Promise<GameRecord> {
    const response = await api.post<GameRecord>('/api/games', data);
    return response.data;
  },

  /** 获取游戏历史 */
  async getHistory(skip = 0, limit = 20): Promise<GameRecord[]> {
    const response = await api.get<GameRecord[]>('/api/games', {
      params: { skip, limit },
    });
    return response.data;
  },

  /** 获取游戏记录详情 */
  async getById(id: number): Promise<GameRecord> {
    const response = await api.get<GameRecord>(`/api/games/${id}`);
    return response.data;
  },

  /** 更新游戏记录 */
  async updateGame(
    id: number,
    data: Partial<{
      player_name: string;
      score: number;
      level: number;
      lines: number;
      play_time: number;
    }>
  ): Promise<GameRecord> {
    const response = await api.put<GameRecord>(`/api/games/${id}`, data);
    return response.data;
  },

  /** 删除游戏记录 */
  async deleteGame(id: number): Promise<void> {
    await api.delete(`/api/games/${id}`);
  },
};

/** 排行榜API */
export const leaderboardApi = {
  /** 获取排行榜 */
  async getTopScores(limit = 10): Promise<LeaderBoardEntry[]> {
    const response = await api.get<LeaderBoardEntry[]>('/api/leaderboard', {
      params: { limit },
    });
    return response.data;
  },
};

/** 玩家统计API */
export const playerApi = {
  /** 获取玩家统计 */
  async getStats(playerName: string): Promise<PlayerStats> {
    const response = await api.get<PlayerStats>(
      `/api/players/${playerName}/stats`
    );
    return response.data;
  },
};

/** 健康检查 */
export const healthCheck = async (): Promise<{ status: string; service: string }> => {
  const response = await api.get<{ status: string; service: string }>('/api/health');
  return response.data;
}

export default api;
