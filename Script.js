const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const filter = document.getElementById('filter');
const projects = document.querySelectorAll('.project');

if (filter && projects.length > 0) {
  filter.addEventListener('change', () => {
    const value = filter.value;
    projects.forEach(project => {
      if (value === 'all' || project.classList.contains(value)) {
        project.style.display = 'block';
      } else {
        project.style.display = 'none';
      }
    });
  });
}

/* ==========================
   GESTION DES MODALS
   (utilisé par la page "À côté")
   ========================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay.open').forEach(modal => {
    modal.classList.remove('open');
  });
  document.body.style.overflow = '';
}

// Boutons d'ouverture
document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    openModal(btn.getAttribute('data-modal'));
  });
});

// Boutons de fermeture
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(btn.getAttribute('data-close'));
  });
});

// Clic en dehors de la modal (sur l'overlay) => ferme
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

// Touche Échap => ferme la modal ouverte
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    closeAllModals();
  }
});


/* =========================================================
   BANNIÈRE FIXE : NOUVEAU PORTFOLIO SUR VERCEL
   ========================================================= */
function initMigrationBanner() {
  if (document.getElementById('migration-top-bar')) return;

  const bar = document.createElement('div');
  bar.id = 'migration-top-bar';
  bar.className = 'migration-top-bar';
  bar.innerHTML = `
    <div class="migration-top-bar-content">
      <div class="migration-top-bar-text">
        <span class="migration-top-bar-badge">✨ Nouveau</span>
        <span>Nouvelle version de mon portfolio</span>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <a href="https://portfolio-laura.andriamifidy.fr/" class="migration-top-bar-btn" target="_blank" rel="noopener noreferrer">
          Découvrir sur Vercel &rarr;
        </a>
        <button class="migration-top-bar-close" title="Fermer la bannière" aria-label="Fermer">&times;</button>
      </div>
    </div>
  `;

  document.body.prepend(bar);
  document.body.classList.add('has-migration-bar');

  const closeBtn = bar.querySelector('.migration-top-bar-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      bar.remove();
      document.body.classList.remove('has-migration-bar');
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMigrationBanner);
} else {
  initMigrationBanner();
}
