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
