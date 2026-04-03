# Figma MCP 트러블슈팅 — 실제 문제 + 해결법

> 2026-04 기준 GitHub Issues, Figma Forum, 커뮤니티 수집

---

## macOS 권한 설정 (자동화 전 필수)

### Figma Desktop 권한
```
System Settings → Privacy & Security → Accessibility
→ Figma 추가 (자동화 플러그인 실행에 필요)

System Settings → Privacy & Security → Automation
→ Figma가 다른 앱 제어 허용
```

### Terminal/iTerm 권한
```
System Settings → Privacy & Security → Full Disk Access
→ Terminal (또는 iTerm, Warp) 추가
→ Claude Code가 파일 읽기/쓰기 가능하게

System Settings → Privacy & Security → Developer Tools
→ Terminal 추가 (Gatekeeper 우회)
```

### Homebrew 설치 시 (setup.sh)
```
문제: "brew install --cask figma" 시 "not verified" 경고
해결:
  System Settings → Privacy & Security → "Open Anyway" 클릭
  또는: xattr -d com.apple.quarantine /Applications/Figma.app
```

### Node.js npx 권한
```
문제: npx 실행 시 "permission denied"
해결:
  # npm 글로벌 디렉토리 권한 수정
  sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
  
  # 또는 nvm 사용 (권한 문제 없음)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  nvm install 22
```

### Figma 플러그인 로컬 실행 허용
```
문제: "Import plugin from manifest" 시 보안 경고
해결:
  Figma Desktop → Preferences → 
  "Allow plugins from development" 활성화
  (기본적으로 Development 메뉴가 보이면 이미 활성화됨)
```

### WebSocket localhost 방화벽
```
문제: figma-mcp-go ws://localhost:1994 연결 안 됨
해결:
  System Settings → Network → Firewall → Options
  → "Automatically allow built-in software" 체크
  → Node.js / npx 허용 추가
  
  또는 방화벽 일시 비활성화하여 테스트
```

### Claude Code 터미널 권한
```
문제: claude mcp add 시 "EACCES: permission denied"
해결:
  # Claude Code 설정 파일 권한
  chmod 644 ~/.claude.json
  chmod -R 755 ~/.claude/
```

---

## 설치/CLI 문제

### Node.js 버전 호환
```
문제: npx 실행 시 "SyntaxError" 또는 "Unexpected token"
원인: Node.js 16 이하
해결: Node.js 18+ 필요

node -v          # v18.0.0 이상
nvm install 22   # 업그레이드
```

### Claude Code CLI 버전
```
문제: "claude mcp add" 명령 안 됨
해결: npm update -g @anthropic-ai/claude-code
claude --version   # v2.1.x 이상 권장
```

### npx 캐시 문제
```
문제: figma-mcp-go 이전 버전으로 실행됨
해결: npx clear-npx-cache
강제: npx -y @vkhanhqui/figma-mcp-go@latest
```

### Windows manifest.json 임포트 오류 (GitHub #3)
```
원인: 경로에 한글/공백
해결: C:\Users\이름\.figma-mcp-go-plugin\ 에 압축 해제 (한글 없는 경로)
```

### macOS ARM sharp/libvips 에러 (Framelink #288)
```
원인: ARM64 바이너리 없음
해결: arch -x86_64 npx -y figma-developer-mcp --figma-api-key=KEY
또는: 공식 Remote MCP 사용 (네이티브 모듈 불필요)
```

---

## 연결/인증 문제

### OAuth 인증 루프
```
해결: 시크릿 창에서 figma.com 로그아웃 → 재인증
또는: claude mcp remove figma → 재등록
```

### "MCP dialog dismissed"
```
정상 동작. 에러 아님. 다이얼로그 닫혔다는 뜻.
```

### figma-mcp-go 응답 없음
```
원인: 플러그인 미실행
해결: Figma Desktop → Plugins → Development → Figma MCP Go → 실행
확인: 패널에 "Connected" + ws://localhost:1994
```

### "도구가 없다" 에러
```
원인: figma-use 스킬 미로드
해결: /figma-use 먼저 실행 또는 CLAUDE.md 자동 규칙 확인
```

---

## API/레이트 제한

### 429 Rate Limit (Framelink #258)
```
원인: Free 월 6회 / Pro 분당 10회 초과
해결:
  1. figma-mcp-go 사용 (무제한)
  2. 요청 간격 두기 (분당 10회 이하)
  3. Pro Dev $12/월 업그레이드
```

### 20KB 응답 잘림
```
해결: 섹션별 분할 요청
  "히어로만 [URL?node-id=히어로]"
  "기능 소개만 [URL?node-id=기능]"
  "전체를 page.tsx로 조합해줘"
```

---

## 코드 변환 품질

### position: absolute 코드
```
원인: Auto Layout 없음
해결: "먼저 Auto Layout 적용해줘" → 그 다음 변환
```

