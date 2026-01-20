// ---------------------------
// Pricing + UI logic (Main)
// ---------------------------

// Constants
const DISCOUNT_ANNUAL = 0.15; // example

const PLAN_MONTHLY = {
  basic: 1500000,
  pro: 4900000,
  ent: 12000000 // base anchor; enterprise is "~"
};

const OPTION_PRICES = {
  kw10: 200000,     // per +10 keywords
  seat1: 50000,     // per seat
  dc50k: 600000,    // per +50k DC
  ac10k: 400000,    // per +10k AC (VibeAI 필수)
  bf1000: 150000,   // per +1,000 keyword-days
  rt_15to5: 800000,
  rt_5to1: 2000000
};

// Details content (decision-maker friendly)
const DETAILS = {
  keywords: {
    title: "키워드(+10)",
    body: `
      <p><b>키워드</b>는 모니터링할 브랜드/제품/인물/이슈 단어입니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>키워드가 늘어나면, 그만큼 수집/분석 대상이 넓어집니다.</li>
        <li>실무에서는 "사업부/브랜드 수"가 늘어날 때 키워드를 주로 증량합니다.</li>
      </ul>
      <div class="mt-3 rounded-xl bg-white p-3 text-xs text-slate-700">
        예) 'SK hynix', 'HBM', '메모리', '경쟁사명'처럼 키워드가 늘수록 커버리지가 넓어집니다.
      </div>
    `
  },
  seats: {
    title: "좌석(+1)",
    body: `
      <p><b>좌석</b>은 서비스를 쓰는 사용자 수(팀 확장)입니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>보고용(보기 전용) 인원이 많으면 좌석을 늘리는 경우가 많습니다.</li>
        <li>필요 시 "보기 전용(저렴)"과 "편집 가능(표준)"을 분리할 수 있습니다.</li>
      </ul>
    `
  },
  dc: {
    title: "DC(수집 크레딧)",
    body: `
      <p><b>DC</b>는 "데이터 수집에 드는 클라우드 리소스(월 처리량)"입니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>크롤링, 정제, 중복 제거, 인덱싱 등 수집 파이프라인 비용이 포함됩니다.</li>
        <li>키워드가 많거나 채널 범위가 넓을수록 DC가 더 필요합니다.</li>
      </ul>
      <div class="mt-3 rounded-xl bg-white p-3 text-xs text-slate-700">
        의사결정 포인트: "우리 조직이 월간 얼마나 많은 콘텐츠를 모아야 하는가?"
      </div>
    `
  },
  ac: {
    title: "AC(AI 크레딧)",
    body: `
      <p><b>AC</b>는 "AI 기능 사용량(월)"입니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>AI 요약, AI 인사이트, 대응 가이드, 영상 타임라인 등 생성형 기능에서 차감됩니다.</li>
        <li>요약보다 '타임라인/심층 인사이트'가 더 많은 비용이 들 수 있어 AC로 분리합니다.</li>
      </ul>
      <div class="mt-3 rounded-xl bg-white p-3 text-xs text-slate-700">
        의사결정 포인트: "AI를 '가끔' 쓰나, '매일' 리포트처럼 쓰나?"
      </div>
    `
  },
  backfill: {
    title: "Backfill(과거 데이터 소급 수집)",
    body: `
      <p><b>Backfill</b>은 키워드를 등록한 시점에 "과거 데이터"를 추가로 채워주는 기능입니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>기본은 <b>키워드 등록 이후</b>부터 수집합니다. (불필요한 데이터까지 미리 쌓지 않음)</li>
        <li>다만 "지난달부터 무슨 일이 있었는지" 같은 요구가 있으면 Backfill로 소급합니다.</li>
      </ul>
      <div class="mt-3 rounded-xl bg-white p-3 text-xs text-slate-700">
        <b>키워드-일</b> 개념: 10키워드 × 30일 = 300 키워드-일<br/>
        즉, 키워드가 많고 소급 기간이 길수록 비용이 늘어나는 '버스트 작업'입니다.
      </div>
    `
  },
  realtime: {
    title: "수집 주기(실시간성)",
    body: `
      <p><b>수집 주기</b>는 '얼마나 자주 업데이트되는지'입니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>위기 대응/이슈 모니터링은 1~5분 단위가 유리합니다.</li>
        <li>일반 리서치/월간 보고는 15분 이상으로도 충분한 경우가 많습니다.</li>
      </ul>
    `
  },
  collectionMode: {
    title: "수집 방식(키워드 등록 이후 수집)",
    body: `
      <p>이 서비스는 <b>모든 데이터를 미리 전부 저장하는 방식</b>이 아니라,</p>
      <p class="mt-1"><b>키워드 등록 시점부터 필요한 데이터만 수집</b>합니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>장점: 불필요한 수집 비용을 줄이고, 필요한 것에 리소스를 집중합니다.</li>
        <li>과거 데이터가 필요할 때만 Backfill로 선택적으로 채웁니다.</li>
      </ul>
    `
  },
  channels: {
    title: "채널 커버리지",
    body: `
      <p><b>채널 커버리지</b>는 어떤 소스까지 수집/분석하는지입니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>국내 핵심: 유튜브/뉴스/커뮤니티 중심</li>
        <li>국내 풀: SNS 포함</li>
        <li>글로벌: 해외 소스 포함(협의/범위 확정 필요)</li>
      </ul>
    `
  },
  trendSentiment: {
    title: "언급량/감성/이슈 탐지",
    body: `
      <p>실무자가 '지금 무슨 일이 벌어졌는지'를 빠르게 파악하는 기본 세트입니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>언급량 추이: 언제/얼마나 늘었는지</li>
        <li>감성: 긍정/부정/중립 비율</li>
        <li>이슈 탐지: 급증/변곡점을 자동으로 표시</li>
      </ul>
    `
  },
  compare: {
    title: "경쟁사/키워드 비교",
    body: `
      <p>"우리만 보면 안 되고, 비교가 있어야 의미가 있다"를 해결합니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>브랜드 간 언급량/감성/채널 분포 비교</li>
        <li>경쟁 이슈 발생 시 상대 변화까지 함께 확인</li>
      </ul>
    `
  },
  trustScore: {
    title: "데이터 신뢰도(커버리지/품질)",
    body: `
      <p>의사결정권자가 가장 많이 묻는 질문: "이 데이터 믿어도 돼?"</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>중복/스팸 제거 수준, 출처 추적, 커버리지 지표 등으로 신뢰도를 보조합니다.</li>
        <li>고급 수준은 근거(링크/출처)와 품질 리포트를 강화합니다.</li>
      </ul>
    `
  },
  aiSummary: {
    title: "AI 요약",
    body: `
      <p>길고 많은 콘텐츠를 "한 번에 읽히게" 만드는 기능입니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>뉴스/커뮤니티/댓글 등을 요약해 핵심을 빠르게 파악</li>
        <li>사용량이 늘수록 AI 비용이 커져 AC로 과금 분리</li>
      </ul>
    `
  },
  aiInsight: {
    title: "AI 인사이트/대응 가이드",
    body: `
      <p>단순 요약이 아니라 "왜 발생했는지 / 무엇을 해야 하는지"까지 제안합니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>이슈 원인/핵심 논점/리스크 포인트 정리</li>
        <li>커뮤니케이션/대응 문구 템플릿 제공</li>
      </ul>
    `
  },
  timeline: {
    title: "영상 하이라이트(타임라인)",
    body: `
      <p>유튜브 영상 전체를 다 보지 않아도, <b>키워드가 언급된 구간</b>만 빠르게 찾습니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>시간 절감 효과가 크지만 분석 비용도 커서 AC에서 차감</li>
      </ul>
    `
  },
  retention: {
    title: "보관기간(Retention)",
    body: `
      <p>수집한 데이터를 "얼마나 오래" 보관하는지입니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>보고/감사/추적이 필요하면 보관기간이 중요합니다.</li>
        <li>보관이 길수록 저장비/운영비가 늘어 플랜에서 차등됩니다.</li>
      </ul>
    `
  },
  download: {
    title: "다운로드/리포트",
    body: `
      <p>실무에서는 "대시보드도 좋지만, 보고자료로 뽑아야" 결재가 끝납니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>CSV/XLSX는 분석팀, PPT는 보고용에 유리합니다.</li>
        <li>맞춤 리포트는 Enterprise에서 협의합니다.</li>
      </ul>
    `
  },
  api: {
    title: "API/웹훅/SSO",
    body: `
      <p>조직이 커질수록 "연동/보안"이 도입의 핵심 조건이 됩니다.</p>
      <ul class="mt-2 list-disc pl-5 space-y-1">
        <li>API/웹훅: 다른 시스템(Jira/Slack/BI 등)과 연결</li>
        <li>SSO/감사로그: 보안/접근통제/감사 대응</li>
      </ul>
    `
  }
};

