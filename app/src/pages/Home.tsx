import { useLenis } from '@/hooks/useLenis';
import ClothBackground from '@/components/ClothBackground';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/sections/HeroSection';
import StatsBar from '@/sections/StatsBar';
import ProgramsSection from '@/sections/ProgramsSection';
import AboutSection from '@/sections/AboutSection';
import TrainersSection from '@/sections/TrainersSection';
import TestimonialsSection from '@/sections/TestimonialsSection';
import PricingSection from '@/sections/PricingSection';
import CTASection from '@/sections/CTASection';

export default function Home() {
  useLenis();

  return (
    <>
      <ClothBackground />
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <StatsBar />
        <ProgramsSection />
        <AboutSection />
        <TrainersSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
