# 크롤링 전략 가이드 (Ultimate Crawling Strategy)

> 이커머스부터 SaaS 벤치마크까지. 차단 우회부터 API 활용까지 4단계 전략.

---

## 핵심 원칙

- **항상 합법적 수단 우선**: 공식 API → 공개 데이터 → robots.txt 준수
- **단계 순서 지키기**: 1순위(API)가 안 될 때만 2순위로, 순서 건너뛰지 말 것
- **Rate limiting 존중**: 의도적 딜레이, 요청 수 제한 준수
- **개인정보 수집 금지**: GDPR/PIPA 준수. 개인 식별 정보 수집 절대 금지

---

## 4단계 접근 전략

### 1순위: 공식 API (가장 안전하고 안정적)

#### Naver 상품/검색 API
```bash
# 네이버 개발자센터: https://developers.naver.com
# 서비스 신청 → Client ID + Client Secret 발급

# 상품 검색 API
curl -H "X-Naver-Client-Id: YOUR_CLIENT_ID" \
     -H "X-Naver-Client-Secret: YOUR_CLIENT_SECRET" \
     "https://openapi.naver.com/v1/search/shop.json?query=아이오페+레티놀&display=100"

# 응답 필드: title, lprice(최저가), hprice(최고가), mallName, link, image
# 일일 할당량: 25,000건 (검색 API 기준)
```

#### Naver 스마트스토어 파트너 API
```bash
# 네이버 커머스 API: https://api.commerce.naver.com
# 파트너 센터 → API 사용 신청 필요 (판매자 계정)

# 상품 목록 조회
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     "https://api.commerce.naver.com/external/v2/products?page=1&size=100"
```

#### Coupang Partners API
```bash
# https://developers.coupang.com
# Partners 가입 → Access Key + Secret Key 발급
# 인증 방식: HMAC-SHA256

# Python으로 HMAC 인증 예시
pip install requests

python3 << 'EOF'
import hmac, hashlib, time, requests

ACCESS_KEY = "your-access-key"
SECRET_KEY = "your-secret-key"

def generate_hmac(method, url, secret_key, access_key):
    datetime = time.strftime("%y%m%d%H%M%S", time.gmtime())
    message = datetime + method + url
    signature = hmac.new(
        secret_key.encode('utf-8'),
        message.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return f"CEA algorithm=HmacSHA256, access-key={access_key}, signed-date={datetime}, signature={signature}"

url = "/v2/providers/affiliate_open_api/apis/openapi/products/search?keyword=아이오페&limit=100"
auth = generate_hmac("GET", url, SECRET_KEY, ACCESS_KEY)
response = requests.get(f"https://api-gateway.coupang.com{url}", headers={"Authorization": auth})
print(response.json())
EOF
```

#### Amazon PA-API 5.0 (Product Advertising API)
```bash
# https://affiliate-program.amazon.com/assoc_credentials/home
# Associates 계정 필요 → Access Key + Secret Key 발급

# Node.js SDK 설치
npm install paapi5-nodejs-sdk

# 또는 Python SDK
pip install amazon-paapi5

# Python 예시
python3 << 'EOF'
from paapi5_python_sdk.api.default_api import DefaultApi
from paapi5_python_sdk.models.search_items_request import SearchItemsRequest
from paapi5_python_sdk.models.partner_type import PartnerType

api = DefaultApi(
    access_key="YOUR_ACCESS_KEY",
    secret_key="YOUR_SECRET_KEY",
    host="webservices.amazon.co.jp",  # JP: amazon.co.jp / US: amazon.com
    region="ap-northeast-1"           # JP: ap-northeast-1 / US: us-east-1
)

request = SearchItemsRequest(
    partner_tag="YOUR_ASSOCIATE_TAG",
    partner_type=PartnerType.ASSOCIATES,
    keywords="retinol serum",
    search_index="Beauty",
    resources=["ItemInfo.Title", "Offers.Listings.Price", "Images.Primary.Large"]
)

response = api.search_items(request)
for item in response.search_result.items:
    print(item.asin, item.item_info.title.display_value)
EOF
```

