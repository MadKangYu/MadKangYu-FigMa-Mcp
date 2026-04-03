# Figma MCP 프로젝트 규칙

## Figma MCP 서버

- **공식 Remote**: `figma` (OAuth, 읽기+쓰기, use_figma 포함)
- **figma-mcp-go**: `figma-mcp-go` (플러그인 브릿지, 레이트 제한 없음, 읽기 + 기본 쓰기)
- 읽기 작업 → figma-mcp-go 우선 / use_figma(Plugin API) → 공식 figma만 지원

## ⚠️ 필수 규칙: figma-use 스킬 먼저

Figma 파일을 수정하거나 새로 만드는 작업 시 **반드시 figma-use 스킬을 먼저 로드**.
빼뜨리면 "도구가 없다" 오류 발생. Hermes(루나) 사용 시 자동 처리됨.

## 스킬 활성화

| 스킬 | 트리거 |
|------|--------|
| `figma-implement-design` | Figma URL + "코드로 변환" |
| `figma-generate-design` | "Figma에 디자인 만들어줘" |
| `figma-use` | use_figma 호출 전 자동 로드 |
| `figma-code-connect` | Code Connect 매핑 요청 시 |
| `figma-generate-library` | 디자인 시스템 구축 요청 시 |

## URL 파싱 규칙

```
figma.com/design/:fileKey/:fileName?node-id=:nodeId → nodeId에서 - 를 : 로 변환
figma.com/design/:fileKey/branch/:branchKey/:fileName → branchKey를 fileKey로
figma.com/board/:fileKey/:fileName → FigJam
```

## 핵심 프롬프트 패턴

### 디자인 → 코드
```
이 Figma 디자인을 [프레임워크]로 구현해줘
[Cmd+L URL]
```

### 코드 → Figma
```
Figma [URL]에 [화면 이름] 만들어줘.
포함할 요소: [나열] / 색상: [값] / 크기: [px]
```

### 요소 수정
```
Figma [URL]의 [요소]에서 [속성]을 [새 값]으로 바꿔줘
```

### 레퍼런스 조합
```
이 웹사이트를 Figma로 가져와줘: [웹 URL]
Figma 파일: [URL]
```

## 결과물 품질 높이는 팁

| 팁 | 왜 효과 있나 |
|---|-----------|
| Dev Mode 링크 사용 (`&mode=dev`) | Figma가 더 정확한 레이아웃 데이터 제공 |
| Figma에 Auto Layout 적용해두기 | Flexbox/Grid로 정확 변환. 없으면 `position: absolute` 되어 반응형 불가 |
| 전체 파일 대신 섹션별 요청 | 타임아웃 방지 + 집중 처리 → 품질 향상 |
| Figma에 변수(Variables) 써두기 | 하드코딩(`#3B82F6`) 대신 토큰(`--color-primary`)으로 변환 |
| 레이어 이름 정리해두기 | CSS 클래스가 의미있게 나옴 (`div_1234` → `.hero-button`) |
| 프레임워크 명확히 지정 | "React"가 아니라 "React + TypeScript + Tailwind"처럼 구체적으로 |

### 페이지 전체 변환 시 섹션별 순서
```
1단계: 히어로 섹션 변환 (URL + node-id)
2단계: 기능 소개 섹션 변환 (URL + node-id)
3단계: 가격 플랜 섹션 변환 (URL + node-id)
4단계: 푸터 변환 (URL + node-id)
5단계: 전체를 하나의 page.tsx로 조합해줘
```
> ⚠️ 한 번에 전체 요청하면 안 됨 — 타임아웃 + 품질 저하

## 자동 대응 규칙

- **Figma URL에 `&mode=dev` 자동 추가**: 사용자가 Figma URL을 붙여넣으면 `node-id`가 있고 `mode=dev`가 없을 경우 자동으로 `&mode=dev`를 추가하여 코드 변환 품질을 높인다. 사용자에게 알리지 않고 자동 처리.
- **Figma 스크린샷 자동 인지**: 사용자가 Figma 화면 스크린샷을 보내면:
  1. 브라우저 주소창에서 Figma URL 추출 (figma.com/design/... 패턴)
  2. 좌측 레이어 패널에서 프레임/컴포넌트 이름 파악
  3. 우측 패널에서 Dev Mode/Inspect/MCP 상태 확인
  4. 선택된 요소의 CSS 속성값 (색상, 폰트, 간격) 읽기
  5. Dev Mode 활성 여부 감지 (`</>` 아이콘, Inspect 탭, MCP 패널)
  6. URL이 보이면 자동으로 `&mode=dev` 추가하여 MCP 도구 호출에 사용
  7. **다중 레이어 선택 시**: 스크린샷에 여러 레이어가 보이면 각각의 이름/속성을 개별 파악하고, 필요시 `get_metadata`로 node-id를 일괄 조회하여 개별 처리
- **코드 → Figma 레이어 역추적**: 코드에서 클래스명/컴포넌트명이 보이면 MCP로 해당 레이어를 자동 검색:
  1. `search_design_system`으로 컴포넌트명 검색 (예: "Button", "Card")
  2. `get_metadata`로 전체 노드 트리에서 이름 매칭
  3. figma-mcp-go의 `search_nodes`로 레이어 이름 패턴 검색 (예: "Hero", "Nav")
  4. 매칭된 node-id로 `get_design_context` 호출 → 정확한 요소 타겟팅
  5. 코드의 CSS 클래스 (`hero-section`, `nav-button`) → Figma 레이어 이름으로 매핑 시도
