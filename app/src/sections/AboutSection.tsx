import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Image clip-path reveal
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Text content stagger
      const textEls = section.querySelectorAll('.about-text-item');
      gsap.fromTo(
        textEls,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} id="about" className="relative z-10 py-[var(--space-section-y)]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div ref={imageRef} style={{ clipPath: reducedMotion ? 'inset(0 0% 0 0)' : undefined }}>
            <div className="aspect-video rounded-xl overflow-hidden">
              <img
                src="/images/about-gym.jpg"
                alt="CrossFit gym interior"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text Content */}
          <div>
            <span className="about-text-item font-mono-label text-fitness-accent text-xs uppercase tracking-[0.12em] block mb-4">
              OUR PHILOSOPHY
            </span>
            <h2 className="about-text-item font-display text-white tracking-[0.03em] leading-tight" style={{ fontSize: 'var(--type-section-title)' }}>
              FORGE YOUR
            </h2>
            <h2 className="about-text-item font-display text-fitness-accent tracking-[0.03em] leading-tight mb-6" style={{ fontSize: 'var(--type-section-title)' }}>
              STRONGEST SELF
            </h2>
            <p className="about-text-item text-fitness-text-secondary font-body text-lg leading-relaxed mb-8">
              We believe fitness is a transformation of mind and body. Our facility combines cutting-edge equipment, world-class coaching, and an unbreakable community to push you beyond what you thought possible. Every rep counts. Every session matters.
            </p>
            <a
              href="#programs"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#programs')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="about-text-item inline-block border border-fitness-accent text-fitness-accent px-8 py-3 rounded-full font-body font-semibold text-sm uppercase tracking-wider hover:bg-fitness-accent hover:text-white transition-all duration-300"
            >
              About Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