---

### 2순위: CLI 도구 (빠른 탐색/프로토타이핑)

#### Playwright MCP
```bash
# 이미 설치된 경우 바로 사용 가능
# Claude Code에서:

# 기본 탐색 + 스냅샷
browser_navigate: "https://smartstore.naver.com/mystore/products"
browser_snapshot  # DOM 구조 캡처 (텍스트 기반)

# JavaScript 실행으로 데이터 추출
browser_evaluate: |
  Array.from(document.querySelectorAll('.product-item')).map(el => ({
    name: el.querySelector('.product-name')?.textContent?.trim(),
    price: el.querySelector('.price')?.textContent?.trim(),
    url: el.querySelector('a')?.href
  }))

# 스크린샷 저장
browser_take_screenshot: "/tmp/reference-screenshot.png"
```

#### gstack (Headless Browser CLI)
```bash
# 설치
npm install -g gstack
# 또는
brew install gstack  # macOS

# 페이지 텍스트 추출
gstack fetch "https://example.com" --format text

# 스크린샷
gstack screenshot "https://example.com" --output /tmp/site.png --width 1440

# DOM 쿼리
gstack query "https://example.com" --selector ".price" --attr "textContent"

# 여러 URL 배치 처리
gstack batch urls.txt --format json --output results.json
```

#### curl + jq (API 호출 기본)
```bash
# 설치 확인
brew install curl jq

# Naver 검색 API + 결과 파싱
curl -s \
  -H "X-Naver-Client-Id: $NAVER_CLIENT_ID" \
  -H "X-Naver-Client-Secret: $NAVER_CLIENT_SECRET" \
  "https://openapi.naver.com/v1/search/shop.json?query=레티놀크림&display=20" \
  | jq '.items[] | {title: .title, price: .lprice, mall: .mallName}' \
  | jq -s '.' > products.json

# 여러 키워드 루프
for keyword in "레티놀" "비타민C" "나이아신아마이드"; do
  curl -s \
    -H "X-Naver-Client-Id: $NAVER_CLIENT_ID" \
    -H "X-Naver-Client-Secret: $NAVER_CLIENT_SECRET" \
    "https://openapi.naver.com/v1/search/shop.json?query=${keyword}&display=100" \
    | jq --arg kw "$keyword" '[.items[] | {keyword: $kw, title: .title, price: .lprice}]' \
    >> all_products.jsonl
  sleep 0.5  # Rate limiting
done
```

---

### 3순위: CDP (Chrome DevTools Protocol)

실제 브라우저로 로그인 세션, 쿠키, JavaScript 렌더링이 필요한 경우.

#### OpenChrome MCP 사용법
```bash
# Claude Code에서 MCP 도구 사용:

# 1. 브라우저 연결 상태 확인
mcp__openchrome__oc_connection_health

# 2. 페이지 탐색
mcp__openchrome__navigate: { url: "https://smartstore.naver.com/mystore" }

# 3. 로그인 상태에서 페이지 읽기 (쿠키 자동 사용)
mcp__openchrome__read_page: { type: "simplified" }

# 4. 특정 요소 찾기
mcp__openchrome__find: { query: "product price" }

# 5. DOM 직접 쿼리
mcp__openchrome__query_dom: {
  selector: ".product-list-item",
  attribute: "textContent"
}

# 6. JavaScript 실행
mcp__openchrome__javascript_tool: {
  code: "return document.querySelectorAll('.price').length"
}

# 7. 쿠키 확인/관리
mcp__openchrome__cookies: { action: "get", domain: "smartstore.naver.com" }
```

#### setup-browser-cookies 스킬 (실제 쿠키 임포트)
```bash
# Claude Code 터미널에서:
/setup-browser-cookies

# 이 스킬이 하는 일:
# 1. Chrome/Firefox에서 현재 로그인된 쿠키를 추출
# 2. MCP가 사용할 수 있는 형식으로 변환
# 3. Naver, Coupang 등 사이트의 세션 쿠키를 CDP에 주입

# 수동으로 쿠키 추출 (Chrome)
# 개발자 도구 → Application → Cookies → 복사
# 또는 EditThisCookie 확장 프로그램 사용
```

