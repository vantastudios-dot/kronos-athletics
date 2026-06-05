import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import SectionHeader from '@/components/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

const trainers = [
  {
    name: 'Alex Rivera',
    role: 'Head Coach',
    bio: '12 years elite coaching. CrossFit Games competitor.',
    tags: ['KRONOS', 'OLY LIFTING'],
    image: '/images/trainer-1.jpg',
  },
  {
    name: 'Sarah Chen',
    role: 'Strength Coach',
    bio: 'Former powerlifter. Specializes in progressive overload programming.',
    tags: ['STRENGTH', 'POWERLIFTING'],
    image: '/images/trainer-2.jpg',
  },
  {
    name: 'Marcus Johnson',
    role: 'Performance Coach',
    bio: 'NFL combine trainer. Speed and agility specialist.',
    tags: ['SPEED', 'ATHLETIC'],
    image: '/images/trainer-3.jpg',
  },
  {
    name: 'Emma Williams',
    role: 'Nutrition Coach',
    bio: 'Precision Nutrition certified. Meal planning expert.',
    tags: ['NUTRITION', 'RECOVERY'],
    image: '/images/trainer-4.jpg',
  },
  {
    name: 'David Park',
    role: 'Mobility Coach',
    bio: 'Physical therapist. Movement quality and injury prevention.',
    tags: ['MOBILITY', 'REHAB'],
    image: '/images/trainer-1.jpg',
  },
  {
    name: 'Lisa Torres',
    role: 'HIIT Coach',
    bio: 'Former track athlete. High-intensity interval training expert.',
    tags: ['HIIT', 'ENDURANCE'],
    image: '/images/trainer-2.jpg',
  },
];

export default function TrainersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll('.trainer-card');
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
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
    <section ref={sectionRef} id="trainers" className="relative z-10 py-[var(--space-section-y)] bg-fitness-bg-secondary">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12 px-6">
          <SectionHeader label="MEET THE TEAM" title="ELITE COACHES" centered />
        </div>

        <div className="scroll-container">
          {trainers.map((trainer, i) => (
            <div
              key={i}
              className="trainer-card scroll-card glass-panel p-8 flex flex-col items-center text-center"
              style={{ width: 320 }}
            >
              <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-[rgba(255,255,255,0.08)] mb-5">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-display text-white text-2xl tracking-wide">{trainer.name}</h3>
              <span className="font-mono-label text-fitness-muted text-xs uppercase tracking-[0.12em] mt-1 mb-3">
                {trainer.role}
              </span>
              <p className="text-fitness-text-secondary text-sm leading-relaxed mb-4 line-clamp-2">
                {trainer.bio}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {trainer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-[0.7rem] font-mono uppercase tracking-wider"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
