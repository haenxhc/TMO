import { db, storage, auth } from "./firebase-config.js";
import { requireAuth, logout } from "./auth-guard.js";
import {
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc,
  updateDoc, arrayUnion, arrayRemove, increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

document.getElementById("logout").addEventListener("click", logout);

const form = document.getElementById("meme-form");
const wall = document.getElementById("meme-wall");

requireAuth(async (user) => {
  const userSnap = await getDoc(doc(db, "users", user.uid));
  const pseudo = userSnap.data()?.pseudo || "Membre";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = document.getElementById("meme-file").files[0];
    const caption = document.getElementById("meme-caption").value.trim();
    if (!file) return;

    const storageRef = ref(storage, `memes/${user.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "memes"), {
      authorId: user.uid,
      pseudo,
      imageUrl: url,
      caption,
      likes: 0,
      likedBy: [],
      createdAt: serverTimestamp()
    });

    form.reset();
  });

  const q = query(collection(db, "memes"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snap) => {
    wall.innerHTML = "";
    snap.forEach((d) => {
      const m = d.data();
      const liked = (m.likedBy || []).includes(user.uid);
      const el = document.createElement("div");
      el.className = "card meme-card";
      el.innerHTML = `
        <img src="${m.imageUrl}" alt="meme" />
        <div class="meme-meta">
          <p class="meme-caption">${m.caption || ""}</p>
          <small>par ${m.pseudo}</small>
          <button class="like-btn ${liked ? "liked" : ""}" data-id="${d.id}">
            ❤️ ${m.likes || 0}
          </button>
        </div>
      `;
      el.querySelector(".like-btn").addEventListener("click", async () => {
        const refDoc = doc(db, "memes", d.id);
        if (liked) {
          await updateDoc(refDoc, { likes: increment(-1), likedBy: arrayRemove(user.uid) });
        } else {
          await updateDoc(refDoc, { likes: increment(1), likedBy: arrayUnion(user.uid) });
        }
      });
      wall.appendChild(el);
    });
  });
});
