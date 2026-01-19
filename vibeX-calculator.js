// ---------------------------
// Calculator logic
// ---------------------------

// DOM elements
const planSelect = document.getElementById("planSelect");
const kwAdd = document.getElementById("kwAdd");
const seatAdd = document.getElementById("seatAdd");
const dcAdd = document.getElementById("dcAdd");
const acAdd = document.getElementById("acAdd");
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

function recompute() {
  const plan = planSelect.value;
  let base = PLAN_MONTHLY[plan] ?? 0;

  // If annual toggle active, show monthly-equivalent on cards, but calculator is "월" 기준으로 유지 (decision makers usually compare monthly),
  // and annual is computed with discount.
  // (You can flip this easily later if you want.)
  const k = clampNonNegInt(kwAdd.value);
  const s = clampNonNegInt(seatAdd.value);
  const dc = clampNonNegInt(dcAdd.value);
  const ac = clampNonNegInt(acAdd.value);
  const bf = clampNonNegInt(bfAdd.value);

  let options = 0;
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
    const cur = clampNonNegInt(input.value);
    input.value = String(Math.max(0, cur + step));
    recompute();
  });
});

// Inputs
[planSelect, kwAdd, seatAdd, dcAdd, acAdd, bfAdd, realtimeUp].forEach(el => {
  el.addEventListener("input", recompute);
  el.addEventListener("change", recompute);
});

resetBtn.addEventListener("click", () => {
  planSelect.value = "pro";
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
