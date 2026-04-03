# Figma MCP 시작하기

> 실습 중심. 이론 없음. 순서대로 따라하면 10분 안에 작동함.

---

## 1단계. Figma 계정 + 파일 만들기

1. [figma.com](https://figma.com) 접속 → 로그인 (없으면 무료 계정 생성)
2. 화면 왼쪽 상단 `+ New design file` 클릭
3. 파일이 열리면 브라우저 URL 전체 복사

URL 형태:
```
https://www.figma.com/design/ABC123XYZ/My-Design
```

이 URL이 모든 요청에 필요한 핵심 정보다.

---

## 2단계. Figma API 토큰 발급

1. [figma.com/settings](https://figma.com/settings) 접속
2. "Personal access tokens" 섹션 찾기
3. "Generate new token" 클릭
4. 이름: `Claude Code` 입력
5. 스코프: **File content** 체크 (필수)
6. 토큰 복사 — 한 번만 표시됨, 반드시 저장

---

## 3단계. MCP 서버 설치 (3가지 중 선택)

### 방법 A. 공식 Remote MCP (권장)

Claude Code 터미널에서 한 줄 실행:

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

인증은 OAuth (브라우저 팝업). 설치 후 `/figma` 명령으로 확인.

수동 설정 원하면 `~/.claude/settings.json`에 직접 추가:

```json
{
  "mcpServers": {
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

### 방법 B. figma-mcp-go (무료 플랜, 레이트 제한 없음)

무료 계정이거나 공식 서버의 월 6회 제한이 걸리면 사용.
Go 기반, npx로 실행, 플러그인 브릿지 방식이라 레이트 제한 없음.

```json
{
  "mcpServers": {
    "figma-mcp-go": {
      "command": "npx",
      "args": ["-y", "figma-mcp-go", "--figma-api-key=YOUR-TOKEN"]
    }
  }
}
```

GitHub: [vkhanhqui/figma-mcp-go](https://github.com/vkhanhqui/figma-mcp-go)

### 방법 C. Claude Desktop MCP

Claude Desktop 앱에서: MCP 설정 → Figma 플러그인 추가 → Personal Token 입력.
오프라인 환경이거나 Desktop 앱만 사용할 때 선택.

| 방식 | 인증 | use_figma | 오프라인 | 추천 |
|------|------|-----------|----------|------|
| Remote MCP (공식) | OAuth | 지원 | 불가 | 대부분의 경우 |
| figma-mcp-go | Personal Token | 지원 | 가능 | 무료 플랜 / 무제한 |
| Desktop MCP | Personal Token | 제한적 | 가능 | 특수한 경우만 |

---

## 4단계. Figma URL 복사법

### 파일 전체 URL
브라우저 주소창에서 그대로 복사:
```
https://www.figma.com/design/ABC123XYZ/My-Design
```

### 특정 노드 URL (Cmd+L / Ctrl+L)
Figma에서 프레임/컴포넌트 선택 후 `Cmd+L` (Mac) / `Ctrl+L` (Win):
```
https://www.figma.com/design/ABC123XYZ/My-Design?node-id=123-456
```

### Copy link to selection
우클릭 → "Copy link to selection" — 선택한 요소의 URL 복사.

### 방법 3: Dev Mode URL (코드 변환 시 최고 품질) ⭐
```
https://www.figma.com/design/ABC123/My-Design?node-id=123-456&mode=dev
```
1. Figma에서 요소 선택
2. 상단 메뉴 `</>` (Dev Mode) 클릭
3. 우클릭 → Copy link to selection
4. 링크에 `&mode=dev`가 포함됨

> **Dev Mode 링크를 쓰면 코드 변환 품질이 올라감.**
> Figma가 레이아웃 구조 정보를 더 명확하게 제공 → Claude가 더 정확한 코드 생성.

### Dev Mode에서 Copy example prompt
Dev Mode 패널 오른쪽 상단 "Copy example prompt" 버튼 → Claude Code에 바로 붙여넣기 가능한 프롬프트가 클립보드에 복사됨.

---

## 5단계. 첫 프롬프트 3개

### 읽기: 디자인 → 코드 변환
```
이 Figma 디자인을 React + Tailwind로 구현해줘
https://www.figma.com/design/ABC123XYZ/My-Design?node-id=123-456
```

### 쓰기: AI → 캔버스 생성
```
이 파일에 로그인 화면 만들어줘. 기존 컴포넌트와 색상을 재사용해.
https://www.figma.com/design/ABC123XYZ/My-Design
```

### 코드 변환 (디자인 토큰 포함)
```
이 Figma 파일의 색상, 간격, 타이포 변수를 Tailwind config로 변환해줘
https://www.figma.com/design/ABC123XYZ/My-Design
```

---

## Desktop MCP 설정 (URL 없이 선택만으로 작동)

```
1. Figma 데스크탑 앱 → Preferences → MCP → Enable
2. Claude Code: claude mcp add figma-desktop -- figma-desktop-mcp
3. 사용법: Figma에서 요소 선택 → "현재 선택된 요소를 코드로 변환해줘" (URL 불필요)
```

## figma-mcp-go 플러그인 설치

```
1. Figma 데스크탑 앱 → 아무 파일 열기
2. Plugins → Development → Import plugin from manifest...
3. 경로: figma-plugin/plugin-dist/manifest.json 선택
4. Plugins → Development → Figma MCP Go 실행
5. WebSocket ws://localhost:1994 자동 연결
```

## figma-mcp-go 상세 설정

공식 서버 대신 figma-mcp-go를 선택했다면:

1. `.mcp.json` (프로젝트 루트) 또는 `~/.claude/settings.json`에 위 설정 추가
2. `YOUR-TOKEN` 자리에 2단계에서 발급한 토큰 입력
3. Claude Code 재시작 → `/mcp` 명령으로 서버 연결 확인

**장점 요약:**
- 레이트 제한 없음 (공식 서버는 Free 플랜 월 6회)
- Figma Plugin API 브릿지 방식으로 안정적
- npx 기반이라 별도 설치 불필요
- Pro/Org 플랜 없어도 실질적으로 무제한 사용 가능
