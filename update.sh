#!/bin/bash
# MadKangYu-FigMa-Mcp 자동 업데이트 스크립트
set -e
echo "🔄 Figma MCP 업데이트 시작..."

# 1. 학습 자료 업데이트
LEARN_DIR="$HOME/Projects/figma-mcp-learning"
if [ -d "$LEARN_DIR/.git" ]; then
  echo "→ 학습 자료 pull..."
  cd "$LEARN_DIR" && git pull origin main
else
  echo "→ 학습 자료 clone..."
  git clone https://github.com/MadKangYu/MadKangYu-FigMa-Mcp.git "$LEARN_DIR" 2>/dev/null
fi

# 2. figma-mcp-go 플러그인 최신 버전
PLUGIN_DIR="$HOME/.figma-mcp-go-plugin"
echo "→ figma-mcp-go 플러그인 최신 버전 다운로드..."
rm -rf "$PLUGIN_DIR"
mkdir -p "$PLUGIN_DIR"
curl -sL https://github.com/vkhanhqui/figma-mcp-go/releases/latest/download/plugin.zip -o /tmp/figma-mcp-go-plugin.zip
unzip -o /tmp/figma-mcp-go-plugin.zip -d "$PLUGIN_DIR" > /dev/null
rm /tmp/figma-mcp-go-plugin.zip

# 3. npx 캐시 갱신
echo "→ figma-mcp-go npm 패키지 캐시 갱신..."
npx -y @vkhanhqui/figma-mcp-go@latest --version 2>/dev/null || true

echo ""
echo "✅ 업데이트 완료!"
echo "  플러그인: $PLUGIN_DIR/plugin-dist/manifest.json"
echo "  Figma 데스크탑에서 플러그인 재실행하면 최신 버전 적용"
