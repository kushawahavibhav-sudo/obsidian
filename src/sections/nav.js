import { site } from '../data/site.js';

export function initNav({ scroll }) {
  const bar = document.getElementById('topbar');
  const links = [...document.querySelectorAll('[data-nav]')];
  const sections = links.map((a) => document.getElementById(a.dataset.nav));

  // smooth anchor navigation
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (a.classList.contains('off')) return e.preventDefault();
      const target = id === '#top' ? 0 : document.querySelector(id);
      if (target === null) return;
      e.preventDefault();
      scroll.scrollTo(target);
    });
  });

  // github + say hi
  const gh = document.getElementById('nav-gh');
  if (site.github) {
    gh.href = site.github;
    gh.target = '_blank';
    gh.rel = 'noopener';
  } else {
    gh.classList.add('off');
    gh.title = 'Add your GitHub URL in src/data/site.js';
    gh.setAttribute('aria-disabled', 'true');
  }
  const hi = document.getElementById('say-hi');
  if (site.email) hi.href = 'mailto:' + site.email;

  // progress bar + active link
  const prog = document.getElementById('prog');
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    let cur = -1;
    sections.forEach((s, i) => {
      if (s.getBoundingClientRect().top < innerHeight * 0.45) cur = i;
    });
    links.forEach((a, i) => a.classList.toggle('on', i === cur));
  };
  scroll.onScroll(update);
  update();

  return { setPaper: (on) => bar.classList.toggle('on-paper', on) };
}
