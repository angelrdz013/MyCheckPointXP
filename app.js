// ===============================
// MyCheckPointXP - app.js
// ===============================

let xp = 0;
let snoozeCount = 0;

// Elementos DOM
const checkinBtn = document.getElementById("checkinBtn");
const snoozeBtn  = document.getElementById("snoozeBtn");
const statusEl   = document.getElementById("status");
const xpEl       = document.getElementById("xp");

const modal      = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalMsg   = document.getElementById("modalMessage");
const modalExtra = document.getElementById("modalExtra");
const closeModal = document.getElementById("closeModal");

// Frases y actividades
const frasesEGO = [
  "Tu mente dice: «mejor después»… pero tú mandas.",
  "El EGO quiere que pares, pero tú puedes más.",
  "No necesitas motivación, solo acción ahora.",
  "Haz una cosa +1 y estarás en marcha."
];
const actividades = [
  "Respira profundo 3 veces.",
  "Levántate y estírate 1 minuto.",
  "Toma agua y camina 5 pasos.",
  "Escribe una idea rápida en tu libreta.",
  "Mueve hombros/cuello 30 segundos."
];

// ===============================
// HELPERS
// ===============================
function rand(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
function updateXP(){ xpEl.textContent = xp; }

// ===============================
// NOTIFICACIONES
// ===============================
function requestNotifPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function notifyUser(title, body){
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

// ===============================
// MODAL
// ===============================
function openModal(){ modal.style.display = "block"; }
function closeModalFn(){ modal.style.display = "none"; }
closeModal.addEventListener("click", closeModalFn);
modal.addEventListener("click", (e)=>{ if(e.target===modal) closeModalFn(); });

// ===============================
// CHECK-IN FLOW
// ===============================
function startCheckInFlow(){
  requestNotifPermission();

  const frase = rand(frasesEGO);
  const act   = rand(actividades);

  // Paso 1: mensaje positivo
  openModal();
  modalTitle.textContent = "🌟 Inicio positivo";
  modalMsg.textContent   = "Momento de cuidarte. Cada acción cuenta. 💪";
  modalExtra.textContent = "";

  // Paso 2: EGO + actividad
  setTimeout(()=>{
    modalTitle.textContent = "🧠 Tu EGO habla…";
    modalMsg.textContent   = frase;
    modalExtra.textContent = "Sugerencia: " + act;

    // Paso 3: cuenta regresiva
    let count = 5;
    modalTitle.textContent = "⏳ Cuenta regresiva";
    modalMsg.textContent   = String(count);

    const tick = setInterval(()=>{
      count--;
      if(count > 0){
        modalMsg.textContent = String(count);
      } else {
        clearInterval(tick);
        modalTitle.textContent = "🔥 ¡Acción!";
        modalMsg.textContent   = "5,4,3,2,1… ¡GO!";
        modalExtra.textContent = "¡Lo lograste! +5 XP 🎯";
        xp += 5;
        updateXP();
        statusEl.textContent = "✅ Check-in registrado. ¡Bien ahí, jugador!";
        notifyUser("Check-In completado", "Ganaste 5 XP. Sigue sumando 🕹️");
      }
    }, 1000);
  }, 1200);
}

// ===============================
// SNOOZE
// ===============================
function snooze(){
  requestNotifPermission();
  if (snoozeCount < 2) {
    snoozeCount++;
    statusEl.textContent = `⏸ Snooze (30 min). Usados: ${snoozeCount}/2`;
    notifyUser("Snooze activado", "Te recordamos en 30 minutos.");
    setTimeout(showCheckInNotification, 30*60*1000);
  } else {
    statusEl.textContent = "⚠️ Límite de snoozes alcanzado. Haz tu check-in.";
    notifyUser("Límite alcanzado", "Ya no puedes posponer, ¡vamos a la acción!");
  }
}

// ===============================
// RECORDATORIOS
// ===============================
function showCheckInNotification(){
  notifyUser("⏰ Hora de tu Check-In", "¿Ya cumpliste tu hábito?");
}

// Notificación inicial (como check-in de la mañana)
window.addEventListener("load", () => {
  requestNotifPermission();
  setTimeout(() => {
    notifyUser("🌞 Buenos días", "Escribe tu meta del día en MyCheckPointXP");
    statusEl.textContent = "🌞 Inicia el día con tu meta personal.";
  }, 3000);
});

// Notificación cada 2 horas
setInterval(showCheckInNotification, 2 * 60 * 60 * 1000);

// ===============================
// EVENTOS DE BOTONES
// ===============================
checkinBtn.addEventListener("click", startCheckInFlow);
snoozeBtn.addEventListener("click", snooze);

// Estado inicial
updateXP();

// ===============================
// SERVICE WORKER
// ===============================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("✅ Service Worker registrado"))
    .catch(err => console.error("Error SW:", err));
}
