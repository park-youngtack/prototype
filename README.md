# 멀티 페이지 GitHub Pages 플랫폼

다양한 독립적인 HTML 페이지(vibeX, pageA, pageB, pageC)를 한 저장소에서 관리하는 멀티 페이지 빌드 시스템입니다.

## 프로젝트 구조

```
소셜리스닝/
├── vibeX/                      # VibeX 프로젝트
│   ├── parts/                  # HTML 조각 파일들 (10개)
│   │   ├── 01-head.html       # <head> 섹션
│   │   ├── 02-header.html     # 네비게이션
│   │   ├── 03-hero.html       # 히어로 + 플랜 카드
│   │   ├── 04-calculator.html # 요금 계산기
│   │   ├── 05-compare-vibecatch.html
│   │   ├── 06-compare-vibeplus.html
│   │   ├── 07-compare-vibeflow.html
│   │   ├── 08-faq.html
│   │   ├── 09-footer.html
│   │   └── 10-scripts.html    # JS 링크
│   ├── vibeX-main.js          # vibeX 메인 UI 로직
│   ├── vibeX-calculator.js    # vibeX 요금 계산기
│   ├── index.html             # 빌드 결과 (자동 생성, .gitignore)
│   └── README.md              # vibeX 프로젝트 설명
│
├── pageA/                      # 미래 프로젝트 A (추가 예정)
│   ├── parts/
│   ├── pageA-script.js        # (필요 시)
│   ├── index.html             # 빌드 결과
│   └── README.md
│
├── pageB/                      # 미래 프로젝트 B
├── pageC/                      # 미래 프로젝트 C
│
├── .gitignore                  # Git 무시 파일
├── package.json                # npm 설정 및 빌드 스크립트
├── build.js                    # 멀티 페이지 빌드 시스템
└── README.md                   # 이 파일 (저장소 전체 설명)
```

## 핵심 특징

- 각 페이지는 완전히 독립적인 폴더 구조
- `build.js`가 각 페이지의 `parts/`를 합쳐 `index.html` 생성
- 전체 빌드 또는 개별 페이지 빌드 지원
- GitHub Pages에 바로 배포 가능

## 빠른 시작

### 사전 요구사항
- Node.js v14 이상
- npm 또는 yarn

### 초기 설정

```bash
# 프로젝트 디렉토리로 이동
cd "소셜리스닝"

# 의존성 설치
npm install
```

### 빌드 명령어

```bash
# 모든 페이지 빌드
npm run build

# vibeX만 빌드
npm run build:vibeX

# pageA만 빌드
npm run build:pageA

# 자동 빌드 (파일 변경 감시)
npm run watch

# vibeX만 감시 빌드
npm run watch:vibeX
```

## 파일 수정 가이드

### parts/ 파일 구조

각 파일은 독립적인 HTML 조각입니다. `<html>`, `<head>`, `<body>` 태그는 빌드 스크립트에서 자동 추가되므로, 콘텐츠만 포함하면 됩니다.

#### 예시: vibeX/parts/04-calculator.html 수정

```html
<!-- 이것은 vibeX/parts/04-calculator.html의 일부 -->
<section id="calculator" class="mx-auto max-w-7xl px-4 py-8">
  <h2 class="text-2xl font-bold mb-6">요금 계산기</h2>
  <!-- 계산기 콘텐츠 -->
  <div class="space-y-4">
    <!-- 수정 내용 -->
  </div>
</section>
```

### 수정 시 주의사항

- **parts/ 파일만 수정** (index.html은 자동 생성되므로 직접 수정 금지)
- 각 파일은 HTML 조각이므로 완전한 HTML 문서가 아님
- 파일명 앞 숫자 변경 금지 (빌드 순서 결정)
- 수정 후 반드시 빌드: `npm run build:vibeX`

## GitHub 업로드 및 관리

### .gitignore 핵심

```gitignore
# 자동 생성 파일
vibeX/index.html
pageA/index.html
pageB/index.html
pageC/index.html
*/index.html

# Node.js
node_modules/
npm-debug.log

# OS
.DS_Store
```

### 커밋 포함/제외

**커밋 포함:**
```
vibeX/
pageA/
build.js
package.json
.gitignore
README.md
```

**커밋 제외:**
```
*/index.html (자동 생성)
node_modules/ (npm install로 복구)
```

### 배포 전 빌드

```bash
# index.html 생성 (로컬 테스트용)
npm run build
```

## 트러블슈팅

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

### "parts/ 디렉토리를 찾을 수 없습니다" 오류

```bash
# 예: npm run build:pageA 실행 시 pageA/parts/ 없음
mkdir pageA/parts
```

### 변경사항이 반영 안 될 때

```bash
# 1. watch 모드 확인
npm run watch:vibeX

# 2. 강제 새로고침
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# 3. 캐시 삭제 후 새로고침
# 브라우저 개발자도구 > Application > Clear All
```

### HTML 구조 오류

```bash
# parts/ 파일 검사
# 특히 HTML 태그가 제대로 닫혀있는지 확인

# 예: <div> 태그 누락 ?
<section>
  <div class="container">
    <!-- 닫는 태그 누락! -->
</section>

# 올바른 예 ?
<section>
  <div class="container">
  </div>
</section>
```

## 빌드 시스템 상세

### build.js 동작

```javascript
1. 루트 디렉토리의 모든 폴더 스캔
2. "parts/" 디렉토리가 있는 폴더 탐지 (페이지 폴더)
3. 각 페이지 폴더의 parts/ 내 HTML 파일 수집
4. 파일명 순서대로 정렬 (01-*, 02-*, ...)
5. <!doctype html><html lang="ko"> 추가
6. 모든 parts 파일 내용 순차적으로 합침
7. </html> 추가
8. index.html로 저장
9. 빌드 통계 출력 (파일 개수, 라인 수, 크기)
```

### CLI 사용

```bash
# 모든 페이지 빌드
node build.js

# 특정 페이지만 빌드
node build.js vibeX
node build.js pageA
```

## 관련 문서

- [vibeX 프로젝트 설명](vibeX/README.md) - vibeX 페이지 상세 가이드
- [Tailwind CSS 문서](https://tailwindcss.com)
- [MDN HTML 가이드](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [Git 공식 문서](https://git-scm.com/doc)

## 문의 및 지원

문제가 발생하면:
1. 이 README를 다시 읽어보기
2. `build.js`와 `package.json` 확인
3. 터미널의 에러 메시지 읽어보기
4. `.gitignore` 설정 확인

---

**Last Updated:** 2025-01-20
**Version:** 2.0.0 (멀티 페이지)
**License:** MIT
