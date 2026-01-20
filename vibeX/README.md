# VibeX Platform - 가격 책정 페이지

VibeX 플랫폼의 AI 여론 인텔리전스 서비스 가격 책정 페이지입니다. VibeCatch, VibePlus, VibeFlow 3개 모듈과 상세한 요금 계산기를 포함합니다.

## 📁 폴더 구조

```
vibeX/
├── parts/                      # HTML 조각 파일들 (10개)
│   ├── 01-head.html           # <head> 섹션 (메타, Tailwind CSS CDN)
│   ├── 02-header.html         # 상단 네비게이션 바
│   ├── 03-hero.html           # 히어로 섹션 + 3개 플랜 카드
│   ├── 04-calculator.html     # 요금 계산기 (대화형)
│   ├── 05-compare-vibecatch.html # VibeCatch 모듈 비교 테이블
│   ├── 06-compare-vibeplus.html  # VibePlus 모듈 비교 테이블
│   ├── 07-compare-vibeflow.html  # VibeFlow 모듈 비교 테이블
│   ├── 08-faq.html            # FAQ 섹션
│   ├── 09-footer.html         # 푸터
│   └── 10-scripts.html        # JS 파일 링크
│
├── vibeX-main.js              # 메인 UI 로직
├── vibeX-calculator.js        # 요금 계산 엔진
├── index.html                 # 빌드 결과 (자동 생성, .gitignore)
└── README.md                  # 이 파일
```

## 🎯 핵심 기능

### 1. 3개 모듈 비교 (Hero 섹션)

**VibeCatch** (기본 모듈)
- 기본 가격: 정가 기준
- 포함: 데이터 수집, 기본 분석, 보기
- 추가 비용: 키워드, 좌석, DC(수집 크레딧)

**VibeAI** (선택 추가)
- AI 기능 추가 모듈
- 포함: VibeCatch + AI 요약/인사이트
- 가격: 플랜별로 다름 (Basic/Pro)
- Enterprise는 협의

**VibeFlow** (선택 추가)
- 자동화/워크플로우 모듈
- 포함: VibeCatch + 자동 리포트/연동
- 가격: 플랜별로 다름 (Basic/Pro)
- Enterprise는 협의

### 2. 요금 계산기 (Calculator)

**기본 플랜 선택**
- Basic: ₩1,500,000/월
- Pro: ₩4,900,000/월
- Enterprise: ~(협의)

**추가 모듈**
- ☐ VibeAI 추가 여부 (체크 시 가격 표시)
- ☐ VibeFlow 추가 여부 (체크 시 가격 표시)

**옵션 조정**
| 항목 | 단위 | 가격 | 설명 |
|------|------|------|------|
| 키워드 | +10개 | ₩200,000 | 모니터링 대상 키워드 추가 |
| 좌석 | +1개 | ₩50,000 | 사용자 수 추가 |
| DC | +50k | ₩600,000 | 월간 데이터 수집량 |
| AC | +10k | ₩400,000 | AI 기능 사용량 (VibeAI 필수) |
| Backfill | +1,000 keyword-days | ₩150,000 | 과거 데이터 소급 수집 |
| 수집 주기 | 15→5분 | ₩800,000 | 실시간성 향상 |
| 수집 주기 | 5→1분 | ₩2,000,000 | 극도의 실시간성 |

**실시간 계산**
- 월간 요금 자동 계산
- 연간 요금 (15% 할인 적용)

**초기화**
- Reset 버튼으로 기본값으로 복귀

## 🏗️ Parts 파일 상세

### 01-head.html (10줄)
- 메타 설정 (UTF-8, viewport)
- 페이지 제목: "VibeX Platform - VibeCatch Pricing"
- **Tailwind CSS CDN**: `https://cdn.tailwindcss.com`
- 부드러운 스크롤 설정

### 02-header.html (20줄)
- 상단 네비게이션 바 (로고, 메뉴)
- 반응형 레이아웃

### 03-hero.html (144줄)
**플랜 카드 (3개)**
- VibeCatch (Basic/Pro/Ent)
- VibePlus (Basic/Pro/협의)
- VibeFlow (Basic/Pro/협의)

