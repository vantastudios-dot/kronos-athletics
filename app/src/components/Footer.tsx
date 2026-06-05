import { Instagram, Youtube, Facebook, Twitter } from 'lucide-react';

const quickLinks = ['Home', 'About', 'Trainers', 'Pricing', 'Contact'];
const programs = ['CrossFit', 'Strength', 'Personal Coaching', 'Nutrition', 'Recovery'];

export default function Footer() {
  return (
    <footer className="relative z-10 bg-fitness-bg-secondary border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & About */}
          <div className="lg:col-span-1">
            <span className="font-display text-white text-2xl tracking-[0.15em]">KRONOS</span>
            <p className="text-fitness-text-secondary text-sm mt-4 max-w-[280px] leading-relaxed">
              Elite fitness club dedicated to transforming athletes through high-intensity training and world-class coaching.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono-label text-fitness-muted text-xs uppercase tracking-[0.12em] mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-fitness-text-secondary text-sm hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-mono-label text-fitness-muted text-xs uppercase tracking-[0.12em] mb-4">Programs</h4>
            <ul className="space-y-2.5">
              {programs.map((prog) => (
                <li key={prog}>
                  <a href="#programs" className="text-fitness-text-secondary text-sm hover:text-white transition-colors">
                    {prog}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono-label text-fitness-muted text-xs uppercase tracking-[0.12em] mb-4">Contact</h4>
            <ul className="space-y-2.5 text-fitness-text-secondary text-sm">
              <li>123 Iron Street, Fitness District</li>
              <li>(555) 123-4567</li>
              <li>info@crossfitelite.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-fitness-muted text-xs">
            &copy; 2026 CrossFit Elite. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[Instagram, Youtube, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-fitness-muted hover:text-fitness-accent transition-colors"
                aria-label="Social link"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
