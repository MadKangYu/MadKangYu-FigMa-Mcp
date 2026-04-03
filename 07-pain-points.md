# Figma MCP 불편사항 10가지 — 문제 + 대안 + 프롬프트

> 자동화 / 정형화 / 수동 대응으로 분류

---

## 분류 요약

| # | 문제 | 분류 | 대안 상태 |
|---|------|------|---------|
| 1 | 레이트 제한 (Free 월6회) | 자동화 | ✅ setup.sh에 figma-mcp-go 포함 |
| 2 | 20KB 출력 제한 | 정형화 | 📋 섹션 분할 템플릿 |
| 3 | Auto Layout 없으면 쓰레기 코드 | 정형화 | 📋 선행 프롬프트 |
| 4 | 커스텀 폰트 미지원 | 수동 | 📖 코드에서 수동 지정 |
| 5 | 이미지/동영상 미지원 | 정형화 | 📋 별도 추출 워크플로우 |
| 6 | 스타일 정확도 85-90% | 정형화 | 📋 검증 + 수정 루프 |
| 7 | figma-use 스킬 누락 에러 | 자동화 | ✅ CLAUDE.md 자동 로드 규칙 |
| 8 | WebSocket 연결 불안정 | 자동화 | ✅ 공식 Remote 메인 규칙 |
| 9 | 무료 Dev Mode 제한 | 수동 | 📖 무료 범위 안내 |
| 10 | Figma Make와 혼동 | 수동 | 📖 용어 정리 (06-glossary) |

---

## 자동화 완료 (이미 해결)

### #1. 레이트 제한 — figma-mcp-go로 우회
```bash
# setup.sh가 자동 설치
claude mcp add -s user figma-mcp-go -- npx -y @vkhanhqui/figma-mcp-go@latest
```
Free 플랜 월 6회 → **무제한**. 이미 설치됨.

### #7. figma-use 스킬 누락 — CLAUDE.md 자동 규칙
CLAUDE.md에 "Figma 쓰기 작업 시 figma-use 먼저 로드" 규칙이 이미 반영됨.
Hermes(루나) 사용 시 자동 처리.

### #8. WebSocket 불안정 — 공식 Remote 메인
CLAUDE.md에 "읽기 → figma-mcp-go / 쓰기(use_figma) → 공식 figma" 규칙 반영됨.

---

## 정형화 (워크플로우/템플릿)

### #2. 20KB 출력 제한

**문제**: 복잡한 페이지를 한번에 요청하면 잘림 → 불완전한 코드
**왜 발생**: MCP 응답 크기 제한 (20KB/응답)

**대안 — 섹션별 분할 워크플로우:**
```
1단계: 히어로 섹션 변환
  "이 프레임의 히어로 섹션만 React로 변환해줘 [URL?node-id=히어로]"

2단계: 기능 소개 섹션 변환
  "이 프레임의 기능 소개 섹션만 변환해줘 [URL?node-id=기능]"

3단계: 가격 플랜 변환
  "가격 섹션 변환해줘 [URL?node-id=가격]"

4단계: 푸터 변환
  "푸터 변환해줘 [URL?node-id=푸터]"

5단계: 조합
  "위에서 만든 4개 섹션을 하나의 page.tsx로 조합해줘"
```

**자동 감지 규칙** (CLAUDE.md에 추가):
> 복잡한 페이지 변환 요청 시, 자동으로 섹션 분할 제안

---

### #3. Auto Layout 없으면 position: absolute 코드

**문제**: Auto Layout 없는 디자인 → `position: absolute; top: 123px; left: 456px;`
**왜 발생**: Figma에서 자유 배치 → MCP가 절대 좌표로 변환할 수밖에 없음

**대안 — 선행 프롬프트:**
```
# 변환 전에 먼저 실행
"이 Figma 프레임에 Auto Layout을 적용해줘. 
 현재 레이아웃 구조를 유지하면서 Flexbox 방식으로 변환해줘."
[URL]

# 확인 후 코드 변환
"Auto Layout 적용된 이 디자인을 React + Tailwind로 변환해줘"
[URL]
```

**자동 감지 규칙** (CLAUDE.md에 추가):
> Auto Layout 없는 프레임 발견 시, 변환 전 "Auto Layout 먼저 적용할까요?" 제안

---

### #5. 이미지/동영상 미지원

