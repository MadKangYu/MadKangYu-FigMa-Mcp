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

## 워크플로우 원칙

1. 와이어프레임 먼저, 디자인 나중
2. 코드 수정 전에 Figma에서 시각적 확인 (Figma = 버퍼)
3. 섹션별로 나눠서 요청 (20KB 제한)
4. Cmd+L로 node-id 포함 URL 사용
5. 한번에 다 시키지 말고 단계별 확인

## 참조 파일

- 시작하기: ./01-getting-started.md
- 핵심 개념: ./02-core-concepts.md
- 도구/스킬 레퍼런스: ./03-tools-and-skills.md
- 전체 워크플로우 + 프롬프트: ./04-workflows.md
- 리소스 모음: ./05-resources.md
- Q&A: ./QnA.md
