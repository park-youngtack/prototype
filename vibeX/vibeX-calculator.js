// ---------------------------
// Calculator logic
// ---------------------------

// 플랜별 추가 모듈(월) 요금: 상단 Hero 플랜 카드의 표기값을 기준으로 함
// - VibeCatch는 모든 플랜에 기본 포함(별도 선택 없음)
// - VibeAI/VibeFlow는 선택 추가
// - Enterprise는 협의(계산기에서는 선택 불가 처리)
const MODULE_ADDON_MONTHLY = {
  vibeAI: { basic: 800000, pro: 1200000, ent: null },
  vibeFlow: { basic: 500000, pro: 800000, ent: null }
};

// DOM elements
const planSelect = document.getElementById("planSelect");
const moduleAI = document.getElementById("moduleAI");
const moduleFlow = document.getElementById("moduleFlow");
const moduleAIPrice = document.getElementById("moduleAIPrice");
const moduleFlowPrice = document.getElementById("moduleFlowPrice");
const moduleEntNote = document.getElementById("moduleEntNote");
const kwAdd = document.getElementById("kwAdd");
const seatAdd = document.getElementById("seatAdd");
const dcAdd = document.getElementById("dcAdd");
const acAdd = document.getElementById("acAdd");
const acCard = document.getElementById("acCard");
const acHint = document.getElementById("acHint");
const bfAdd = document.getElementById("bfAdd");
const realtimeUp = document.getElementById("realtimeUp");
const estMonthly = document.getElementById("estMonthly");
const estAnnual = document.getElementById("estAnnual");
const resetBtn = document.getElementById("resetBtn");

function clampNonNegInt(v) {
  const n = parseInt(String(v).replace(/[^0-9-]/g, ""), 10);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, n);
}

function getModuleAddonMonthly(moduleKey, planKey) {
  const table = MODULE_ADDON_MONTHLY[moduleKey];
  if (!table) return 0;
  const v = table[planKey];
  return v ?? 0;
}

function formatModuleAddon(addon) {
  if (addon === null) return "협의";
  return `+ ${formatWon(addon ?? 0)}`;
}

function syncModuleUI(plan) {
  const isEnt = plan === "ent";

  // Enterprise는 추가 모듈이 협의라서 계산기에서는 선택을 막음(오해 방지)
  if (moduleAI) {
    if (isEnt && moduleAI.checked) moduleAI.checked = false;
    moduleAI.disabled = isEnt;
  }
  if (moduleFlow) {
    if (isEnt && moduleFlow.checked) moduleFlow.checked = false;
    moduleFlow.disabled = isEnt;
  }

  if (moduleEntNote) {
    moduleEntNote.classList.toggle("hidden", !isEnt);
  }

  if (moduleAIPrice) {
    const addon = MODULE_ADDON_MONTHLY.vibeAI?.[plan];
    moduleAIPrice.textContent = formatModuleAddon(addon);
  }
  if (moduleFlowPrice) {
    const addon = MODULE_ADDON_MONTHLY.vibeFlow?.[plan];
    moduleFlowPrice.textContent = formatModuleAddon(addon);
  }
}

function isVibeAISelected() {
  return Boolean(moduleAI && moduleAI.checked && !moduleAI.disabled);
}

function syncAcAvailability() {
  const enabled = isVibeAISelected();

  if (acAdd) {
    if (!enabled && clampNonNegInt(acAdd.value) !== 0) acAdd.value = "0";
    acAdd.disabled = !enabled;
  }

  if (acCard) {
    acCard.classList.toggle("opacity-60", !enabled);
  }
  if (acHint) {
    acHint.classList.toggle("text-slate-500", true);
  }
}

function recompute() {
  const plan = planSelect.value;
  syncModuleUI(plan);
  syncAcAvailability();
  let base = PLAN_MONTHLY[plan] ?? 0;

  // If annual toggle active, show monthly-equivalent on cards, but calculator is "월" 기준으로 유지 (decision makers usually compare monthly),
  // and annual is computed with discount.
  // (You can flip this easily later if you want.)
  const k = clampNonNegInt(kwAdd.value);
  const s = clampNonNegInt(seatAdd.value);
  const dc = clampNonNegInt(dcAdd.value);
  const ac = isVibeAISelected() ? clampNonNegInt(acAdd.value) : 0;
  const bf = clampNonNegInt(bfAdd.value);

  let options = 0;
  // 추가 모듈(선택)
  if (moduleAI && moduleAI.checked && !moduleAI.disabled) {
    options += getModuleAddonMonthly("vibeAI", plan);
  }
  if (moduleFlow && moduleFlow.checked && !moduleFlow.disabled) {
    options += getModuleAddonMonthly("vibeFlow", plan);
  }

  options += k * OPTION_PRICES.kw10;
  options += s * OPTION_PRICES.seat1;
  options += dc * OPTION_PRICES.dc50k;
  options += ac * OPTION_PRICES.ac10k;
  options += bf * OPTION_PRICES.bf1000;

  // Realtime upgrade logic (simple)
  const rt = realtimeUp.value;
  if (rt === "15to5") options += OPTION_PRICES.rt_15to5;
  if (rt === "5to1") options += OPTION_PRICES.rt_5to1;

  const monthly = base + options;
  const annual = monthly * 12 * (1 - DISCOUNT_ANNUAL);

  estMonthly.textContent = formatWon(monthly);
  estAnnual.textContent = formatWon(annual);
}

// Step buttons
document.querySelectorAll(".stepBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const step = parseInt(btn.getAttribute("data-step"), 10) || 0;
    const input = document.getElementById(targetId);
    if (!input) return;
    if (input.disabled) return;
    const cur = clampNonNegInt(input.value);
    input.value = String(Math.max(0, cur + step));
    recompute();
  });
});

// Inputs
[planSelect, moduleAI, moduleFlow, kwAdd, seatAdd, dcAdd, acAdd, bfAdd, realtimeUp].filter(Boolean).forEach(el => {
  el.addEventListener("input", recompute);
  el.addEventListener("change", recompute);
});

resetBtn.addEventListener("click", () => {
  planSelect.value = "pro";
  if (moduleAI) moduleAI.checked = false;
  if (moduleFlow) moduleFlow.checked = false;
  kwAdd.value = "0";
  seatAdd.value = "0";
  dcAdd.value = "0";
  acAdd.value = "0";
  bfAdd.value = "0";
  realtimeUp.value = "none";
  recompute();
});

// init
recompute();
