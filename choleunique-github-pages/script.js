const root = document.documentElement;
const cursor = document.querySelector('.cursor');
const stage = document.querySelector('#mascotStage');
const mascot = document.querySelector('.mascot-wrap');
const pupils = [...document.querySelectorAll('[data-eye]')];
const moodButton = document.querySelector('#moodButton');
const speech = document.querySelector('#speech');
const projectCards = [...document.querySelectorAll('.project-card')];
const workSection = document.querySelector('#work');

let pointerX = innerWidth / 2;
let pointerY = innerHeight / 2;

function updateCursor(x, y) {
  if (!cursor) return;
  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;
}

function updateEyes(x, y) {
  pupils.forEach((pupil) => {
    const box = pupil.getBoundingClientRect();
    const dx = x - (box.left + box.width / 2);
    const dy = y - (box.top + box.height / 2);
    const distance = Math.hypot(dx, dy) || 1;
    const reach = Math.min(9, box.width * 0.2);
    pupil.style.setProperty('--look-x', `${(dx / distance) * reach}px`);
    pupil.style.setProperty('--look-y', `${(dy / distance) * reach}px`);
  });

  if (stage && mascot) {
    const rect = stage.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, (x - rect.left - rect.width / 2) / (rect.width / 2)));
    const ny = Math.max(-1, Math.min(1, (y - rect.top - rect.height / 2) / (rect.height / 2)));
    mascot.style.setProperty('--tilt-x', `${nx * 8}px`);
    mascot.style.setProperty('--tilt-y', `${ny * 5}px`);
  }
}

window.addEventListener('pointermove', (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  updateCursor(pointerX, pointerY);
  updateEyes(pointerX, pointerY);
});

document.querySelectorAll('a, button, .mode-card').forEach((element) => {
  element.addEventListener('mouseenter', () => cursor?.classList.add('is-hovering'));
  element.addEventListener('mouseleave', () => cursor?.classList.remove('is-hovering'));
});

const speeches = [
  '我们负责观察世界，她负责重新排列它。',
  '检测到访客。正在努力假装这是个正经网站。',
  '前方左转：进入一个不太直线的脑回路。',
  '这里没有完成品，只有暂时停止生长的想法。'
];
let mood = 0;
moodButton?.addEventListener('click', () => {
  mood = (mood + 1) % speeches.length;
  document.body.classList.toggle('mood-blue', mood % 2 === 1);
  speech.textContent = speeches[mood];
  speech.animate(
    [{ transform: 'rotate(-2deg) scale(.82)' }, { transform: 'rotate(2deg) scale(1.05)' }, { transform: 'rotate(-2deg) scale(1)' }],
    { duration: 360, easing: 'cubic-bezier(.2,.8,.2,1)' }
  );
});

function updateProjectStack() {
  if (!workSection || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = workSection.getBoundingClientRect();
  const travel = Math.max(1, workSection.offsetHeight - innerHeight);
  const progress = Math.max(0, Math.min(0.999, -rect.top / travel));
  const activeIndex = Math.min(projectCards.length - 1, Math.floor(progress * projectCards.length));
  projectCards.forEach((card, index) => card.classList.toggle('is-past', index < activeIndex));
}

window.addEventListener('scroll', updateProjectStack, { passive: true });
window.addEventListener('resize', () => {
  updateEyes(pointerX, pointerY);
  updateProjectStack();
});

updateEyes(pointerX, pointerY);
updateProjectStack();
