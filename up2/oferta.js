document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.slides');
  const slides = [...track.children];
  const count = carousel.querySelector('.slide-count');
  const current = () => Math.round(track.scrollLeft / track.clientWidth);
  carousel.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    const next = (current() + Number(button.dataset.direction) + slides.length) % slides.length;
    track.scrollTo({left: next * track.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }));
  track.addEventListener('scroll', () => {count.textContent = `${current() + 1} / ${slides.length}`;}, {passive: true});
});
function startTimer(timer) {
  const end = Date.now() + Number(timer.dataset.seconds) * 1000;
  const clock = timer.querySelector('.clock');
  function tick() {
    const remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000));
    clock.textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
    if (!remaining) clearInterval(interval);
  }
  const interval = setInterval(tick, 1000);
  tick();
}

const delayedSections = [...document.querySelectorAll('[data-reveal-after]')];
document.querySelectorAll('.timer').forEach(timer => {
  if (!timer.closest('[data-reveal-after]')) startTimer(timer);
});
function revealDueSections() {
  const elapsed = performance.now() / 1000;
  delayedSections.forEach(section => {
    if (!section.hidden || elapsed < Number(section.dataset.revealAfter)) return;
    section.hidden = false;
    section.querySelectorAll('.timer').forEach(startTimer);
  });
  if (delayedSections.every(section => !section.hidden)) clearInterval(revealInterval);
}
const revealInterval = setInterval(revealDueSections, 250);
document.addEventListener('visibilitychange', revealDueSections);
revealDueSections();
