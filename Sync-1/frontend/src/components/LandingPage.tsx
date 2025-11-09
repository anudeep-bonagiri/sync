import { useEffect } from 'react';
import Hero from './landing/Hero';
import ConceptSection from './landing/ConceptSection';
import Dashboard from './landing/Dashboard';
import WhySection from './landing/WhySection';
import DemoFlow from './landing/DemoFlow';
import TechStack from './landing/TechStack';
import Team from './landing/Team';
import Footer from './landing/Footer';

export default function LandingPage() {
  useEffect(() => {
    document.title = 'Sync - Self-Healing AI';
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans antialiased">
      <Hero />
      <ConceptSection />
      <Dashboard />
      <WhySection />
      <DemoFlow />
      <TechStack />
      <Team />
      <Footer />
    </div>
  );
}

