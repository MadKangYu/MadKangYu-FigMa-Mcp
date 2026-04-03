# Figma MCP 핵심 개념

> 설치 방법은 01-getting-started.md 참고. 여기서는 개념과 판단 기준만 다룸.

---

## Figma MCP란?

Figma MCP(Model Context Protocol)는 Claude Code, Cursor, Codex 등 AI 코딩 에이전트가 Figma 디자인 파일에 직접 접근해 **디자인 읽기, 코드 변환, 캔버스 직접 쓰기**를 할 수 있게 해주는 프로토콜이다. 2026년 3월 `use_figma` 도구 추가로 기존 read-only에서 **양방향** 연동으로 확장됐다.

---

## 핵심 도구 3개

| 도구 | 방향 | 용도 |
|------|------|------|
| `get_design_context` | Figma → 코드 | 디자인 구조 읽기, 코드 생성용 데이터 추출 |
| `generate_figma_design` | 웹 → Figma | 라이브 웹 UI 캡처 → 편집 가능한 Figma 레이어로 변환 |
| `use_figma` | AI → Figma | 캔버스에 직접 프레임/컴포넌트/변수 생성 및 수정 **(NEW)** |

전체 도구는 7개(`get_variable_defs`, `get_code_connect_map`, `search_design_system`, `create_new_file` 포함)이지만 실전에서 90%는 위 3개로 해결된다.

---

## Skills vs Tools 차이

| 구분 | Tools (도구) | Skills (스킬) |
|------|-------------|---------------|
| 정의 | MCP 프로토콜로 실행되는 함수 | 마크다운 파일로 정의된 에이전트 행동 규칙 |
| 실행 방식 | API 호출 | 프롬프트 지시 (코드 없음) |
| 예시 | `get_design_context`, `use_figma` | `/figma-generate-library`, `/use-figma` |
| 커스텀 | 불가 (공식만) | 마크다운 파일 작성으로 직접 생성 가능 |

스킬은 에이전트가 Figma 작업을 어떻게 접근할지 규칙을 정의한다. 도구가 "무엇을 할 수 있는가"라면 스킬은 "어떻게 할 것인가"다.

---

## 바이브코더 필요성 판단 매트릭스

**혼자 + 빠른 프로토타입이면 Figma MCP 불필요.**
Claude Frontend Skills + Agentation으로 충분하다.

**아래 중 하나라도 해당되면 Figma MCP가 필요하다:**

| 상황 | 이유 |
|------|------|
| 코드를 못 읽는 사람과 협업 | 디자이너/클라이언트/마케터는 `.tsx` 파일을 열지 못함. Figma 링크 하나로 누구든 브라우저에서 접근 가능 |
| 코드 작성 전 방향 합의 필요 | 바이브코딩의 최대 낭비: 코드 다 만들고 "이 방향 아닌 것 같아요". Figma로 먼저 OK 받고 코드 |
| 디자인 시스템 일관성 관리 | 여러 화면의 색상/간격/타이포 토큰을 Figma Variables에서 한곳에 관리하고 코드에 동기화 |
| 기존 Figma 자산을 코드로 변환 | `get_design_context`로 스크린샷보다 정확한 구조화 데이터 추출 |

---

## 최강 조합: Figma MCP → Claude Code → Agentation

```
Figma MCP로 초안 생성
    ↓
Claude Code로 코드 변환 (get_design_context)
    ↓
Agentation으로 실제 앱 수정 및 배포
```

이 세 단계가 맞물리면 디자인부터 배포까지 완전 자동화된다.

| 상황 | 추천 도구 |
|------|-----------|
| 혼자 + 빠른 프로토타입 | Claude Frontend Skills + Agentation |
| 협업 + 방향 합의 + 디자인 시스템 | + Figma MCP 추가 |
| 기존 Figma 자산 활용 | Figma MCP 필수 |
| 디자인→코드→배포 풀파이프라인 | Figma MCP + Claude Code + Agentation |

---

## 제한사항

| 항목 | 내용 |
|------|------|
| 출력 크기 | 응답당 **20KB 제한** — 복잡한 화면은 섹션별로 나눠서 요청 |
| 이미지/동영상 | **미지원** — 비트맵 이미지, GIF, 영상 레이어 처리 불가 |
| 커스텀 폰트 | **미지원** |
| 스타일 정확도 | **85~90%** (SFAI Labs 테스트) — 수동 검토 필요 |
| 현재 상태 | **베타** — 프로덕션 사용 시 결과물 반드시 확인 |
| Seat 요구 | Full seat 필요 (Dev seat은 읽기 전용) |

---

## 가격 / 레이트 제한

| 플랜 | 제한 |
|------|------|
| Free / Starter / View / Collab | 읽기 도구 **월 6회** |
| Dev / Full seat (Pro · Org · Enterprise) | **분당 제한** (REST API Tier 1) |
| `use_figma` (베타) | **레이트 제한 면제** |
| figma-mcp-go 사용 시 | **무제한** (공식 API 우회) |

현재 베타 무료. 유료 전환 시기와 가격은 미공개.
월 6회 제한에 걸리면 figma-mcp-go로 전환하면 된다 (01-getting-started.md 참고).
