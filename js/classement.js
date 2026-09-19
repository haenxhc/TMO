import { db } from "./firebase-config.js";
import { requireAuth, logout } from "./auth-guard.js";
import {
  collection, query, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("logout").addEventListener("click", logout);

const board = document.getElementById("leaderboard");

requireAuth(() => {
  const q = query(collection(db, "users"), orderBy("points", "desc"));
  onSnapshot(q, (snap) => {
    board.innerHTML = "";
    snap.forEach((d, i) => {
      const u = d.data();
      const el = document.createElement("div");
      el.className = "card leaderboard-row";
      el.innerHTML = `
        <span class="rank">#${i + 1}</span>
        <img src="${u.avatar || 'https://via.placeholder.com/40'}" alt="avatar" class="avatar" />
        <span class="pseudo">${u.pseudo}</span>
        <span class="points">${u.points || 0} pts</span>
      `;
      board.appendChild(el);
    });
  });
});