#### 안티봇 우회 전략
```javascript
// Playwright에서 실제 유저처럼 동작하게 설정
const playwright = require('playwright');

async function humanLikeBrowsing(url) {
  const browser = await playwright.chromium.launch({
    headless: false,  // 헤드리스 비활성화
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-web-security'
    ]
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
  });

  const page = await context.newPage();

  // navigator.webdriver 숨기기
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  await page.goto(url);

  // 인간처럼 랜덤 딜레이
  await page.waitForTimeout(1000 + Math.random() * 2000);

  // 마우스 움직임 시뮬레이션
  await page.mouse.move(200 + Math.random() * 100, 300 + Math.random() * 100);
  await page.waitForTimeout(500 + Math.random() * 1000);

  const data = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[class*="price"]')).map(el => el.textContent.trim());
  });

  await browser.close();
  return data;
}
```

---

### 4순위: VPN/프록시 (지역 차단 우회)

#### Cloudflare WARP CLI (무료, 가장 간단)
```bash
# macOS 설치
brew install cloudflare-warp

# 또는 공식 패키지: https://1.1.1.1/

# 사용법
warp-cli register       # 최초 등록
warp-cli connect        # VPN 연결
warp-cli status         # 상태 확인
warp-cli disconnect     # 연결 해제

# 특정 국가로 연결 (Teams 계정 필요)
warp-cli set-custom-endpoint 162.159.192.1:2408
```

#### WireGuard CLI
```bash
# macOS 설치
brew install wireguard-tools

# 설정 파일 생성 (/etc/wireguard/wg0.conf)
cat > /etc/wireguard/wg0.conf << EOF
[Interface]
PrivateKey = YOUR_PRIVATE_KEY
Address = 10.0.0.2/24
DNS = 8.8.8.8

[Peer]
PublicKey = SERVER_PUBLIC_KEY
Endpoint = server.example.com:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
EOF

# 연결/해제
sudo wg-quick up wg0
sudo wg-quick down wg0

# 상태 확인
sudo wg show
```

#### ScraperAPI (API 기반 프록시, 월 1000건 무료)
```bash
# https://www.scraperapi.com
# 가입 → API Key 발급

# 기본 사용
curl "http://api.scraperapi.com?api_key=YOUR_KEY&url=https://www.amazon.co.jp/s?k=retinol"

# 지역 설정
curl "http://api.scraperapi.com?api_key=YOUR_KEY&country_code=jp&url=https://www.amazon.co.jp/s?k=retinol"

# 렌더 JavaScript
curl "http://api.scraperapi.com?api_key=YOUR_KEY&render=true&url=https://example.com"

# Python 래퍼
pip install scraperapi-sdk
python3 << 'EOF'
from scraperapi_sdk import ScraperAPIClient
client = ScraperAPIClient('YOUR_API_KEY')
result = client.get(url='https://www.amazon.co.jp/s?k=retinol')
print(result.text[:1000])
EOF
```

#### Bright Data (프리미엄, 업무용)
```bash
# https://brightdata.com
# 주거용 IP 프록시. 가장 우회율 높음. 가격: ~$15/GB

# Proxy Manager 설치
npm install -g @brightdata/proxy-manager

# 또는 직접 프록시 설정
curl --proxy "http://USERNAME:PASSWORD@zproxy.lum-superproxy.io:22225" \
     "https://www.amazon.co.jp/s?k=retinol"
```

#### CDP에서 프록시 설정
```javascript
// Playwright + 프록시
const browser = await playwright.chromium.launch({
  proxy: {
    server: 'http://proxy.example.com:8080',
    username: 'user',
    password: 'pass'
  }
});

// ScraperAPI와 함께 Playwright 사용
const browser = await playwright.chromium.launch({
  proxy: {
    server: 'http://proxy.scrapeops.io:5353',
    username: 'scrapeops-api-key-YOUR_KEY',
    password: ''
  }
});
```

---

## 플랫폼별 최적 접근법

