import { useEffect, useRef, useState } from 'react';
import { Nav, Hero, ClientWall, Capabilities } from './components/sections-top';
import { Work, Footprint, Estimator, Closer } from './components/sections-bottom';
import { studio, waLink } from './lib/content';
import { WhatsAppIcon } from './components/ui';

/* ------------------------------------------------------------
   Brief modal — builds a real, pre-filled WhatsApp message
------------------------------------------------------------ */
function BriefModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [kind, setKind] = useState('Residential');
  const [area, setArea] = useState('');
  const [when, setWhen] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const message = [
    `Brief — ${kind} in ${city}`,
    name && `Name: ${name}`,
    area && `Area: ${area} sq ft`,
    when && `Target start: ${when}`,
    note && `\n${note}`,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="brief-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal__box" style={{ position: 'relative' }}>
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close brief form"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="mono" style={{ marginBottom: '0.8rem' }}>
          Goes straight to a principal
        </div>
        <h3 id="brief-title">Tell us the site.</h3>
        <p>
          Four fields. We reply within 4 working days with a site visit slot — not a brochure.
        </p>

        <label className="mono" htmlFor="b-name">Your name</label>
        <input
          id="b-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Aparna Kher"
          autoComplete="name"
        />

        <label className="mono" htmlFor="b-kind">Project type</label>
        <select id="b-kind" value={kind} onChange={(e) => setKind(e.target.value)}>
          <option>Residential</option>
          <option>Hospitality</option>
          <option>Workplace</option>
          <option>Retail / F&amp;B</option>
          <option>Adaptive reuse</option>
        </select>

        <label className="mono" htmlFor="b-city">Location</label>
        <select id="b-city" value={city} onChange={(e) => setCity(e.target.value)}>
          <option>Mumbai</option>
          <option>Alibaug</option>
          <option>Goa</option>
          <option>Bengaluru</option>
          <option>Chikmagalur</option>
          <option>Elsewhere in India</option>
        </select>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="mono" htmlFor="b-area">Area (sq ft)</label>
            <input
              id="b-area"
              value={area}
              onChange={(e) => setArea(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="2400"
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="mono" htmlFor="b-when">Target start</label>
            <input
              id="b-when"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              placeholder="Nov 2025"
            />
          </div>
        </div>

        <label className="mono" htmlFor="b-note">Anything we should know</label>
        <textarea
          id="b-note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Sloping plot, existing laterite wall we'd like to keep…"
        />

        <div className="modal__actions">
          <a
            className="btn"
            href={waLink(message)}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
          >
            <WhatsAppIcon /> Send via WhatsApp
          </a>
          <a className="btn btn--ghost" href={`tel:${studio.phoneHref}`}>
            Call instead
          </a>
        </div>
        <p className="mono" style={{ marginTop: '1rem', marginBottom: 0 }}>
          Or email {studio.email}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   App
------------------------------------------------------------ */
export default function App() {
  const [brief, setBrief] = useState(false);
  const open = () => setBrief(true);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        el.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
      });
    };

    onScroll();
    if (reduced) return () => window.removeEventListener('scroll', onScroll);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="grain" aria-hidden="true" />

      <div className="progress" aria-hidden="true" ref={progressRef} />

      <a
        href="#work"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          zIndex: 500,
        }}
      >
        Skip to work
      </a>

      <Nav onBrief={open} />

      <main>
        <Hero />
        <ClientWall />
        <Capabilities />
        <Work />
        <Footprint />
        <Estimator />
        <Closer onBrief={open} />
      </main>

      <a
        className="wa"
        href={waLink(
          'Hello Obsidian Atelier — I found you online and would like to talk about a project.',
        )}
        target="_blank"
        rel="noreferrer"
        aria-label="Message the studio on WhatsApp"
      >
        <WhatsAppIcon />
        <span style={{ display: 'none' }} className="wa-label">
          WhatsApp
        </span>
      </a>

      {brief && <BriefModal onClose={() => setBrief(false)} />}
    </>
  );
}
