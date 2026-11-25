import { revealHeading, revealItems } from '../animations/reveal.js';
import { site } from '../data/site.js';

export function initAbout({ scroll, reduced }) {
  // facts (monospace list) + bio
  document.getElementById('facts').innerHTML = site.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  document.getElementById('bio').innerHTML = site.bio.map((p) => `<p>${p}</p>`).join('');

  revealHeading(document.getElementById('ab-h'), { reduced });
  revealItems(document.getElementById('facts'), document.querySelectorAll('#facts div'), { reduced });
  revealItems(document.getElementById('bio'), document.querySelectorAll('#bio p'), { reduced, delay: 140 });
  revealItems(document.querySelector('.ab .big'), [document.querySelector('.ab .big')], { reduced });

  // contact
  revealHeading(document.getElementById('ct-h'), { reduced });
  const wire = (id, href, placeholder) => {
    const a = document.getElementById(id);
    if (href) {
      a.href = href;
      a.rel = 'noopener';
      if (!href.startsWith('mailto')) a.target = '_blank';
    } else {
      a.classList.add('off');
      a.removeAttribute('href');
      a.setAttribute('aria-disabled', 'true');
      a.title = 'Add this in src/data/site.js';
      a.textContent = placeholder;
    }
  };
  wire('mail', site.email && 'mailto:' + site.email, 'Email: add in site.js');
  wire('gh', site.github, 'GitHub: add in site.js');
  wire('soc', site.social, 'Social: add in site.js');
  document.getElementById('yr').textContent = `© ${new Date().getFullYear()} ${site.name}`;
  document.getElementById('up').addEventListener('click', () => scroll.scrollTo(0));
}
