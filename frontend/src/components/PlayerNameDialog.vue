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
  font-size: 15px;
  color: #111827;
  text-align: center;
  margin-bottom: 16px;
  font-weight: 500;
}

.name-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 12px;
  background: #fef3c7;
  border-radius: 4px;
  color: #92400e;
  font-size: 12px;
  border: 1px solid #fcd34d;
}

.tip-icon {
  color: #f59e0b;
  font-size: 14px;
  flex-shrink: 0;
}

/* Element Plus Dialog 样式覆盖 */
:deep(.el-dialog) {
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.3);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  padding: 20px 24px;
}

:deep(.el-dialog__title) {
  color: #f1f5f9;
  font-size: 18px;
  font-weight: 600;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  padding: 16px 24px 20px;
  border-top: 1px solid rgba(99, 102, 241, 0.2);
}

:deep(.el-input__wrapper) {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid #475569;
  box-shadow: none;
  transition: all 0.2s;
}

:deep(.el-input__wrapper:hover) {
  border-color: #64748b;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

:deep(.el-input__inner) {
  color: #f1f5f9;
  font-size: 14px;
}

:deep(.el-input__inner::placeholder) {
  color: #64748b;
}

:deep(.el-input__count) {
  color: #64748b;
  background: transparent;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 20px;
  height: 36px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

:deep(.el-button--primary:hover) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
}

:deep(.el-button--primary:disabled) {
  background: #475569;
  color: #94a3b8;
  box-shadow: none;
}

:deep(.el-overlay) {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}
</style>