**요금 표시 방식**
- 각 카드에 `data-monthly` 속성 (월간 가격)
- 월간/연간 토글 버튼으로 가격 전환
- 연간은 "월 단위 환산가" 표시 (15% 할인 반영)

**주요 요소**
```html
<div data-plan-price data-monthly="1500000">₩1,500,000</div>
<span>/ 월 (VAT 별도)</span>
```

### 04-calculator.html (199줄)
**DOM 요소 ID** (vibeX-calculator.js와 연동)
```html
<!-- 플랜 선택 -->
<select id="planSelect">
  <option value="basic">Basic</option>
  <option value="pro" selected>Pro</option>
  <option value="ent">Enterprise</option>
</select>

<!-- 모듈 추가 -->
<input type="checkbox" id="modulePlus" />
<input type="checkbox" id="moduleFlow" />

<!-- 옵션 입력 -->
<input type="number" id="kwAdd" />      <!-- 키워드 -->
<input type="number" id="seatAdd" />    <!-- 좌석 -->
<input type="number" id="dcAdd" />      <!-- DC -->
<input type="number" id="acAdd" />      <!-- AC -->
<input type="number" id="bfAdd" />      <!-- Backfill -->
<select id="realtimeUp">
  <option value="none">기본(15분+)</option>
  <option value="15to5">5분 이상</option>
  <option value="5to1">1분 이상</option>
</select>

<!-- 결과 표시 -->
<div id="estMonthly">₩0</div>   <!-- 월간 요금 -->
<div id="estAnnual">₩0</div>    <!-- 연간 요금 -->

<!-- 리셋 -->
<button id="resetBtn">초기화</button>

<!-- 스텝 버튼 (±) -->
<button class="stepBtn" data-target="kwAdd" data-step="1">+</button>
<button class="stepBtn" data-target="kwAdd" data-step="-1">-</button>
```

### 05-07-compare-*.html (221~500줄)
**모듈별 비교 테이블**

**구조**
```html
<table>
  <thead>
    <tr>
      <th>기능</th>
      <th>Basic</th>
      <th>Pro</th>
      <th>Enterprise</th>
    </tr>
  </thead>
  <tbody>
    <!-- 행 -->
    <tr class="feature-row" data-detail="keywords">
      <td>
        <button class="rowBtn" data-detail="keywords">키워드</button>
      </td>
      <td>100</td>
      <td>500</td>
      <td>무제한</td>
    </tr>
    <!-- 상세 설명 행 (숨김) -->
    <tr class="detail-row hidden" data-detail-for="keywords">
      <td colspan="4">
        <div class="detail-content">
          <!-- 상세 설명 -->
        </div>
      </td>
    </tr>
  </tbody>
</table>
```

**정보 아이콘**
```html
<button class="infoBtn" data-detail="keywords">ⓘ</button>
```

**토글 기능**
- `rowBtn` / `infoBtn` 클릭 → 해당 `detail-row` 토글
- `toggleAllBtn` → 카테고리 내 모든 상세 행 일괄 토글

### 08-faq.html (26줄)
- FAQ 섹션 (닫힘/열림 토글)

### 09-footer.html (22줄)
- 저작권, 연락처, 링크

### 10-scripts.html (4줄)
**JS 파일 로드**
```html
<script src="vibeX-main.js"></script>
<script src="vibeX-calculator.js"></script>
</body>
</html>
```

## 💻 JavaScript 파일

### vibeX-main.js (315줄)

**상수 정의**
```javascript
const DISCOUNT_ANNUAL = 0.15;  // 15% 할인

const PLAN_MONTHLY = {
  basic: 1500000,
  pro: 4900000,
  ent: 12000000  // 기준값 (실제는 협의)
};

const OPTION_PRICES = {
  kw10: 200000,
  seat1: 50000,
  dc50k: 600000,
  ac10k: 400000,
  bf1000: 150000,
  rt_15to5: 800000,
  rt_5to1: 2000000
};
```

**주요 함수**

1. **setBilling(mode)**
   - 월간/연간 토글
   - 플랜 카드의 가격 표시 변경
   - `data-plan-price` 요소 갱신

