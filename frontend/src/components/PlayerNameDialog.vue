<template>
  <el-dialog
    v-model="isVisible"
    title="欢迎来到俄罗斯方块"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div class="name-dialog-content">
      <p class="dialog-hint">请输入您的名字开始游戏</p>

      <el-input
        v-model="inputName"
        placeholder="请输入名字（2-20个字符）"
        maxlength="20"
        show-word-limit
        clearable
        @keyup.enter="handleConfirm"
        ref="inputRef"
      />

      <div class="name-tips">
        <el-icon class="tip-icon"><InfoFilled /></el-icon>
        <span>您的名字将用于保存游戏记录和排行榜展示</span>
      </div>
    </div>

    <template #footer>
      <el-button
        type="primary"
        @click="handleConfirm"
        :disabled="!isNameValid"
        size="large"
        style="width: 100%"
      >
        开始游戏
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { InfoFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  'confirm': [name: string];
}>();

const inputName = ref('');
const inputRef = ref();

const isVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
});

const isNameValid = computed(() => {
  const name = inputName.value.trim();
  return name.length >= 2 && name.length <= 20;
});

const handleConfirm = () => {
  const name = inputName.value.trim();

  if (name.length < 2) {
    ElMessage.warning('名字至少需要2个字符');
    return;
  }

  if (name.length > 20) {
    ElMessage.warning('名字最多20个字符');
    return;
  }

  emit('confirm', name);
  inputName.value = '';
};

// 自动聚焦输入框
watch(() => props.visible, (visible) => {
  if (visible) {
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
});
</script>

<style scoped>
.name-dialog-content {
  padding: 10px 0;
}

.dialog-hint {
  font-size: 16px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 500;
}

.name-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 6px;
  color: #606266;
  font-size: 13px;
}

.tip-icon {
  color: #409eff;
  font-size: 18px;
  flex-shrink: 0;
}
</style>
