const participantsInput = document.getElementById("participantsInput");
const totalCount = document.getElementById("totalCount");
const remainingCount = document.getElementById("remainingCount");
const remainingList = document.getElementById("remainingList");
const prizeInput = document.getElementById("prizeInput");
const winnerCountInput = document.getElementById("winnerCount");
const drawBtn = document.getElementById("drawBtn");
const resetBtn = document.getElementById("resetBtn");
const loadDemo = document.getElementById("loadDemo");
const saveList = document.getElementById("saveList");
const removeToggle = document.getElementById("removeToggle");
const soundToggle = document.getElementById("soundToggle");
const stageName = document.getElementById("stageName");
const stageScreen = document.getElementById("stageScreen");
const stagePrize = document.getElementById("stagePrize");
const stageStatus = document.getElementById("stageStatus");
const winnerList = document.getElementById("winnerList");

const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");

let participants = [];
let remaining = [];
let winners = [];
let rollingTimer = null;
let audioCtx = null;
let pulseInterval = null;

const STORAGE_KEY = "raffle-data-v1";

const demoList = [
  "林小北",
  "赵青",
  "王哲",
  "李嘉",
  "何雨晴",
  "周齐",
  "宋知远",
  "顾一诺",
  "叶驰",
  "许澜",
  "孙拾光",
  "韩子墨",
  "沈星河",
  "程若岚",
  "季言",
  "唐晓冉",
];

const confettiColors = ["#5af2ff", "#ff7bd5", "#f9d65c", "#ffffff"];
const confettiPieces = [];

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function parseParticipants(raw) {
  const list = raw
    .split(/[\n,，;；]+/)
    .map((name) => name.trim())
    .filter(Boolean);
  return Array.from(new Set(list));
}

function saveState() {
  const payload = {
    participants,
    remaining,
    winners,
    prize: prizeInput.value.trim(),
    remove: removeToggle.checked,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    participants = data.participants || [];
    remaining = data.remaining || [];
    winners = data.winners || [];
    prizeInput.value = data.prize || "";
    removeToggle.checked = data.remove !== false;
    participantsInput.value = participants.join("\n");
  } catch (error) {
    console.warn("Failed to load state", error);
  }
}

function updateCounts() {
  totalCount.textContent = participants.length;
  remainingCount.textContent = remaining.length;
}

function renderRemaining() {
  remainingList.innerHTML = "";
  if (!remaining.length) {
    remainingList.innerHTML = "<span class='muted'>无剩余名单</span>";
    return;
  }
  remaining.forEach((name) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = name;
    remainingList.appendChild(chip);
  });
}

function renderWinners() {
  winnerList.innerHTML = "";
  if (!winners.length) {
    winnerList.innerHTML = "<span class='muted'>暂未开奖</span>";
    return;
  }
  winners
    .slice()
    .reverse()
    .forEach((item) => {
      const card = document.createElement("div");
      card.className = "winner-card";
      card.innerHTML = `
        <div class="winner-card__title">${item.prize || "未命名奖项"}</div>
        <div class="winner-card__names">${item.names.join(" · ")}</div>
        <div class="winner-card__time">${item.time}</div>
      `;
      winnerList.appendChild(card);
    });
}

function updateStageStatus(text) {
  stageStatus.textContent = text;
}

function setStagePrize() {
  const prize = prizeInput.value.trim() || "未命名奖项";
  stagePrize.textContent = `奖项：${prize}`;
}

function syncUI() {
  updateCounts();
  renderRemaining();
  renderWinners();
  setStagePrize();
  saveState();
}

function randomPick(list, count) {
  const pool = list.slice();
  const picked = [];
  const max = Math.min(count, pool.length);
  for (let i = 0; i < max; i += 1) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}

function startPulseSound() {
  if (!soundToggle.checked) return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const gain = audioCtx.createGain();
  gain.connect(audioCtx.destination);
  gain.gain.value = 0.02;

  pulseInterval = setInterval(() => {
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 220 + Math.random() * 180;
    osc.connect(gain);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  }, 120);
}

function stopPulseSound() {
  if (pulseInterval) {
    clearInterval(pulseInterval);
    pulseInterval = null;
  }
}

function rollingNames(duration = 2400) {
  if (rollingTimer) clearInterval(rollingTimer);
  stageScreen.classList.add("rolling");
  updateStageStatus("滚动中...");
  const start = Date.now();
  rollingTimer = setInterval(() => {
    const candidate = remaining[Math.floor(Math.random() * remaining.length)];
    stageName.textContent = candidate || "名单为空";
    if (Date.now() - start > duration) {
      clearInterval(rollingTimer);
      rollingTimer = null;
      stageScreen.classList.remove("rolling");
    }
  }, 60);
}

function celebrate() {
  for (let i = 0; i < 140; i += 1) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: -20,
      size: 6 + Math.random() * 8,
      speed: 2 + Math.random() * 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      tilt: Math.random() * 10 - 5,
      rotation: Math.random() * Math.PI,
    });
  }
}

function renderConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach((piece) => {
    confettiCtx.save();
    confettiCtx.translate(piece.x, piece.y);
    confettiCtx.rotate(piece.rotation);
    confettiCtx.fillStyle = piece.color;
    confettiCtx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.6);
    confettiCtx.restore();
    piece.y += piece.speed;
    piece.rotation += 0.02;
  });
  for (let i = confettiPieces.length - 1; i >= 0; i -= 1) {
    if (confettiPieces[i].y > confettiCanvas.height + 40) {
      confettiPieces.splice(i, 1);
    }
  }
  requestAnimationFrame(renderConfetti);
}

renderConfetti();

function handleSaveList() {
  participants = parseParticipants(participantsInput.value);
  remaining = participants.slice();
  syncUI();
}

function handleDraw() {
  if (!remaining.length) {
    stageName.textContent = "名单为空";
    updateStageStatus("请先保存名单");
    return;
  }

  const count = Math.max(1, Number(winnerCountInput.value) || 1);
  setStagePrize();
  startPulseSound();
  rollingNames(2600);

  setTimeout(() => {
    stopPulseSound();
    const picked = randomPick(remaining, count);
    if (!picked.length) return;

    stageName.textContent = picked.join(" · ");
    updateStageStatus("🎉 抽奖完成！");
    const time = new Date().toLocaleString();
    winners.push({
      prize: prizeInput.value.trim(),
      names: picked,
      time,
    });

    if (removeToggle.checked) {
      remaining = remaining.filter((name) => !picked.includes(name));
    }
    celebrate();
    syncUI();
  }, 2700);
}

function handleReset() {
  if (!confirm("确定要清空所有名单与中奖记录吗？")) return;
  participants = [];
  remaining = [];
  winners = [];
  participantsInput.value = "";
  stageName.textContent = "准备开始";
  updateStageStatus("等待抽奖");
  syncUI();
}

loadDemo.addEventListener("click", () => {
  participantsInput.value = demoList.join("\n");
});

saveList.addEventListener("click", handleSaveList);
drawBtn.addEventListener("click", handleDraw);
resetBtn.addEventListener("click", handleReset);
prizeInput.addEventListener("input", setStagePrize);

participantsInput.addEventListener("blur", () => {
  if (!participantsInput.value.trim()) return;
  participants = parseParticipants(participantsInput.value);
  remaining = remaining.length ? remaining : participants.slice();
  syncUI();
});

loadState();
syncUI();
