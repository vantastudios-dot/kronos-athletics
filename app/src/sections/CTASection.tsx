import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const words = section.querySelectorAll('.cta-word');
      gsap.fromTo(
        words,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      const sub = section.querySelector('.cta-sub');
      gsap.fromTo(sub, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.6, scrollTrigger: { trigger: section, start: 'top 75%' } });

      const btn = section.querySelector('.cta-btn');
      gsap.fromTo(btn, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, delay: 0.8, scrollTrigger: { trigger: section, start: 'top 75%' } });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const titleWords = 'YOUR STRONGEST VERSION IS WAITING'.split(' ');

  return (
    <section ref={sectionRef} className="relative z-10 py-[clamp(6rem,15vh,12rem)]">
      <div className="max-w-[700px] mx-auto px-6 lg:px-10 text-center">
        <h2 className="font-display text-white leading-[1.1] tracking-[0.03em]" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
          {titleWords.map((word, i) => (
            <span key={i} className="cta-word inline-block mr-[0.25em] overflow-hidden">
              <span className="inline-block">{word}</span>
            </span>
          ))}
        </h2>

        <p className="cta-sub text-fitness-text-secondary text-lg mt-6 font-body">
          Join 12,000+ athletes who have transformed their lives. Your first class is free.
        </p>

        <a
          href="#pricing"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="cta-btn inline-block mt-10 bg-fitness-accent text-white px-12 py-5 rounded-full font-body font-semibold text-lg uppercase tracking-[0.05em] hover:scale-[1.03] hover:shadow-glow transition-all duration-200"
        >
          Claim Your Free Class
        </a>

        <p className="font-mono-label text-fitness-muted text-xs uppercase tracking-[0.12em] mt-6">
          No commitment. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
