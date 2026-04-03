# Figma MCP 폰트 + 무료/유료 완전 가이드

> 상업 라이센스 가능한 폰트 + Figma 플랜별 기능 범위

---

## 상업용 무료 폰트 (Google Fonts — Figma 기본 탑재)

> Figma는 Google Fonts 전체를 기본 제공. 모두 **SIL Open Font License** → 상업 무료.

### Sans-serif (가장 많이 쓰는 분류)

| 폰트 | MCP 변환 | 용도 | 미리보기 |
|------|---------|------|--------|
| **Inter** | ✅ 최적 | Figma 기본 폰트. UI/웹 최적화 | `The quick brown fox` |
| **Roboto** | ✅ 최적 | Android 기본. Material Design | `The quick brown fox` |
| **Open Sans** | ✅ 안정 | 가독성 최고. 본문용 | `The quick brown fox` |
| **Poppins** | ✅ 안정 | 둥글고 현대적. 랜딩페이지 | `The quick brown fox` |
| **Nunito** | ✅ 안정 | 부드러운 둥근 산세리프 | `The quick brown fox` |
| **Montserrat** | ✅ 안정 | 헤드라인용. 굵은 무게감 | `The quick brown fox` |
| **DM Sans** | ✅ 안정 | 기하학적. SaaS/테크 | `The quick brown fox` |
| **Plus Jakarta Sans** | ✅ 안정 | 모던 UI. Vercel/Linear 스타일 | `The quick brown fox` |
| **Outfit** | ✅ 안정 | 기하학적. 깔끔한 헤드라인 | `The quick brown fox` |

### Serif (고급/전통 느낌)

| 폰트 | MCP 변환 | 용도 |
|------|---------|------|
| **Playfair Display** | ✅ 안정 | 고급 헤드라인 |
| **Merriweather** | ✅ 안정 | 긴 본문 가독성 |
| **Lora** | ✅ 안정 | 블로그/매거진 |
| **Source Serif Pro** | ✅ 안정 | 전문적 문서 |

### Monospace (코드/기술)

| 폰트 | MCP 변환 | 용도 |
|------|---------|------|
| **JetBrains Mono** | ✅ 안정 | 코드 표시 최적 |
| **Fira Code** | ✅ 안정 | 합자 지원 코드 폰트 |
| **Source Code Pro** | ✅ 안정 | Adobe 코드 폰트 |
| **IBM Plex Mono** | ✅ 안정 | IBM 디자인 시스템 |

### 한국어 (Korean)

| 폰트 | MCP 변환 | 라이센스 | 비고 |
|------|---------|---------|------|
| **Noto Sans KR** | ⚠️ 수동 지정 필요 | ✅ SIL OFL (상업 무료) | Google Fonts. Figma에서 사용 가능 |
| **Noto Serif KR** | ⚠️ 수동 지정 필요 | ✅ SIL OFL | 한국어 세리프 |
| **IBM Plex Sans KR** | ⚠️ 수동 지정 필요 | ✅ SIL OFL | IBM 한국어 |
| **Gothic A1** | ⚠️ 수동 지정 필요 | ✅ SIL OFL | 본문용 고딕 |
| **Pretendard** | ❌ MCP 미인식 | ✅ SIL OFL | 로컬 설치 필요. Figma에서 수동 업로드 |
| **Spoqa Han Sans Neo** | ❌ MCP 미인식 | ✅ SIL OFL | 로컬 설치 필요 |
| **나눔고딕 (NanumGothic)** | ⚠️ 수동 지정 필요 | ✅ SIL OFL | Google Fonts에 포함 |
| **나눔명조 (NanumMyeongjo)** | ⚠️ 수동 지정 필요 | ✅ SIL OFL | 한국어 명조 |

> **⚠️ 수동 지정 필요** = MCP가 자동 인식하지 못함. 프롬프트에 폰트명 명시하면 코드에 반영됨.
> **❌ MCP 미인식** = Google Fonts에 없어서 Figma에서 로컬 폰트로만 사용. 코드에서 별도 설치 필요.

### 한국어 폰트 사용 프롬프트

```
이 디자인을 React + Tailwind로 변환해줘.
폰트는 Pretendard를 사용해.
@font-face로 로딩하고 font-family: 'Pretendard' 적용.
[URL]
```

Tailwind config:
```js
fontFamily: {
  sans: ['Pretendard', 'Noto Sans KR', 'system-ui', 'sans-serif'],
}
```

---

## 유료 폰트 (라이센스 필요)

| 폰트 | 가격 | 비고 |
|------|------|------|
| SF Pro (Apple) | 무료 (Apple 기기에서만) | macOS/iOS 전용. 웹 사용 시 라이센스 문제 |
| Helvetica Neue | 유료 | Monotype 라이센스 |
| Proxima Nova | 유료 (~$29/font) | 웹폰트 별도 구매 |
| Circular | 유료 | Spotify, Airbnb 사용 |
| Graphik | 유료 | 프리미엄 UI 폰트 |

