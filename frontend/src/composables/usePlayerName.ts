/**
 * 用户名管理 - 持久化存储
 */
import { ref, watch } from 'vue';

const PLAYER_NAME_KEY = 'tetris_player_name';

/**
 * 从localStorage加载用户名
 */
export function usePlayerName() {
  const playerName = ref<string>('');
  const isNameLoaded = ref(false);

  // 加载用户名
  const loadPlayerName = () => {
    try {
      const savedName = localStorage.getItem(PLAYER_NAME_KEY);
      if (savedName) {
        playerName.value = savedName;
      }
      isNameLoaded.value = true;
    } catch (error) {
      console.error('加载用户名失败:', error);
      isNameLoaded.value = true;
    }
  };

  // 保存用户名
  const savePlayerName = (name: string) => {
    try {
      localStorage.setItem(PLAYER_NAME_KEY, name);
      playerName.value = name;
    } catch (error) {
      console.error('保存用户名失败:', error);
    }
  };

  // 更新用户名
  const updatePlayerName = (name: string) => {
    savePlayerName(name);
  };

  // 清除用户名
  const clearPlayerName = () => {
    try {
      localStorage.removeItem(PLAYER_NAME_KEY);
      playerName.value = '';
    } catch (error) {
      console.error('清除用户名失败:', error);
    }
  };

  // 初始化时自动加载
  if (!isNameLoaded.value) {
    loadPlayerName();
  }

  return {
    playerName,
    isNameLoaded,
    loadPlayerName,
    savePlayerName,
    updatePlayerName,
    clearPlayerName,
  };
}
