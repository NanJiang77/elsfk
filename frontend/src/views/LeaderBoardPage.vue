<template>
  <div class="leaderboard-page">
    <div class="leaderboard-container">
      <h1 class="page-title">排行榜</h1>

      <el-table
        :data="leaderboardData"
        style="width: 100%"
        :border="true"
        :stripe="false"
      >
        <el-table-column prop="rank" label="排名" width="80" align="center" />
        <el-table-column prop="player_name" label="玩家" min-width="120" />
        <el-table-column prop="score" label="分数" width="120" align="center" sortable />
        <el-table-column prop="level" label="等级" width="100" align="center" />
        <el-table-column prop="lines" label="行数" width="100" align="center" />
        <el-table-column prop="play_time" label="时长(秒)" width="120" align="center" />
        <el-table-column prop="created_at" label="时间" min-width="160" />
      </el-table>

      <div class="back-section">
        <el-button @click="goBack">返回游戏</el-button>
        <el-button @click="refreshData" :loading="loading">
          刷新
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { leaderboardApi } from '@/services/api';
import { leaderboardWS } from '@/services/websocket';
import type { LeaderBoardEntry } from '@/types/game';
import { ElMessage } from 'element-plus';
import axios from 'axios';

const router = useRouter();
const leaderboardData = ref<LeaderBoardEntry[]>([]);
const loading = ref(false);

// 用于存储取消订阅的函数
let unsubscribeLeaderboardUpdate: (() => void) | null = null;

const loadLeaderboard = async () => {
  loading.value = true;
  try {
    console.log('[Leaderboard] 开始加载排行榜...');
    console.log('[Leaderboard] API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    const data = await leaderboardApi.getTopScores(10);
    console.log('[Leaderboard] 数据加载成功:', data);
    leaderboardData.value = data.map((item: LeaderBoardEntry, index: number) => ({
      ...item,
      rank: index + 1,
    }));
    ElMessage.success('排行榜加载成功');
  } catch (error) {
    console.error('[Leaderboard] 加载排行榜失败:', error);
    console.error('[Leaderboard] 错误详情:', {
      message: (error as Error).message,
      code: (error as any).code,
      response: (error as any).response?.data,
      config: (error as any).config
    });

    // 显示更友好的错误提示
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        ElMessage.warning('无法连接到服务器，请确保后端服务已启动');
      } else if (error.response) {
        ElMessage.error(`服务器错误: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else {
        ElMessage.error(`加载排行榜失败: ${error.message}`);
      }
    } else {
      ElMessage.error('加载排行榜失败，请稍后重试');
    }
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  loadLeaderboard();
};

const goBack = () => {
  router.push('/');
};

onMounted(() => {
  console.log('[LeaderboardPage] Component mounted, loading data...');
  loadLeaderboard();

  // 连接WebSocket (可选，失败不影响页面功能)
  try {
    console.log('[LeaderboardPage] Connecting to WebSocket...');
    leaderboardWS.connect();

    // 订阅排行榜更新，并保存取消订阅函数
    unsubscribeLeaderboardUpdate = leaderboardWS.on('leaderboard_update', async () => {
      console.log('[LeaderboardPage] Received leaderboard update, refreshing...');
      // 实时刷新排行榜
      await loadLeaderboard();
    });
    console.log('[LeaderboardPage] WebSocket subscribed successfully');
  } catch (error) {
    console.warn('[LeaderboardPage] WebSocket连接失败，将使用手动刷新:', error);
  }
});

onUnmounted(() => {
  console.log('[LeaderboardPage] Component unmounting, cleaning up...');

  // 取消订阅
  if (unsubscribeLeaderboardUpdate) {
    unsubscribeLeaderboardUpdate();
    unsubscribeLeaderboardUpdate = null;
  }

  // 断开WebSocket
  leaderboardWS.disconnect();
  console.log('[LeaderboardPage] Cleanup complete');
});
</script>

<style scoped>
.leaderboard-page {
  width: 100%;
  min-height: calc(100vh - 120px);
  padding: 24px;
}

.leaderboard-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.3);
  padding: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
}

.back-section {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

/* Element Plus Table 样式 - 深色主题 */
:deep(.el-table) {
  font-size: 14px;
  color: #cbd5e1;
  background: transparent !important;
}

:deep(.el-table__inner-wrapper) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th.el-table__cell) {
  background: rgba(15, 23, 42, 0.8) !important;
  color: #94a3b8;
  font-weight: 600;
  font-size: 13px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(99, 102, 241, 0.3) !important;
  border-right: 1px solid rgba(99, 102, 241, 0.2) !important;
}

:deep(.el-table th.el-table__cell:last-child) {
  border-right: none !important;
}

:deep(.el-table tr) {
  background: transparent !important;
}

:deep(.el-table tr:hover > td) {
  background: rgba(99, 102, 241, 0.1) !important;
}

:deep(.el-table td.el-table__cell) {
  padding: 12px 0;
  border-bottom: 1px solid rgba(71, 85, 105, 0.3) !important;
  border-right: 1px solid rgba(71, 85, 105, 0.2) !important;
  color: #e2e8f0;
  background: transparent !important;
}

:deep(.el-table td.el-table__cell:last-child) {
  border-right: none !important;
}

:deep(.el-table__body tr:last-child td.el-table__cell) {
  border-bottom: none !important;
}

:deep(.el-table__empty-block) {
  background: rgba(15, 23, 42, 0.5) !important;
}

:deep(.el-table__empty-text) {
  color: #94a3b8;
}

/* 排名数字样式 */
:deep(.el-table__body .el-table__row td:first-child) {
  color: #818cf8;
  font-weight: 700;
}

/* 分数列样式 */
:deep(.el-table__body .el-table__row td:nth-child(3)) {
  color: #fbbf24;
  font-weight: 600;
}

/* Element Plus Button 样式 - 深色主题 */
:deep(.el-button) {
  height: 36px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid rgba(99, 102, 241, 0.3);
  background: rgba(99, 102, 241, 0.1);
  color: #cbd5e1;
  transition: all 0.2s;
}

:deep(.el-button:hover) {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.5);
  color: #f1f5f9;
}

:deep(.el-button.is-loading) {
  opacity: 0.7;
}
</style>
