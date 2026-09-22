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