2. **toggleDetail(key)**
   - 특정 기능의 상세 설명 행 토글
   - 기존 열린 행 자동 닫기

3. **toggleAllDetails(categoryId)**
   - 카테고리 내 모든 상세 행 일괄 토글
   - 버튼 텍스트 '모두 열기' ↔ '모두 닫기' 전환

4. **formatWon(n)**
   - 숫자 → "₩1,500,000" 형식 변환

**상세 설명 데이터**
```javascript
const DETAILS = {
  keywords: { title: "키워드(+10)", body: "..." },
  seats: { title: "좌석(+1)", body: "..." },
  dc: { title: "DC(수집 크레딧)", body: "..." },
  ac: { title: "AC(AI 크레딧)", body: "..." },
  backfill: { title: "Backfill(...)", body: "..." },
  realtime: { title: "수집 주기(...)", body: "..." },
  // ... 더 많은 기능
};
```

**초기화**
- 페이지 로드 시 `setBilling("monthly")` 호출

### vibeX-calculator.js (174줄)

**모듈 추가 가격**
```javascript
const MODULE_ADDON_MONTHLY = {
  vibeAI: { basic: 800000, pro: 1200000, ent: null },
  vibeFlow: { basic: 500000, pro: 800000, ent: null }
};
```

**주요 함수**

1. **recompute()**
   - 계산기의 모든 입력값 읽음
   - 기본 요금 + 옵션 합계 계산
   - 월간/연간 요금 갱신

2. **syncModuleUI(plan)**
   - 플랜별 모듈 가용성 설정
   - Enterprise는 모듈 선택 불가
   - 추가 가격 라벨 업데이트 (VibeAI/VibeFlow)

3. **syncAcAvailability()**
   - VibeAI 미선택 시 AC 입력 비활성화
   - AC 카드 시각 처리 (투명도)

4. **clampNonNegInt(v)**
   - 입력값 → 음이 아닌 정수 변환
   - 안전한 값 검증

**이벤트 리스너**
- 플랜 선택 → `recompute()`
- 모듈 체크 (VibeAI/VibeFlow) → `recompute()`
- 옵션 입력 → `recompute()`
- 스텝 버튼 (±) → 값 증감 후 `recompute()`
- 초기화 버튼 → 모든 값 리셋

**초기 상태**
```javascript
planSelect.value = "pro";
moduleAI.checked = false;
moduleFlow.checked = false;
kwAdd.value = "0";
// ... 등등
recompute();  // 초기 계산
```

## 🚀 빌드 & 테스트

### 빌드 명령어

```bash
# vibeX만 빌드
npm run build:vibeX

# 모든 페이지 빌드
npm run build

# 자동 감시 (파일 변경 시 자동 빌드)
npm run watch:vibeX
```

### 빌드 결과
- **생성 위치**: `vibeX/index.html`
- **크기**: ~87KB
- **라인 수**: ~1,637줄
- **파일 구성**: parts/ 10개 파일 합침

### 로컬 테스트

```bash
# 1. 빌드
npm run build:vibeX

# 2. 브라우저에서 열기
# vibeX/index.html을 브라우저로 오픈

# 3. 테스트 항목
- 플랜 카드 표시 확인
- 월간/연간 토글 작동
- 계산기 입력 필드 작동
- 플러스/마이너스 버튼 작동
- 모듈 체크 시 가격 업데이트
- 상세 설명 토글 작동
- 리셋 버튼 작동
- 개발자 도구 Console에 에러 없음
```

## 📝 수정 가이드

### parts/ 파일 수정 시

**예시: 플랜 가격 변경 (Basic)**

1. `vibeX/parts/03-hero.html` 열기
2. `data-monthly="1500000"` 찾기 (VibeCatch Basic)
3. 새로운 가격으로 변경: `data-monthly="2000000"`
4. 표시 텍스트도 업데이트: `₩2,000,000`
5. 저장

```html
<!-- Before -->
<div data-plan-price data-monthly="1500000">₩1,500,000</div>

<!-- After -->
<div data-plan-price data-monthly="2000000">₩2,000,000</div>
```

### 계산기 옵션 가격 수정

**예시: 키워드 가격 변경 (+10개 → +5개, ₩200,000 → ₩150,000)**

