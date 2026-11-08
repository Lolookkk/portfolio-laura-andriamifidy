-- =========================================================
--  Portfolio Laura Andriamifidy — Données de remplissage (seed)
--  Cible : PostgreSQL (Supabase)
--  À exécuter APRÈS schema.sql
--
--  ⚠️  Ce script réinitialise le CONTENU (pages, sections,
--      catégories, items, paramètres) mais PAS les utilisateurs.
--      Il est donc ré-exécutable sans perdre le compte admin.
-- =========================================================

truncate table items, sections, pages, categories, site_settings restart identity cascade;

-- ---------------------------------------------------------
--  Paramètres du site
-- ---------------------------------------------------------
insert into site_settings (key, value) values
  ('brand_line1',  'Laura'),
  ('brand_line2',  'Andriamifidy'),
  ('status',       'Étudiante ingénieure'),
  ('footer_text',  '© {year} Laura Andriamifidy'),
  ('banner_image', '/images/fond2.png'),
  ('title_suffix', '— Portfolio');

-- ---------------------------------------------------------
--  Pages (menu)
-- ---------------------------------------------------------
insert into pages (slug, title, nav_label, template, position, nav_visible) values
  ('accueil', 'Accueil', 'Accueil', 'home',     1, true),
  ('projets', 'Projets', 'Projets', 'projects', 2, true),
  ('anglais', 'Anglais', 'Anglais', 'text',     3, true),
  ('a-cote',  'À côté',  'À côté',  'items',    4, true);

-- ---------------------------------------------------------
--  Catégories (filtre page Projets)
-- ---------------------------------------------------------
insert into categories (code, label, position) values
  ('dev',      'Développement',    1),
  ('cybersec', 'Cybersécurité',    2),
  ('ml',       'Machine Learning', 3),
  ('cloud',    'Cloud',            4);

-- =========================================================
--  SECTIONS (rubriques / sous-rubriques)
-- =========================================================

-- ---------- Accueil : présentation ----------
insert into sections (page_id, parent_id, title, subtitle, content, position)
values (
  (select id from pages where slug = 'accueil'),
  null,
  'Bienvenue !',
  'Présentation',
  $html$Élève ingénieure en 5e année à l’ESILV, au sein de la majeure <b>Cybersecurity &amp; Cloud Computing</b>, ma formation couvre différents domaines de l’informatique, du développement logiciel et web à la cybersécurité, en passant par les systèmes, les infrastructures, les bases de données, le cloud et le machine learning.<br><br>Au cours de mon cursus, j’ai réalisé des projets variés, académiques ou personnels, qui m’ont permis de travailler avec différents langages et environnements. J’ai notamment travaillé avec <b>Rust, C++, C#, Java, JavaScript, Python, SQL et Linux</b>. J’ai développé des applications web et mobiles, des applications desktop, des outils de sécurité, des projets autour du cloud et du machine learning, ainsi que des projets liés à l’analyse et à la sécurisation de systèmes et d’applications.<br><br>Ces expériences m’ont permis de découvrir différentes étapes d’un projet informatique : conception, développement, gestion des données, intégration d'API externes, tests, déploiement et prise en compte des problématiques de sécurité. Elles m’ont également appris à travailler en équipe, à m’adapter à de nouveaux environnements techniques et à approfondir mes connaissances de manière autonome.<br><br>Je recherche actuellement un stage de <b>6 mois à partir de février 2027</b>, dans les domaines du développement informatique, de la cybersécurité ou du cloud. Je recherche également un stage de <b>4 mois à partir d’août 2027</b>, correspondant à mon stage de 4e année.<br><br>À travers ces expériences, je souhaite continuer à développer mes compétences techniques, découvrir de nouvelles problématiques et contribuer concrètement aux projets sur lesquels je serai amenée à travailler.$html$,
  1
);

