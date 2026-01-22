<template>
  <div class="leaderboard-page">
    <div class="leaderboard-container">
      <h1 class="page-title">排行榜</h1>

      <el-table
        :data="leaderboardData"
        style="width: 100%"
        stripe
        :header-cell-style="{ background: '#667eea', color: 'white' }"
        :cell-style="{ color: 'white' }"
      >
        <el-table-column prop="rank" label="排名" width="80" align="center" />
        <el-table-column prop="player_name" label="玩家" width="150" />
        <el-table-column prop="score" label="分数" width="120" align="center" sortable />
        <el-table-column prop="level" label="等级" width="100" align="center" />
        <el-table-column prop="lines" label="行数" width="100" align="center" />
        <el-table-column prop="play_time" label="时长(秒)" width="120" align="center" />
        <el-table-column prop="created_at" label="时间" width="180" />
      </el-table>

      <div class="back-section">
        <el-button @click="goBack" size="large">返回游戏</el-button>
        <el-button @click="refreshData" :loading="loading" size="large">
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

const router = useRouter();
const leaderboardData = ref<LeaderBoardEntry[]>([]);
const loading = ref(false);

const loadLeaderboard = async () => {
  loading.value = true;
  try {
    const data = await leaderboardApi.getTopScores(10);
    leaderboardData.value = data.map((item: LeaderBoardEntry, index: number) => ({
      ...item,
      rank: index + 1,
    }));
  } catch (error) {
    console.error('加载排行榜失败:', error);
    ElMessage.error('加载排行榜失败');
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
  loadLeaderboard();

  // 连接WebSocket
  leaderboardWS.connect();

  // 订阅排行榜更新
  leaderboardWS.on('leaderboard_update', async () => {
    // 实时刷新排行榜
    await loadLeaderboard();
  });
});

onUnmounted(() => {
  // 断开WebSocket
  leaderboardWS.disconnect();
});
</script>

<style scoped>
.leaderboard-page {
  width: 100%;
  min-height: calc(100vh - 150px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
}

.leaderboard-container {
  max-width: 900px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 30px;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 30px;
}

.back-section {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style>
