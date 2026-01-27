#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 빌드할 페이지 목록 (루트 디렉토리의 폴더 자동 탐지)
function getPageList() {
  const rootDir = __dirname;
  return fs.readdirSync(rootDir)
    .filter(file => {
      const filePath = path.join(rootDir, file);
      return fs.statSync(filePath).isDirectory() &&
        !file.startsWith('.') &&
        fs.existsSync(path.join(filePath, 'parts'));
    });
}

// 특정 페이지를 빌드하는 함수
function buildPage(pageName) {
  const pageDir = path.join(__dirname, pageName);
  const partsDir = path.join(pageDir, 'parts');
  const outputFile = path.join(pageDir, 'index.html');

  // parts/ 디렉토리 확인
  if (!fs.existsSync(partsDir)) {
    console.error(`❌ ${pageName}/parts/ 디렉토리를 찾을 수 없습니다.`);
    return null;
  }

  // HTML 조각 파일 읽기 (순서대로 정렬)
  const files = fs.readdirSync(partsDir)
    .filter(file => file.endsWith('.html'))
    .sort();

  if (files.length === 0) {
    console.error(`❌ ${pageName}/parts/ 디렉토리에 HTML 파일이 없습니다.`);
    return null;
  }

  // HTML 조합
  let htmlContent = '<!doctype html>\n<html lang="ko">\n';

  files.forEach(file => {
    const filePath = path.join(partsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    htmlContent += content;
  });

  htmlContent += '</html>\n';

  // index.html 파일로 저장
  fs.writeFileSync(outputFile, htmlContent, 'utf8');

  // 통계 출력
  const stats = fs.statSync(outputFile);
  const sizeKB = (stats.size / 1024).toFixed(1);

  console.log(`✓ ${pageName} 빌드 완료! (${sizeKB} KB)`);

  // 루트 인덱스용 프로젝트 정보 반환
  let description = '';
  const readmePath = path.join(pageDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    // 첫 번째 단락(설명) 추출 시도
    const lines = readmeContent.split('\n').filter(l => l.trim().length > 0);
    if (lines.length > 1) {
      description = lines[1].replace(/#/g, '').trim(); // 첫 번째 줄이 제목이면 두 번째 줄 사용
    } else if (lines.length > 0) {
      description = lines[0].replace(/#/g, '').trim();
    }
  }

  return { name: pageName, path: pageName, desc: description || `${pageName} 프로젝트 페이지입니다.` };
}

// 루트 index.html을 생성하는 함수
function buildRootIndex(projects) {
  const outputFile = path.join(__dirname, 'index.html');
  const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VibeX Intelligence Hub</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/pretendard.css" />
    <style>
        body { 
            font-family: Pretendard, sans-serif;
            background: radial-gradient(circle at top right, #1e293b, #0f172a);
            min-height: 100vh;
        }
        .glass {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
    </style>
</head>
<body class="text-slate-200 py-20 px-4">
    <div class="max-w-5xl mx-auto">
        <header class="text-center mb-16">
            <h1 class="text-5xl font-black text-white mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                VibeX Intelligence
            </h1>
            <p class="text-slate-400 text-lg uppercase tracking-[0.2em] font-medium">Project Ecosystem Hub</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${projects.map(p => `
            <a href="./${p.path}/" class="group block glass rounded-[2rem] p-8 hover:bg-white/[0.07] hover:border-blue-500/30 transition-all duration-500">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">${p.name}</h2>
                    <div class="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </div>
                <p class="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    ${p.desc}
                </p>
            </a>
            `).join('')}
        </div>

        <footer class="mt-20 pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
            <p>&copy; 2025 VibeX Intelligence Hub. Built with automated systems.</p>
        </footer>
    </div>
</body>
</html>`;

  fs.writeFileSync(outputFile, htmlContent, 'utf8');
  console.log(`✓ 루트 index.html 업데이트 완료!`);
}

// 메인 로직
const targetPage = process.argv[2];

if (targetPage) {
  console.log(`\n🔨 ${targetPage} 빌드 시작...\n`);
  const project = buildPage(targetPage);
  if (project) {
    // 특정 페이지 빌드 시에도 전체 목록을 다시 빌드하여 루트 인덱스 갱신
    const pages = getPageList();
    const projects = pages.map(p => {
      // 이미 빌드한 페이지면 성능을 위해 캐시하거나 다시 읽기만 함
      const readmePath = path.join(__dirname, p, 'README.md');
      let description = '';
      if (fs.existsSync(readmePath)) {
        const readmeContent = fs.readFileSync(readmePath, 'utf8');
        const lines = readmeContent.split('\n').filter(l => l.trim().length > 0);
        if (lines.length > 1) description = lines[1].replace(/#/g, '').trim();
        else if (lines.length > 0) description = lines[0].replace(/#/g, '').trim();
      }
      return { name: p, path: p, desc: description || `${p} 프로젝트 페이지입니다.` };
    });
    buildRootIndex(projects);
  }
} else {
  const pages = getPageList();
  if (pages.length === 0) {
    console.error('❌ 빌드할 페이지가 없습니다.');
    process.exit(1);
  }

  console.log(`\n🔨 전체 빌드 시작... (${pages.length}개 페이지)\n`);
  const projects = [];
  pages.forEach(page => {
    const project = buildPage(page);
    if (project) projects.push(project);
    console.log('');
  });

  buildRootIndex(projects);
  console.log('✅ 전체 빌드 및 루트 인덱스 업데이트 완료!');
}