1. `vibeX/vibeX-main.js` 열기
2. `OPTION_PRICES` 섹션 찾기
3. `kw10: 200000` → `kw10: 150000` 변경
4. 저장

```javascript
// Before
const OPTION_PRICES = {
  kw10: 200000,     // per +10 keywords
  // ...
};

// After
const OPTION_PRICES = {
  kw10: 150000,     // per +10 keywords (가격 인상)
  // ...
};
```

### 추가 모듈 가격 수정

**예시: VibeAI Pro 가격 변경 (₩1,200,000 → ₩1,500,000)**

1. `vibeX/vibeX-calculator.js` 열기
2. `MODULE_ADDON_MONTHLY` 섹션 찾기
3. `vibeAI: { basic: 800000, pro: 1200000, ...}` → `pro: 1500000`
4. 저장

```javascript
// Before
const MODULE_ADDON_MONTHLY = {
  vibeAI: { basic: 800000, pro: 1200000, ent: null },
  vibeFlow: { basic: 500000, pro: 800000, ent: null }
};

// After
const MODULE_ADDON_MONTHLY = {
  vibeAI: { basic: 800000, pro: 1500000, ent: null },  // Pro 가격 인상
  vibeFlow: { basic: 500000, pro: 800000, ent: null }
};
```

### 비교 테이블 수정

**예시: VibeCatch Basic 키워드 한계 변경 (100 → 150)**

1. `vibeX/parts/05-compare-vibecatch.html` 열기
2. 테이블에서 해당 셀 찾기
3. 값 변경
4. 저장

```html
<!-- Before -->
<tr>
  <td>키워드</td>
  <td>100</td>
  <td>500</td>
  <td>무제한</td>
</tr>

<!-- After -->
<tr>
  <td>키워드</td>
  <td>150</td>  <!-- Changed -->
  <td>500</td>
  <td>무제한</td>
</tr>
```

## ⚠️ 주의사항

### 파일 구조 유지
- **parts/ 파일명 번호 변경 금지** (01-*, 02-*, ... 순서 중요)
- vibeX-main.js, vibeX-calculator.js 파일명 변경 금지
- parts/10-scripts.html에서 JS 로드 순서 유지

### DOM ID 일치성
- vibeX-calculator.js의 `getElementById()` 호출과 HTML의 ID 일치 필수
- 예: `document.getElementById("planSelect")` ↔ `<select id="planSelect">`

### Tailwind CSS CDN
- 01-head.html에서 `<script src="https://cdn.tailwindcss.com"></script>` 유지
- 오프라인 환경에서는 별도 CSS 빌드 필요

### 데이터 형식
- `data-monthly`: 숫자만 (쉼표 없음)
- `formatWon()`으로 "₩1,500,000" 형식 자동 변환
- 입력 필드 ID와 `data-target` 속성 일치

## 📞 문제 해결

### 계산기가 동작 안 할 때
```bash
# 1. 브라우저 Console 확인 (F12)
# 2. DOM ID 확인: id="moduleAI", id="moduleFlow" 등이 HTML에 있는지
# 3. JS 파일 로드 확인: 10-scripts.html 확인
# 4. vibeX-calculator.js의 DOM 요소 선택자와 일치하는지 확인
```

### 가격 계산이 이상할 때
```bash
# 1. PLAN_MONTHLY / OPTION_PRICES 값 확인
# 2. MODULE_ADDON_MONTHLY 값 확인
# 3. calculatePrice() 함수의 계산 로직 점검
# 4. VibeAI/VibeFlow 활성화 상태 확인
```

### 스타일이 깨졌을 때
```bash
# 1. 01-head.html의 Tailwind CSS CDN 확인
# 2. Tailwind 클래스명 오류 확인
# 3. 부분 빌드 재실행: npm run build:vibeX
```

## 🔗 관련 문서

- [전체 저장소 README](../README.md) - 멀티 페이지 구조 및 빌드 시스템
- [Tailwind CSS 문서](https://tailwindcss.com) - 스타일링
- [MDN HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) - HTML 마크업

---

**Last Updated:** 2025-01-20
**Version:** 1.0.0
**Maintainer:** VibeX Team