| 플랫폼 | 차단 수준 | 최적 방법 | 대안 | 비고 |
|--------|----------|-----------|------|------|
| Naver 스마트스토어 | 보통 | 검색 API (공식) | CDP + 로그인 쿠키 | API: 25,000건/일 |
| Coupang | 높음 | Partners API | CDP + HMAC 쿠키 | Bot 감지 강함 |
| Amazon JP | 높음 | PA-API 5.0 | CDP + 일본 프록시 | Associates 가입 필수 |
| Amazon US | 높음 | PA-API 5.0 | CDP + VPN (US) | 동일 |
| 11번가 | 낮음 | CDP (직접) | Playwright | API 없음, Bot 감지 약함 |
| G마켓/옥션 | 보통 | CDP | Playwright + 딜레이 | 모바일 우회 효과적 |
| 올리브영 | 보통 | CDP | gstack | 로그인 없이 가격 조회 가능 |
| 무신사 | 보통 | CDP | Playwright | SPA, JS 렌더링 필요 |
| Shopify 스토어 | 낮음 | curl + jq | Playwright | JSON API 노출된 경우 많음 |
| 해외 SaaS | 낮음 | Playwright MCP | gstack | 마케팅 페이지 공개 |

---

## 비즈니스 활용 시나리오

### 1. SaaS 랜딩페이지 벤치마크
```
목적: 경쟁 SaaS 제품의 랜딩페이지 구조 분석
도구: Playwright MCP + Figma MCP

프롬프트:
"다음 SaaS 제품들의 랜딩페이지를 분석해줘:
- [경쟁사1 URL]
- [경쟁사2 URL]
- [경쟁사3 URL]

각 사이트에서 추출할 항목:
1. Hero 섹션 카피라이팅 패턴
2. Pricing 구조 (플랜 수, 가격대, 강조 플랜)
3. Social Proof 방식 (고객 수, 로고, 리뷰)
4. CTA 버튼 텍스트와 색상
5. Feature 섹션 레이아웃 (grid vs list)

결과를 비교표로 만들고 Figma FigJam에 다이어그램으로 정리해줘"
```

### 2. 경쟁사 가격/기능 비교표 자동 생성
```bash
# 매주 자동 실행 스크립트
#!/bin/bash
# price-monitor.sh

KEYWORDS=("레티놀 크림 50ml" "비타민C 세럼 30ml" "히알루론산 에센스")
OUTPUT_FILE="price_$(date +%Y%m%d).csv"

echo "keyword,platform,product,price,url,timestamp" > $OUTPUT_FILE

for keyword in "${KEYWORDS[@]}"; do
  # Naver API 조회
  result=$(curl -s \
    -H "X-Naver-Client-Id: $NAVER_CLIENT_ID" \
    -H "X-Naver-Client-Secret: $NAVER_CLIENT_SECRET" \
    "https://openapi.naver.com/v1/search/shop.json?query=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$keyword'))")&display=5")

  echo $result | jq -r --arg kw "$keyword" \
    '.items[] | [$kw, .mallName, .title, .lprice, .link, (now | todate)] | @csv' \
    >> $OUTPUT_FILE

  sleep 1
done

echo "저장 완료: $OUTPUT_FILE"
```

### 3. 인플루언서 콘텐츠 레이아웃 분석
```
목적: 뷰티/뷰티 인플루언서 콘텐츠 구조 분석
도구: Playwright MCP (인스타그램 퍼블릭 페이지)

프롬프트:
"다음 인플루언서들의 최근 10개 게시물 레이아웃을 분석해줘:
- [인스타그램 공개 계정 URL]

분석 항목:
1. 이미지 배치 패턴 (단일/캐러셀/리일)
2. 텍스트 오버레이 위치와 스타일
3. 색상 팔레트 일관성
4. 해시태그 전략

결과를 바탕으로 우리 브랜드 콘텐츠 템플릿을 Figma에 만들어줘"
```