-- ---------- Anglais ----------
insert into sections (page_id, title, content, position) values
(
  (select id from pages where slug = 'anglais'),
  'Présentation',
  $html$L’anglais fait partie de mon parcours, aussi bien dans un contexte académique que dans mes expériences personnelles. J’ai eu l’occasion de développer mon niveau à travers différents séjours linguistiques ainsi que ma préparation au TOEFL.$html$,
  1
),
(
  (select id from pages where slug = 'anglais'),
  'Certification',
  $html$<b>TOEFL ITP Level 1</b> — score de <b>570</b> — 17 mai 2025<br>Niveau <b>B2+</b>$html$,
  2
),
(
  (select id from pages where slug = 'anglais'),
  'Séjours linguistiques',
  $html$Ces séjours à l’étranger avec l’organisme EF m’ont permis de pratiquer l’anglais en étant immergée dans un pays anglophone. J’ai pu faire des rencontres avec des personnes venant de pays très différents, découvrir davantage la culture britannique et pratiquer l’anglais au quotidien, avec une demi-journée de cours chaque jour.
<ul>
  <li><b>Cambridge, Angleterre</b> — 3 semaines — juillet 2022</li>
  <li><b>Manchester, Angleterre</b> — 3 semaines — juillet 2023</li>
</ul>$html$,
  3
),
(
  (select id from pages where slug = 'anglais'),
  'Activités',
  $html$<b>Association Anglais Plaisir</b> — Courbevoie<br><br>Je rejoins cette association de conversation anglaise à partir d’octobre 2026. Une séance par semaine permet de pratiquer l’anglais à travers des échanges sur différents sujets.$html$,
  4
);

-- ---------- À côté : intro ----------
insert into sections (page_id, title, content, position)
values (
  (select id from pages where slug = 'a-cote'),
  'Ce que je fais en dehors de l’informatique',
  null,
  1
);

-- =========================================================
--  ITEMS — PROJETS (page Projets)
-- =========================================================

-- 1. Gestionnaire de mots de passe local — Rust
insert into items (kind, page_id, title, description, categories, tech, repo_url, demo_url, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'Gestionnaire de mots de passe local — Rust',
  $html$Développement d'une application de bureau de type coffre-fort numérique permettant de stocker localement des identifiants de manière chiffrée.<br><br>Le projet utilise notamment Argon2id pour la dérivation de clé, AES-256-GCM pour le chiffrement et un serveur HTTP local permettant la communication avec une extension navigateur.$html$,
  '{dev,cybersec}',
  '{Rust,"egui / eframe",Argon2id,AES-256-GCM,Axum,Tokio}',
  'https://github.com/Lolookkk/SafeVault.git',
  'https://youtu.be/2BV0FN4xTSA',
  1
);

