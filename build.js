#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const partsDir = path.join(__dirname, 'parts');
const outputFile = path.join(__dirname, 'vibeX.html');

// parts/ 디렉토리의 모든 HTML 파일 읽기 (01-*, 02-*, ... 순서)
const files = fs.readdirSync(partsDir)
  .filter(file => file.endsWith('.html'))
  .sort();

if (files.length === 0) {
  console.error('❌ 오류: parts/ 디렉토리에 HTML 파일이 없습니다.');
  process.exit(1);
}

let htmlContent = '<!doctype html>\n<html lang="ko">\n';

files.forEach(file => {
  const filePath = path.join(partsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  htmlContent += content;
});

htmlContent += '</html>\n';

// vibeX.html에 쓰기
fs.writeFileSync(outputFile, htmlContent, 'utf8');

// 파일 정보 출력
const stats = fs.statSync(outputFile);
const lines = htmlContent.split('\n').length;
const sizeKB = (stats.size / 1024).toFixed(1);

console.log('✓ 빌드 완료!');
console.log(`  파일: ${files.length}개 파일 → vibeX.html`);
console.log(`  라인: ${lines}줄`);
console.log(`  크기: ${sizeKB} KB`);
console.log(`  경로: ${outputFile}`);
