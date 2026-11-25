// Split an element's text into masked words: <span.w><span.wi>word</span></span>
// Keeps <br> and wrapper elements (e.g. an outlined span) intact.
export function splitWords(el) {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const words = child.textContent.split(/\s+/).filter(Boolean);
        if (!words.length) return;
        const frag = document.createDocumentFragment();
        words.forEach((w, i) => {
          const mask = document.createElement('span');
          mask.className = 'w';
          const inner = document.createElement('span');
          inner.className = 'wi';
          inner.textContent = w;
          mask.appendChild(inner);
          frag.appendChild(mask);
          if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(el);
  return [...el.querySelectorAll('.wi')];
}
