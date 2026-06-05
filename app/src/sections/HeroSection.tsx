import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(labelRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.3)
        .fromTo(line1Ref.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.5)
        .fromTo(line2Ref.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.7)
        .fromTo(subRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.9)
        .fromTo(ctaRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 }, 1.1)
        .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.5);
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex items-center justify-center min-h-[100dvh] px-6"
    >
      <div className="text-center max-w-4xl mx-auto">
        {/* Label */}
        <span
          ref={labelRef}
          className="font-mono-label text-fitness-accent text-xs uppercase tracking-[0.12em] block mb-6"
          style={{ opacity: reducedMotion ? 1 : undefined }}
        >
          Elite Fitness Club
        </span>

        {/* Headline */}
        <h1 className="font-display text-white leading-[0.9] tracking-[0.04em]" style={{ fontSize: 'var(--type-hero-display)', textShadow: '0 0 60px rgba(255, 42, 42, 0.2)' }}>
          <div ref={line1Ref} className="overflow-hidden">
            <span className="inline-block" style={{ transform: reducedMotion ? 'translateY(0)' : undefined }}>BE</span>
          </div>
          <div ref={line2Ref} className="overflow-hidden">
            <span className="inline-block" style={{ transform: reducedMotion ? 'translateY(0)' : undefined }}>GREATER</span>
          </div>
        </h1>

        {/* Subheadline */}
        <p
          ref={subRef}
          className="text-fitness-text-secondary text-lg md:text-xl mt-6 max-w-[500px] mx-auto font-body"
          style={{ opacity: reducedMotion ? 1 : undefined }}
        >
          Push past limits. Transform your body. Join the elite.
        </p>

        {/* CTA */}
        <a
          ref={ctaRef}
          href="#pricing"
          onClick={handleCtaClick}
          className="inline-block mt-10 bg-fitness-accent text-white px-10 py-4 rounded-full font-body font-semibold text-base uppercase tracking-[0.05em] hover:scale-[1.03] hover:shadow-glow transition-all duration-200"
          style={{ opacity: reducedMotion ? 1 : undefined }}
        >
          Start Your Journey
        </a>

        {/* Scroll Indicator */}
        <div
          ref={scrollRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-pulse-glow"
          style={{ opacity: reducedMotion ? 0.5 : undefined }}
        >
          <ChevronDown className="text-fitness-muted" size={28} />
        </div>
      </div>
    </section>
  );
}
