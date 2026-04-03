# Figma MCP 도구 & 스킬 레퍼런스

> 2026-04-03 — 02-tools-reference + 08-official-skills-reference + 10-devmode-and-community 통합

---

## MCP 서버 4종 비교

| 서버 | 방식 | 읽기 | 쓰기 | 특징 |
|------|------|------|------|------|
| **공식 Remote** (`mcp.figma.com`) | HTTP OAuth | O | O (`use_figma`) | 설치 불필요, 항상 최신 |
| **Framelink** (GLips/Figma-Context-MCP) | PAT + REST | O | X | 토큰 절약, 14,100+ Stars |
| **Grab** (cursor-talk-to-figma-mcp) | WebSocket + Plugin | O | O | Figma Plugin API 직접, 6,600+ Stars |
| **Console** (southleft/figma-console-mcp) | PAT + REST | O | 제한 | 디자인 시스템 API처럼 사용, 1,400+ Stars |
| **figma-mcp-go** (vkhanhqui) | REST | O | X | **무료 플랜용** — 레이트 제한 없음, Go 기반 |

### 추천 조합

| 상황 | 추천 | 이유 |
|------|------|------|
| **입문/학습** | 공식 Remote만 | 설치 1줄, OAuth만 하면 끝 |
| **실전 개발 (Free)** | 공식 Remote + figma-mcp-go | 읽기 무제한 우회 |
| **실전 개발 (Pro)** | 공식 Remote만 | 200회/일 충분, 안정적 |
| **디자인 시스템 팀** | 공식 Remote + Console | 92개 도구, 디버깅 |
| **오프라인/로컬** | Desktop MCP | URL 불필요, 선택만으로 작동 |

**공식 Remote 설치:**
```bash
# Claude Code
claude mcp add --transport http figma https://mcp.figma.com/mcp

# VS Code: MCP:Add Server → HTTP → https://mcp.figma.com/mcp
# Cursor: /add-plugin figma
```

---

## 전체 MCP 도구

> **읽기 도구 = URL만 주면 자동**. 쓰기/수정은 스킬(Skills)이 필요.

### 읽기 전용 도구 (6개 핵심)

| 도구 | 용도 | 언제 쓰나 |
|------|------|----------|
| `get_file` | 파일 전체 구조 읽기 | 어떤 요소가 있는지 파악, 코드 변환 전 구조 이해 |
| `get_styles` | 색상/폰트/스타일 읽기 | 디자인에 일관된 스타일 적용할 때 |
| `get_components` | 컴포넌트 목록 읽기 | 버튼/카드/헤더 등 재사용 요소 파악 |
| `get_variables` | 디자인 토큰 읽기 | 색상/간격/폰트를 코드 변수로 추출, 라이트/다크 모드 |
| `get_code_connect` | 디자인-코드 연결 정보 | Figma 컴포넌트 ↔ 코드 컴포넌트 매핑 확인 |
| `get_images` | 이미지/아이콘 내보내기 | 특정 요소를 PNG/SVG/JPG/PDF로 추출 |
| `get_design_context` | 디자인 데이터 + 코드 + 스크린샷 | **가장 많이 씀** — 디자인→코드 변환 (위 5개 통합) |

> **`get_design_context` 하나면 대부분 해결.** 나머지 5개는 특정 상황에서 개별 호출.
>
> **`get_design_context` 기본 출력: React + Tailwind.** 프롬프트로 변경 가능:
> - "Generate my Figma selection in Vue."
> - "Generate my Figma selection in plain HTML + CSS."
> - "Generate my Figma selection in iOS."
> - "using components from src/components/ui"

### 쓰기/검색 도구

| 도구 | 용도 | 예시 프롬프트 |
|------|------|------------|
| `use_figma` | Plugin API로 캔버스에 JS 실행 | "fix the auto-layout spacing on the nav" |
| `generate_figma_design` | 웹 UI → Figma 변환 | "이 웹사이트를 Figma로 변환해줘" |
| `search_design_system` | 라이브러리 전체 검색 | "button 컴포넌트 찾아줘" — 새로 만들지 말고 기존 재사용 |
| `create_new_file` | 빈 파일 생성 | — |
| `generate_diagram` | FigJam 다이어그램 | — |

### 기타 도구 (특수 상황)

| 도구 | 용도 | 언제 쓰나 |
|------|------|----------|
| `get_screenshot` | 노드 시각적 캡처 | 변환 결과 비교 확인 |
| `get_metadata` | 노드 맵 | 대용량 파일에서 구조 파악 |
| `get_figjam` | FigJam 보드 읽기 | FigJam 다이어그램 분석 |
| `get_variable_defs` | 변수/토큰 정의 | 디자인 토큰 추출 |
| `whoami` | 사용자/플랜 정보 | 현재 권한 확인 |
| `create_design_system_rules` | CLAUDE.md 규칙 생성 | 프로젝트 초기 설정 |

### Code Connect 도구 (Org 플랜 이상)

