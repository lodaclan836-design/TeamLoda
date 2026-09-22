const nav = document.querySelector('nav');
const menu = document.querySelector('.menu');
const toast = document.querySelector('.toast');

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
});

document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

document.querySelectorAll('.soon').forEach(button => {
  button.addEventListener('click', () => {
    toast.textContent = button.dataset.message || 'Coming soon.';
    toast.classList.add('show');
    clearTimeout(window.lodaToast);
    window.lodaToast = setTimeout(() => toast.classList.remove('show'), 2800);
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));

const countUp = element => {
  const target = Number(element.dataset.count);
  const started = performance.now();
  const update = now => {
    const progress = Math.min((now - started) / 1150, 1);
    element.textContent = Math.floor(target * (1 - Math.pow(1 - progress, 3))).toLocaleString() + (progress === 1 ? (element.dataset.suffix || '') : '');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

const statObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.querySelectorAll('[data-count]').forEach(countUp);
    statObserver.unobserve(entry.target);
  }
}), { threshold: 0.45 });
statObserver.observe(document.querySelector('.stats'));
// Optional background movement: subtle contour lines shift with the pointer.
const motionField = document.createElement('div');
motionField.className = 'motion-field';
document.body.prepend(motionField);

const moveBackground = ({ clientX, clientY }) => {
  const shiftX = ((clientX / window.innerWidth) - .5) * 48;
  const shiftY = ((clientY / window.innerHeight) - .5) * 36;
  motionField.style.setProperty('--field-x', `${shiftX}px`);
  motionField.style.setProperty('--field-y', `${shiftY}px`);
};

window.addEventListener('pointermove', moveBackground);
window.addEventListener('pointerdown', moveBackground);

// This prevents ordinary selecting, dragging, and right-clicking on the showcase site.
document.querySelectorAll('img').forEach(image => image.setAttribute('draggable', 'false'));
document.addEventListener('contextmenu', event => event.preventDefault());
