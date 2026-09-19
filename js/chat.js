import { db, auth } from "./firebase-config.js";
import { requireAuth, logout } from "./auth-guard.js";
import {
  collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("logout").addEventListener("click", logout);

const box = document.getElementById("messages");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");

requireAuth(async (user) => {
  const userSnap = await getDoc(doc(db, "users", user.uid));
  const pseudo = userSnap.data()?.pseudo || user.displayName || "Membre";

  const q = query(
    collection(db, "messages"),
    orderBy("createdAt", "desc"),
    limit(100)
  );

  onSnapshot(q, (snap) => {
    box.innerHTML = "";
    const msgs = snap.docs.map(d => d.data()).reverse();
    msgs.forEach((m) => {
      const el = document.createElement("div");
      el.className = "msg" + (m.authorId === user.uid ? " me" : "");
      el.innerHTML = `
        <span class="msg-author">${m.pseudo}</span>
        <span class="msg-text">${m.texte}</span>
      `;
      box.appendChild(el);
    });
    box.scrollTop = box.scrollHeight;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const texte = input.value.trim();
    if (!texte) return;
    input.value = "";
    await addDoc(collection(db, "messages"), {
      authorId: user.uid,
      pseudo,
      texte,
      createdAt: serverTimestamp()
    });
  });
});
