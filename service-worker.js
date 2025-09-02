// service-worker.js
self.addEventListener("push", function(event) {
  const data = event.data.json();
  const title = data.title || "MyCheckPointXP";
  const options = {
    body: data.body || "¡Es hora de tu check-in!",
    icon: "/icon.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
