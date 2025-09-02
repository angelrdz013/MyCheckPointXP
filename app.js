// --- Variables de estado ---
let snoozeCount = 0;
const maxSnoozes = 2;
let checkinDoneToday = false;

// --- Utilidades ---
function getToday() {
  return new Date().toISOString().split("T")[0];
}

// Guardar/leer en localStorage
function saveDailyCheckin(intention, challenge, phrase) {
  const today = getToday();
  const log = {
    date: today,
    time: new Date().toLocaleTimeString(),
    intention,
    challenge,
    phrase,
  };
  localStorage.setItem("dailyCheckin", JSON.stringify(log));
  checkinDoneToday = true;
}

function getDailyCheckin() {
  const data = localStorage.getItem("dailyCheckin");
  if (!data) return null;
  const log = JSON.parse(data);
  if (log.date === getToday()) return log;
  return null;
}

// --- Frases motivacionales ---
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

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// --- Modal ---
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalExtra = document.getElementById("modalExtra");
const closeModalBtn = document.getElementById("closeModal");

function openModal(title, message, extra = "") {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modalExtra.textContent = extra;
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

closeModalBtn.addEventListener("click", closeModal);

// --- Check-in inicial ---
function dailyCheckin() {
  const log = getDailyCheckin();
  if (log) {
    document.getElementById("status").textContent =
      "📝 Ya hiciste tu check-in inicial hoy. Intención: " + log.intention;
    return;
  }

  const intention = prompt("📌 ¿Cuál es tu intención para hoy?");
  const challenge = prompt("🎯 ¿Cuál será tu reto personal/profesional?");
  const phrase = random(dailyPhrases);

  saveDailyCheckin(intention, challenge, phrase);

  openModal(
    "🌅 Check-in inicial",
    `✨ Mensaje del día: ${phrase}`,
    `Intención: ${intention}\nReto: ${challenge}`
  );
  document.getElementById("status").textContent =
    "✅ Check-in inicial registrado.";
}

// --- Check-in emocional ---
function emotionalCheckin() {
  // Snooze ya alcanzado?
  if (snoozeCount > 0) {
    snoozeCount = 0; // reset al hacer check-in
  }

  const feelings = [
    "😌 Bien, con energía",
    "😐 Cansado",
    "😫 Estresado",
    "😔 Falta de motivación",
    "😢 Triste",
    "😵 Ansiedad / Tensión física",
  ];
  const choice = prompt(
    "🧠 ¿Cómo te sientes ahora?\n1. 😌 Bien\n2. 😐 Cansado\n3. 😫 Estresado\n4. 😔 Falta de motivación\n5. 😢 Triste\n6. 😵 Ansiedad"
  );

  const idx = parseInt(choice) - 1;
  let emotion = feelings[idx] || "Sin respuesta";
  let activity = "Haz una pausa breve e intencional.";

  switch (choice) {
    case "1":
      activity =
        "💪 Aprovecha tu energía para una meta clave en los próximos 30 minutos.";
      break;
    case "2":
      activity = "🌿 Da una caminata o estírate 5 min. (Noradrenalina)";
      break;
    case "3":
      activity =
        "🧘 Respira profundo 3 veces y relaja tus hombros. (GABA)";
      break;
    case "4":
      activity =
        "📝 Anota 3 micro-tareas y empieza por la primera. (Noradrenalina)";
      break;
    case "5":
      activity =
        "🎵 Pon tu canción favorita y recuerda algo que te haga sonreír. (Endorfinas)";
      break;
    case "6":
      activity =
        "😌 Haz 1 min de respiración consciente. Toma un descanso sensorial. (GABA)";
      break;
  }

  const reason = prompt("🗣️ ¿Por qué te sientes así?");
  const advice = prompt("🧠 Dale un consejo a tu 'yo amigo'");

  const phrase = random(emotionalPhrases);

  openModal(
    "⏰ Check-in emocional",
    `Estado: ${emotion}\nMotivo: ${reason}\nConsejo: ${advice}`,
    `💬 Actividad: ${activity}\n🎲 Frase: ${phrase}\n🚀 +2 XP desbloqueados`
  );
  document.getElementById("status").textContent =
    "✅ Check-in emocional completado.";
}

// --- Snooze ---
document.getElementById("snoozeBtn").addEventListener("click", () => {
  if (snoozeCount < maxSnoozes) {
    snoozeCount++;
    document.getElementById("status").textContent =
      `⏰ Check-in pospuesto 30 min. (Snooze ${snoozeCount}/${maxSnoozes})`;
    setTimeout(emotionalCheckin, 30 * 60 * 1000); // 30 min
  } else {
    document.getElementById("status").textContent =
      "⚠️ Ya usaste los 2 snoozes. Haz tu check-in ahora.";
    emotionalCheckin();
  }
});

// --- Botón de check-in manual ---
document.getElementById("checkinBtn").addEventListener("click", () => {
  const log = getDailyCheckin();
  if (!log) {
    dailyCheckin();
  } else {
    emotionalCheckin();
  }
});

// --- Auto check-in inicial al cargar ---
window.onload = () => {
  const log = getDailyCheckin();
  if (!log) {
    dailyCheckin();
  } else {
    document.getElementById("status").textContent =
      "✅ Check-in inicial ya registrado.";
    // Programar cada 2h
    setInterval(emotionalCheckin, 2 * 60 * 60 * 1000);
  }
};
