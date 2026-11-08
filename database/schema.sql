-- =========================================================
--  Portfolio Laura Andriamifidy — Schéma de base de données
--  Cible : PostgreSQL (Supabase)
--  Ordre d'exécution : 1) schema.sql   2) seed.sql
-- =========================================================

-- ---------------------------------------------------------
--  Utilisateurs (compte administrateur unique, pas d'inscription publique)
-- ---------------------------------------------------------
create table if not exists users (
  id            serial primary key,
  email         text not null unique,
  password_hash text not null,
  role          text not null default 'admin',
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------
--  Paramètres du site (clé / valeur)
--  Clés utilisées : brand_line1, brand_line2, status,
--                   footer_text, banner_image, title_suffix
-- ---------------------------------------------------------
create table if not exists site_settings (
  key   text primary key,
  value text
);

-- ---------------------------------------------------------
--  Pages  = rubriques principales affichées dans le menu
--  template : home | projects | text | items
-- ---------------------------------------------------------
create table if not exists pages (
  id          serial primary key,
  slug        text not null unique,
  title       text not null,
  nav_label   text,
  template    text not null default 'text',
  position    integer  not null default 0,
  nav_visible boolean  not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------
--  Sections = rubriques et sous-rubriques d'une page
--  parent_id = null  -> rubrique de premier niveau
--  parent_id = id    -> sous-rubrique
-- ---------------------------------------------------------
create table if not exists sections (
  id         serial primary key,
  page_id    integer not null references pages(id) on delete cascade,
  parent_id  integer references sections(id) on delete cascade,
  title      text,
  subtitle   text,
  content    text,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
--  Catégories utilisées par le filtre de la page Projets
-- ---------------------------------------------------------
create table if not exists categories (
  id       serial primary key,
  code     text not null unique,
  label    text not null,
  position integer not null default 0
);

-- ---------------------------------------------------------
--  Éléments = projets (kind = 'project') et activités (kind = 'activity')
--  categories : codes de catégories (ex : {dev,cybersec})
--  tech       : badges de technologies (ex : {Rust,Axum})
--  gallery    : [{ "url": "...", "alt": "..." }]
-- ---------------------------------------------------------
create table if not exists items (
  id             serial primary key,
  kind           text not null default 'project',          -- project | activity
  page_id        integer references pages(id) on delete set null,
  section_id     integer references sections(id) on delete set null,
  title          text not null,
  subtitle       text,
  description    text,
  categories     text[]  not null default '{}',
  tech           text[]  not null default '{}',
  image_url      text,
  repo_url       text,
  demo_url       text,
  modal_title    text,
  modal_subtitle text,
  modal_content  text,
  gallery        jsonb   not null default '[]'::jsonb,
  position       integer not null default 0,
  published      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------
--  Index
-- ---------------------------------------------------------
create index if not exists idx_sections_page    on sections (page_id, position);
create index if not exists idx_sections_parent  on sections (parent_id);
create index if not exists idx_items_kind       on items (kind, position);
create index if not exists idx_items_page       on items (page_id);
