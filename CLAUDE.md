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
- 복잡한 페이지 변환 요청 시 → 자동으로 섹션 분할 제안 (20KB 제한 대응)
- Auto Layout 없는 프레임 발견 시 → 변환 전 "Auto Layout 먼저 적용할까요?" 제안
- 이미지 포함 디자인 → `get_images`로 에셋 먼저 추출 후 코드 변환
- 커스텀 폰트 감지 시 → 코드에 `@font-face` + `font-family` 수동 지정 안내

## 워크플로우 원칙

1. 와이어프레임 먼저, 디자인 나중
2. 코드 수정 전에 Figma에서 시각적 확인 (Figma = 버퍼)
3. 섹션별로 나눠서 요청 (20KB 제한)
4. Dev Mode 링크 사용 (`&mode=dev`) — 최고 품질
5. 한번에 다 시키지 말고 단계별 확인
6. 수정 요청 시 "어디가 왜 다른지" 구체적으로 짚어주기

## 참조 파일

- 시작하기: ./01-getting-started.md
- 핵심 개념: ./02-core-concepts.md
- 도구/스킬 레퍼런스: ./03-tools-and-skills.md
- 전체 워크플로우 + 프롬프트: ./04-workflows.md
- 리소스 모음: ./05-resources.md
- Q&A: ./QnA.md
