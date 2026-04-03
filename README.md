# Figma MCP 학습 프로젝트

> 2026-04-03 | KangYu + 허민님 사생결단 부트캠프

## 구조

```
figma-mcp-learning/
├── CLAUDE.md               ← Claude 자동 참조 (스킬, 패턴, 원칙)
├── 01-getting-started.md   ← 설치 + 첫 사용 (20분)
├── 02-core-concepts.md     ← MCP 개념 + 필요성 판단
├── 03-tools-and-skills.md  ← 도구 16개 + 스킬 7개 + 커뮤니티
├── 04-workflows.md         ← 워크플로우 8개 + 프롬프트 패턴 15개
├── 05-resources.md         ← 공식 문서 / GitHub / npm 링크
├── QnA.md                  ← 학습 Q&A 13개
├── figma-plugin/           ← figma-mcp-go 플러그인 파일
└── archive/                ← 통합 전 원본 (10개)
```

## 빠른 시작

1. **처음이면** → `01-getting-started.md`
2. **왜 필요한지** → `02-core-concepts.md`
3. **바로 쓰고 싶으면** → `04-workflows.md` 프롬프트 패턴 복붙
4. **레퍼런스 찾기** → `05-resources.md`

## MCP 서버 설정

```bash
# 공식 Remote (OAuth, 읽기+쓰기)
claude mcp add --transport http figma https://mcp.figma.com/mcp

# figma-mcp-go (무제한, 플러그인 브릿지)
claude mcp add -s user figma-mcp-go -- npx -y @vkhanhqui/figma-mcp-go@latest
```

## 핵심 한 줄

> Figma를 디자인 버퍼로 사용 → 코드 수정 전에 시각적 확인 → 확정 후 코드 변환
