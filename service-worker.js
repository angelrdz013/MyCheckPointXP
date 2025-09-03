self.addEventListener('push', (event) => {
  const data = event.data.json();

  const title = data.title;
  const options = {
    body: data.body,
    icon: 'https://angelrdz013.github.io/MyCheckPointXP/favicon.ico', // Puedes cambiar esto por el icono que prefieras
    badge: 'https://angelrdz013.github.io/MyCheckPointXP/favicon.ico',
    tag: 'check-in-notification',
    renotify: true
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
