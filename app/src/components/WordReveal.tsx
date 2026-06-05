import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface WordRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  stagger?: number;
  scrollTrigger?: boolean;
  delay?: number;
}

export default function WordReveal({
  text,
  className = '',
  as: Tag = 'h2',
  stagger = 0.08,
  scrollTrigger = true,
  delay = 0,
}: WordRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const words = text.split(' ');

  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const wordInners = el.querySelectorAll('.word-inner');
      const fromVars: gsap.TweenVars = { yPercent: 120, opacity: 0 };
      const toVars: gsap.TweenVars = {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger,
        delay,
      };

      const vars: Record<string, unknown> = { ...toVars };
      if (scrollTrigger) {
        vars.scrollTrigger = {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        };
      }

      gsap.fromTo(wordInners, fromVars, vars as gsap.TweenVars);
    }, el);

    return () => ctx.revert();
  }, [text, stagger, scrollTrigger, delay, reducedMotion]);

  return (
    <Tag ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className}>
      {words.map((word, i) => (
        <span key={i} className="word-wrap mr-[0.25em]">
          <span
            className="word-inner"
            style={{
              display: 'inline-block',
              transform: reducedMotion ? 'translateY(0)' : undefined,
              opacity: reducedMotion ? 1 : undefined,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
