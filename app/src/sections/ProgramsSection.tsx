import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import SectionHeader from '@/components/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

const programs = [
  {
    title: 'KRONOS',
    description: 'High-intensity functional training combining weightlifting, gymnastics, and cardio. Every WOD pushes you further.',
    tags: ['STRENGTH', 'ENDURANCE', 'COMMUNITY'],
    image: '/images/program-crossfit.jpg',
  },
  {
    title: 'STRENGTH TRAINING',
    description: 'Progressive overload programs designed to build raw power. From deadlifts to squats, master the fundamentals.',
    tags: ['POWER', 'HYPERTROPHY', 'TECHNIQUE'],
    image: '/images/program-strength.jpg',
  },
  {
    title: 'PERSONAL COACHING',
    description: 'One-on-one guidance from certified elite coaches. Custom programming tailored to your goals and physiology.',
    tags: ['CUSTOM', 'ACCOUNTABILITY', 'RESULTS'],
    image: '/images/program-coaching.jpg',
  },
  {
    title: 'ATHLETE PERFORMANCE',
    description: 'Sport-specific conditioning for competitive athletes. Speed, agility, power — engineered for your discipline.',
    tags: ['SPEED', 'AGILITY', 'SPORT-SPECIFIC'],
    image: '/images/program-performance.jpg',
  },
];

export default function ProgramsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll('.program-card');
      cards.forEach((card) => {
        const content = card.querySelector('.program-content');
        const image = card.querySelector('.program-image-wrap');
        const tags = card.querySelectorAll('.tag-pill');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        tl.fromTo(content, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
          .fromTo(image, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.7')
          .fromTo(tags, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 }, '-=0.4');
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} id="programs" className="relative z-10 py-[var(--space-section-y)]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <SectionHeader label="WHAT WE OFFER" title="TRAIN WITHOUT LIMITS" />

        <div className="flex flex-col gap-16">
          {programs.map((program, i) => {
            const isReversed = i % 2 !== 0;
            return (
              <div
                key={program.title}
                className={`program-card grid grid-cols-1 md:grid-cols-[55%_45%] gap-8 items-center ${isReversed ? 'md:[direction:rtl]' : ''}`}
              >
                <div className={`program-content ${isReversed ? 'md:[direction:ltr]' : ''}`}>
                  <h3 className="font-display text-white tracking-[0.02em] mb-4" style={{ fontSize: 'var(--type-subsection)' }}>
                    {program.title}
                  </h3>
                  <p className="text-fitness-text-secondary font-body leading-relaxed mb-6">
                    {program.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {program.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag-pill px-3 py-1 rounded-full text-[0.7rem] font-mono uppercase tracking-wider"
                        style={{
                          background: 'rgba(255, 42, 42, 0.15)',
                          color: '#FF2A2A',
                          border: '1px solid rgba(255, 42, 42, 0.3)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href="#pricing"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 text-fitness-accent font-body font-semibold text-sm hover:gap-3 transition-all"
                  >
                    Learn More <ArrowRight size={16} />
                  </a>
                </div>

                <div className={`program-image-wrap ${isReversed ? 'md:[direction:ltr]' : ''}`}>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden group">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