- **텍스트 콘텐츠 자동 인지**: 레퍼런스를 복제 후 텍스트만 수정한 경우:
  1. figma-mcp-go `scan_text_nodes`로 전체 텍스트 노드 스캔
  2. 스크린샷에서 보이는 텍스트를 OCR 수준으로 읽어서 정확한 문구 파악
  3. 코드 변환 시 Figma의 **실제 텍스트 내용**을 그대로 반영 (placeholder 금지)
  4. 한국어/영어 혼합 텍스트도 정확히 유지
  5. 버튼 레이블("무료 체험 시작하기"), 헤드라인, 설명문 등 모든 텍스트를 코드에 하드코딩이 아닌 **Figma 원본 그대로** 사용
- 복잡한 페이지 변환 요청 시 → 자동으로 섹션 분할 제안 (20KB 제한 대응)
- **Auto Layout 자동 판단**: 아래 요소가 포함된 프레임에 Auto Layout이 없으면 변환 전 자동 적용 제안:
  - 리스트/카드 그리드 (같은 요소 반복)
  - 네비게이션 바 (메뉴 아이템 나열)
  - 폼 (입력필드 + 라벨 수직 정렬)
  - 버튼 (텍스트 길이에 따라 크기 변동)
  - 모달/다이얼로그 (내용에 따라 높이 변동)
  - 반응형 레이아웃 (화면 크기에 따라 재배치)
  - 예외 (적용 불필요): 고정 아이콘, 배경 이미지, 워터마크, 인쇄물
- 이미지 포함 디자인 → `get_images`로 에셋 먼저 추출 후 코드 변환
- 커스텀 폰트 감지 시 → 코드에 `@font-face` + `font-family` 수동 지정 안내

## 워크플로우 원칙

1. 와이어프레임 먼저, 디자인 나중
2. 코드 수정 전에 Figma에서 시각적 확인 (Figma = 버퍼)
3. 섹션별로 나눠서 요청 (20KB 제한)
4. Dev Mode 링크 사용 (`&mode=dev`) — 최고 품질
5. 한번에 다 시키지 말고 단계별 확인
6. 수정 요청 시 "어디가 왜 다른지" 구체적으로 짚어주기

## Chrome CDP 연동 (상세페이지 접근)

Figma MCP가 접근 못하는 콘텐츠(로그인 필요 사이트, SPA, 동적 페이지)는 Chrome CDP로 해결:

1. **OpenChrome MCP** (`openchrome`)로 실제 브라우저 접근:
   - `navigate` → 로그인 필요한 상세페이지 접근
   - `read_page` → 렌더링된 HTML/CSS 추출
   - `javascript_tool` → SPA 동적 콘텐츠 로드 대기
   - `inspect` → DOM 요소 상세 분석

2. **CDP → Figma 파이프라인**:
   ```
   OpenChrome으로 상세페이지 접근 → 구조/스타일 추출
   → generate_figma_design으로 Figma에 디자인 생성
   → use_figma로 세부 수정
   → get_design_context로 코드 변환
   ```

3. **활용 시나리오**:
   - 로그인 후에만 보이는 대시보드 → CDP로 접근 → Figma에 가져오기
   - 쇼핑몰 상세페이지 → CDP로 상품 정보 + 레이아웃 추출
   - SPA 앱 내부 화면 → CDP로 렌더링 완료 후 캡처
   - 경쟁사 유료 콘텐츠 레이아웃 분석 → CDP + Figma

4. **WebFetch 403 차단 시 대안**:
   - `WebFetch` 실패 → `openchrome navigate` + `read_page` 사용
   - 쿠키/세션 필요 → `openchrome cookies` 관리
   - JavaScript 렌더링 필요 → `openchrome javascript_tool`로 대기 후 추출

## 로컬 프로젝트 경로 인지

Figma 디자인과 코드를 연결하려면 로컬 프로젝트 위치를 알아야 함:
1. **현재 작업 디렉토리 확인**: `pwd` — Claude Code가 실행 중인 위치
2. **프로젝트 루트 탐지**: `package.json`, `tsconfig.json`, `.git` 기준
3. **컴포넌트 디렉토리 자동 탐색**: `src/components/`, `app/`, `pages/` 패턴
4. **Figma 레이어명 ↔ 로컬 파일 매칭**:
   - Figma "HeroSection" → `src/components/HeroSection.tsx` 검색
   - Figma "NavBar" → `grep -r "NavBar" src/` 로 파일 위치 파악
5. **CLAUDE.md에 프로젝트 경로 명시 시 자동 참조**:
   ```
   ## 프로젝트 경로
   - 메인: /Users/yu/Projects/my-app
   - 컴포넌트: src/components/ui/
   - 스타일: tailwind.config.ts
   ```

## 참조 파일

- 시작하기: ./01-getting-started.md
- 핵심 개념: ./02-core-concepts.md
- 도구/스킬 레퍼런스: ./03-tools-and-skills.md
- 전체 워크플로우 + 프롬프트: ./04-workflows.md
- 리소스 모음: ./05-resources.md
- Q&A: ./QnA.md
