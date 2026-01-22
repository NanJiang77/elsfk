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
  width: 200px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
  color: var(--text-primary);
}

.key-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.key-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  transition: background 0.2s;
}

.key-card:hover {
  background: rgba(255, 255, 255, 0.15);
}

.key-icon {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.key-desc {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
