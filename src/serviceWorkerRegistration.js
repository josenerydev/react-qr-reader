export function register() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceWorker.js').then(
          (registration) => {
            console.log(
              'Service Worker registrado com sucesso:',
              registration.scope
            );
          },
          (err) => {
            console.error('Erro ao registrar o Service Worker:', err);
          }
        );
      });
    }
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  }
  