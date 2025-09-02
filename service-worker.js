// ===============================
// MyCheckPointXP - service-worker.js
// ===============================

// Activación del Service Worker
self.addEventListener("install", event => {
  console.log("📦 Service Worker instalado");
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("🚀 Service Worker activado");
});

// Manejo de notificaciones push
self.addEventListener("push", event => {
  console.log("📩 Push recibido:", event.data ? event.data.text() : "sin datos");

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: "MyCheckPointXP", body: event.data.text() };
  }

  const title = data.title || "MyCheckPointXP";
  const options = {
    body: data.body || "¡Es hora de tu check-in!",
    icon: "icon.png", // coloca un ícono en la raíz del repo si quieres
    badge: "icon.png"
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Cuando el usuario hace clic en la notificación
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow("/");
    })
  );
});