-- 2. Forum de discussion — Projet personnel
insert into items (kind, page_id, title, description, categories, tech, repo_url, modal_title, modal_subtitle, modal_content, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'Forum de discussion — Projet personnel (en développement)',
  $html$Développement d'un forum de discussion web full-stack permettant la gestion des utilisateurs, des rôles, des rubriques, des ressources, des sujets et des réponses.<br><br>Le projet comprend également l'inscription, la connexion et différents niveaux de droits pour les administrateurs, modérateurs et membres.$html$,
  '{dev,cybersec}',
  '{Node.js,React,JavaScript,Supabase,PostgreSQL,SQL}',
  'https://github.com/Lolookkk/forum.git',
  'Forum de discussion pour personnes timides ou sujettes à l’anxiété sociale',
  'Projet personnel (en développement) — août 2026',
  $html$<h3>L’idée du projet</h3>
<p>J’ai commencé ce projet personnel en août 2026 autour d’une idée : créer un espace de discussion destiné notamment aux personnes timides ou sujettes à l’anxiété sociale, afin de leur permettre d’échanger plus facilement avec d’autres personnes.<br><br>L’objectif n’est pas de créer une plateforme médicale ou un service de thérapie, mais plutôt un espace communautaire permettant de parler de ses difficultés, de partager ses expériences et de trouver du soutien auprès d’autres personnes. Je voulais également que le forum ne soit pas uniquement centré sur ces difficultés : chacun peut aussi y parler de ses passions, de ses hobbies, de ses projets ou simplement de sa vie quotidienne. Le forum se veut donc généraliste.<br><br>Des ressources et des numéros utiles sont également prévus afin d’apporter des informations et, lorsque cela est nécessaire, d’orienter les utilisateurs vers des professionnels ou des services adaptés.</p>
<h3>Conception du projet</h3>
<p>Avant de commencer le développement, j’ai pris le temps de définir une structure assez précise du projet afin d’avoir une vision claire de ce que je voulais construire.<br><br>J’ai notamment rédigé trois documents :</p>
<ul>
  <li><b>BRD (Business Requirements Document)</b> : définition des besoins et des objectifs du projet ;</li>
  <li><b>SRS (Software Requirements Specification)</b> : description des fonctionnalités et exigences du forum ;</li>
  <li><b>SDD (Software Design Document)</b> : conception technique et architecture de l’application.</li>
</ul>
<p>Le projet a naturellement évolué depuis, mais cette étape m’a permis de partir sur une base structurée avant de commencer à développer.</p>
<h3>Développement</h3>
<p>Le projet est développé avec une architecture <b>MVC (Model-View-Controller)</b>, que j’ai choisie pour garder une séparation claire entre les différentes parties de l’application.</p>
<p><b>Technologies utilisées :</b></p>
<ul>
  <li>Node.js</li>
  <li>React</li>
  <li>JavaScript</li>
  <li>PostgreSQL / Supabase</li>
  <li>SQL</li>
  <li>Git / GitHub</li>
</ul>
<p>Le MVP comprend notamment l’authentification, les profils utilisateurs, les rôles, les catégories et sous-catégories, la création de discussions et de réponses, les signalements, les ressources, les annonces ainsi qu’une partie administration.<br><br>J’utilise également GitHub pour gérer les versions du projet et travailler avec différentes branches.</p>
<h3>La suite du projet</h3>
<p>Le projet est encore en développement. Une fois le MVP terminé, je prévois de déployer l’application afin de pouvoir commencer à la tester dans des conditions plus proches de son utilisation réelle.<br><br>Je souhaite organiser deux phases de bêta-test :</p>
<ul>
  <li>une première phase avec environ <b>5 personnes</b>, pas nécessairement concernées par la timidité ou l’anxiété sociale, afin de vérifier que le forum est intuitif et facile à utiliser ;</li>
  <li>une seconde phase avec environ <b>20 personnes correspondant davantage au public cible</b>, afin d’obtenir des retours sur l’expérience réelle du forum.</li>
</ul>
<p>La sécurité fait également partie des prochaines étapes importantes du projet. Étant spécialisée en cybersécurité, je souhaite réaliser un <b>audit de sécurité et des tests d’intrusion</b> avant d’aller plus loin dans le déploiement, notamment parce que les utilisateurs pourraient être amenés à partager des informations personnelles ou des pensées parfois sensibles.<br><br>Les retours des utilisateurs, les problèmes d’utilisation identifiés et les améliorations apportées au fil des tests permettront ensuite de mesurer concrètement l’évolution du projet.</p>$html$,
  2
);

-- 3. Tests et sécurisation de pages web
insert into items (kind, page_id, title, description, categories, tech, demo_url, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'Tests et sécurisation de pages web',
  $html$Projet pratique de cybersécurité web basé sur l'analyse, l'exploitation puis la correction de pages volontairement vulnérables.<br><br>Le projet porte notamment sur les injections SQL, les Stored XSS et le vol de session, avec mise en place de corrections adaptées.$html$,
  '{cybersec,dev}',
  '{PHP,SQL,Apache,MySQL,XAMPP}',
  'https://youtu.be/hdlVBO40Bfk',
  3
);

-- 4. Plateforme comparative d'audit de sécurité des smart contracts (projet à venir)
--    ⚠️ À CONSERVER marqué « projet à venir »
insert into items (kind, page_id, title, description, categories, tech, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'Plateforme comparative d''audit de sécurité des smart contracts (projet à venir)',
  $html$Développement prévu d'une plateforme web permettant d'analyser et de comparer les résultats de plusieurs outils d'audit de smart contracts, notamment Slither, Mythril et Echidna.<br><br>Le projet porte notamment sur la détection de vulnérabilités comme la réentrance, les problèmes de contrôle d'accès, les appels externes dangereux et la comparaison des faux positifs.$html$,
  '{cybersec,dev}',
  '{Solidity,Python,Slither,Mythril,Echidna,Web}',
  4
);

-- 5. StudyPet — Application Android
insert into items (kind, page_id, title, description, categories, tech, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'StudyPet — Application Android',
  $html$Développement d'une application mobile Android de productivité intégrant un timer Pomodoro, un animal virtuel, une boutique et un système de récompenses.<br><br>Le projet comprend également l'intégration d'une API REST, la gestion des notifications, la navigation entre les écrans et des tests unitaires.$html$,
  '{dev}',
  '{Kotlin,Android,"Android Studio","REST API",ViewModel,Fragments,"JUnit / Mockito"}',
  5
);

