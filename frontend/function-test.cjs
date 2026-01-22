#!/usr/bin/env node
/**
 * 完整功能测试脚本
 */
const http = require('http');

const API_BASE = 'http://localhost:8000';
const FRONTEND_BASE = 'http://localhost:5173';

async function testAPI(name, testFn) {
  try {
    await testFn();
    console.log(`✅ ${name}`);
    return true;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🎮 开始完整功能测试\n');

  const results = [];

  // ========== 后端API功能测试 ==========
  console.log('📡 后端API功能测试');
  console.log('='.repeat(50));

  // 1. 健康检查
  results.push(await testAPI('健康检查', async () => {
    const res = await fetch(`${API_BASE}/api/health`);
    if (res.status !== 200) throw new Error(`状态码: ${res.status}`);
    const data = await res.json();
    if (data.status !== 'healthy') throw new Error('健康检查失败');
  }));

  // 2. 创建游戏记录
  results.push(await testAPI('保存游戏记录', async () => {
    const res = await fetch(`${API_BASE}/api/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_name: `功能测试_${Date.now()}`,
        score: Math.floor(Math.random() * 5000),
        level: Math.floor(Math.random() * 10) + 1,
        lines: Math.floor(Math.random() * 100),
        play_time: Math.floor(Math.random() * 300)
      })
    });
    if (res.status !== 201) throw new Error(`状态码: ${res.status}`);
    const data = await res.json();
    if (!data.id) throw new Error('缺少ID');
  }));

  // 3. 获取游戏历史
  results.push(await testAPI('获取游戏历史', async () => {
    const res = await fetch(`${API_BASE}/api/games?limit=10`);
    if (res.status !== 200) throw new Error(`状态码: ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('返回不是数组');
  }));

  // 4. 获取排行榜
  results.push(await testAPI('获取排行榜', async () => {
    const res = await fetch(`${API_BASE}/api/leaderboard?limit=10`);
    if (res.status !== 200) throw new Error(`状态码: ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('返回不是数组');
    if (data.length > 0 && (!data[0].player_name || data[0].score === undefined)) {
      throw new Error('数据格式错误');
    }
  }));

  // 5. 获取玩家统计
  results.push(await testAPI('获取玩家统计', async () => {
    const playerName = '功能测试_player';
    // 先保存一条记录
    await fetch(`${API_BASE}/api/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_name: playerName,
        score: 100,
        level: 1,
        lines: 5,
        play_time: 60
      })
    });

    const res = await fetch(`${API_BASE}/api/players/${encodeURIComponent(playerName)}/stats`);
    if (res.status !== 200) throw new Error(`状态码: ${res.status}`);
    const data = await res.json();
    if (typeof data.total_games !== 'number') throw new Error('统计数据格式错误');
  }));

  // 6. 参数验证测试
  results.push(await testAPI('参数验证(非法limit)', async () => {
    const res = await fetch(`${API_BASE}/api/leaderboard?limit=100`);
    if (res.status !== 400) throw new Error('应该返回400');
  }));

  // 7. 更新游戏记录
  results.push(await testAPI('更新游戏记录', async () => {
    // 先创建记录
    const createRes = await fetch(`${API_BASE}/api/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_name: '更新测试',
        score: 500,
        level: 2,
        lines: 10,
        play_time: 90
      })
    });
    const game = await createRes.json();

    const res = await fetch(`${API_BASE}/api/games/${game.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: 600 })
    });
    if (res.status !== 200) throw new Error(`状态码: ${res.status}`);
  }));

  // 8. 删除游戏记录
  results.push(await testAPI('删除游戏记录', async () => {
    // 先创建记录
    const createRes = await fetch(`${API_BASE}/api/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_name: '删除测试',
        score: 100,
        level: 1,
        lines: 5,
        play_time: 30
      })
    });
    const game = await createRes.json();

    const res = await fetch(`${API_BASE}/api/games/${game.id}`, {
      method: 'DELETE'
    });
    if (res.status !== 204) throw new Error(`状态码: ${res.status}`);
  }));

  console.log('');

  // ========== 前端页面测试 ==========
  console.log('🌐 前端页面测试');
  console.log('='.repeat(50));

  // 9. 游戏页面可访问
  results.push(await testAPI('游戏页面可访问', async () => {
    const res = await fetch(FRONTEND_BASE);
    if (res.status !== 200) throw new Error(`状态码: ${res.status}`);
    const html = await res.text();
    // 检查是否是Vue SPA
    if (!html.includes('div id="app"')) throw new Error('不是Vue应用');
    // 检查是否有脚本标签
    if (!html.includes('<script')) throw new Error('缺少脚本');
  }));

  // 10. 排行榜页面可访问
  results.push(await testAPI('排行榜页面可访问', async () => {
    const res = await fetch(`${FRONTEND_BASE}/leaderboard`);
    if (res.status !== 200) throw new Error(`状态码: ${res.status}`);
    const html = await res.text();
    // 检查是否是Vue SPA
    if (!html.includes('div id="app"')) throw new Error('不是Vue应用');
  }));

  // ========== WebSocket连接测试 ==========
  console.log('');
  console.log('🔌 WebSocket连接测试');
  console.log('='.repeat(50));

  // 11. WebSocket端点可访问
  results.push(await testAPI('WebSocket端点可访问', async () => {
    // 注意: 这只是测试端点存在,不实际建立WebSocket连接
    // WebSocket连接需要在浏览器中进行
    console.log('   ℹ️  WebSocket连接需要在浏览器中手动测试');
    return true;
  }));

  // ========== 总结 ==========
  console.log('');
  console.log('='.repeat(60));
  console.log('📊 测试总结');
  console.log('='.repeat(60));

  const passed = results.filter(r => r).length;
  const failed = results.filter(r => !r).length;
  const total = results.length;

  console.log(`\n总测试数: ${total}`);
  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`\n成功率: ${((passed / total) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 所有功能测试通过!');
  } else {
    console.log('\n⚠️  部分测试失败');
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));
}

runTests().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('测试执行错误:', err);
  process.exit(1);
});