// Utility function
function formatWon(n) {
  if (!Number.isFinite(n)) return "₩0";
  return "₩" + Math.round(n).toLocaleString("ko-KR");
}

// Billing toggle (for plan cards only)
let billingMode = "monthly"; // monthly | annual

const monthlyBtn = document.getElementById("billingMonthlyBtn");
const annualBtn = document.getElementById("billingAnnualBtn");

function setBilling(mode) {
  billingMode = mode;

  const isMonthly = mode === "monthly";
  monthlyBtn.className = isMonthly
    ? "rounded-lg px-3 py-1.5 text-sm font-semibold bg-white shadow-sm"
    : "rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900";
  annualBtn.className = !isMonthly
    ? "rounded-lg px-3 py-1.5 text-sm font-semibold bg-white shadow-sm"
    : "rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900";

  // Update card prices (annual displays estimated monthly-equivalent or annual? We'll show monthly, but toggle changes to annual-per-month equivalent with note)
  const planEls = document.querySelectorAll("[data-plan-price]");
  planEls.forEach(el => {
    const monthly = Number(el.getAttribute("data-monthly"));
    if (!Number.isFinite(monthly)) return;

    if (billingMode === "monthly") {
      el.textContent = formatWon(monthly);
      el.nextElementSibling && (el.nextElementSibling.textContent = "/ 월 (VAT 별도)");
    } else {
      const annualMonthlyEq = monthly * (1 - DISCOUNT_ANNUAL);
      el.textContent = formatWon(annualMonthlyEq);
      el.nextElementSibling && (el.nextElementSibling.textContent = "/ 월 (연간 결제 환산, VAT 별도)");
    }
  });

  // 계산기가 로드되었으면 재계산 (안전 체크)
  if (typeof recompute === 'function') {
    recompute();
  }
}

