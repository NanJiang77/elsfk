<template>
  <div class="controls-panel">
    <h3 class="panel-title">操作说明</h3>

    <div class="key-cards">
      <div class="key-card">
        <div class="key-icon">←</div>
        <div class="key-desc">左移</div>
      </div>

      <div class="key-card">
        <div class="key-icon">→</div>
        <div class="key-desc">右移</div>
      </div>

      <div class="key-card">
        <div class="key-icon">↑</div>
        <div class="key-desc">旋转</div>
      </div>

      <div class="key-card">
        <div class="key-icon">↓</div>
        <div class="key-desc">加速</div>
      </div>

      <div class="key-card">
        <div class="key-icon">Space</div>
        <div class="key-desc">硬降</div>
      </div>

      <div class="key-card">
        <div class="key-icon">P/p</div>
        <div class="key-desc">暂停/继续</div>
      </div>

      <div class="key-card">
        <div class="key-icon">R/r</div>
        <div class="key-desc">重新开始</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 操作说明面板 - 纯展示组件，无需逻辑
</script>

<style scoped>
.controls-panel {
  width: 220px;
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #cbd5e1;
  text-align: center;
}

.key-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.key-card {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  border: 1px solid rgba(71, 85, 105, 0.3);
  transition: all 0.2s;
}

.key-card:hover {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.5);
}

.key-icon {
  display: inline-block;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid #475569;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #e2e8f0;
}

.key-desc {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}
</style>
