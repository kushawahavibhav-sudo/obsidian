import { useEffect, useState } from 'react';
import {
  studio,
  hero,
  capabilities,
  tickerClients,
  provenanceTicker,
} from '../lib/content';
import { images } from '../lib/manifest';
import { Counter, Reveal, Ticker } from './ui';

function HeroFigure() {
  const asset = images[hero.figure];
  return (
    <figure className="hero__figure">
      <img
        src={asset.src}
        srcSet={asset.srcSet}
        sizes="(min-width: 760px) 42vw, 100vw"
        width={asset.width}
        height={asset.height}
        alt="Courtyard of a lime-plastered coastal house, filtered daylight through a deep verandah"
        fetchPriority="high"
        decoding="async"
      />
      <figcaption>
        <span>{hero.caption}</span>
        <span>{asset.credit}</span>
      </figcaption>
    </figure>
  );
}

export function Nav({ onBrief }: { onBrief: () => void }) {
  const links = [
    ['01', 'Work', '#work'],
    ['02', 'Practice', '#practice'],
    ['03', 'Footprint', '#footprint'],
    ['04', 'Estimate', '#estimate'],
  ];
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const ids = links.map(([, , href]) => href.replace('#', ''));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="nav">
      <a href="#top" className="nav__mark" aria-label={`${studio.name} — home`}>
        Obsidian <span>Atelier</span>
      </a>

      <nav className="nav__links" aria-label="Primary">
        {links.map(([n, label, href]) => (
          <a
            key={href}
            href={href}
            aria-current={active === href ? 'true' : undefined}
          >
            <span aria-hidden="true" style={{ opacity: 0.4, marginRight: '0.4rem' }}>
              {n}
            </span>
            {label}
          </a>
        ))}
      </nav>

      <div className="nav__right">
        <span className="status">7 sites live</span>
        <button type="button" className="btn btn--sm" onClick={onBrief}>
          Start a brief
        </button>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <>
      <section className="hero shell" id="top">
        <div className="hero__kicker">
          <span className="chip">{hero.kicker}</span>
          <span className="chip">Monsoon watch: active</span>
          <span className="chip">Mumbai · Goa · Bengaluru</span>
        </div>

        <div className="hero__grid">
          <div>
            <h1 className="display h-hero hero__title">
              {hero.lines.map((line, i) => (
                <span className="line" key={i}>
                  <span>
                    {i === hero.accentIndex ? <em>{line}</em> : line}
                  </span>
                </span>
              ))}
            </h1>

            <div className="hero__body">
              <p className="lede">{hero.lede}</p>

              <div className="hero__meta">
                {hero.metrics.map((m) => (
                  <div className="stat" key={m.label}>
                    <span className="stat__n">
                      {m.value === '0' ? (
                        '0'
                      ) : (
                        <Counter to={parseFloat(m.value)} decimals={m.value.includes('.') ? 1 : 0} />
                      )}
                      {m.suffix && <em> {m.suffix}</em>}
                    </span>
                    <span className="stat__l">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <HeroFigure />
        </div>
      </section>

      <div style={{ paddingTop: 'clamp(3rem, 6vw, 5rem)' }} />

      <Ticker
        items={provenanceTicker.map((p) => (
          <span key={p.k}>
            <strong>{p.k}</strong> — {p.v}
          </span>
        ))}
      />
    </>
  );
}

export function ClientWall() {
  return (
    <section className="section" style={{ paddingBlock: 'clamp(2.6rem, 5vw, 4rem)' }}>
      <div className="shell" style={{ marginBottom: '1.6rem' }}>
        <div className="eyebrow">Trusted by 31 repeat clients across three states</div>
      </div>
      <Ticker
        items={tickerClients.map((c) => <span key={c}>{c}</span>)}
        reverse
      />
    </section>
  );
}

export function Capabilities() {
  const [open, setOpen] = useState<string | null>('01');
  return (
    <section className="section is-light" id="practice">
      <div className="shell">
        <div className="eyebrow" style={{ marginBottom: '2rem' }}>
          02 / Practice
        </div>

        <div
          style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'minmax(0,1fr)',
            marginBottom: '2.8rem',
          }}
        >
          <h2 className="display h-xl">
            Four things we do, <em>properly.</em>
          </h2>
          <p className="lede">
            We don't take on anything outside these. Everything below is delivered in-house by the
            same 41 people — no subcontracted detailing, no handover gaps between the desk and the
            site.
          </p>
        </div>

        <div className="caps">
          {capabilities.map((c, i) => {
            const isOpen = open === c.n;
            return (
              <Reveal
                key={c.n}
                as="article"
                className="cap"
                delay={i * 70}
                data-open={isOpen ? 'true' : 'false'}
                onClick={() => setOpen(isOpen ? null : c.n)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpen(isOpen ? null : c.n);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="cap__idx">{c.n}</div>
                <div>
                  <div className="cap__head">
                    <h3 className="cap__title">{c.title}</h3>
                    <span className="cap__toggle" aria-hidden="true">
                      +
                    </span>
                  </div>
                  <div className="cap__panel">
                    <div>
                      <p>{c.blurb}</p>
                      <ul className="cap__list">
                        {c.deliverables.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { studio };
