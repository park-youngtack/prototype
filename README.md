# VibeX Platform - 가격 책정 페이지

VibeX 플랫폼의 가격 책정 페이지입니다. AI 여론 인텔리전스 플랫폼의 세 가지 모듈(VibeCatch, VibePlus, VibeFlow)과 요금 계산기를 포함합니다.

## 📁 프로젝트 구조

```
소셜리스닝/
├── vibeX.html                      # 최종 빌드된 HTML 파일 (자동 생성)
├── vibeX-main.js                   # 메인 UI 로직 (플랜 카드, 토글)
├── vibeX-calculator.js             # 요금 계산기 로직
├── vibeX-components.css            # 재사용 가능한 CSS 클래스
├── build.js                        # 빌드 스크립트 (Node.js)
├── package.json                    # npm 설정 및 스크립트
├── README.md                       # 이 파일
├── .gitignore                      # Git 무시 파일
│
└── parts/                          # HTML 조각 파일들 (개발용)
    ├── 01-head.html               # <head> 섹션 (10줄)
    ├── 02-header.html             # 상단 네비게이션 (20줄)
    ├── 03-hero.html               # 히어로 + 플랜 카드 (144줄)
    ├── 04-calculator.html         # 요금 계산기 (199줄)
    ├── 05-compare-vibecatch.html  # VibeCatch 모듈 비교 (221줄)
    ├── 06-compare-vibeplus.html   # VibePlus 모듈 비교 (500줄)
    ├── 07-compare-vibeflow.html   # VibeFlow 모듈 비교 (441줄)
    ├── 08-faq.html                # FAQ 섹션 (26줄)
    ├── 09-footer.html             # 푸터 (22줄)
    └── 10-scripts.html            # JS 링크 (4줄)
```

## 🎯 핵심 특징

### 1. **모듈화된 HTML 구조**
- 큰 HTML 파일을 10개의 작은 조각으로 분리
- 각 섹션: 10~500줄 (원본: 1,596줄)
- 각 섹션을 독립적으로 편집 및 관리

### 2. **자동 빌드 시스템**
- `build.js`: Node.js 스크립트로 parts/ 디렉토리의 모든 HTML 조각을 합쳐서 vibeX.html 생성
- `npm run build`: 수동 빌드
- `npm run watch`: 파일 변경 시 자동 빌드

### 3. **기술 스택**
| 기술 | 설명 |
|------|------|
| **HTML5** | 구조 마크업 |
| **Tailwind CSS** | 유틸리티 우선 CSS 프레임워크 |
| **JavaScript (Vanilla)** | UI 로직 및 계산기 |
| **Node.js** | 빌드 스크립트 실행 |

### 4. **파일별 역할**

| 파일 | 크기 | 역할 |
|------|------|------|
| **vibeX.html** | 85KB | 최종 배포용 HTML (자동 생성) |
| **vibeX-main.js** | 13KB | 플랜 카드 UI, 요금 토글, 상세 설명 토글 |
| **vibeX-calculator.js** | 2.8KB | 요금 계산 로직 |
| **vibeX-components.css** | 5.8KB | 재사용 가능한 CSS 클래스 |

## 🚀 빠른 시작

### 사전 요구사항
- Node.js v14 이상
- npm 또는 yarn

### 1️⃣ 초기 설정

```bash
# 프로젝트 디렉토리로 이동
cd "소셜리스닝"

# 의존성 설치
npm install
```

### 2️⃣ 개발 모드 (자동 빌드)

```bash
# Watch 모드 실행 (파일 변경 시 자동 빌드)
npm run watch

# 다른 터미널에서 로컬 서버 실행 (선택사항)
# 예: npx http-server 또는 Live Server 확장 프로그램 사용
```

### 3️⃣ 파일 수정 워크플로우

1. `parts/` 디렉토리의 원하는 파일 수정
   ```
   parts/04-calculator.html 수정
   ```

2. 파일 저장 (watch 모드에서 자동 빌드됨)

3. 브라우저 새로고침하여 변경사항 확인

4. 완료!

### 4️⃣ 수동 빌드

```bash
npm run build
```

## 📋 파일 수정 가이드

### parts/ 디렉토리 구조

각 파일은 독립적인 HTML 조각입니다. `<html>`, `<head>`, `<body>` 태그는 빌드 스크립트에서 추가되므로, 각 파일은 콘텐츠만 포함합니다.

#### 예시: parts/04-calculator.html 수정

```html
<!-- 이것은 parts/04-calculator.html의 일부 -->
<section id="calculator" class="mx-auto max-w-7xl px-4 py-8">
  <!-- 계산기 콘텐츠 -->
  <div class="space-y-4">
    <!-- 플랜 선택 -->
    <div>
      <label for="planSelect" class="block text-sm font-semibold">플랜 선택</label>
      <select id="planSelect" class="rounded-lg border border-slate-200 px-3 py-2">
        <option value="basic">Basic</option>
        <option value="pro" selected>Pro</option>
        <option value="ent">Enterprise</option>
      </select>
    </div>
    <!-- 나머지 계산기 UI -->
  </div>
</section>
```

### 수정 시 주의사항