-- 6. Mini application web (Java et MySQL)
insert into items (kind, page_id, title, description, categories, tech, image_url, repo_url, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'Mini application web (Java et MySQL)',
  $html$Développement d'une application web dynamique en Java (Servlets/JSP) avec MySQL, suivant l’architecture MVC et le pattern DAO. Elle permet de gérer une liste d’étudiants via une interface web, avec les fonctionnalités d'affichage, d'ajout, de modification et de suppression, en utilisant Tomcat, et une navigation securisée entre les pages.$html$,
  '{dev}',
  '{Java,MySQL}',
  '/images/java2.png',
  'https://github.com/sophieeanne/WebStudentBook.git',
  6
);

-- 7. Prédiction de l'OEE avec IBM watsonx
insert into items (kind, page_id, title, description, categories, tech, image_url, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'Projet de prédiction de l’OEE avec IBM watsonx : machine learning',
  $html$Développement d’un modèle de prédiction de l’OEE avec IBM watsonx : préparation des données, entraînement AutoAI (XGBoost), compréhension du déploiement cloud et du monitoring (qualité, dérive, explicabilité avec SHAP &amp; LIME).$html$,
  '{ml}',
  '{"IBM watsonx"}',
  '/images/projet-IBM.png',
  7
);

-- 8. Détection d'intrusions réseau en Python
insert into items (kind, page_id, title, description, categories, tech, image_url, repo_url, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'Détection d’intrusions réseau en Python (Machine Learning)',
  $html$Création d'un modèle de Machine Learning permettant de détecter la présence d'une attaque à partir de données liées au trafic réseau et au comportement utilisateur.<br><br>Le projet comprend le prétraitement des données, l'entraînement du modèle de classification et l'évaluation de ses performances.$html$,
  '{ml,cybersec}',
  '{Python,"Machine Learning"}',
  '/images/ml_projet.png',
  'https://github.com/manGjv/Cybersecurity-Intrusion-Detection.git',
  8
);

-- 9. Outil de chiffrement/déchiffrement
insert into items (kind, page_id, title, description, categories, tech, image_url, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'Outil de chiffrement/déchiffrement',
  $html$Développement d'un outil CLI permettant de chiffrer et déchiffrer des données (fichiers ou texte) avec des algorithmes simples ou avancés : César, XOR, AES-GCM, Chacha20$html$,
  '{dev,cybersec}',
  '{Rust}',
  '/images/chiffrement.png',
  9
);

-- 10. Mini application desktop (JavaFX et MySQL)
insert into items (kind, page_id, title, description, categories, tech, image_url, repo_url, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'Mini application desktop (JavaFX et MySQL)',
  $html$Développement d'une application desktop en JavaFX avec MySQL permettant la gestion de stock d’un magasin de vêtements pour femmes, incluant la gestion des produits, des ventes/achats, des remises et le suivi financier, tout en respectant les patterns MVC et DAO.$html$,
  '{dev}',
  '{Java,MySQL}',
  '/images/java1.png',
  'https://github.com/sophieeanne/WomenShopFX.git',
  10
);

-- 11. Projet MySQL (VéloMax)
insert into items (kind, page_id, title, description, categories, tech, image_url, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'Projet MySQL',
  $html$Conception et développement d'un système de gestion pour VéloMax (réseau de magasins de vélos) en C#/MySQL, avec modules de gestion des stocks, commandes, fournisseurs, clients (particuliers/entreprises) et calcul de statistiques commerciales.$html$,
  '{dev}',
  '{C#,MySQL}',
  '/images/velomax.png',
  11
);

-- 12. Simulateur de combat Pokémon en C++
insert into items (kind, page_id, title, description, categories, tech, image_url, repo_url, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'Création d''un simulateur de combat Pokémon en C++',
  $html$Mise en oeuvre des principes de POO (héritage, polymorphisme, encapsulation) avec un menu interactif, un système de types et de faiblesses/résistances pour gérer des combats tour-par-tour.$html$,
  '{dev}',
  '{C++}',
  '/images/pokemon.png',
  'https://github.com/sophieeanne/projet-C-pokemon.git',
  12
);

