let xp = 0;
let snoozeCount = 0; // máximo 2 snoozes permitidos

const checkinBtn = document.getElementById("checkinBtn");
const snoozeBtn = document.getElementById("snoozeBtn");
const status = document.getElementById("status");

checkinBtn.addEventListener("click", () => {
  xp += 5;
  status.innerText = `✅ Check-in registrado. XP total: ${xp}`;
  notifyUser("¡Nuevo Check-In!", `Ganaste 5 XP. Total: ${xp}`);
});

snoozeBtn.addEventListener("click", () => {
  if (snoozeCount < 2) {
    snoozeCount++;
    status.innerText = `⏸ Snooze activado (30 min). Usados: ${snoozeCount}/2`;
    notifyUser("Snooze activado", "Te recordaremos en 30 minutos.");
    setTimeout(showCheckInNotification, 30 * 60 * 1000); // 30 minutos
  } else {
    status.innerText = "⚠️ Límite de snoozes alcanzado. Haz tu check-in.";
    notifyUser("Límite alcanzado", "Ya no puedes posponer, haz tu check-in.");
  }
});

// Solicitar permiso para notificaciones
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Función para mostrar notificación de check-in
function showCheckInNotification() {
  notifyUser("⏰ Hora de tu Check-In", "¿Ya cumpliste tu hábito?");
}

// Enviar recordatorio cada 2 horas
setInterval(showCheckInNotification, 2 * 60 * 60 * 1000); // 2 horas

function notifyUser(title, message) {
  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  }
}
