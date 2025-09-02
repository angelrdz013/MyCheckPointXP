// --- Estado ---
let snoozeCount = 0;
const maxSnoozes = 2;

// --- Frases ---
const dailyPhrases = [
  "🎯 Hoy también cuenta.",
  "💪 Tu disciplina le está ganando al caos.",
  "🧘‍♀️ Tu mente es tu casa. Límpiala con intención.",
  "🕹️ Cada día es un nuevo nivel. ¡Presiona Start!",
  "🚀 No tienes que hacerlo perfecto. Solo avanzar.",
];
const emotionalPhrases = [
  "Recuerda que tu mente también merece un respiro.",
  "Tu energía marca el ritmo de tu día.",
  "Cada pausa intencional es una victoria silenciosa.",
  "Hazlo por ti. Hazlo ahora.",
  "Hoy es un buen día para ganar XP emocional.",
];
function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// --- Modal ---
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const countdownEl = document.getElementById("countdown");
const closeModalBtn = document.getElementById("closeModal");

function openModal(title, html) {
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  countdownEl.textContent = "";
  modal.style.display = "flex";
}
function closeModal() { modal.style.display = "none"; }
closeModalBtn.addEventListener("click", closeModal);

// --- Check-in inicial ---
function dailyCheckin() {
  const phrase = random(dailyPhrases);
  const form = `
    <p>✨ Mensaje del día: ${phrase}</p>
    <label>📌 Tu intención: <br><input id="intencion"></label><br>
    <label>🎯 Tu reto: <br><input id="reto"></label><br>
    <button onclick="saveDaily()">✅ Guardar</button>
  `;
  openModal("🌅 Check-in inicial", form);
  localStorage.setItem("dailyPhrase", phrase);
}

window.saveDaily = function() {
  const intention = document.getElementById("intencion").value;
  const challenge = document.getElementById("reto").value;
  const phrase = localStorage.getItem("dailyPhrase");
  localStorage.setItem("dailyCheckin", JSON.stringify({intention, challenge, phrase, date: new Date().toDateString()}));
  modalBody.innerHTML = `
    <p>✅ Intención: ${intention}</p>
    <p>🎯 Reto: ${challenge}</p>
    <p>✨ ${phrase}</p>
  `;
  document.getElementById("status").textContent = "✅ Check-in inicial registrado.";
};

// --- Check-in emocional ---
function emotionalCheckin() {
  const phrase = random(emotionalPhrases);
  const form = `
    <p>🧠 ¿Cómo te sientes ahora?</p>
    <select id="emocion">
      <option value="😌 Bien, con energía">😌 Bien, con energía</option>
      <option value="😐 Cansado">😐 Cansado</option>
      <option value="😫 Estresado">😫 Estresado</option>
      <option value="😔 Falta de motivación">😔 Falta de motivación</option>
      <option value="😢 Triste">😢 Triste</option>
      <option value="😵 Ansiedad / Tensión física">😵 Ansiedad / Tensión física</option>
    </select><br>
    <p>🤝 Un Amigo te pregunta: ¿Por qué te sientes así?</p>
    <textarea id="razon"></textarea><br>
    <p>🧠 Dale un consejo a tu 'yo amigo':</p>
    <textarea id="consejo"></textarea><br>
    <button onclick="saveEmo()">✅ Guardar</button>
  `;
  openModal("⏰ Check-in emocional", form);
  localStorage.setItem("emoPhrase", phrase);
}

window.saveEmo = function() {
  const emocion = document.getElementById("emocion").value;
  const razon = document.getElementById("razon").value;
  const consejo = document.getElementById("consejo").value;
  const phrase = localStorage.getItem("emoPhrase");

  modalBody.innerHTML = `
    <p>Estado: ${emocion}</p>
    <p>Motivo: ${razon}</p>
    <p>Consejo (Amigo): ${consejo}</p>
    <p>🎲 Frase: ${phrase}</p>
    <p>🚀 +2 XP desbloqueados</p>
  `;

  startCountdown();
  document.getElementById("status").textContent = "✅ Check-in emocional completado.";
};

// --- Cuenta regresiva estilo arcade ---
function startCountdown() {
  let count = 5;
  countdownEl.textContent = count;
  const interval = setInterval(() => {
    count--;
    countdownEl.textContent = count > 0 ? count : "🚀 ¡Vamos!";
    if (count <= 0) clearInterval(interval);
  }, 1000);
}

// --- Snooze ---
document.getElementById("snoozeBtn").addEventListener("click", () => {
  if (snoozeCount < maxSnoozes) {
    snoozeCount++;
    document.getElementById("status").textContent =
      `⏰ Check-in pospuesto 30 min. (Snooze ${snoozeCount}/${maxSnoozes})`;
    setTimeout(emotionalCheckin, 30 * 60 * 1000);
  } else {
    emotionalCheckin();
  }
});

// --- Botones principales ---
document.getElementById("checkinBtn").addEventListener("click", () => {
  const log = localStorage.getItem("dailyCheckin");
  if (!log || JSON.parse(log).date !== new Date().toDateString()) {
    dailyCheckin();
  } else {
    emotionalCheckin();
  }
});

// --- Auto check-in inicial al cargar ---
window.onload = () => {
  const log = localStorage.getItem("dailyCheckin");
  if (!log || JSON.parse(log).date !== new Date().toDateString()) {
    dailyCheckin();
  } else {
    document.getElementById("status").textContent = "✅ Check-in inicial ya registrado.";
    setInterval(emotionalCheckin, 2 * 60 * 60 * 1000);
  }
};
