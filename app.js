let xp = 0;
let snoozeCount = 0; // máximo 2 snoozes permitidos

const checkinBtn = document.getElementById("checkinBtn");
const snoozeBtn = document.getElementById("snoozeBtn");
const status = document.getElementById("status");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalExtra = document.getElementById("modalExtra");
const closeModal = document.getElementById("closeModal");

const frasesEGO = [
  "Tu mente dice: 'Mejor después'... pero tú mandas.",
  "El EGO quiere que pares, pero tú puedes más.",
  "No necesitas motivación, solo acción ahora."
];

const actividades = [
  "Respira profundo 3 veces.",
  "Levántate y estírate 1 minuto.",
  "Toma agua y camina 2 pasos.",
  "Escribe una idea rápida en tu libreta."
];

// --- CHECK-IN FLOW ---
function startCheckInFlow() {
  const frase = frasesEGO[Math.floor(Math.random() * frasesEGO.length)];
  const actividad = actividades[Math.floor(Math.random() * actividades.length)];
  
  let count = 5;

  modal.style.display = "block";
  modalTitle.innerText = "🌟 Inicio del día positivo";
  modalMessage.innerText = "Recuerda: cada acción cuenta. Momento de cuidarte.";
  modalExtra.innerText = "";

  setTimeout(() => {
    modalTitle.innerText = "🧠 Tu EGO habla...";
    modalMessage.innerText = frase;
    modalExtra.innerText = `Sugerencia: ${actividad}`;

    const interval = setInterval(() => {
      modalTitle.innerText = "⏳ Cuenta regresiva";
      modalMessage.innerText = `${count}`;
      count--;
      if (count < 0) {
        clearInterval(interval);
        modalTitle.innerText = "🔥 ¡Acción!";
        modalMessage.innerText = "5,4,3,2,1... ¡GO!";
        modalExtra.innerText = "¡Lo lograste, suma +5 XP!";
        xp += 5;
        status.innerText = `✅ Check-in registrado. XP total: ${xp}`;
        notifyUser("Check-In completado", `Ganaste 5 XP. Total: ${xp}`);
      }
    }, 1000);
  }, 2000);
}

// Botones
checkinBtn.addEventListener("click", startCheckInFlow);

snoozeBtn.addEventListener("click", () => {
  if (snoozeCount < 2) {
    snoozeCount++;
    status.innerText = `⏸ Snooze activado (30 min). Usados: ${snoozeCount}/2`;
    notifyUser("Snooze activado", "Te recordaremos en 30 minutos.");
    setTimeout(showCheckInNotification, 30 * 60 * 1000);
  } else {
    status.innerText = "⚠️ Límite de snoozes alcanzado. Haz tu check-in.";
    notifyUser("Límite alcanzado", "Ya no puedes posponer, haz tu check-in.");
  }
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// --- NOTIFICACIONES ---
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

function notifyUser(title, message) {
  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  }
}

function showCheckInNotification() {
  notifyUser("⏰ Hora de tu Check-In", "¿Ya cumpliste tu hábito?");
}

// Recordatorio cada 2 horas
setInterval(showCheckInNotification, 2 * 60 * 60 * 1000);
