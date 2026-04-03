#!/bin/bash
# MadKangYu-FigMa-Mcp 자동 설치 스크립트
# 사용법: curl -sL https://raw.githubusercontent.com/MadKangYu/MadKangYu-FigMa-Mcp/main/setup.sh | bash

set -e
echo "🎨 Figma MCP 자동 설치 시작..."

# 1. 공식 Figma MCP (Remote, OAuth)
echo "→ 공식 Figma MCP 서버 추가..."
claude mcp add --transport http figma https://mcp.figma.com/mcp 2>/dev/null || echo "  이미 등록됨"

# 2. figma-mcp-go (무제한, 플러그인 브릿지)
echo "→ figma-mcp-go 서버 추가..."
claude mcp add -s user figma-mcp-go -- npx -y @vkhanhqui/figma-mcp-go@latest 2>/dev/null || echo "  이미 등록됨"

# 3. figma-mcp-go 플러그인 다운로드
PLUGIN_DIR="$HOME/.figma-mcp-go-plugin"
if [ ! -d "$PLUGIN_DIR" ]; then
  echo "→ figma-mcp-go 플러그인 다운로드..."
  mkdir -p "$PLUGIN_DIR"
  curl -sL https://github.com/vkhanhqui/figma-mcp-go/releases/latest/download/plugin.zip -o /tmp/figma-mcp-go-plugin.zip
  unzip -o /tmp/figma-mcp-go-plugin.zip -d "$PLUGIN_DIR" > /dev/null
  rm /tmp/figma-mcp-go-plugin.zip
  echo "  플러그인 경로: $PLUGIN_DIR/plugin-dist/manifest.json"
else
  echo "  플러그인 이미 다운로드됨"
fi

# 4. 학습 자료 clone
LEARN_DIR="$HOME/Projects/figma-mcp-learning"
if [ ! -d "$LEARN_DIR" ]; then
  echo "→ 학습 자료 다운로드..."
  git clone https://github.com/MadKangYu/MadKangYu-FigMa-Mcp.git "$LEARN_DIR" 2>/dev/null
else
  echo "  학습 자료 이미 존재"
fi

echo ""
echo "✅ 설치 완료!"
echo ""
echo "📋 다음 단계 (수동):"
echo "  1. Figma 데스크탑 앱 열기"
echo "  2. Plugins → Development → Import plugin from manifest..."
echo "  3. 경로: $PLUGIN_DIR/plugin-dist/manifest.json"
echo "  4. 플러그인 실행 → WebSocket 자동 연결"
echo ""
echo "🔑 Figma OAuth 인증:"
echo "  Claude Code에서 아무 Figma 도구 호출 시 자동 브라우저 인증"
echo ""
echo "📖 학습 자료: $LEARN_DIR/README.md"
echo ""
echo "💡 바로 시작:"
echo '  "이 Figma 파일에 랜딩페이지 만들어줘 [URL]"'
