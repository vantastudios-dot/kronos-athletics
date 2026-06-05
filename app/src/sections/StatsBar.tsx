import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 12000, suffix: '+', label: 'ACTIVE MEMBERS', display: '12K+' },
  { value: 50, suffix: '+', label: 'ELITE COACHES', display: '50+' },
  { value: 98, suffix: '%', label: 'SUCCESS RATE', display: '98%' },
  { value: 24, suffix: '/7', label: 'GYM ACCESS', display: '24/7' },
];

export default function StatsBar() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Animate stats in
      const statItems = section.querySelectorAll('.stat-item');
      gsap.fromTo(
        statItems,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Count up numbers
      numberRefs.current.forEach((el, i) => {
        if (!el) return;
        const stat = stats[i];
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (stat.value >= 1000) {
              el.textContent = Math.round(obj.val / 1000) + 'K' + stat.suffix;
            } else {
              el.textContent = Math.round(obj.val) + stat.suffix;
            }
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-fitness-bg-secondary border-y border-[rgba(255,255,255,0.08)] py-12"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="stat-item text-center">
              <span
                ref={(el) => { numberRefs.current[i] = el; }}
                className="font-accent text-white block"
                style={{ fontSize: 'var(--type-stat)' }}
              >
                {reducedMotion ? stat.display : '0'}
              </span>
              <span className="font-mono-label text-fitness-muted text-xs uppercase tracking-[0.12em] mt-2 block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
