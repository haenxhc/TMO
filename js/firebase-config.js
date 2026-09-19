// Remplace par ta config Firebase (Console Firebase > Paramètres du projet > Tes apps)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCjCbaakzPkFt-nttm_K3VbpMNx0LmuF4k",
    authDomain: "tmo-hq-b2fa5.firebaseapp.com",
    projectId: "tmo-hq-b2fa5",
    storageBucket: "tmo-hq-b2fa5.firebasestorage.app",
    messagingSenderId: "328287185757",
    appId: "1:328287185757:web:45c186e4777b551781d6b4",
    measurementId: "G-68N3754J6R"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
