<template>
  <el-dialog
    v-model="isVisible"
    title="欢迎来到俄罗斯方块"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    role="dialog"
    aria-labelledby="dialog-title"
    aria-describedby="dialog-hint"
  >
    <div class="name-dialog-content">
      <p id="dialog-hint" class="dialog-hint">请输入您的名字开始游戏</p>

      <el-input
        v-model="inputName"
        placeholder="请输入名字（2-20个字符）"
        maxlength="20"
        show-word-limit
        clearable
        @keyup.enter="handleConfirm"
        ref="inputRef"
        aria-label="玩家名字"
        :aria-invalid="!isNameValid && inputName.length > 0"
        aria-describedby="name-tips"
      />

      <div id="name-tips" class="name-tips" role="note">
        <el-icon class="tip-icon" aria-hidden="true"><InfoFilled /></el-icon>
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
        aria-label="开始游戏"
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
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--tech-text);
  text-align: center;
  margin-bottom: 20px;
  font-weight: 500;
}

.name-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background: rgba(56, 139, 200, 0.05);
  border-radius: 4px;
  color: var(--tech-text-muted);
  font-size: 12px;
  border: 1px solid var(--tech-border);
}

.tip-icon {
  color: var(--tech-accent);
  font-size: 14px;
  flex-shrink: 0;
}

/* Element Plus Dialog 样式覆盖 */
:deep(.el-dialog) {
  background: var(--tech-panel);
  backdrop-filter: blur(20px);
  border-radius: 8px;
  border: 1px solid var(--tech-border);
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid var(--tech-border);
  padding: 20px 24px;
}

:deep(.el-dialog__title) {
  font-family: 'JetBrains Mono', monospace;
  color: var(--tech-text);
  font-size: 14px;
  font-weight: 600;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  padding: 16px 24px 20px;
  border-top: 1px solid var(--tech-border);
}

:deep(.el-input__wrapper) {
  background: rgba(56, 139, 200, 0.05);
  border: 1px solid var(--tech-border);
  box-shadow: none;
  transition: all 0.2s ease;
  border-radius: 4px;
}

:deep(.el-input__wrapper:hover) {
  border-color: var(--tech-accent);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: var(--tech-accent);
  box-shadow: 0 0 0 2px rgba(56, 139, 200, 0.1);
}

:deep(.el-input__inner) {
  color: var(--tech-text);
  font-size: 14px;
  font-family: 'Inter', sans-serif;
}

:deep(.el-input__inner::placeholder) {
  color: var(--tech-text-muted);
}

:deep(.el-input__count) {
  color: var(--tech-text-muted);
  background: transparent;
}

:deep(.el-button--primary) {
  font-family: 'JetBrains Mono', monospace;
  background: var(--tech-accent);
  border: none;
  color: var(--tech-bg);
  font-size: 13px;
  font-weight: 600;
  padding: 10px 20px;
  height: auto;
  transition: all 0.2s ease;
}

:deep(.el-button--primary:hover) {
  background: var(--tech-accent-2);
}

:deep(.el-button--primary:disabled) {
  background: var(--tech-border);
  color: var(--tech-text-muted);
}

:deep(.el-overlay) {
  background: rgba(10, 14, 26, 0.8);
  backdrop-filter: blur(4px);
}
</style>
