import { db } from "./firebase-config.js";
import { requireAuth, logout } from "./auth-guard.js";
import {
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp,
  doc, updateDoc, increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("logout").addEventListener("click", logout);

const form = document.getElementById("defi-form");
const list = document.getElementById("defis-list");

requireAuth((user) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titre = document.getElementById("defi-titre").value.trim();
    const description = document.getElementById("defi-desc").value.trim();
    if (!titre) return;
    await addDoc(collection(db, "defis"), {
      titre,
      description,
      proposePar: user.uid,
      pseudo: user.displayName || "Membre",
      votesPour: 0,
      votesContre: 0,
      statut: "ouvert",
      createdAt: serverTimestamp()
    });
    form.reset();
  });

  const q = query(collection(db, "defis"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snap) => {
    list.innerHTML = "";
    snap.forEach((d) => {
      const defi = d.data();
      const el = document.createElement("div");
      el.className = "card defi-card";
      el.innerHTML = `
        <h4>${defi.titre}</h4>
        <p>${defi.description || ""}</p>
        <small>par ${defi.pseudo}</small>
        <div class="defi-votes">
          <button class="btn btn-primary" data-vote="pour">👍 ${defi.votesPour || 0}</button>
          <button class="btn btn-ghost" data-vote="contre">👎 ${defi.votesContre || 0}</button>
        </div>
      `;
      el.querySelector("[data-vote=pour]").addEventListener("click", () => {
        updateDoc(doc(db, "defis", d.id), { votesPour: increment(1) });
      });
      el.querySelector("[data-vote=contre]").addEventListener("click", () => {
        updateDoc(doc(db, "defis", d.id), { votesContre: increment(1) });
      });
      list.appendChild(el);
    });
  });
});
