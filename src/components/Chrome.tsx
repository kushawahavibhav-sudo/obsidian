import { useEffect, useState } from 'react';
import { studio } from '../lib/site';

const CURRENT_YEAR = new Date().getFullYear();

const nav = [
  { n: '01', label: 'Work', href: '#work' },
  { n: '02', label: 'Studio', href: '#studio' },
  { n: '03', label: 'Services', href: '#services' },
  { n: '04', label: 'Footprint', href: '#footprint' },
  { n: '05', label: 'Enquire', href: '#enquire' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300"
      style={{
        background: scrolled ? 'color-mix(in srgb, var(--canvas) 92%, transparent)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 var(--rule)' : '0 1px 0 transparent',
        transform: 'translateZ(0)',
      }}
    >
      <div className="shell flex items-center justify-between" style={{ height: 'var(--header-h)' }}>
        <a href="#top" className="flex items-baseline gap-2.5" aria-label="Obsidian — home">
          <span className="display text-[1.35rem] tracking-[-0.02em]">Obsidian</span>
          <span className="mono hidden text-[0.6rem] text-ink-muted sm:inline">
            Est. 2009
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex items-baseline gap-1.5 text-[0.82rem] text-ink-soft transition-colors hover:text-ink"
            >
              <span className="mono text-[0.6rem] text-ink-muted transition-colors group-hover:text-accent">
                {item.n}
              </span>
              <span className="link-line">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={`mailto:${studio.email}`} className="btn btn--accent hidden text-[0.78rem] md:inline-flex">
            Start a project
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className="absolute left-0 block h-px w-full bg-ink transition-transform duration-300"
                style={{ top: 0, transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }}
              />
              <span
                className="absolute left-0 block h-px w-full bg-ink transition-opacity duration-200"
                style={{ top: 6, opacity: open ? 0 : 1 }}
              />
              <span
                className="absolute left-0 block h-px w-full bg-ink transition-transform duration-300"
                style={{ top: 12, transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className="overflow-hidden border-t border-[var(--rule)] lg:hidden"
        style={{
          maxHeight: open ? '80vh' : 0,
          transition: 'max-height 0.5s var(--ease-in-out-quart)',
          background: 'var(--canvas)',
        }}
      >
        <nav aria-label="Mobile" className="shell flex flex-col py-2">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-3 border-b border-[var(--rule)] py-4 last:border-0"
            >
              <span className="mono text-[0.62rem] text-ink-muted">{item.n}</span>
              <span className="display text-[1.6rem]">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer style={{ background: 'var(--color-charcoal-deep)', color: 'var(--ink-inverse)' }}>
      <div className="shell py-14 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="display text-[clamp(1.6rem,4vw,2.4rem)] leading-[1.05]">
              Architecture that
              <br />
              <em className="not-italic" style={{ color: 'var(--accent)' }}>
                outlives the brief.
              </em>
            </p>
            <a
              href={`mailto:${studio.email}`}
              className="mt-5 inline-block text-[0.95rem]"
              style={{ color: 'var(--accent)' }}
            >
              {studio.email}
            </a>
          </div>

          <div>
            <p className="mono mb-4" style={{ color: 'rgba(243,240,233,0.45)' }}>
              Studios
            </p>
            <ul className="space-y-4 text-[0.85rem]" style={{ color: 'rgba(243,240,233,0.78)' }}>
              {studio.locations.map((o) => (
                <li key={o.city}>
                  <span className="block" style={{ color: 'var(--ink-inverse)' }}>
                    {o.city}
                  </span>
                  <span className="block text-[0.8rem]" style={{ color: 'rgba(243,240,233,0.55)' }}>
                    {o.address}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mono mb-4" style={{ color: 'rgba(243,240,233,0.45)' }}>
              Elsewhere
            </p>
            <ul className="space-y-2.5 text-[0.85rem]">
              {['Instagram', 'Journal', 'Careers', 'Press kit'].map((l) => (
                <li key={l}>
                  <a href="#top" className="link-line" style={{ color: 'rgba(243,240,233,0.78)' }}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-14 flex flex-col gap-3 border-t pt-6 text-[0.72rem] sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: 'rgba(243,240,233,0.14)', color: 'rgba(243,240,233,0.45)' }}
        >
          <span className="mono">© {CURRENT_YEAR} Obsidian Design LLP</span>
          <span className="mono">Mumbai · Bengaluru — 19.0760° N, 72.8777° E</span>
        </div>
      </div>
    </footer>
  );
}
