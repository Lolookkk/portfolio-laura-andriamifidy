# Données du portfolio — version lisible

> Version Markdown du fichier [`seed.sql`](./seed.sql).
> Sert de **référence éditable** : c'est exactement le contenu actuellement présent sur le site.
> En pratique, une fois Supabase configuré, tout se modifie depuis la page cachée `/studio`
> (plus besoin de retoucher ce fichier).

---

## ⚙️ Paramètres du site

| Clé | Valeur |
|---|---|
| `brand_line1` | Laura |
| `brand_line2` | Andriamifidy |
| `status` | Étudiante ingénieure |
| `footer_text` | © {year} Laura Andriamifidy |
| `banner_image` | /images/fond2.png |
| `title_suffix` | — Portfolio |

---

## 🧭 Pages (menu)

| slug | titre | libellé menu | template | ordre |
|---|---|---|---|---|
| `accueil` | Accueil | Accueil | home | 1 |
| `projets` | Projets | Projets | projects | 2 |
| `anglais` | Anglais | Anglais | text | 3 |
| `a-cote` | À côté | À côté | items | 4 |

---

## 🏷️ Catégories

| code | libellé | ordre |
|---|---|---|
| `dev` | Développement | 1 |
| `cybersec` | Cybersécurité | 2 |
| `ml` | Machine Learning | 3 |
| `cloud` | Cloud | 4 |

---

## 📄 Sections (rubriques / sous-rubriques)

### Page *Accueil*
- **h1 :** Bienvenue !
- **h2 :** Présentation
- **Contenu :** présentation complète (parcours ESILV, langages, recherche de stage
  6 mois dès février 2027 puis 4 mois dès août 2027).

### Page *Anglais*
| ordre | titre (h2) | contenu |
|---|---|---|
| 1 | Présentation | L'anglais dans mon parcours (académique + séjours linguistiques + TOEFL). |
| 2 | Certification | **TOEFL ITP Level 1** — score **570** — 17 mai 2025 — niveau **B2+**. |
| 3 | Séjours linguistiques | Organisme EF + liste : Cambridge (3 sem., juil. 2022), Manchester (3 sem., juil. 2023). |
| 4 | Activités | **Association Anglais Plaisir** — Courbevoie, à partir d'octobre 2026. |

### Page *À côté*
| ordre | titre (h2) | contenu |
|---|---|---|
| 1 | Ce que je fais en dehors de l'informatique | (titre d'introduction) |

---

## 🚀 Projets (page *Projets*) — `kind = project`

| # | Titre | Catégories | Technologies | Image | Liens |
|---|---|---|---|---|---|
| 1 | Gestionnaire de mots de passe local — Rust | dev, cybersec | Rust, egui/eframe, Argon2id, AES-256-GCM, Axum, Tokio | — | [GitHub](https://github.com/Lolookkk/SafeVault.git) · [YouTube](https://youtu.be/2BV0FN4xTSA) |
| 2 | Forum de discussion — Projet personnel (en développement) | dev, cybersec | Node.js, React, JavaScript, Supabase, PostgreSQL, SQL | — | [GitHub](https://github.com/Lolookkk/forum.git) · *fenêtre détaillée* |
| 3 | Tests et sécurisation de pages web | cybersec, dev | PHP, SQL, Apache, MySQL, XAMPP | — | [YouTube](https://youtu.be/hdlVBO40Bfk) |
| 4 | Plateforme comparative d'audit de sécurité des smart contracts **(projet à venir)** | cybersec, dev | Solidity, Python, Slither, Mythril, Echidna, Web | — | — |
| 5 | StudyPet — Application Android | dev | Kotlin, Android, Android Studio, REST API, ViewModel, Fragments, JUnit/Mockito | — | — |
| 6 | Mini application web (Java et MySQL) | dev | Java, MySQL | java2.png | [GitHub](https://github.com/sophieeanne/WebStudentBook.git) |
| 7 | Projet de prédiction de l'OEE avec IBM watsonx : machine learning | ml | IBM watsonx | projet-IBM.png | — |
| 8 | Détection d'intrusions réseau en Python (Machine Learning) | ml, cybersec | Python, Machine Learning | ml_projet.png | [GitHub](https://github.com/manGjv/Cybersecurity-Intrusion-Detection.git) |
| 9 | Outil de chiffrement/déchiffrement | dev, cybersec | Rust | chiffrement.png | — |
| 10 | Mini application desktop (JavaFX et MySQL) | dev | Java, MySQL | java1.png | [GitHub](https://github.com/sophieeanne/WomenShopFX.git) |
| 11 | Projet MySQL (VéloMax) | dev | C#, MySQL | velomax.png | — |
| 12 | Création d'un simulateur de combat Pokémon en C++ | dev | C++ | pokemon.png | [GitHub](https://github.com/sophieeanne/projet-C-pokemon.git) |
| 13 | Projet de traitement d'image | dev | C# | traitement-image.bmp | — |
| 14 | Projet Plateforme en ligne d'apprentissage artistique (en cours) | dev | Node, React, JavaScript, PostgreSQL | soul-art.png | — |
| 15 | Memory Trouble — C & DevSecOps | cybersec, dev, cloud | C, GitLab CI/CD, GCC, Cppcheck, Clang-Tidy, Valgrind, SonarQube | — | — |
| 16 | API de recommandation musicale — Performance | dev, cloud | Python, FastAPI, C++, MongoDB, Redis, NGINX | — | [GitHub](https://github.com/sophieeanne/spotify-project.git) |

> ⚠️ Le projet **n° 4** doit rester marqué « projet à venir ».
> Le projet **n° 2** possède une fenêtre « En savoir plus » complète (idée, conception
> BRD/SRS/SDD, développement MVC, suite du projet) — contenu détaillé dans `seed.sql`.

---

## 🎨 Activités (page *À côté*) — `kind = activity`

| # | Titre | Sous-titre | Badges | Fenêtre « En savoir plus » | Galerie |
|---|---|---|---|---|---|
| 1 | Musique | Piano – Chant – MAO | Piano, Chant, MAO, Synthé | Parcours piano/conservatoire, concours, style, MAO, aujourd'hui | — |
| 2 | Art | Peinture – dessin | Peinture, Dessin, Leonart | Association Leonart 2025-2026 | mer.png, paysage.png, Michel Ange.png |
| 3 | Karaté & self-défense | Sport | Karaté, Self-défense | Début septembre 2026, ceinture blanche, 2×/semaine | — |
| 4 | Cuisine | Cuisine – découverte | Recettes, Expérimentation | Début juin 2026 | brioche.png, oeuf.png, spritz.png |
| 5 | Voyage | Découverte de nouvelles cultures | Europe, Cultures | Voyages Europe, pays scandinaves et baltes | — |
