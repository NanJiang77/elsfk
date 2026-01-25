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
  background: var(--tech-panel);
  backdrop-filter: blur(16px);
  border-radius: 6px;
  padding: 20px;
  border: 1px solid var(--tech-border);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .controls-panel {
    width: 100%;
    max-width: 200px;
  }
}

.panel-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--tech-accent);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.key-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.key-card {
  background: rgba(56, 139, 200, 0.05);
  border-radius: 4px;
  padding: 10px 12px;
  border: 1px solid var(--tech-border);
  transition: all 0.2s ease;
  cursor: default;
}

.key-card:hover {
  border-color: var(--tech-accent);
  background: rgba(56, 139, 200, 0.1);
}

.key-card:focus-visible {
  outline: 2px solid var(--tech-accent);
  outline-offset: 2px;
}

.key-icon {
  display: inline-block;
  background: var(--tech-bg);
  border: 1px solid var(--tech-border);
  border-radius: 3px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--tech-accent);
  font-family: 'JetBrains Mono', monospace;
}

.key-desc {
  font-size: 11px;
  color: var(--tech-text-muted);
  font-weight: 500;
}
</style>
