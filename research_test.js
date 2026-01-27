import { OpenRouter } from "@openrouter/sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

async function researchCompany(companyName) {
  const resultsDir = "research_results";
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }

  const mdFilePath = path.join(resultsDir, `${companyName}.md`);

  // 이미 리서치 결과가 있는 경우 건너뛰기 (비용 보호)
  if (fs.existsSync(mdFilePath)) {
    console.log(`\n[${companyName}] 이미 리서치 결과가 존재합니다. (${mdFilePath})`);
    return fs.readFileSync(mdFilePath, 'utf8');
  }

  console.log(`\n[${companyName}] 리서치를 시작합니다 (Deep Research 모델 사용)...`);

  const prompt = `
당신은 기업 분석 및 전략 전문가입니다. 다음 회사에 대해 'Deep Research'를 수행하고 그 결과를 상세하게 보고하세요.

대상 회사: ${companyName}

조사 및 보고 항목:
1. 회사 개요 및 핵심 정체성
2. 데이터 수집 및 처리 기술 (핵심 인프라, 독자적인 데이터 확보 경로, 데이터 정제 기술 등)
3. AI 기술 활용 및 운영 (사용 중인 AI 모델, 특허 기술, AI 서비스 상용화 사례 등)
4. 최근 비즈니스 현황 (최근 1-2년 내 투자 유치 현황, 주요 파트너십, 시장 점유율 등)
5. 인수 시 이식 및 시너지 시나리오 (이 회사를 인크로스 또는 스텔라이즈가 인수했을 때 기대할 수 있는 전략적 시너지 3가지 이상)

출력 형식:
- 인간이 읽기 편한 Markdown 형식으로 작성하세요.
- 각 섹션은 명확한 헤더(##)를 사용하세요.
- 전문적이고 구체적인 수치나 기술 명칭이 있다면 포함하세요.
`;

  try {
    const stream = await openrouter.chat.send({
      model: process.env.MODEL_ID || "openai/o4-mini-deep-research",
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }]
        }
      ],
      stream: true
    });

    let fullContent = "";
    process.stdout.write("리서치 진행 중 (Deep Research 중이므로 시간이 다소 소요될 수 있습니다): ");

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullContent += content;
        process.stdout.write(".");
      }
    }

    console.log("\n\n리서치 완료!");

    // Markdown 파일 저장
    fs.writeFileSync(mdFilePath, fullContent);
    console.log(`\n📄 [Markdown 문서 생성 완료]: ${mdFilePath}`);

    return fullContent;
  } catch (error) {
    console.error("오류 발생:", error);
  }
}

// 메인 실행부
const companyArg = process.argv[2];
if (companyArg) {
  researchCompany(companyArg);
} else {
  // 기본 테스트 대상: 로플랫
  researchCompany("로플랫");
}