⚠️ **중요:**
- **parts/ 파일만 수정** (vibeX.html은 자동 생성되므로 직접 수정 금지)
- 각 파일은 HTML 조각이므로 완전한 HTML 문서가 아님
- 파일명 앞 숫자 변경 금지 (빌드 순서 결정)
- 수정 후 반드시 `npm run build` 또는 watch 모드 실행

## 🔄 GitHub 업로드 및 관리

### 1️⃣ .gitignore 설정

```bash
# 프로젝트 루트에 .gitignore 파일 생성
node_modules/
vibeX.html
.DS_Store
*.log
```

**이유:**
- `node_modules/`: npm 의존성 (크기 큼, package.json에서 복구 가능)
- `vibeX.html`: 자동 생성되므로 버전 관리 불필요
- 개발 환경 파일들

### 2️⃣ GitHub 저장소 설정

```bash
# Git 초기화 (이미 되어있으면 생략)
git init

# 원격 저장소 추가
git remote add origin https://github.com/username/vibex-pricing.git

# 처음 커밋
git add .
git commit -m "initial: VibeX 가격 책정 페이지 구조 설정"

# 원격 저장소에 푸시
git push -u origin main
```

### 3️⃣ 워크플로우

#### **개발 중 커밋**

```bash
# parts 파일 수정 후
git add parts/04-calculator.html
git commit -m "feat: 계산기 UI 개선 - 키워드 입력 필드 추가"

# 여러 파일 수정
git add parts/
git commit -m "refactor: 계산기 섹션 구조 개선"
```

#### **배포 전 빌드**

```bash
# vibeX.html 생성 (최종 배포용)
npm run build

# vibeX.html은 .gitignore에 있으므로 커밋되지 않음
# 배포할 때만 필요 (npm run build로 서버에서 생성)
```

### 4️⃣ GitHub에 업로드할 파일

✅ **커밋 포함:**
```
parts/
├── 01-head.html
├── 02-header.html
├── 03-hero.html
├── ...
vibeX-main.js
vibeX-calculator.js
vibeX-components.css
build.js
package.json
package-lock.json
.gitignore
README.md
```

❌ **커밋 제외:**
```
vibeX.html (자동 생성)
node_modules/ (npm install로 복구)
```

## 📝 커밋 메시지 가이드

```bash
# 좋은 예시:
git commit -m "feat: 요금 계산기 기능 추가"
git commit -m "fix: 플랜 카드 토글 버그 수정"
git commit -m "refactor: 모듈 구조 개선"
git commit -m "docs: README 작성"
git commit -m "build: build.js 최적화"

# 안 좋은 예시:
git commit -m "수정"
git commit -m "파일 변경"
git commit -m "업데이트"
```

### 커밋 타입

| 타입 | 설명 |
|------|------|
| **feat** | 새로운 기능 |
| **fix** | 버그 수정 |
| **refactor** | 코드 구조 개선 |
| **docs** | 문서 수정 |
| **build** | 빌드 설정 수정 |
| **style** | 스타일 수정 (기능 변화 없음) |
| **perf** | 성능 개선 |

## 🔗 팀 협업 가이드

### 1️⃣ 새로운 팀원 온보딩

```bash
# 저장소 클론
git clone https://github.com/username/vibex-pricing.git
cd vibex-pricing

# 의존성 설치
npm install

# 개발 시작
npm run watch

# 브라우저에서 확인
open vibeX.html
```

### 2️⃣ 브랜치 전략

```bash
# 기능 개발용 브랜치
git checkout -b feature/calculator-enhancement

# 버그 수정용 브랜치
git checkout -b fix/toggle-bug

# 완료 후 Pull Request 생성
git push origin feature/calculator-enhancement
```

### 3️⃣ Pull Request 리뷰

PR 생성 시:
- 수정된 부분 명확하게 설명
- 관련 parts/ 파일만 포함 (vibeX.html 제외)
- 스크린샷이나 데모 영상 첨부

## 🐛 트러블슈팅

### 빌드가 안 될 때

```bash
# 1. Node.js 버전 확인
node --version  # v14 이상 필요

# 2. npm 재설치
rm -rf node_modules package-lock.json
npm install

# 3. 수동 빌드
npm run build
```

### 변경사항이 반영 안 될 때

```bash
# 1. watch 모드 확인 (터미널에서 실행)
npm run watch

# 2. 강제 새로고침
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# 3. 캐시 삭제 후 새로고침
브라우저 개발자도구 > Application > Clear All
```

### 부분 빌드 실패

```bash
# parts/ 파일 구문 확인
# 특히 HTML 태그가 제대로 닫혀있는지 확인

# 예: <div> 태그 누락
<!-- ❌ 잘못된 예 -->
<section>
  <div class="container">
    <!-- 닫는 태그 누락! -->
</section>

<!-- ✅ 올바른 예 -->
<section>
  <div class="container">
  </div>
</section>
```

## 📚 추가 리소스

- [Tailwind CSS 문서](https://tailwindcss.com)
- [MDN HTML 가이드](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [Git 공식 문서](https://git-scm.com/doc)

## 📞 문의 및 지원

문제가 발생하면:
1. README를 다시 읽어보기
2. `.gitignore` 및 `build.js` 확인
3. 터미널의 에러 메시지 읽어보기
4. 팀과 함께 논의하기

---

**Last Updated:** 2025-01-20
**Version:** 1.0.0
**License:** MIT
