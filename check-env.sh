#!/bin/bash
# Figma MCP Environment Checker
# Usage: bash check-env.sh

echo "========================================"
echo "  Figma MCP Environment Check"
echo "========================================"
echo ""

PASS=0
WARN=0
FAIL=0

check() {
  local name="$1" cmd="$2" min="$3"
  local ver
  ver=$(eval "$cmd" 2>/dev/null)
  if [ -z "$ver" ]; then
    echo "  FAIL  $name — not installed"
    FAIL=$((FAIL+1))
  else
    echo "  OK    $name — $ver"
    PASS=$((PASS+1))
  fi
}

echo "[System]"
check "Node.js (18+)" "node -v"
check "npm" "npm -v"
check "Git" "git --version | cut -d' ' -f3"

if [ "$(uname)" = "Darwin" ]; then
  check "Homebrew" "brew --version 2>/dev/null | head -1"
  if [ -d "/Applications/Figma.app" ]; then
    echo "  OK    Figma Desktop — installed"
    PASS=$((PASS+1))
  else
    echo "  FAIL  Figma Desktop — not installed (brew install --cask figma)"
    FAIL=$((FAIL+1))
  fi
fi

echo ""
echo "[Claude Code]"
check "Claude Code" "claude --version 2>/dev/null | head -1"

echo ""
echo "[MCP Servers]"
if command -v claude &> /dev/null; then
  figma_status=$(claude mcp list 2>/dev/null | grep "figma" || echo "")
  if echo "$figma_status" | grep -q "Connected"; then
    echo "  OK    Figma MCP — connected"
    PASS=$((PASS+1))
  elif echo "$figma_status" | grep -q "authentication"; then
    echo "  WARN  Figma MCP — needs authentication (call any Figma tool to trigger OAuth)"
    WARN=$((WARN+1))
  elif [ -n "$figma_status" ]; then
    echo "  WARN  Figma MCP — registered but not connected"
    WARN=$((WARN+1))
  else
    echo "  FAIL  Figma MCP — not registered (run setup.sh)"
    FAIL=$((FAIL+1))
  fi

  fmg_status=$(claude mcp list 2>/dev/null | grep "figma-mcp-go" || echo "")
  if echo "$fmg_status" | grep -q "Connected"; then
    echo "  OK    figma-mcp-go — connected (unlimited)"
    PASS=$((PASS+1))
  elif [ -n "$fmg_status" ]; then
    echo "  WARN  figma-mcp-go — registered, run Figma plugin to connect"
    WARN=$((WARN+1))
  else
    echo "  WARN  figma-mcp-go — not registered (optional, for unlimited usage)"
    WARN=$((WARN+1))
  fi
else
  echo "  FAIL  Claude Code not installed — cannot check MCP servers"
  FAIL=$((FAIL+1))
fi

echo ""
echo "[Figma Plugin]"
if [ -f "$HOME/.figma-mcp-go-plugin/plugin-dist/manifest.json" ]; then
  echo "  OK    figma-mcp-go plugin — downloaded"
  PASS=$((PASS+1))
else
  echo "  WARN  figma-mcp-go plugin — not downloaded (run setup.sh)"
  WARN=$((WARN+1))
fi

echo ""
echo "========================================"
echo "  Results: $PASS passed, $WARN warnings, $FAIL failed"
echo "========================================"

if [ $FAIL -gt 0 ]; then
  echo ""
  echo "  Fix failures first:"
  echo "  curl -sL https://raw.githubusercontent.com/MadKangYu/MadKangYu-FigMa-Mcp/main/setup.sh | bash"
fi
