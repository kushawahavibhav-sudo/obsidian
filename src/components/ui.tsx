import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type HTMLAttributes,
} from 'react';

/* ------------------------------------------------------------
   Reveal — IntersectionObserver stagger
------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'figure';
  className?: string;
} & HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error polymorphic ref
      ref={ref}
      data-in={seen ? 'true' : 'false'}
      className={`rv ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------
   Counter — rolls up on enter
------------------------------------------------------------ */
export function Counter({
  to,
  decimals = 0,
  duration = 1500,
}: {
  to: number;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setVal(to);
      return;
    }

    const run = () => {
      if (done.current) return;
      done.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(to * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === 'undefined') {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) run();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {val.toFixed(decimals)}
    </span>
  );
}

/* ------------------------------------------------------------
   Ticker — infinite marquee, duplicated track
------------------------------------------------------------ */
export function Ticker({
  items,
  fast = false,
  reverse = false,
}: {
  items: ReactNode[];
  fast?: boolean;
  reverse?: boolean;
}) {
  const track = (key: string) => (
    <div className="ticker__track" key={key} aria-hidden={key === 'b'}>
      {items.map((it, i) => (
        <span className="ticker__item" key={i}>
          {it}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`ticker${fast ? ' ticker--fast' : ''}${reverse ? ' ticker--rev' : ''}`}
    >
      {track('a')}
      {track('b')}
    </div>
  );
}

/* ------------------------------------------------------------
   Magnetic — cursor-follow translate, hardware accelerated
------------------------------------------------------------ */
export function Magnetic({
  children,
  strength = 12,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
    const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = 'translate3d(0,0,0)';
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{
        display: 'inline-block',
        transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
        willChange: 'transform',
      }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------
   Pin icon — crisp inline SVG, no emoji
------------------------------------------------------------ */
export function PinIcon({ size = 11 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

export function ArrowIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.42 1.27 4.87L2 22l5.32-1.33a9.9 9.9 0 0 0 4.72 1.2c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.13c-1.55 0-3-.44-4.23-1.2l-.3-.18-3.15.79.8-3.07-.2-.31a8.14 8.14 0 0 1-1.25-4.35c0-4.51 3.67-8.18 8.18-8.18s8.18 3.67 8.18 8.18-3.67 8.32-8.18 8.32Zm4.5-6.13c-.24-.12-1.45-.71-1.67-.79-.22-.08-.39-.12-.55.12-.16.25-.63.79-.77.95-.14.16-.28.18-.52.06a6.7 6.7 0 0 1-1.97-1.22 7.4 7.4 0 0 1-1.36-1.7c-.14-.25-.02-.38.1-.5.12-.12.25-.28.37-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.63.3-.22.24-.83.81-.83 1.98s.85 2.3.97 2.46c.12.16 1.67 2.55 4.04 3.58.56.24 1 .39 1.35.5.56.18 1.08.15 1.48.09.45-.07 1.45-.59 1.66-1.17.2-.57.2-1.06.14-1.17-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}
