# Figma MCP — 디자인을 말로 하는 시대

## 이게 뭔데?

Figma에 디자인이 있으면 AI한테 "이거 코드로 만들어줘"라고 말하면 끝.
반대로 "로그인 화면 만들어줘"라고 말하면 Figma에 디자인이 생김.

```
전통적인 방법:  디자인 보고 → 코드 직접 타이핑 → 수정 반복
MCP 방법:      "이거 React로 만들어줘" → 끝
```

## 비유로 이해하기

```
Figma = 화이트보드
MCP = 화이트보드를 읽고 쓸 수 있는 AI의 눈과 손
도구(Tool) = 재료 (밀가루, 달걀) — Figma 파일을 읽는 기능
스킬(Skill) = 레시피 (케이크 만드는 법) — 도구를 어떤 순서로 쓸지 안내
```

## 왜 필요해?

```
혼자 빠르게 만들 때 → 필요 없음. Claude + Agentation이면 충분
하지만 이런 상황이면 Figma가 필요:
  ✓ 코드 못 읽는 사람(디자이너, 클라이언트)과 협업할 때
  ✓ 코드 짜기 전에 "이 방향 맞아?" 확인받고 싶을 때
  ✓ 여러 화면을 한눈에 보면서 일관성 체크할 때
  ✓ 이미 Figma에 디자인이 있을 때
```

## 이런 상황에서 쓰면 됨

### 상황 1: "이 사이트 너무 예쁜데, 비슷하게 만들고 싶어"

```
이 웹사이트를 Figma로 가져와줘: https://cal.com
Figma 파일: [내 URL]
```
→ AI가 스크린샷이 아니라 **실제 요소값**(색상, 폰트, 간격)을 가져옴
→ 색상만 내 브랜드로 바꾸고, 텍스트만 수정하면 끝

### 상황 2: "코드 짜고 있는데 레이아웃이 머릿속에 안 그려져"

```
Claude Code로 랜딩페이지를 만들고 있는데
레이아웃이 어떻게 나올지 먼저 보고 싶어.
Figma [URL]에 와이어프레임(회색 박스 수준)으로 만들어줘:
- 히어로 (헤드라인 + CTA + 이미지)
- 기능 소개 3열
- 가격표 3개
- 푸터
```
→ 코드 안 건드리고 Figma에서 먼저 시각적 확인
→ 마음에 들면 "이거 React로 변환해줘"

### 상황 3: "클라이언트가 수정 요청을 보냈어"

```
클라이언트: "히어로 배경색 바꿔주세요" + Figma 코멘트

나: Figma [URL]의 히어로 섹션 배경색을
    #1E40AF에서 #059669로 바꿔줘
```
→ Figma에서 수정 → 클라이언트 확인 → OK 후 코드 반영
→ 코드 레벨이 아니라 **디자인 레벨에서 수정 사이클 끝**

### 상황 4: "앱 5개 화면을 한눈에 보고 싶어"

```
Figma [URL]에 아래 화면을 나란히 만들어줘 (375x812px, 간격 80px):
화면 1 - 스플래시
화면 2 - 온보딩
화면 3 - 로그인
화면 4 - 홈
화면 5 - 설정
전체를 플로우로 정리해줘.
```
→ 기획서, 포트폴리오, 클라이언트 공유가 **코드 없이** 바로 됨

### 상황 5: "디자인은 있는데 코드가 필요해"

```
이 Figma 디자인을 React + TypeScript + Tailwind로 만들어줘:
[Dev Mode URL — &mode=dev 포함]

조건:
- 함수형 컴포넌트
- TypeScript props 타입 정의
- 모바일 먼저 반응형
- 접근성 속성 포함
```
→ Dev Mode 링크를 쓰면 **코드 변환 품질이 올라감**
→ 섹션별로 나눠서 요청하면 타임아웃 없이 정확

### 상황 6: "디자인 토큰을 코드에 동기화하고 싶어"

```
이 Figma 파일의 색상/간격/타이포 변수를 추출해서
Tailwind config로 변환해줘
[URL]
```
→ `#3B82F6` 대신 `--color-primary` 토큰으로 변환
→ 색상 하나 바꾸면 전체가 한 번에 반영

---

## 1분 설치

```bash
curl -sL https://raw.githubusercontent.com/MadKangYu/MadKangYu-FigMa-Mcp/main/setup.sh | bash
```

이것만 붙여넣으면:
- 공식 Figma MCP 서버 설치 (읽기+쓰기)
- figma-mcp-go 설치 (무제한, 레이트 제한 없음)
- 플러그인 파일 다운로드
- 학습 자료 전체 clone

**설치 후 딱 한 번만 수동:**
```
Figma 데스크탑 앱 → Plugins → Development → Import plugin from manifest...
→ ~/.figma-mcp-go-plugin/plugin-dist/manifest.json 선택 → 플러그인 실행
```

## 3가지만 기억하면 됨

### 1. 디자인 → 코드 (읽기)
```
이 Figma 디자인을 React + TypeScript + Tailwind로 만들어줘
[Figma에서 Cmd+L로 복사한 URL]
```

### 2. 말 → 디자인 (쓰기)
```
이 파일에 랜딩페이지 만들어줘. 히어로 + 기능 3열 + 가격표 + 푸터.
[Figma 파일 URL]
```

### 3. 좋은 사이트 → 내 디자인 (가져오기)
```
이 웹사이트를 Figma로 가져와줘: https://cal.com
Figma 파일: [내 Figma URL]
```

## 잘 쓰는 법 (품질 올리기)

| 이렇게 하면 | 왜 좋아지나 |
|-----------|----------|
| Dev Mode 링크 사용 (`&mode=dev`) | AI가 레이아웃을 더 정확히 읽음 |
| 한번에 전체 말고 **섹션별** 요청 | 타임아웃 안 나고, 품질 올라감 |
| Auto Layout 써둔 디자인 | `position: absolute` 대신 Flexbox/Grid로 변환 |
| 레이어 이름 정리 | `div_1234` 대신 `.hero-button` 클래스명 |
| 변수(Variables) 써두기 | `#3B82F6` 대신 `--color-primary` 토큰 |
| "React" 말고 "React + TypeScript + Tailwind" | 구체적일수록 정확 |

## 최강 파이프라인

```
1. 좋은 사이트 발견 → Figma로 가져오기 (스크린샷 ❌ 요소값 ✅)
2. 필요한 부분만 수정 (색상, 텍스트, 레이아웃)
3. 확인 → OK → 코드로 변환
4. Agentation으로 실제 앱에 적용
```

핵심: **처음부터 만들지 않는다. 좋은 걸 가져와서 수정한다.**

## 자동 업데이트

```bash
# 학습 자료 + 플러그인 최신 버전으로 업데이트
curl -sL https://raw.githubusercontent.com/MadKangYu/MadKangYu-FigMa-Mcp/main/update.sh | bash
```

## 더 알고 싶으면

| 궁금한 것 | 파일 |
|---------|------|
| 처음 시작 | `01-getting-started.md` |
| 왜 필요한지 | `02-core-concepts.md` |
| 뭘 할 수 있는지 | `03-tools-and-skills.md` |
| 바로 복붙 프롬프트 | `04-workflows.md` |
| 공식 문서 링크 | `05-resources.md` |
| 자주 묻는 질문 | `QnA.md` |

## 한 줄 요약

> **코드 짜기 전에 Figma에서 먼저 보고, 확정되면 그때 코드로.**
> Figma는 디자인 도구가 아니라 **소통 도구**다.
