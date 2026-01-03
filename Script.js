const filter = document.getElementById('filter');
const projects = document.querySelectorAll('.project');

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