monthlyBtn.addEventListener("click", () => setBilling("monthly"));
annualBtn.addEventListener("click", () => setBilling("annual"));

// Toggle detail rows in comparison tables
function toggleDetail(key) {
  // Find the detail row for this key
  const detailRow = document.querySelector(`tr.detail-row[data-detail-for="${key}"]`);
  if (!detailRow) return;

  // Close all other detail rows
  document.querySelectorAll('tr.detail-row').forEach(row => {
    if (row !== detailRow) {
      row.classList.add('hidden');
    }
  });

  // Toggle this detail row
  detailRow.classList.toggle('hidden');
}

// Toggle all details in a category
function toggleAllDetails(categoryId) {
  const category = document.querySelector(`[data-category="${categoryId}"]`);
  if (!category) return;

  const detailRows = category.querySelectorAll('tr.detail-row');
  const allHidden = Array.from(detailRows).every(row => row.classList.contains('hidden'));

  detailRows.forEach(row => {
    if (allHidden) {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  });

  // Update button text
  const btn = category.querySelector('.toggleAllBtn');
  if (btn) {
    btn.textContent = allHidden ? '모두 닫기' : '모두 열기';
  }
}

document.querySelectorAll(".rowBtn").forEach(btn => {
  btn.addEventListener("click", () => toggleDetail(btn.getAttribute("data-detail")));
});
document.querySelectorAll(".infoBtn").forEach(btn => {
  btn.addEventListener("click", () => toggleDetail(btn.getAttribute("data-detail")));
});
document.querySelectorAll(".toggleAllBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const categoryId = btn.closest('[data-category]').getAttribute('data-category');
    toggleAllDetails(categoryId);
  });
});

// init
setBilling("monthly");
