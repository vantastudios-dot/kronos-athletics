import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import SectionHeader from '@/components/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "CrossFit changed my life. I walked in overweight and unmotivated. Six months later, I'm 30 pounds lighter, stronger than ever, and part of a family that pushes me every day.",
    name: 'James M.',
    result: '-30 LBS IN 6 MONTHS',
    image: '/images/testimonial-1.jpg',
  },
  {
    quote: "The coaches here are next level. They corrected my form, programmed my training, and took my deadlift from 315 to 485 in under a year.",
    name: 'Rachel K.',
    result: '+170LB DEADLIFT PR',
    image: '/images/testimonial-2.jpg',
  },
  {
    quote: "I was skeptical about the community aspect. Now I can't imagine training alone. The energy in this gym is unlike anywhere else.",
    name: 'Mike T.',
    result: 'MEMBER 2+ YEARS',
    image: '/images/testimonial-1.jpg',
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll('.testimonial-card');
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.2,
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
    <section ref={sectionRef} className="relative z-10 py-[var(--space-section-y)]">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
        <SectionHeader label="SUCCESS STORIES" title="REAL RESULTS" centered />

        <div className="flex flex-col gap-8 max-w-[800px] mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card glass-panel p-10 relative">
              <Quote className="text-fitness-accent opacity-50 absolute top-6 left-6" size={40} />
              <p className="text-white text-lg italic leading-relaxed font-body relative z-10 mt-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-[rgba(255,255,255,0.08)]">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div>
                  <span className="text-white font-body font-semibold block">{t.name}</span>
                  <span className="font-mono-label text-fitness-accent text-xs uppercase tracking-[0.12em]">
                    {t.result}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