-- 13. Projet de traitement d'image
insert into items (kind, page_id, title, description, categories, tech, image_url, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'Projet de traitement d''image',
  $html$Traitement d'images BMP : format et structure d'une image Bitmap, nuance de gris, image en noir et blanc, agrandissement, rétrécissement, rotation, appliquer un filtre.$html$,
  '{dev}',
  '{C#}',
  '/images/traitement-image.bmp',
  13
);

-- 14. Plateforme en ligne d'apprentissage artistique
insert into items (kind, page_id, title, description, categories, tech, image_url, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'Projet Plateforme en ligne d’apprentissage artistique (en cours)',
  $html$Développement full-stack (Node and React) d’une plateforme de cours en ligne avec streaming, abonnements et gamification.$html$,
  '{dev}',
  '{Node,React,JavaScript,PostgreSQL}',
  '/images/soul-art.png',
  14
);

-- 15. Memory Trouble — C & DevSecOps
insert into items (kind, page_id, title, description, categories, tech, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'Memory Trouble — C & DevSecOps',
  $html$Projet autour de l'amélioration de la qualité d'un projet C et de la mise en place d'une chaîne CI/CD avec GitLab.<br><br>Le projet utilise notamment l'analyse statique, les tests, Valgrind, SonarQube, la couverture de code et les Quality Gates.$html$,
  '{cybersec,dev,cloud}',
  '{C,"GitLab CI/CD",GCC,Cppcheck,Clang-Tidy,Valgrind,SonarQube}',
  15
);

-- 16. API de recommandation musicale — Performance
insert into items (kind, page_id, title, description, categories, tech, repo_url, position)
values (
  'project', (select id from pages where slug = 'projets'),
  'API de recommandation musicale — Performance',
  $html$Projet d'optimisation d'une API de recommandation musicale basée sur un dataset de plus de 32 000 titres Spotify.<br><br>Le projet étudie notamment l'utilisation de C++, MongoDB, Redis, du multithreading et de NGINX afin d'améliorer les performances et la capacité à gérer une forte charge.$html$,
  '{dev,cloud}',
  '{Python,FastAPI,C++,MongoDB,Redis,NGINX}',
  'https://github.com/sophieeanne/spotify-project.git',
  16
);

-- =========================================================
--  ITEMS — ACTIVITÉS (page À côté)
-- =========================================================

-- 1. Musique
insert into items (kind, page_id, title, subtitle, categories, tech, modal_title, modal_subtitle, modal_content, position)
values (
  'activity', (select id from pages where slug = 'a-cote'),
  'Musique', 'Piano – Chant – MAO', '{}',
  '{Piano,Chant,MAO,Synthé}',
  'Musique', 'Piano – Chant – MAO',
  $html$<p>La musique m’accompagne depuis l’enfance. J’ai commencé par le piano en prenant des cours.</p>
<h3>Piano</h3>
<ul>
  <li><b>École de musique (2011-2019)</b> : piano et solfège, jusqu’au niveau 2C3.</li>
  <li><b>Conservatoire d’Avignon (2019-2022)</b> :
    <ul>
      <li>Piano : de 1C4 à 2C3</li>
      <li>Solfège : de 2C2 à 2C4, avec obtention du Certificat d’Études Musicales (CEM)</li>
    </ul>
  </li>
</ul>
<h3>Concours et représentations</h3>
<p>J’ai participé au Grand Concours Musical de Piano à Pernes-les-Fontaines :</p>
<ul>
  <li>2013 : Médaille d’or à l’unanimité</li>
  <li>2014 : Médaille d’or à l’unanimité</li>
  <li>2015 : Médaille d’argent</li>
  <li>2017 : Médaille d’or à l’unanimité</li>
  <li>2018 : Médaille d’or à l’unanimité en quatre mains &amp; Médaille de bronze en piano seul</li>
</ul>
<p>J’ai également participé régulièrement à différentes prestations : auditions de piano, représentations en église, interventions en EHPAD, masterclass, concerts collectifs et prestations en quatre mains.</p>
<h3>Style de musique</h3>
<p>J’ai une grande préférence pour le style romantique, mais j’ai également eu l’occasion de pratiquer des morceaux variés de différents compositeurs célèbres, comme Bach, Mendelssohn, Chopin, Scarlatti ou encore Debussy.</p>
<h3>Autres pratiques musicales</h3>
<p>J’ai également élargi ma pratique de la musique en apprenant certaines choses en autodidacte.<br><br>Je me suis mise au chant en 2019. Je chante principalement de la pop, mais aussi quelques chansons françaises ou du rock. J’ai notamment eu l’occasion de chanter lors d’événements, comme des mariages, et j’aime chanter régulièrement dans des karaokés, privés ou ouverts au public, lorsque j’en ai l’occasion.<br><br>Avec le chant est naturellement venu l’apprentissage des accords de base à la guitare, afin de pouvoir m’accompagner, mais surtout la découverte de la musique assistée par ordinateur (MAO) en 2020 pour pouvoir m’enregistrer.<br><br>J’ai d’abord commencé avec Ableton, puis j’ai migré vers N-Track Studio. J’ai notamment expérimenté la superposition des voix et des sons, l’ajustement des filtres, l’amélioration du son et les enregistrements MIDI.<br><br>J’ai également commencé le synthétiseur en 2024, qui me permet davantage de créer et de manipuler mes propres sons.</p>
<h3>Aujourd’hui</h3>
<p>Aujourd’hui, même si mon rythme de pratique est beaucoup moins dense qu’avant le début de mes études, la musique continue de faire partie de mon quotidien, parfois de manière occasionnelle et sous différentes formes : MAO, karaokés, grandes occasions ou simplement entretien des morceaux que j’ai appris au piano.</p>$html$,
  1
);

