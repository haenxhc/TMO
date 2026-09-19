import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

export function requireAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "index.html";
    } else {
      callback(user);
    }
  });
}

export async function logout() {
  await signOut(auth);
  window.location.href = "index.html";
}