**원칙: Google Fonts에 있으면 상업 무료. 없으면 라이센스 확인.**

---

## Figma 플랜별 무료/유료 범위

### 한눈에 비교

| 기능 | Free (Starter) | Pro | Org | Enterprise |
|------|:---:|:---:|:---:|:---:|
| **가격** | $0 | $15/월 | $45/월 | $75/월 |
| Figma 파일 생성 | 3개 | 무제한 | 무제한 | 무제한 |
| 페이지/파일 | 3개 | 무제한 | 무제한 | 무제한 |
| 히스토리 | 30일 | 무제한 | 무제한 | 무제한 |

### MCP 관련 기능 (핵심) — 2026-04 최신

| 기능 | Free (Starter) | Pro Full ($16) | Pro Dev ($12) | Org ($55) | Enterprise ($90) |
|------|:---:|:---:|:---:|:---:|:---:|
| **MCP 도구 호출** | **월 6회** | **200/일, 10/분** | **200/일, 10/분** | 200/일, 15/분 | 600/일, 20/분 |
| `use_figma` (쓰기) | ❌ 없음 | ✅ 베타 면제 | ✅ 베타 면제 | ✅ | ✅ |
| `get_design_context` | ✅ (6회 내) | ✅ | ✅ | ✅ | ✅ |
| Dev Mode | ❌ 없음 | ✅ | ✅ | ✅ | ✅ |
| Code Connect | ❌ | ❌ | ❌ | ✅ | ✅ |
| VS Code 연동 | ❌ | ✅ | ✅ | ✅ | ✅ |
| Variables 모드 | 없음 | 10 모드 | 읽기만 | 20 모드 | 무제한 |
| 커스텀 폰트 공유 | ❌ | ❌ | ❌ | ✅ | ✅ |
| 팀 라이브러리 | ❌ | ✅ | 읽기만 | ✅ | ✅ |
| Variables REST API | ❌ | ❌ | ❌ | ❌ | ✅ |
| 레이트 면제 도구 | `whoami`, `generate_figma_design` | 동일 | 동일 | 동일 | 동일 |

### 무료로 할 수 있는 것 (정확)

```
✅ Figma 파일 3개까지 생성
✅ MCP 읽기 도구 월 6회 (get_design_context 등)
✅ Google Fonts 전체 사용
✅ 컴포넌트 생성/사용
✅ generate_figma_design (레이트 면제)
✅ 기본 프로토타이핑

❌ use_figma (쓰기) 불가
❌ Dev Mode 불가
❌ Variable modes 불가
❌ 팀 라이브러리 불가
```

### 유료가 필요한 순간

```
💰 $12/월 (Pro Dev seat) — 최소 실전용:
   → MCP 200회/일 + use_figma 쓰기 + Dev Mode
   → 개발자에게 가장 가성비 좋은 선택

💰 $16/월 (Pro Full seat) — 디자인 + 개발:
   → 위 전부 + Variable 10 모드 + 팀 라이브러리

💰 $55/월 (Organization) — 팀 협업:
   → Code Connect + 커스텀 폰트 공유 + 브랜칭

💰 $90/월 (Enterprise) — 대규모:
   → Variables REST API + 600회/일 + SCIM
```

### 현실적 추천

```
혼자 학습/테스트    → Free + figma-mcp-go (읽기 무제한) = $0
                    ⚠️ 쓰기(use_figma)는 불가 → 읽기만
실전 개발자         → Pro Dev seat ($12/월) ← 가장 추천
디자인 + 개발       → Pro Full seat ($16/월)
팀 + 디자인 시스템  → Organization ($55/월)
```

---

## MCP 변환에 가장 좋은 폰트 조합 (추천)

### 영문 프로젝트
```css
font-family: 'Inter', system-ui, sans-serif;  /* UI/앱 */
font-family: 'Plus Jakarta Sans', sans-serif;  /* SaaS/모던 */
font-family: 'DM Sans', sans-serif;            /* 테크/미니멀 */
```

### 한국어 프로젝트
```css
font-family: 'Pretendard', 'Noto Sans KR', system-ui, sans-serif;  /* 앱/웹 */
font-family: 'Noto Sans KR', sans-serif;                            /* 안전한 선택 */
```

### Tailwind 설정
```js
// tailwind.config.js
module.exports = {
  theme: {
    fontFamily: {
      sans: ['Pretendard', 'Inter', 'Noto Sans KR', 'system-ui', 'sans-serif'],
      serif: ['Noto Serif KR', 'Playfair Display', 'serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    }
  }
}
```
