// Configuração OPCIONAL das salas online (Firebase).
// 1. Copie este arquivo para "firebase-config.js"
// 2. Preencha com os dados do seu projeto em https://console.firebase.google.com
//    (ative Firestore e Authentication > Anônimo)
// Sem o firebase-config.js o jogo roda normalmente no modo offline.

window.__firebase_config = JSON.stringify({
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000"
});
window.__app_id = "7a0-arena-do-multiverso";
