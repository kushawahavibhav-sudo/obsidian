import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Stagger step, 0–4. */
  delay?: 0 | 1 | 2 | 3 | 4;
  /** Distance in px the element travels up into place. */
  distance?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'figure';
}

/**
 * Scroll-triggered reveal. Uses IntersectionObserver rather than Framer Motion so
 * that content still renders (and is indexed) when JS observers are unavailable.
 * Honours prefers-reduced-motion via the `.reveal` CSS fallback.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 26,
  className = '',
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If the element is already in view on mount, reveal it without waiting.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      data-delay={delay}
      style={{ '--reveal-y': `${distance}px` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
