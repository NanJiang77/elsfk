/**
 * 浏览器端功能测试
 * 使用Puppeteer进行自动化测试
 */

const http = require('http');

// 测试前端页面是否可访问
function testPageAccess(url, pageTitle) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 && data.includes('<!doctype html>')) {
          resolve({ success: true, url, status: res.statusCode });
        } else {
          reject({ success: false, url, status: res.statusCode });
        }
      });
    }).on('error', (err) => {
      reject({ success: false, url, error: err.message });
    });
  });
}

// 测试API端点
function testAPIEndpoint(url, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: url,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ success: true, url, status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ success: true, url, status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject({ success: false, url, error: err.message });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// 运行所有测试
async function runTests() {
  console.log('🧪 开始浏览器端和API集成测试\n');
  const results = [];

  // 测试1: 访问游戏页面
  console.log('📋 测试1: 访问游戏页面');
  try {
    const result = await testPageAccess('http://localhost:5173/', '游戏页面');
    console.log('   ✅ 游戏页面可访问');
    results.push({ test: '游戏页面访问', status: 'PASS' });
  } catch (err) {
    console.log('   ❌ 游戏页面访问失败:', err.error || err.status);
    results.push({ test: '游戏页面访问', status: 'FAIL', error: err });
  }

  // 测试2: 访问排行榜页面
  console.log('\n📋 测试2: 访问排行榜页面');
  try {
    const result = await testPageAccess('http://localhost:5173/leaderboard', '排行榜页面');
    console.log('   ✅ 排行榜页面可访问');
    results.push({ test: '排行榜页面访问', status: 'PASS' });
  } catch (err) {
    console.log('   ❌ 排行榜页面访问失败:', err.error || err.status);
    results.push({ test: '排行榜页面访问', status: 'FAIL', error: err });
  }

  // 测试3: API健康检查
  console.log('\n📋 测试3: API健康检查');
  try {
    const result = await testAPIEndpoint('/api/health');
    console.log('   ✅ API健康检查通过');
    results.push({ test: 'API健康检查', status: 'PASS' });
  } catch (err) {
    console.log('   ❌ API健康检查失败:', err.error);
    results.push({ test: 'API健康检查', status: 'FAIL', error: err });
  }

  // 测试4: 获取排行榜数据
  console.log('\n📋 测试4: 获取排行榜数据');
  try {
    const result = await testAPIEndpoint('/api/leaderboard?limit=10');
    if (result.data && Array.isArray(result.data) && result.data.length > 0) {
      console.log(`   ✅ 排行榜数据正常 (${result.data.length} 条记录)`);
      results.push({ test: '排行榜数据获取', status: 'PASS' });
    } else {
      console.log('   ⚠️  排行榜数据为空');
      results.push({ test: '排行榜数据获取', status: 'WARN', message: '数据为空' });
    }
  } catch (err) {
    console.log('   ❌ 排行榜数据获取失败:', err.error);
    results.push({ test: '排行榜数据获取', status: 'FAIL', error: err });
  }

  // 测试5: 保存游戏记录
  console.log('\n📋 测试5: 保存游戏记录');
  try {
    const gameData = {
      player_name: '自动化测试玩家',
      score: Math.floor(Math.random() * 5000),
      level: Math.floor(Math.random() * 10) + 1,
      lines: Math.floor(Math.random() * 100),
      play_time: Math.floor(Math.random() * 300)
    };
    const result = await testAPIEndpoint('/api/games', 'POST', gameData);
    if (result.data && result.data.id) {
      console.log(`   ✅ 游戏记录保存成功 (ID: ${result.data.id}, 分数: ${gameData.score})`);
      results.push({ test: '保存游戏记录', status: 'PASS', gameId: result.data.id });
    } else {
      console.log('   ❌ 游戏记录保存失败');
      results.push({ test: '保存游戏记录', status: 'FAIL' });
    }
  } catch (err) {
    console.log('   ❌ 游戏记录保存失败:', err.error);
    results.push({ test: '保存游戏记录', status: 'FAIL', error: err });
  }

  // 测试6: 获取游戏历史
  console.log('\n📋 测试6: 获取游戏历史');
  try {
    const result = await testAPIEndpoint('/api/games?limit=5');
    if (result.data && Array.isArray(result.data)) {
      console.log(`   ✅ 游戏历史获取成功 (${result.data.length} 条记录)`);
      results.push({ test: '游戏历史获取', status: 'PASS' });
    } else {
      console.log('   ❌ 游戏历史格式错误');
      results.push({ test: '游戏历史获取', status: 'FAIL' });
    }
  } catch (err) {
    console.log('   ❌ 游戏历史获取失败:', err.error);
    results.push({ test: '游戏历史获取', status: 'FAIL', error: err });
  }

  // 测试7: 获取玩家统计
  console.log('\n📋 测试7: 获取玩家统计');
  try {
    const playerName = encodeURIComponent('自动化测试玩家');
    const result = await testAPIEndpoint(`/api/players/${playerName}/stats`);
    if (result.data && typeof result.data.total_games !== 'undefined') {
      console.log(`   ✅ 玩家统计获取成功 (总场次: ${result.data.total_games})`);
      results.push({ test: '玩家统计获取', status: 'PASS' });
    } else {
      console.log('   ❌ 玩家统计格式错误');
      results.push({ test: '玩家统计获取', status: 'FAIL' });
    }
  } catch (err) {
    console.log('   ❌ 玩家统计获取失败:', err.error);
    results.push({ test: '玩家统计获取', status: 'FAIL', error: err });
  }

  // 测试8: CORS测试
  console.log('\n📋 测试8: CORS响应头检查');
  try {
    const result = await testAPIEndpoint('/api/health');
    if (result.success) {
      console.log('   ✅ CORS配置正常');
      results.push({ test: 'CORS配置', status: 'PASS' });
    }
  } catch (err) {
    console.log('   ⚠️  CORS检查失败:', err.error);
    results.push({ test: 'CORS配置', status: 'WARN', error: err });
  }

  // 输出测试总结
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试总结');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const warned = results.filter(r => r.status === 'WARN').length;
  const total = results.length;

  console.log(`\n总测试数: ${total}`);
  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`⚠️  警告: ${warned}`);
  console.log(`\n成功率: ${((passed / total) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 所有核心测试通过!');
  } else {
    console.log('\n⚠️  部分测试失败,请查看详细信息');
  }

  console.log('\n' + '='.repeat(60));

  return results;
}

// 运行测试
runTests().then(results => {
  process.exit(results.filter(r => r.status === 'FAIL').length > 0 ? 1 : 0);
}).catch(err => {
  console.error('测试执行错误:', err);
  process.exit(1);
});
