# Figma MCP 학습 Q&A

> 2026-04-03 학습 중 질문/답변 정리 (13개, 카테고리별)

---

## 개념

### Q1. 바이브코더에게 Figma MCP가 정말 필요한가?

혼자 빠르게 만들 때는 불필요. 하지만:
- 코드를 못 읽는 사람과 협업 → 필요
- 코드 작성 전 방향 합의 → 필요
- 디자인 시스템 일관성 → 필요
- 기존 Figma 자산 코드 변환 → 필수

**최강 조합**: Figma MCP 초안 → Claude Code 코드 변환 → Agentation 앱 수정

### Q2. 캡처 vs MCP — 왜 MCP가 정확한가?

| 방식 | 가져오는 것 | 정확도 |
|------|-----------|--------|
| 스크린샷 | 이미지(픽셀), AI 추측 재구성 | 낮음 |
| MCP | 요소값(레이어, CSS, 토큰), 구조 그대로 | 높음 |

### Q3. Figma Copy 기능과 MCP의 관계?

MCP = Copy as code + Copy properties를 **자동화**한 것.
수동: 우클릭 → Copy as code → 에디터 붙여넣기
MCP: "이 프레임을 React로 변환해줘 [URL]" → 끝

---

## 실전 사용법

### Q4. 범위를 특정해서 가져올 수 있나?

**가능.** Figma에서 원하는 요소 선택 → `Cmd+L` → node-id 포함 URL 복사.
`get_design_context`에 이 URL 주면 선택한 요소만 변환.

### Q5. Cmd+L 잘 쓰는 법?

- 프레임 선택 후 Cmd+L → `?node-id=` 포함 URL (가장 많이 씀)
- 브라우저 주소창 복사 ❌ → Figma에서 선택 후 Cmd+L ✅
- 전체 파일 한번에 ❌ → 섹션별 나눠서 ✅ (20KB 제한)
- Dev Mode "Copy example prompt" 버튼이 가장 편함

### Q6. Claude Code로 하면 기존 코드가 수정되는데?

**Figma를 버퍼로 사용:**
1. `use_figma`로 Figma에 와이어프레임 (코드 안 건드림)
2. 마음에 들 때까지 Figma에서만 수정
3. 확정 후 `get_design_context`로 코드 변환 (git branch 분리)

핵심: 수정 사이클을 코드가 아닌 **디자인 레벨에서 끝낸다.**

### Q7. 디자인 못하는데, 뭘 참고하라고 지시?

디자인 감각이 아니라 "이거 + 저거" 조합 능력만 필요:

```
히어로 → cal.com 참고 / 기능 소개 → linear.app 참고
가격표 → vercel.com 참고 / 소셜 프루프 → notion.so 참고
```

### Q8. 레퍼런스 조합 + 트렌드 보완 프롬프트?

5단계: 레퍼런스 수집 → 섹션 분석 → 조합 초안 → 트렌드 보완 → 코드 변환.
한번에 다 시키지 말고 **단계별로 확인하면서 진행.**

---

## 협업

### Q9. 작업 결과를 다른 사람에게 전달하려면?

Figma = 바이브코딩 결과물의 전달 채널:
- 디자이너 → 댓글 + 수정 요청
- 클라이언트 → 직접 코멘트
- 마케터 → PNG/SVG 다운로드
- Copy to Figma Slides → 프레젠테이션 변환

### Q10. 원격에서 "이 부분 수정해줘" 더 나은 방식?

**Copy link to selection** 이 최고:
1. 요소 우클릭 → Copy link to selection → 링크 전달
2. Claude Code에 링크 붙여넣기 → 정확한 노드 타겟팅
3. `use_figma`로 수정 → `get_design_context`로 코드 반영

---

## 환경 설정

### Q11. Obsidian 경로를 모르는 사람이 LLM으로 편하게 쓰려면?

**CLAUDE.md에 경로 등록** (추천):
```markdown
# CLAUDE.md
## 환경
- Obsidian Vault: /Users/이름/Obsidian Vault/
```
한번 설정하면 "옵시디언 노트 읽어줘"만 하면 됨.

### Q12. 스킬 프롬프트보다 더 나은 방식?

공식 스킬 7개를 상황에 맞게 선택:

| 하고 싶은 것 | 스킬 |
|-------------|------|
| 코드 → Figma 디자인 | `figma-generate-design` |
| Figma → 코드 변환 | `figma-implement-design` |
| 디자인 시스템 구축 | `figma-generate-library` |
| 캔버스 직접 조작 | `figma-use` |

---

## 실습 기록

### 허민님 사생결단 부트캠프 (2026-04-03)

**환경**: Claude Code v2.1.91, Sonnet 4.6, Claude Max
**Figma**: min heo (Professional), aikako 프로젝트
**MCP 서버**: figma ✅ connected, context7 ✅, chrome-devtools ✅ (7개 중 3개 활성)
**학습 내용**: Figma MCP 전체 체계, Dev Mode, 스킬 시스템
**핵심 인사이트**: Figma를 디자인 버퍼로 사용 → 코드 수정 전 시각적 확인

---

## Q15. figma-console-mcp는 뭐고, 기존 것과 뭐가 다른가?

92개+ 도구로 가장 강력 (디버깅, 실시간 모니터링, FigJam, Cloud Mode).
하지만 **macOS WebSocket 연결 끊김 이슈** 3건 Open 상태 (#61, #26, #46).

**현재 권장**: 공식 figma + figma-mcp-go. console은 이슈 해결 후 추가.

---

## Q13. Figma 플러그인이 따로 있나? 더 쉽게 하려면?

### 방식별 플러그인 필요 여부

| 방식 | Figma 플러그인 | 설정 난이도 |
|------|---------------|-----------|
| 공식 Remote MCP | **불필요** (OAuth만) | 쉬움 |
| figma-mcp-go | plugin.zip 설치 필요 | 보통 |
| Grab/cursor-talk-to-figma | Community 플러그인 + WebSocket | 복잡 |

### 가장 쉬운 조합
1. **공식 Remote** 기본 사용 (플러그인 없음)
2. 레이트 제한 걸리면 **figma-mcp-go** 플러그인 설치

### figma-mcp-go 플러그인 설치법
```
Figma 데스크탑 → Plugins → Development → Import plugin from manifest
→ GitHub releases의 plugin.zip → manifest.json 선택 → 플러그인 실행
```

---

## Q14. 명령어를 모르면 어떻게 하나?

**자연어로 말하면 됨.** 스킬 이름이나 도구명을 외울 필요 없음.

```
❌ "figma-use 스킬을 사용하여 use_figma 도구로..."
✅ "이 Figma 파일에 로그인 화면 만들어줘 [URL]"
```

Claude가 알아서 적절한 스킬과 도구를 자동 선택.
뭘 할 수 있는지 모르면: "이 Figma 파일로 뭘 할 수 있어? [URL]"
