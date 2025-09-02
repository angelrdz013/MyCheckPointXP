let xp = 0;

document.getElementById("checkinBtn").addEventListener("click", () => {
  xp += 5;
  document.getElementById("status").innerText = `✅ Check-in registrado. XP total: ${xp}`;
  notifyUser("¡Nuevo Check-In!", `Ganaste 5 XP. Total: ${xp}`);
});

document.getElementById("snoozeBtn").addEventListener("click", () => {
  document.getElementById("status").innerText = "⏸ Snooze activado por 30 minutos.";
  notifyUser("Snooze activado", "Te recordaremos en 30 minutos.");
});

// Solicitar permiso para notificaciones
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

function notifyUser(title, message) {
  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  }
}