| 도구 | 용도 |
|------|------|
| `get_code_connect_suggestions` | 미매핑 컴포넌트 발견 |
| `get_context_for_code_connect` | 컴포넌트 속성 가져오기 |
| `add_code_connect_map` | 매핑 등록 |
| `send_code_connect_mappings` | 매핑 일괄 전송 |
| `get_code_connect_map` | 기존 매핑 읽기 |

---

## 도구 vs 스킬 차이

| 구분 | 비유 | 실제 역할 |
|------|------|---------|
| **도구 (Tool)** | 재료 (밀가루, 달걀) | Figma 파일을 읽는 기능 |
| **스킬 (Skill)** | 레시피 (케이크 만드는 법) | 도구를 어떤 순서로 쓸지 안내하는 절차 |

- 도구만 있으면: "카드 만들어줘" → Claude가 스스로 추측해야 함
- 스킬이 있으면: "카드 만들 때는 이 순서, 이 규칙, 이 방식으로" → 일관된 결과

### 스킬 직접 호출 문법
```
/figma-use Figma [URL]에 가격 카드 컴포넌트 만들어줘
/figma-generate-design Figma [URL]에 모바일 설정 화면 만들어줘
/figma-generate-library Figma [URL]에 버튼, 인풋, 배지 컴포넌트 세트 만들어줘
```

### 코드 변환 전용 빌트인 스킬 4가지

| 스킬 | 변환 | 언제 |
|------|------|------|
| `react-component` | Figma → React 컴포넌트 | React 프로젝트 |
| `html-css` | Figma → HTML + CSS | 프레임워크 없이 |
| `tailwind` | Figma → Tailwind 클래스 | Tailwind 프로젝트 |
| `design-tokens` | Figma 변수 → CSS/JSON/TS | 디자인 시스템 구축 시 |

### 스킬 저장 위치
```
~/.hermes/skills/mcp/
```

---

## 공식 스킬 7개 + 추천 순위

> 출처: github.com/figma/mcp-server-guide/skills/
> **⚠️ figma-use 스킬은 항상 먼저 로드** — 모든 쓰기 작업 전 필수

### 추천 순위

| 순위 | 스킬 | 빈도 | 누가 쓰나 |
|:---:|------|------|---------|
| ★★★ | `figma-implement-design` | 매일 | 모든 개발자 — 디자인→코드 변환 |
| ★★★ | `figma-use` | 매일 | 모든 쓰기 작업의 필수 전제 |
| ★★☆ | `figma-generate-design` | 자주 | 새 화면/와이어프레임 생성 |
| ★★☆ | `figma-create-design-system-rules` | 프로젝트 초기 | CLAUDE.md 규칙 자동 생성 |
| ★☆☆ | `figma-generate-library` | 드물게 | 디자인 시스템 팀 (20-100+ 호출) |
| ★☆☆ | `figma-code-connect` | 드물게 | Org 플랜 이상, 컴포넌트 매핑 |
| ☆☆☆ | `figma-create-new-file` | 거의 안 씀 | 빈 파일 만들 때만 |

> **처음 시작? `figma-implement-design` 하나만 알면 됨.**
> 쓰기 작업 시 `figma-use`는 자동 로드.

---

### 1. figma-use (기본 — 핵심) ★★★
`use_figma` 도구 사용 전체 규칙 정의. 17개 Critical Rules 포함.
- `return`으로 출력 (figma.notify 금지)
- 색상값 0-1 범위 (0-255 아님)
- fills/strokes는 새 배열로 교체 (읽기전용 배열 직접 수정 불가)
- 폰트 조작 전 `loadFontAsync()` 반드시 호출
- `layoutSizingHorizontal/Vertical = 'FILL'`은 `appendChild` 이후에 설정
- 새 최상위 노드는 (0,0)이 아닌 곳에 배치
- 실패한 스크립트는 atomic (부분 실행 없음)

### 2. figma-implement-design (디자인 → 코드)
Figma 디자인을 프로덕션 레디 코드로 변환. **실무에서 가장 자주 쓰는 스킬.**
- 입력: URL 파싱 (Remote) 또는 현재 선택 (Desktop)
- 순서: `get_design_context` → 스크린샷 → 에셋 다운로드 → 코드 변환 → 1:1 검증
- 규칙: 기존 프로젝트 컴포넌트 우선, 새 아이콘 패키지 임포트 금지, 플레이스홀더 금지

### 3. figma-generate-design (코드 → Figma)
코드베이스 디자인 시스템으로 Figma에 풀페이지 화면 구축.
- 디자인 시스템 발견 3가지: 기존 화면 inspect(선호) → `search_design_system` → `getLocalVariableCollectionsAsync`
- 핵심 규칙: 섹션을 Wrapper 안에 직접 빌드 (나중에 reparent 금지)

### 4. figma-generate-library (디자인 시스템 구축) ★ 가장 방대
프로페셔널 급 디자인 시스템 전체 구축. **절대 one-shot 아님 — 20~100+ 호출 필요.**
- 5단계: Discovery → Foundations(토큰) → File Structure → Components → Integration+QA
- 토큰 규모별: <50개 단일 컬렉션 / 50-200개 3계층 / 200개+ 다수 semantic
- 상태 저장: `getSharedPluginData()` + `/tmp/dsb-state-{RUN_ID}.json`

