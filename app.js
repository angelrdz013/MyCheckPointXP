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

// --- Modales ---
const modalCheckin = document.getElementById("modalCheckin");
const modalCountdown = document.getElementById("modalCountdown");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const countdownEl = document.getElementById("countdown");

function openCheckin(title, html) {
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modalCheckin.style.display = "flex";
}
function closeCheckin() {
  modalCheckin.style.display = "none";
}
document.getElementById("closeCheckin").addEventListener("click", () => {
  closeCheckin();
  startCountdown();
});

function openCountdown() {
  modalCountdown.style.display = "flex";
}
function closeCountdown() {
  modalCountdown.style.display = "none";
}

// --- Check-in inicial ---
function dailyCheckin() {
  const phrase = random(dailyPhrases);
  const form = `
    <p>✨ Mensaje del día: ${phrase}</p>
    <label>📌 Tu intención:<br><input id="intencion"></label><br>
    <label>🎯 Tu reto:<br><input id="reto"></label><br>
    <button onclick="saveDaily()">✅ Guardar</button>
  `;
  openCheckin("🌅 Check-in inicial", form);
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
    <p style="color:#0ff; margin-top:10px;">💪 Bueno, pues hazlo tú!</p>
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

    <p>🤔 ¿Por qué te sientes así?</p>
    <textarea id="razon" oninput="reflectAmigo()"></textarea><br>

    <p id="amigoReflejo" style="color:#0ff; font-style:italic;"></p>

    <p>🧠 ¿Qué consejo le darías a tu amigo?</p>
    <textarea id="consejo"></textarea><br>

    <button onclick="saveEmo()">✅ Guardar</button>
  `;
  openCheckin("⏰ Check-in emocional", form);
  localStorage.setItem("emoPhrase", phrase);
}

window.reflectAmigo = function() {
  const razon = document.getElementById("razon").value;
  const amigoReflejo = document.getElementById("amigoReflejo");
  if (razon.trim() !== "") {
    amigoReflejo.textContent = `🤝 Un amigo dice: "${razon}"`;
  } else {
    amigoReflejo.textContent = "";
  }
};

window.saveEmo = function() {
  const emocion = document.getElementById("emocion").value;
  const razon = document.getElementById("razon").value;
  const consejo = document.getElementById("consejo").value;
  const phrase = localStorage.getItem("emoPhrase");

  modalBody.innerHTML = `
    <p>Estado: ${emocion}</p>
    <p>Amigo: "Me siento ${razon}"</p>
    <p>Consejo: ${consejo}</p>
    <p>🎲 Frase: ${phrase}</p>
    <p>🚀 +2 XP desbloqueados</p>
    <p style="color:#0ff; margin-top:10px;">💪 Bueno, pues hazlo tú!</p>
  `;

  document.getElementById("status").textContent = "✅ Check-in emocional completado.";
};

// --- Countdown ---
function startCountdown() {
  openCountdown();
  let count = 5;
  countdownEl.textContent = count;
  const interval = setInterval(() => {
    count--;
    countdownEl.textContent = count > 0 ? count : "🚀 ¡Vamos!";
    if (count < 0) {
      clearInterval(interval);
      closeCountdown();
    }
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

// --- Auto check-in inicial ---
window.onload = () => {
  const log = localStorage.getItem("dailyCheckin");
  if (!log || JSON.parse(log).date !== new Date().toDateString()) {
    dailyCheckin();
  } else {
    document.getElementById("status").textContent = "✅ Check-in inicial ya registrado.";
    setInterval(emotionalCheckin, 2 * 60 * 60 * 1000);
  }
};
