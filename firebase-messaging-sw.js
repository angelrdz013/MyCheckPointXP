importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDZ3y4u7EyL-0nBJ-ILFbQk7tUsIVku6Yk",
  authDomain: "mycheckpointxp.firebaseapp.com",
  projectId: "mycheckpointxp",
  storageBucket: "mycheckpointxp.firebasestorage.app",
  messagingSenderId: "507163687345",
  appId: "1:507163687345:web:8f8df77bd12d028cca6590"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "icon.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