### 5. figma-code-connect (디자인 ↔ 코드 연결)
`.figma.js` 파일 생성으로 컴포넌트 매핑.
- 속성 매핑: TEXT→`getString`, BOOLEAN→`getBoolean`, VARIANT→`getEnum`, INSTANCE_SWAP→`getInstanceSwap`
- 지원 템플릿: `figma.tsx`, `figma.html`, `figma.swift`, `figma.kotlin`, `figma.code`

### 6. figma-create-design-system-rules (프로젝트 규칙 생성)
코드베이스 분석 후 커스텀 디자인 시스템 규칙 생성.
- Claude Code → `CLAUDE.md` / Cursor → `.cursor/rules/figma-design-system.mdc`
- 규칙 카테고리: Essential(컴포넌트, 토큰, 스타일링) / Recommended / Optional

### 7. figma-create-new-file (빈 파일 생성)
가장 단순한 스킬. `editorType`: `design` 또는 `figjam`. 반환: `file_key`, `file_url`.

---

## 스킬 활성화 방법

Claude Code에서 슬래시 명령으로 직접 호출:
```
/figma-implement-design   → 디자인 → 코드
/figma-generate-design    → 코드 → Figma 화면
/figma-generate-library   → 디자인 시스템 구축
/figma-code-connect       → 컴포넌트 매핑
/figma-use                → use_figma 직접 실행
```

---

## "어떤 스킬 쓸까?" 의사결정 매트릭스

| 상황 | 스킬 | 핵심 도구 |
|------|------|----------|
| Figma 디자인 → React/Next 코드 | `figma-implement-design` | `get_design_context` |
| 아이디어 설명 → Figma 화면 생성 | `figma-generate-design` | `use_figma` |
| 처음부터 디자인 시스템 구축 | `figma-generate-library` | `use_figma` × 100+ |
| 기존 컴포넌트를 코드에 연결 | `figma-code-connect` | `get_context_for_code_connect` |
| 프로젝트 전용 규칙 만들기 | `figma-create-design-system-rules` | `create_design_system_rules` |
| 빈 Figma 파일 필요 | `figma-create-new-file` | `create_new_file` |
| Plugin API 스크립트 직접 실행 | `figma-use` | `use_figma` |

---

## Dev Mode 통합

### Remote MCP (URL 기반)
```
프레임 선택 → Cmd+L → URL을 Claude Code에 붙여넣기
→ get_design_context가 자동으로 요소값 추출
```

### Desktop MCP (선택 기반 — URL 불필요)
```
Figma 데스크탑 앱에서 요소 선택 → Claude Code에 요청
→ "현재 선택된 요소를 코드로 변환해줘"
→ figma-desktop MCP가 선택된 노드를 직접 읽음
```

| 방식 | URL 필요 | 쓰기 | 추천 상황 |
|------|----------|------|----------|
| Remote MCP | O (Cmd+L) | O | 팀 협업, 원격 |
| Desktop MCP | X | O | 혼자 빠르게 작업 |

### Dev Mode 전용 기능
- "Copy example prompt" 버튼 → MCP 프롬프트 자동 생성
- Code Connect → Dev Mode Inspect 패널에 코드 스니펫 표시

---

## 커뮤니티 도구 주요 5개

| 저장소 | Stars | 특징 |
|--------|-------|------|
| [GLips/Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP) | 14,100+ | 읽기 특화, 토큰 절약 |
| [grab/cursor-talk-to-figma-mcp](https://github.com/grab/cursor-talk-to-figma-mcp) | 6,600+ | WebSocket, 벌크 텍스트 교체 |
| [southleft/figma-console-mcp](https://github.com/southleft/figma-console-mcp) | 1,400+ | 디자인 시스템 API화 |
| [vkhanhqui/figma-mcp-go](https://github.com/vkhanhqui/figma-mcp-go) | 315 | **무료 플랜용**, 레이트 제한 없음 |
| [gethopp/figma-mcp-bridge](https://github.com/gethopp/figma-mcp-bridge) | 120 | API 레이트 제한 우회 |

---

## 에러 처리 & 트러블슈팅

| 에러 | 원인 | 해결 |
|------|------|------|
| **20KB 초과** | 응답이 너무 큼 | 노드 범위 좁히기 → 섹션 단위로 분할 요청 |
| **인증 실패** | OAuth 만료 또는 PAT 오류 | Remote: 재로그인 / Framelink: PAT 재발급 |
| **레이트 제한** | Free/Starter 플랜 (월 6회) | figma-mcp-go 또는 figma-mcp-bridge로 전환 |
| **use_figma 스크립트 실패** | 부분 실행 없음 (atomic) | 스크립트 전체 재작성 후 재시도. fills 직접 수정 → 새 배열로 교체 확인 |
| **FILL sizing 오류** | appendChild 전에 FILL 설정 | appendChild 완료 후 layoutSizing 설정 |
| **폰트 로드 오류** | loadFontAsync 누락 | 텍스트 조작 전 반드시 `await loadFontAsync(...)` |
