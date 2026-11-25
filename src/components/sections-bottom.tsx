import { useEffect, useMemo, useState } from 'react';
import {
  cases,
  hubs,
  scopeOptions,
  typologyOptions,
  finishedOptions,
  processSteps,
  studio,
  inr,
  waLink,
} from '../lib/content';
import { images } from '../lib/manifest';
import { Reveal, PinIcon, Ticker, ArrowIcon, Magnetic, WhatsAppIcon } from './ui';

const CURRENT_YEAR = new Date().getFullYear();

/* ============================================================
   03 / WORK — proof, not portfolio theatre
   ============================================================ */
export function Work() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const activeCase = openIdx !== null ? cases[openIdx] : null;

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIdx(null);
      if (e.key === 'ArrowRight') setOpenIdx((prev) => (prev === null ? null : (prev + 1) % cases.length));
      if (e.key === 'ArrowLeft') setOpenIdx((prev) => (prev === null ? null : (prev - 1 + cases.length) % cases.length));
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIdx]);

  return (
    <section className="section" id="work">
      <div className="shell">
        <div className="eyebrow" style={{ marginBottom: '2rem' }}>
          03 / Selected work — 4 of 142
        </div>

        <div className="work">
          {cases.map((c, i) => {
            const asset = images[c.img];
            const flip = i % 2 === 1;
            return (
              <Reveal
                key={c.title}
                as="article"
                className={`case${flip ? ' case--flip' : ''}`}
                delay={40}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(i)}
                  className="case__media"
                  aria-label={`Inspect ${c.title} case study`}
                  style={{ padding: 0, textAlign: 'left', cursor: 'pointer', display: 'block', width: '100%' }}
                >
                  <img
                    src={asset.src}
                    srcSet={asset.srcSet}
                    sizes="(min-width: 760px) 52vw, 100vw"
                    width={asset.width}
                    height={asset.height}
                    alt={c.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="case__badge">
                    {c.badge} · {c.year}
                  </span>
                </button>

                <div>
                  <h3 className="case__title">{c.title}</h3>
                  <div className="case__loc">
                    <PinIcon /> {c.location}
                  </div>

                  <p className="case__desc">
                    <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>The problem. </strong>
                    {c.challenge}
                  </p>
                  <p className="case__desc">
                    <strong style={{ color: 'var(--gold)', fontWeight: 500 }}>What we did. </strong>
                    {c.move}
                  </p>

                  <div className="case__metrics">
                    {c.metrics.map((m) => (
                      <div key={m.l}>
                        <strong>{m.v}</strong>
                        <span>{m.l}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    style={{ marginTop: '1.25rem' }}
                    onClick={() => setOpenIdx(i)}
                  >
                    Inspect dossier <ArrowIcon />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {activeCase && openIdx !== null && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-modal-title"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpenIdx(null);
          }}
        >
          <div className="modal__box" style={{ maxWidth: '760px', position: 'relative' }}>
            <button
              type="button"
              className="modal__close"
              onClick={() => setOpenIdx(null)}
              aria-label="Close project dossier"
              style={{ color: 'var(--ink)', borderColor: 'var(--linen-line)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="mono" style={{ marginBottom: '0.5rem', color: 'var(--gold-dim)' }}>
              0{openIdx + 1} / 0{cases.length} · {activeCase.badge} · {activeCase.year}
            </div>
            <h3 id="case-modal-title">{activeCase.title}</h3>
            <p style={{ marginBottom: '1rem' }}>{activeCase.location}</p>

            <div style={{ overflow: 'hidden', border: '1px solid var(--linen-line)', aspectRatio: '16 / 10', marginBottom: '1.25rem' }}>
              <img
                src={images[activeCase.img].src}
                srcSet={images[activeCase.img].srcSet}
                sizes="(min-width: 760px) 700px, 94vw"
                alt={activeCase.alt}
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '1.25rem' }}>
              <div>
                <div className="mono" style={{ marginBottom: '0.35rem', color: 'var(--ink)' }}>The problem</div>
                <p style={{ margin: 0 }}>{activeCase.challenge}</p>
              </div>
              <div>
                <div className="mono" style={{ marginBottom: '0.35rem', color: 'var(--gold-dim)' }}>What we did</div>
                <p style={{ margin: 0 }}>{activeCase.move}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', borderTop: '1px solid var(--linen-line)', borderBottom: '1px solid var(--linen-line)', padding: '0.9rem 0', marginBottom: '1.25rem' }}>
              {activeCase.metrics.map((m) => (
                <div key={m.l}>
                  <strong style={{ display: 'block', fontSize: '1.15rem', fontWeight: 500 }}>{m.v}</strong>
                  <span className="mono">{m.l}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  style={{ borderColor: 'var(--linen-line)', color: 'var(--ink)' }}
                  onClick={() => setOpenIdx((openIdx - 1 + cases.length) % cases.length)}
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  style={{ borderColor: 'var(--linen-line)', color: 'var(--ink)' }}
                  onClick={() => setOpenIdx((openIdx + 1) % cases.length)}
                >
                  Next →
                </button>
              </div>
              <a
                className="btn btn--sm"
                href={waLink(`Hello Obsidian — I'd like to discuss a project similar to ${activeCase.title} (${activeCase.location}).`)}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon /> Discuss similar brief
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   04 / FOOTPRINT — interactive hub map
   ============================================================ */
export function Footprint() {
  const [active, setActive] = useState(hubs[0].city);
  const hub = hubs.find((h) => h.city === active) ?? hubs[0];

  const totalProjects = hubs.reduce((a, h) => a + h.projects, 0);
  const totalActive = hubs.reduce((a, h) => a + h.active, 0);

  return (
    <section className="section is-light" id="footprint">
      <div className="shell">
        <div className="eyebrow" style={{ marginBottom: '2rem' }}>
          04 / Footprint — 3 offices, 5 operational clusters
        </div>

        <div
          style={{
            display: 'grid',
            gap: 'clamp(2rem, 4vw, 3rem)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            alignItems: 'start',
          }}
        >
          <div>
            <h2 className="display h-xl" style={{ marginBottom: '1.2rem' }}>
              {totalProjects} projects. <em>{totalActive} live.</em>
            </h2>
            <p className="lede" style={{ marginBottom: '1.8rem' }}>
              Every project sits within 6 hours of one of our three offices. That's not a marketing
              constraint — it's how we guarantee a supervisor on site every week for the full build.
            </p>

            <div className="map" role="img" aria-label="Map of project clusters across western India">
              {hubs.map((h) => (
                <button
                  key={h.city}
                  type="button"
                  className="map__dot"
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  data-active={h.city === active ? 'true' : 'false'}
                  onClick={() => setActive(h.city)}
                  aria-pressed={h.city === active}
                >
                  <i aria-hidden="true" />
                  <span>{h.city}</span>
                </button>
              ))}
            </div>
            <p className="mono" style={{ marginTop: '0.9rem', textAlign: 'center' }}>
              Western India · 15.8°N – 19.1°N
            </p>
          </div>

          <div>
            <div className="hubcard">
              <div className="mono">{hub.lead}</div>
              <h3 className="hubcard__fig">{hub.city}</h3>
              <p className="small" style={{ marginBottom: '1rem' }}>
                {hub.note}
              </p>

              <div className="hubcard__row">
                <span>Projects delivered</span>
                <span>{hub.projects}</span>
              </div>
              <div className="hubcard__row">
                <span>Drawn to date</span>
                <span>{hub.drawn}</span>
              </div>
              <div className="hubcard__row">
                <span>Active builds</span>
                <span style={{ color: hub.active > 0 ? 'var(--signal)' : undefined }}>
                  {hub.active > 0 ? `${hub.active} live` : 'Idle'}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '1.4rem', display: 'grid', gap: '0.85rem' }}>
              {processSteps.map((s) => (
                <div
                  key={s.n}
                  style={{
                    display: 'flex',
                    gap: '0.9rem',
                    borderTop: '1px solid var(--line)',
                    paddingTop: '0.85rem',
                  }}
                >
                  <span className="mono" style={{ color: 'var(--gold-dim)', flex: '0 0 auto' }}>
                    {s.n}
                  </span>
                  <div>
                    <strong style={{ fontSize: '14px', fontWeight: 500 }}>
                      {s.title}{' '}
                      <span className="mono" style={{ letterSpacing: '0.1em' }}>
                        wk {s.weeks}
                      </span>
                    </strong>
                    <p className="small" style={{ margin: '0.2rem 0 0' }}>
                      {s.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'clamp(3rem, 6vw, 5rem)' }}>
        <Ticker
          items={hubs.map((h) => (
            <span key={h.city}>
              <strong>{h.city}</strong> — {h.projects} projects · {h.drawn}
            </span>
          ))}
          fast
        />
      </div>
    </section>
  );
}

/* ============================================================
   ESTIMATOR — real arithmetic, no fake sliders
   ============================================================ */
export function Estimator() {
  const [typology, setTypology] = useState(typologyOptions[0].id);
  const [scope, setScope] = useState(scopeOptions[2].id);
  const [finish, setFinish] = useState(finishedOptions[1].id);
  const [area, setArea] = useState(2400);
  const [copied, setCopied] = useState(false);

  const calc = useMemo(() => {
    const t = typologyOptions.find((x) => x.id === typology)!;
    const s = scopeOptions.find((x) => x.id === scope)!;
    const f = finishedOptions.find((x) => x.id === finish)!;

    const construction = area * t.rate * f.mult * t.factor;
    const fee = area * t.rate * 0.11 * s.mult * t.factor;
    const approxWeeks = Math.round(s.weeks * (area > 5000 ? 1.35 : area > 2500 ? 1.12 : 1));
    const total = construction + fee;

    return {
      total,
      construction,
      fee,
      weeks: approxWeeks,
      perSqft: t.rate * f.mult * t.factor,
      label: `${t.label} · ${s.label} · ${f.label}`,
    };
  }, [typology, scope, finish, area]);

  return (
    <section className="section" id="estimate">
      <div className="shell">
        <div className="eyebrow" style={{ marginBottom: '2rem' }}>
          05 / Honest numbers
        </div>

        <div className="est">
          <div className="est__panel">
            <h2 className="display h-lg" style={{ marginBottom: '0.8rem' }}>
              What it actually costs.
            </h2>
            <p className="small" style={{ marginBottom: '1.8rem', maxWidth: '52ch' }}>
              Based on 142 completed projects and our 2025 rate card. These are real range midpoints
              for Maharashtra and Goa — not aspirational floor numbers designed to start a
              conversation.
            </p>

            <div className="field">
              <div className="field__label">
                <span>Typology</span>
                <b>{typologyOptions.find((t) => t.id === typology)?.label}</b>
              </div>
              <div className="seg">
                {typologyOptions.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    data-on={t.id === typology}
                    onClick={() => setTypology(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <div className="field__label">
                <span>Scope</span>
                <b>{scopeOptions.find((s) => s.id === scope)?.label}</b>
              </div>
              <div className="seg">
                {scopeOptions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    data-on={s.id === scope}
                    onClick={() => setScope(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <div className="field__label">
                <span>Finish level</span>
                <b>{finishedOptions.find((f) => f.id === finish)?.label}</b>
              </div>
              <div className="seg">
                {finishedOptions.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    data-on={f.id === finish}
                    onClick={() => setFinish(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <div className="field__label">
                <span>Built-up area</span>
                <b>{area.toLocaleString('en-IN')} sq ft</b>
              </div>
              <input
                type="range"
                min={600}
                max={12000}
                step={100}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                aria-label="Built-up area in square feet"
              />
              <div
                className="mono"
                style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem' }}
              >
                <span>600</span>
                <span>12,000</span>
              </div>
            </div>
          </div>

          <aside className="est__out" aria-live="polite">
            <div className="mono">Indicative project cost</div>
            <div className="est__figure">
              {inr(calc.total)}
              <small>
                ± 14% · {inr(calc.perSqft)} / sq ft · {calc.label}
              </small>
            </div>

            <div className="est__lines">
              <div>
                <span>Construction</span>
                <span>{inr(calc.construction)}</span>
              </div>
              <div>
                <span>Design fee</span>
                <span>{inr(calc.fee)}</span>
              </div>
              <div>
                <span>Programme</span>
                <span>~{calc.weeks} weeks</span>
              </div>
            </div>

            <p className="small" style={{ margin: 0, fontSize: '12px' }}>
              Excludes land, statutory fees and GST. We'll confirm against your site within 4 working
              days.
            </p>

            <div style={{ display: 'grid', gap: '0.55rem' }}>
              <Magnetic>
                <a
                  className="btn"
                  href={waLink(
                    `Hello Obsidian — I ran the estimator: ${area.toLocaleString('en-IN')} sq ft ${calc.label}, indicative ${inr(calc.total)}. Can we discuss?`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  style={{ width: '100%' }}
                >
                  <WhatsAppIcon /> Send this to the studio
                </a>
              </Magnetic>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                style={{ width: '100%' }}
                onClick={() => {
                  const summary = `Obsidian Estimate — ${area.toLocaleString('en-IN')} sq ft · ${calc.label}\nIndicative total: ${inr(calc.total)} (±14%)\nConstruction: ${inr(calc.construction)} | Design fee: ${inr(calc.fee)} | Programme: ~${calc.weeks} weeks`;
                  navigator.clipboard?.writeText(summary).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1800);
                  });
                }}
              >
                {copied ? 'Copied breakdown ✓' : 'Copy breakdown'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CLOSER — real offices, real people
   ============================================================ */
export function Closer({ onBrief }: { onBrief: () => void }) {
  return (
    <section className="section closer" id="contact">
      <div className="shell">
        <div className="eyebrow" style={{ marginBottom: '2rem', color: 'rgba(244,241,234,0.5)' }}>
          06 / Talk to a person
        </div>

        <div className="closer__grid">
          <div>
            <h2 className="display h-xl" style={{ marginBottom: '1.3rem' }}>
              Three offices. <em>One phone.</em>
            </h2>
            <p className="lede" style={{ color: 'rgba(244,241,234,0.6)', marginBottom: '2rem' }}>
              No account managers, no intake forms routed to a shared inbox. Enquiries go to the
              principal who would actually run your project.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              <button type="button" className="btn" onClick={onBrief}>
                Start a brief <ArrowIcon />
              </button>
              <a className="btn btn--ghost" href={`tel:${studio.phoneHref}`}>
                {studio.phone}
              </a>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1.1rem' }}>
            {studio.locations.map((o) => (
              <Reveal className="office" key={o.city}>
                <div className="mono" style={{ color: 'rgba(244,241,234,0.34)' }}>
                  {o.kind} · {o.people} people · {o.lead}
                </div>
                <h4>{o.city}</h4>
                <p>{o.address}</p>
              </Reveal>
            ))}

            <div
              className="office"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}
            >
              <div className="mono" style={{ color: 'rgba(244,241,234,0.34)' }}>
                Direct
              </div>
              <a href={`mailto:${studio.email}`} style={{ fontSize: '13.5px' }}>
                {studio.email}
              </a>
              <span className="mono" style={{ color: 'rgba(244,241,234,0.34)' }}>
                {studio.registration}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="shell">
        <div className="footer">
          <span>
            © {CURRENT_YEAR} {studio.name} — est. {studio.founded}
          </span>
          <span>Built in Lower Parel · IST</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </section>
  );
}
