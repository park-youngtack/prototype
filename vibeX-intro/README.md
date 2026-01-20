# VibeX 소개 페이지 (공포 마케팅 버전)

첫 방문 30초 안에 “이거 없으면 어떻게 되는데?”를 느끼게 하는 VibeX 소개용 랜딩 페이지입니다.  
가격/플랜/상세 기능은 `../vibeX/` 페이지에서 확인하도록 링크로 연결합니다.

## 폴더 구조

```
vibeX-intro/
├── parts/        # HTML 조각 파일들
├── index.html    # 빌드 결과 (자동 생성, .gitignore)
└── README.md     # 이 파일
```

## 빌드

```bash
# 전체 빌드
npm run build

# 소개 페이지만 빌드
node build.js vibeX-intro
```