### 폰트 다르게 나옴
```
원인: Pretendard 등 MCP 미인식
해결: 프롬프트에 "폰트는 Pretendard, @font-face로 로딩" 명시
```

### 이미지 플레이스홀더
```
해결: get_images로 먼저 추출 → 코드에 경로 지정
```

### 스크린샷과 코드 차이
```
해결:
  1. Dev Mode URL(&mode=dev) 사용
  2. "헤딩이 48px인데 32px로 나왔어" 구체적 수정
  ❌ "다시 해줘" → ✅ "어디가 왜 다른지" 명시
```

---

## 환경별 알려진 이슈

| 환경 | 문제 | 상태 | 우회 |
|------|------|------|------|
| macOS ARM | sharp 빌드 실패 | Fixed | 공식 Remote 사용 |
| Windows | manifest 임포트 실패 | Fixed | 한글 경로 제거 |
| WSL | WebSocket 안 됨 | Known | `hostname: "0.0.0.0"` |
| figma-console macOS | WebSocket 끊김 | Open #61 | 공식 Remote |
| Framelink | JSON 구조 변경 | Open #216 | 최신 버전 |
| Framelink | 이미지 경로 오류 | Open #224 | 상대 경로 |

---

## CLI 버전 호환성

| 도구 | 최소 | 권장 | 확인 |
|------|------|------|------|
| Node.js | 18.0 | 22.x | `node -v` |
| npm | 9.0 | 10.x | `npm -v` |
| Claude Code | 2.0 | 2.1.91+ | `claude --version` |
| Figma Desktop | 최신 | 최신 | 앱 내 |
| Homebrew | 4.0 | 최신 | `brew --version` |
| Git | 2.30 | 최신 | `git --version` |

---

## 환경 자동 진단

```bash
bash check-env.sh
# 또는 원격 실행
curl -sL https://raw.githubusercontent.com/MadKangYu/MadKangYu-FigMa-Mcp/main/check-env.sh | bash
```

Node.js, Claude Code, MCP 서버, 플러그인 상태를 한번에 점검.

---

## Figma 초보자가 자주 겪는 문제

### "Figma 처음인데 뭐부터 해야 돼?"
```
1. figma.com 가입 (무료)
2. + New design file 클릭
3. 아무거나 그려보기 (사각형, 텍스트)
4. 그게 전부. MCP는 AI가 대신 해줌.
```

### "Auto Layout이 뭔지 모르겠어"
```
Figma에서 요소들을 자동 정렬하는 기능.
코드의 display: flex 또는 display: grid와 같은 것.

없으면: 요소가 제각각 → AI가 position: absolute로 변환 → 반응형 불가
있으면: 요소가 정렬됨 → AI가 Flexbox로 변환 → 반응형 가능

적용법: 프레임 선택 → 오른쪽 패널 "Auto layout" 클릭 (또는 Shift+A)
몰라도 됨: "이 프레임에 Auto Layout 적용해줘" 라고 AI에게 시키면 됨
```

### "컴포넌트? 변수? 너무 어려워"
```
몰라도 됨. AI한테 자연어로 말하면 됨:

❌ "Primary Button 컴포넌트의 Fill Variable을 brand-blue로 바꿔줘"
✅ "파란 버튼의 색상을 초록색으로 바꿔줘"

용어를 알면 더 정확하지만, 몰라도 AI가 추측해서 처리함.
```

### "Cmd+L이 뭐야? 어디서 눌러?"
```
Figma에서 요소를 클릭한 상태에서 Cmd+L (Mac) / Ctrl+L (Win)
→ 그 요소의 URL이 클립보드에 복사됨
→ 이 URL을 Claude Code에 붙여넣으면 됨

팁: 아무것도 선택 안 하고 Cmd+L → 파일 전체 URL
    프레임 선택하고 Cmd+L → 그 섹션만의 URL (더 정확)
```

### "Dev Mode가 뭐야? 어떻게 들어가?"
```
개발자용 보기 모드. CSS 값, 간격, 색상코드를 보여줌.

들어가기: 우상단 </> 아이콘 클릭 또는 Shift+D
나가기: 같은 아이콘 다시 클릭 또는 Shift+D

무료 범위: CSS 확인, 간격 측정, 링크 복사
유료 범위: 변수 상세, Code Connect, VS Code 연동
```

### "파일이 3개까지밖에 안 만들어져"
```
Free 플랜 = 파일 3개 제한.
해결:
  1. 불필요한 파일 삭제 (Drafts에서)
  2. 한 파일에 여러 페이지로 관리
  3. Pro 플랜 ($16/월) → 무제한
```

### "팀원이 내 파일을 못 봐"
```
공유 안 한 상태.
해결: 우상단 "Share" → 이메일 초대 또는 "Anyone with the link" 설정
Free 플랜에서도 공유는 가능.
```

### "실수로 다 지웠어"
```
Cmd+Z (실행 취소) 연타.
또는: File → Show version history → 이전 버전 복원
Free 플랜: 30일 히스토리
Pro: 무제한 히스토리
```
