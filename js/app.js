import { db, auth } from "./firebase-config.js";
import { requireAuth, logout } from "./auth-guard.js";
import {
  collection, getDocs, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("logout").addEventListener("click", logout);

requireAuth(async (user) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const data = userSnap.data() || {};
  document.getElementById("pseudo").textContent = data.pseudo || user.displayName || "Membre";

  const [membres, memes, defis] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(collection(db, "memes")),
    getDocs(query(collection(db, "defis")))
  ]);

  document.getElementById("stat-membres").textContent = membres.size;
  document.getElementById("stat-memes").textContent = memes.size;
  const defisActifs = defis.docs.filter(d => d.data().statut === "ouvert").length;
  document.getElementById("stat-defis").textContent = defisActifs;

  const derniers = await getDocs(
    query(collection(db, "memes"), orderBy("createdAt", "desc"), limit(3))
  );
  const container = document.getElementById("last-memes");
  container.innerHTML = "";
  derniers.forEach((d) => {
    const m = d.data();
    const el = document.createElement("div");
    el.className = "card meme-card";
    el.innerHTML = `
      <img src="${m.imageUrl}" alt="meme" />
      <p>${m.caption || ""}</p>
    `;
    container.appendChild(el);
  });
});