### 4. 뉴스레터 디자인 수집 → 내 스타일로 변환
```
목적: 경쟁사/업계 뉴스레터 디자인 벤치마크
도구: Really Good Emails + Figma MCP

워크플로우:
1. https://reallygoodemails.com 에서 뷰티/라이프스타일 이메일 10개 북마크
2. Playwright MCP로 각 이메일 스크린샷 캡처
3. Figma에서 분석:
   - 헤더 레이아웃 패턴
   - CTA 버튼 디자인
   - 제품 이미지 배치
   - 푸터 구성

프롬프트:
"수집한 뉴스레터 레퍼런스를 기반으로 [브랜드명] 스타일의 이메일 템플릿을 Figma에 만들어줘:
- 600px 고정 폭
- 브랜드 컬러: [색상코드]
- 섹션: 헤더/프로모션 배너/제품 3열/CTA/푸터
- Pretendard 폰트 (한국어)"
```

### 5. 포트폴리오 사이트 구축
```
목적: 디자인 포트폴리오 사이트 제작
도구: Behance/Layers.to + Figma MCP + Notefolio

단계:
1. Behance에서 뷰티/브랜딩 분야 상위 5개 포트폴리오 분석
2. Notefolio에서 한국 디자이너 스타일 레퍼런스 수집
3. 핵심 섹션 도출: About, Work, Process, Contact

Figma 구조 생성 프롬프트:
"포트폴리오 사이트 Figma 파일을 만들어줘:
- 페이지 구성: Landing, Work, Case Study Template, About, Contact
- 반응형: 1440px / 768px / 390px
- 다크 테마 기본 (Light 토글 옵션)
- Auto Layout으로 모든 컴포넌트 구성
- 케이스 스터디 카드 컴포넌트 (이미지, 태그, 제목, 기간)"
```

### 6. 이커머스 상품 가격 자동화 (G-VAPE / AMPLE:N 활용)
```bash
# 경쟁사 가격 모니터링 + Slack 알림
#!/bin/bash
# monitor-competitors.sh

# 목표 키워드 목록
PRODUCTS_FILE="products.txt"  # 한 줄에 하나씩 상품명

while IFS= read -r product; do
  # Naver 최저가 조회
  lowest=$(curl -s \
    -H "X-Naver-Client-Id: $NAVER_CLIENT_ID" \
    -H "X-Naver-Client-Secret: $NAVER_CLIENT_SECRET" \
    "https://openapi.naver.com/v1/search/shop.json?query=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$product'))")&display=5&sort=asc" \
    | jq -r '.items[0] | "\(.title) | \(.lprice)원 | \(.mallName)"')

  echo "$product → $lowest"
  sleep 0.5
done < "$PRODUCTS_FILE"
```

---

## 환경 변수 관리

```bash
# ~/.zshrc 또는 ~/.env 에 저장
export NAVER_CLIENT_ID="your_naver_client_id"
export NAVER_CLIENT_SECRET="your_naver_client_secret"
export COUPANG_ACCESS_KEY="your_coupang_access_key"
export COUPANG_SECRET_KEY="your_coupang_secret_key"
export AMAZON_ACCESS_KEY="your_amazon_access_key"
export AMAZON_SECRET_KEY="your_amazon_secret_key"
export AMAZON_ASSOCIATE_TAG="your-associate-tag-20"
export SCRAPERAPI_KEY="your_scraperapi_key"

# 적용
source ~/.zshrc
```

---

## 주의사항 및 법적 고려

| 항목 | 내용 |
|------|------|
| robots.txt | 반드시 확인. Disallow된 경로는 크롤링 금지 |
| 이용약관 | 각 플랫폼 ToS에서 자동화 도구 사용 조항 확인 |
| Rate Limit | API는 할당량 준수. CDP는 인간 속도 모방 |
| 개인정보 | 개인 식별 정보 수집 금지 (PIPA 적용) |
| 상업적 사용 | API 데이터의 재판매/재배포 금지 조항 확인 |
| 저작권 | 이미지/텍스트 무단 복제 주의 |

> Naver, Coupang, Amazon 모두 자동화 크롤링을 ToS로 금지하고 있음. 공식 API 사용이 법적으로 가장 안전한 방법. CDP/Playwright는 개인 연구 목적에 한해 신중히 사용.
