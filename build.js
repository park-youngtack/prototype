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
    process.exit(1);
  }

  // HTML 조각 파일 읽기 (순서대로 정렬)
  const files = fs.readdirSync(partsDir)
    .filter(file => file.endsWith('.html'))
    .sort();

  if (files.length === 0) {
    console.error(`❌ ${pageName}/parts/ 디렉토리에 HTML 파일이 없습니다.`);
    process.exit(1);
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
  const lines = htmlContent.split('\n').length;
  const sizeKB = (stats.size / 1024).toFixed(1);

  console.log(`✓ ${pageName} 빌드 완료!`);
  console.log(`  파일: ${files.length}개 → index.html`);
  console.log(`  라인: ${lines}줄`);
  console.log(`  크기: ${sizeKB} KB`);
}

// 각 폴더의 index.html을 루트에 .html 파일로 복사하는 함수
function copyToRoot(pages) {
  pages.forEach(pageName => {
    const sourceFile = path.join(__dirname, pageName, 'index.html');
    const targetFile = path.join(__dirname, `${pageName}.html`);

    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, targetFile);
      console.log(`✓ ${pageName}.html 루트에 복사됨`);
    }
  });
}

// 메인 로직
const targetPage = process.argv[2];

if (targetPage) {
  // 특정 페이지만 빌드
  console.log(`\n🔨 ${targetPage} 빌드 시작...\n`);
  buildPage(targetPage);

  // 루트에 .html 파일로 복사
  const pages = getPageList();
  copyToRoot(pages);
  console.log('');
} else {
  // 모든 페이지 빌드
  const pages = getPageList();
  if (pages.length === 0) {
    console.error('❌ 빌드할 페이지가 없습니다. parts/ 폴더를 포함한 페이지 폴더를 생성해주세요.');
    process.exit(1);
  }

  console.log(`\n🔨 전체 빌드 시작... (${pages.length}개 페이지)\n`);
  pages.forEach(page => {
    buildPage(page);
    console.log('');
  });

  // 루트에 .html 파일로 복사
  copyToRoot(pages);
  console.log('');
  console.log('✅ 전체 빌드 완료!');
}
