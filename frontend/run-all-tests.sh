#!/bin/bash

# 俄罗斯方块游戏 - 测试执行脚本
# 快速运行全部测试

set -e  # 遇到错误立即退出

echo "=================================================="
echo "🎮 俄罗斯方块游戏 - 完整测试套件"
echo "=================================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 单元测试
echo -e "${YELLOW}📦 [1/5] 运行单元测试...${NC}"
npm test -- --run tests/services 2>&1 | grep -E "(Test Files|Tests|passed|Duration)" | tail -5
echo -e "${GREEN}✅ 单元测试完成${NC}"
echo ""

# 2. 组件测试
echo -e "${YELLOW}🧩 [2/5] 运行组件测试...${NC}"
npm test -- --run tests/components 2>&1 | grep -E "(Test Files|Tests|passed|Duration)" | tail -5
echo -e "${GREEN}✅ 组件测试完成${NC}"
echo ""

# 3. 设备检测测试
echo -e "${YELLOW}📱 [3/5] 运行设备检测测试...${NC}"
npm test -- --run tests/device.test.ts 2>&1 | grep -E "(Test Files|Tests|passed|Duration)" | tail -5
echo -e "${GREEN}✅ 设备检测测试完成${NC}"
echo ""

# 4. E2E测试
echo -e "${YELLOW}🔄 [4/5] 运行E2E测试...${NC}"
npm test -- --run tests/e2e 2>&1 | grep -E "(Test Files|Tests|passed|Duration)" | tail -5
echo -e "${GREEN}✅ E2E测试完成${NC}"
echo ""

# 5. 生成测试摘要
echo -e "${YELLOW}📊 [5/5] 生成测试摘要...${NC}"
npm test -- --run 2>&1 | tee test_summary.txt | grep -E "(Test Files|Tests|passed|Duration)" | tail -5
echo -e "${GREEN}✅ 测试摘要已生成${NC}"
echo ""

# 总结
echo "=================================================="
echo -e "${GREEN}🎉 所有测试执行完成！${NC}"
echo "=================================================="
echo ""
echo "📝 查看详细报告:"
echo "   cat test_summary.txt"
echo "   cat TEST_EXECUTION_REPORT.md"
echo ""
echo "🚀 快速测试命令:"
echo "   npm test -- --run              # 运行所有测试"
echo "   npm test -- --watch            # 监听模式"
echo "   npm test -- tests/services     # 只运行单元测试"
echo "   npm test -- tests/components   # 只运行组件测试"
echo ""
