# TMO HQ

Le QG privé de la team TMO.

## Stack
- HTML / CSS / JS vanilla
- Firebase (Auth, Firestore, Storage)
- GitHub Pages + GitHub Actions

## Setup
1. Clone le repo.
2. Crée un projet Firebase, active Auth (Google), Firestore, Storage.
3. Copie ta config dans `js/firebase-config.js`.
4. Ajoute `TON_PSEUDO.github.io` dans Firebase > Auth > Authorized domains.
5. Push sur `main` → GitHub Actions déploie tout seul.

## Structure Firestore
- `users` : profils
- `memes` : mèmes postés
- `messages` : chat
- `defis` : défis de la team