**문제**: 디자인에 포함된 이미지 → 코드에 플레이스홀더만 나옴
**왜 발생**: MCP가 이미지 바이너리를 전송하지 않음

**대안 — 에셋 먼저 추출 워크플로우:**
```
# 1단계: 이미지 추출
"이 Figma 프레임의 이미지/아이콘을 SVG로 내보내줘"
[URL?node-id=이미지노드]
→ get_images로 PNG/SVG/JPG 파일 생성

# 2단계: 코드 변환 (이미지 경로 지정)
"이 디자인을 React로 변환해줘.
 이미지는 /public/images/ 경로에 있어.
 hero-image.png, feature-1.svg 등 실제 파일명 사용해줘."
[URL]
```

**자동 감지 규칙** (CLAUDE.md에 추가):
> 이미지 포함 디자인 변환 시, get_images로 에셋 먼저 추출 후 코드 변환

---

### #6. 스타일 정확도 85-90%

**문제**: 간격 1-2px 차이, 그라디언트/그림자 미묘한 차이
**왜 발생**: MCP 변환이 100% 완벽하지 않음 (베타)

**대안 — 검증 + 수정 루프:**
```
# 1차: 변환
"이 디자인을 React + Tailwind로 변환해줘"
[Dev Mode URL — &mode=dev]

# 2차: 비교 확인
"Figma 스크린샷과 코드 결과를 비교해줘. 다른 부분 알려줘."

# 3차: 구체적 수정 (어디가 왜 다른지 명시)
"헤딩 폰트가 Figma는 48px인데 코드는 32px로 나왔어. 수정해줘."
"버튼 사이 간격이 달라. Figma URL 다시 확인해줘."

# 완료: 전체 검토 후 배포
```

**핵심**: 같은 요청을 그냥 다시 보내지 말고, **어디가 왜 다른지 구체적으로** 짚어주면 훨씬 빠르게 수정됨.

**자동 감지 규칙** (CLAUDE.md에 추가):
> 코드 변환 시 항상 Dev Mode URL(&mode=dev) 사용 권장

---

## 수동 대응 (가이드)

### #4. 커스텀 폰트 미지원

**문제**: Pretendard, Noto Sans KR 등 → MCP가 인식 못함
**대안**: 코드에서 수동 지정

```
# 변환 프롬프트에 폰트 명시
"이 디자인을 React로 변환해줘.
 폰트는 Pretendard를 사용해. 
 @font-face로 로딩하고, font-family: 'Pretendard' 적용해줘."
```

또는 Tailwind config에 미리 설정:
```js
// tailwind.config.js
fontFamily: {
  sans: ['Pretendard', 'system-ui', 'sans-serif'],
}
```

---

### #9. 무료 Dev Mode 제한

**무료로 가능한 것:**
- Dev Mode 진입 (Shift+D)
- CSS 속성 확인 (Inspect 패널)
- 간격/크기 측정
- Copy link to selection (`&mode=dev`)
- Copy as code (HTML/CSS)

**Pro 필요:**
- VS Code 연동
- 변수/토큰 상세 접근
- Code Connect 패널

**결론**: 코드 변환의 핵심 기능은 **무료로 가능**. Pro는 팀 협업에서 가치.

---

### #10. Figma Make와 혼동

```
Figma Make = Figma의 앱 빌더 (별도 제품, 노코드 웹사이트 생성)
Figma MCP = AI와 Figma를 연결하는 프로토콜 (이 프로젝트)
```
이름만 비슷하고 완전히 다른 것. 06-glossary.md에 상세 정리됨.

---

## 한눈에 보는 대응 매트릭스

| 문제 | 자동? | 프롬프트 있음? | 해결 난이도 |
|------|------|------------|---------|
| 레이트 제한 | ✅ 자동 | — | 쉬움 |
| 20KB 제한 | 📋 반자동 | ✅ | 보통 |
| Auto Layout 없음 | 📋 반자동 | ✅ | 보통 |
| 커스텀 폰트 | ❌ 수동 | ✅ | 쉬움 |
| 이미지 미지원 | 📋 반자동 | ✅ | 보통 |
| 정확도 85-90% | 📋 반자동 | ✅ | 반복 필요 |
| figma-use 누락 | ✅ 자동 | — | 쉬움 |
| WebSocket 불안정 | ✅ 자동 | — | 쉬움 |
| Dev Mode 제한 | ❌ 수동 | — | — |
| Make 혼동 | ❌ 수동 | — | 용어 확인 |
