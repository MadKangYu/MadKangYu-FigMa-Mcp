#!/bin/bash
# MadKangYu-FigMa-Mcp 자동 설치 스크립트
# 사용법: curl -sL https://raw.githubusercontent.com/MadKangYu/MadKangYu-FigMa-Mcp/main/setup.sh | bash
set -e
echo "🎨 Figma MCP 올인원 설치 시작..."
echo ""

# 0. 필수 도구 확인
if ! command -v node &> /dev/null; then
  echo "❌ Node.js가 필요합니다. https://nodejs.org 에서 설치하세요."
  exit 1
fi

if ! command -v claude &> /dev/null; then
  echo "❌ Claude Code가 필요합니다. npm install -g @anthropic-ai/claude-code"
  exit 1
fi

# 1. Figma 데스크탑 앱 설치 (macOS)
if [ "$(uname)" = "Darwin" ]; then
  if [ ! -d "/Applications/Figma.app" ]; then
    echo "→ Figma 데스크탑 앱 설치 중 (Homebrew)..."
    if command -v brew &> /dev/null; then
      brew install --cask figma
    else
      echo "  Homebrew 없음 → https://www.figma.com/downloads/ 에서 직접 다운로드"
      open "https://www.figma.com/downloads/"
    fi
  else
    echo "✅ Figma 데스크탑 앱 이미 설치됨"
  fi
fi

# 2. 공식 Figma MCP (Remote, OAuth)
echo "→ 공식 Figma MCP 서버 추가..."
claude mcp add --transport http figma https://mcp.figma.com/mcp 2>/dev/null || echo "  이미 등록됨"

# 3. figma-mcp-go (무제한, 플러그인 브릿지)
echo "→ figma-mcp-go 서버 추가..."
claude mcp add -s user figma-mcp-go -- npx -y @vkhanhqui/figma-mcp-go@latest 2>/dev/null || echo "  이미 등록됨"

# 4. figma-mcp-go 플러그인 다운로드
PLUGIN_DIR="$HOME/.figma-mcp-go-plugin"
echo "→ figma-mcp-go 플러그인 다운로드..."
mkdir -p "$PLUGIN_DIR"
curl -sL https://github.com/vkhanhqui/figma-mcp-go/releases/latest/download/plugin.zip -o /tmp/figma-mcp-go-plugin.zip
unzip -o /tmp/figma-mcp-go-plugin.zip -d "$PLUGIN_DIR" > /dev/null
rm /tmp/figma-mcp-go-plugin.zip

# 5. 학습 자료 clone
LEARN_DIR="$HOME/Projects/figma-mcp-learning"
if [ ! -d "$LEARN_DIR" ]; then
  echo "→ 학습 자료 다운로드..."
  mkdir -p "$HOME/Projects"
  git clone https://github.com/MadKangYu/MadKangYu-FigMa-Mcp.git "$LEARN_DIR" 2>/dev/null
else
  echo "→ 학습 자료 업데이트..."
  cd "$LEARN_DIR" && git pull origin main 2>/dev/null || true
fi

echo ""
echo "============================================"
echo "✅ 설치 완료!"
echo "============================================"
echo ""
echo "📦 설치된 것:"
echo "  • Figma 데스크탑 앱"
echo "  • 공식 Figma MCP 서버 (OAuth, 읽기+쓰기)"
echo "  • figma-mcp-go 서버 (무제한)"
echo "  • figma-mcp-go 플러그인"
echo "  • 학습 자료 (프롬프트 패턴 15개, 워크플로우 8개)"
echo ""
echo "📋 마지막 한 단계 (1회만):"
echo "  1. Figma 데스크탑 앱 열기"
echo "  2. 아무 파일 열기"
echo "  3. Plugins → Development → Import plugin from manifest..."
echo "  4. 경로: $PLUGIN_DIR/plugin-dist/manifest.json"
echo "  5. 플러그인 실행 → 자동 연결"
echo ""
echo "🚀 바로 시작:"
echo '  Claude Code에서: "이 Figma에 랜딩페이지 만들어줘 [URL]"'
echo ""
echo "📖 학습 자료: $LEARN_DIR/README.md"
echo "🔄 업데이트: curl -sL https://raw.githubusercontent.com/MadKangYu/MadKangYu-FigMa-Mcp/main/update.sh | bash"
