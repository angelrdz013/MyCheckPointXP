// Importar scripts de Firebase
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Configuración de tu proyecto Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDZ3y4u7EyL-0nBJ-ILFbQk7tUsIVku6Yk",
  authDomain: "mycheckpointxp.firebaseapp.com",
  projectId: "mycheckpointxp",
  storageBucket: "mycheckpointxp.firebasestorage.app",
  messagingSenderId: "507163687345",
  appId: "1:507163687345:web:8f8df77bd12d028cca6590"
});

const messaging = firebase.messaging();

// 👉 Prueba mínima: mostrar SIEMPRE una notificación cuando llega algo en background
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Mensaje en background:", payload);

  const notificationTitle = payload.notification?.title || "📩 Nuevo mensaje";
  const notificationOptions = {
    body: payload.notification?.body || "Llegó una notificación de prueba",
    icon: "icon.png" // opcional
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
