/**
 * 玩家设置状态管理
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePlayerStore = defineStore('player', () => {
  const playerName = ref<string>('玩家');
  const isNameSet = ref<boolean>(false);

  const setPlayerName = (name: string) => {
    playerName.value = name.trim() || '玩家';
    isNameSet.value = true;
    localStorage.setItem('tetris_player_name', playerName.value);
  };

  const loadPlayerName = () => {
    const saved = localStorage.getItem('tetris_player_name');
    if (saved) {
      playerName.value = saved;
      isNameSet.value = true;
    }
  };

  return {
    playerName,
    isNameSet,
    setPlayerName,
    loadPlayerName,
  };
});
