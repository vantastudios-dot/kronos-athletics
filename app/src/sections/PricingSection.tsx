import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import SectionHeader from '@/components/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

const tiers = [
  {
    name: 'BASIC',
    price: 79,
    description: 'Perfect for beginners starting their fitness journey.',
    features: [
      'Access to gym floor',
      '2 group classes per week',
      'Locker room access',
      'Basic fitness assessment',
    ],
    cta: 'GET STARTED',
    featured: false,
  },
  {
    name: 'PRO',
    price: 149,
    description: 'Our most popular plan for serious athletes.',
    features: [
      'Unlimited gym access',
      'Unlimited group classes',
      '1 personal training session/month',
      'Nutrition consultation',
      'Recovery lounge access',
    ],
    cta: 'JOIN NOW',
    featured: true,
  },
  {
    name: 'ELITE',
    price: 249,
    description: 'The complete package for maximum results.',
    features: [
      'Everything in Pro',
      '4 personal training sessions/month',
      'Custom meal planning',
      'Monthly body composition scan',
      'Priority class booking',
      '24/7 gym access',
    ],
    cta: 'GO ELITE',
    featured: false,
  },
];

export default function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll('.pricing-card');
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Featured card float
      const featured = section.querySelector('.pricing-featured');
      if (featured) {
        gsap.to(featured, {
          y: '+=5',
          yoyo: true,
          repeat: -1,
          duration: 1.5,
          ease: 'sine.inOut',
        });
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} id="pricing" className="relative z-10 py-[var(--space-section-y)] bg-fitness-bg-secondary">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
        <SectionHeader label="MEMBERSHIP" title="CHOOSE YOUR PATH" centered />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`pricing-card relative rounded-xl p-8 ${
                tier.featured
                  ? 'pricing-featured bg-fitness-bg border-2 border-fitness-accent scale-[1.02]'
                  : 'bg-fitness-bg border border-[rgba(255,255,255,0.08)]'
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-fitness-accent text-white font-mono text-[0.7rem] uppercase tracking-wider px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="font-display text-white text-2xl tracking-wide">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="font-accent text-white text-5xl">${tier.price}</span>
                <span className="text-fitness-muted text-sm font-body">/MO</span>
              </div>
              <p className="text-fitness-text-secondary text-sm mt-3">{tier.description}</p>

              <div className="my-6 border-t border-[rgba(255,255,255,0.08)]" />

              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="text-fitness-accent flex-shrink-0 mt-0.5" size={16} />
                    <span className="text-fitness-text-secondary text-sm font-body">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className={`block text-center mt-8 py-3 rounded-full font-body font-semibold text-sm uppercase tracking-wider transition-all duration-200 ${
                  tier.featured
                    ? 'bg-fitness-accent text-white hover:scale-[1.03] hover:shadow-glow'
                    : 'border border-fitness-accent text-fitness-accent hover:bg-fitness-accent hover:text-white'
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