-- 2. Art
insert into items (kind, page_id, title, subtitle, categories, tech, modal_title, modal_subtitle, modal_content, gallery, position)
values (
  'activity', (select id from pages where slug = 'a-cote'),
  'Art', 'Peinture – dessin', '{}',
  '{Peinture,Dessin,Leonart}',
  'Art', 'Peinture – dessin',
  $html$<p>J’ai pratiqué différentes activités artistiques de manière assez régulière avant 2022, puis de façon plus occasionnelle depuis.<br><br>J’ai également été membre de l’association étudiante Leonart pendant l’année universitaire 2025-2026.</p>
<h3>Galerie</h3>$html$,
  '[{"url":"/images/mer.png","alt":"Mer"},{"url":"/images/paysage.png","alt":"Paysage"},{"url":"/images/Michel Ange.png","alt":"Michel Ange"}]',
  2
);

-- 3. Karaté & self-défense
insert into items (kind, page_id, title, subtitle, categories, tech, modal_title, modal_subtitle, modal_content, position)
values (
  'activity', (select id from pages where slug = 'a-cote'),
  'Karaté & self-défense', 'Sport', '{}',
  '{Karaté,Self-défense}',
  'Karaté & self-défense', 'Sport',
  $html$<p>J’ai commencé le karaté en septembre 2026. Il s’agit d’une activité que je découvre actuellement, et je suis pour le moment ceinture blanche.<br><br>J’ai également commencé la self-défense, qui comprend notamment des exercices basés sur l’improvisation et la mise en situation.<br><br>Dans le cadre du club, je pratique actuellement deux fois par semaine.</p>$html$,
  3
);

-- 4. Cuisine
insert into items (kind, page_id, title, subtitle, categories, tech, modal_title, modal_subtitle, modal_content, gallery, position)
values (
  'activity', (select id from pages where slug = 'a-cote'),
  'Cuisine', 'Cuisine – découverte', '{}',
  '{Recettes,Expérimentation}',
  'Cuisine', 'Cuisine – découverte',
  $html$<p>J’ai commencé à cuisiner en juin 2026.<br><br>Je pratique régulièrement et j’aime notamment découvrir de nouvelles recettes et expérimenter différents plats.</p>
<h3>Galerie</h3>$html$,
  '[{"url":"/images/brioche.png","alt":"Brioche"},{"url":"/images/oeuf.png","alt":"Oeuf"},{"url":"/images/spritz.png","alt":"Spritz"}]',
  4
);

-- 5. Voyage
insert into items (kind, page_id, title, subtitle, categories, tech, modal_title, modal_subtitle, modal_content, position)
values (
  'activity', (select id from pages where slug = 'a-cote'),
  'Voyage', 'Découverte de nouvelles cultures', '{}',
  '{Europe,Cultures}',
  'Voyage', 'Découverte de nouvelles cultures',
  $html$<p>J’aime découvrir de nouveaux pays et de nouvelles cultures, pour l’instant sur le continent européen, notamment à travers mes voyages en Angleterre, dans les pays scandinaves et dans les pays baltes.</p>$html$,
  5
);
